import { createRequestId, jsonFailure } from "@/lib/http";
import { consumeAiRateLimit } from "@/lib/ai/access";
import {
  MAX_CHAT_BODY_BYTES,
  parseChatRequest,
  PayloadTooLargeError,
  readBoundedRequestBody
} from "@/lib/ai/contracts";
import { getProviderCandidates } from "@/lib/ai/providers";
import { runOzlindEngine, type OzlindEngineEvent } from "@/lib/ai/engine";
import type { ModelMessage } from "ai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const encoder = new TextEncoder();

function sendEvent(controller: ReadableStreamDefaultController<Uint8Array>, name: string, data: unknown) {
  controller.enqueue(encoder.encode("event: " + name + "\ndata: " + JSON.stringify(data) + "\n\n"));
}

function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",").at(-1)?.trim();
  return request.headers.get("x-real-ip") || forwarded || "unknown";
}

function toPublicEvent(event: OzlindEngineEvent): { name: string; data: unknown } {
  switch (event.type) {
    case "start": return { name: "start", data: event };
    case "delta": return { name: "delta", data: { text: event.text } };
    case "done": return { name: "done", data: event };
    case "error":
      return {
        name: "error",
        data: {
          code: event.code,
          message: event.message,
          ...(event.durationMs === undefined ? {} : { durationMs: event.durationMs })
        }
      };
  }
}

export async function POST(request: Request): Promise<Response> {
  if (!await consumeAiRateLimit(clientKey(request))) {
    const response = jsonFailure("RATE_LIMITED", "Too many requests. Please wait and try again.", 429);
    response.headers.set("Retry-After", "60");
    return response;
  }

  const declaredLength = Number(request.headers.get("content-length") || 0);
  if (declaredLength > MAX_CHAT_BODY_BYTES) {
    return jsonFailure("PAYLOAD_TOO_LARGE", "The request is too large.", 413);
  }

  let rawBody: string;
  try {
    rawBody = await readBoundedRequestBody(request);
  } catch (error) {
    if (error instanceof PayloadTooLargeError) {
      return jsonFailure("PAYLOAD_TOO_LARGE", "The request is too large.", 413);
    }
    return jsonFailure("INVALID_REQUEST", "The request body could not be read.", 400);
  }

  const parsed = parseChatRequest(rawBody);
  if (!parsed.ok) {
    const status = parsed.code === "PAYLOAD_TOO_LARGE" ? 413 : 400;
    return jsonFailure(parsed.code, parsed.message, status);
  }

  if (getProviderCandidates(parsed.preferredProvider).length === 0) {
    return jsonFailure("PROVIDERS_NOT_CONFIGURED", "No model runtime is configured for this service.", 503);
  }

  const messages: ModelMessage[] = parsed.messages.map(({ role, content }) => ({ role, content }));
  const requestId = createRequestId();
  const streamAbort = new AbortController();
  const signal = AbortSignal.any([request.signal, streamAbort.signal]);

  const body = new ReadableStream<Uint8Array>({
    start(controller) {
      void (async () => {
        try {
          for await (const engineEvent of runOzlindEngine({
            messages,
            preferredProvider: parsed.preferredProvider,
            signal
          })) {
            if (signal.aborted) break;
            const mapped = toPublicEvent(engineEvent);
            const data = mapped.data && typeof mapped.data === "object"
              ? mapped.data as Record<string, unknown>
              : { value: mapped.data };
            sendEvent(controller, mapped.name, { requestId, ...data });
          }
        } catch {
          if (!signal.aborted) {
            sendEvent(controller, "error", {
              requestId,
              code: "INTERNAL_STREAM_ERROR",
              message: "The response could not be completed. Please retry."
            });
          }
        } finally {
          if (!signal.aborted) controller.close();
        }
      })();
    },
    cancel() { streamAbort.abort(); }
  });

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-store, no-transform",
      "X-Accel-Buffering": "no",
      "X-Content-Type-Options": "nosniff",
      "X-Request-Id": requestId
    }
  });
}
