import { consumeAiRateLimit } from "@/lib/ai/access";
import { isSupportedAttachmentSignature, SUPPORTED_ATTACHMENT_TYPES } from "@/lib/ai/attachments";
import { parseChatRequest } from "@/lib/ai/contracts";
import { jsonFailure } from "@/lib/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024;
const MAX_MULTIPART_BYTES = MAX_ATTACHMENT_BYTES + 128 * 1024;

function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",").at(-1)?.trim();
  return request.headers.get("x-real-ip") || forwarded || "unknown";
}

async function readBoundedBody(request: Request): Promise<Uint8Array> {
  const reader = request.body?.getReader();
  if (!reader) return new Uint8Array();

  const chunks: Uint8Array[] = [];
  let totalBytes = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      totalBytes += value.byteLength;
      if (totalBytes > MAX_MULTIPART_BYTES) {
        await reader.cancel();
        throw new Error("PAYLOAD_TOO_LARGE");
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const body = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return body;
}

function getConversationContext(messages: { role: "user" | "assistant"; content: string }[]): string {
  return messages
    .map((message) => `${message.role === "user" ? "User" : "Ozlind"}: ${message.content}`)
    .join("\n\n");
}

export async function POST(request: Request): Promise<Response> {
  if (!await consumeAiRateLimit(clientKey(request))) {
    const response = jsonFailure("RATE_LIMITED", "Too many requests. Please wait and try again.", 429);
    response.headers.set("Retry-After", "60");
    return response;
  }

  if (!process.env.GEMINI_API_KEY) {
    return jsonFailure("VISION_NOT_CONFIGURED", "Image and PDF analysis is not configured yet.", 503);
  }

  const contentType = request.headers.get("content-type") || "";
  if (!contentType.toLowerCase().startsWith("multipart/form-data;")) {
    return jsonFailure("INVALID_CONTENT_TYPE", "Send an image or PDF as multipart form data.", 415);
  }

  const declaredLength = Number(request.headers.get("content-length") || 0);
  if (declaredLength > MAX_MULTIPART_BYTES) {
    return jsonFailure("PAYLOAD_TOO_LARGE", "The attachment is too large. The limit is 10 MB.", 413);
  }

  let form: FormData;
  try {
    const body = await readBoundedBody(request);
    const bodyBuffer = new ArrayBuffer(body.byteLength);
    new Uint8Array(bodyBuffer).set(body);
    form = await new Response(bodyBuffer, { headers: { "content-type": contentType } }).formData();
  } catch (error) {
    if (error instanceof Error && error.message === "PAYLOAD_TOO_LARGE") {
      return jsonFailure("PAYLOAD_TOO_LARGE", "The attachment is too large. The limit is 10 MB.", 413);
    }
    return jsonFailure("INVALID_MULTIPART", "The attachment request could not be read.", 400);
  }

  const uploaded = form.get("file");
  const history = form.get("messages");
  if (!(uploaded instanceof File) || typeof history !== "string") {
    return jsonFailure("INVALID_ATTACHMENT", "Attach one image or PDF and include the conversation.", 400);
  }
  if (uploaded.size === 0) {
    return jsonFailure("EMPTY_ATTACHMENT", "The selected file is empty.", 400);
  }
  if (uploaded.size > MAX_ATTACHMENT_BYTES) {
    return jsonFailure("PAYLOAD_TOO_LARGE", "The attachment is too large. The limit is 10 MB.", 413);
  }
  if (!(SUPPORTED_ATTACHMENT_TYPES as readonly string[]).includes(uploaded.type)) {
    return jsonFailure("UNSUPPORTED_ATTACHMENT", "Use a PDF, PNG, JPEG, or WebP file.", 415);
  }

  const parsed = parseChatRequest(JSON.stringify({ provider: "gemini", messages: (() => {
    try {
      return JSON.parse(history);
    } catch {
      return null;
    }
  })() }));
  if (!parsed.ok) {
    return jsonFailure(parsed.code, parsed.message, parsed.code === "PAYLOAD_TOO_LARGE" ? 413 : 400);
  }

  let fileBytes: Uint8Array;
  try {
    fileBytes = new Uint8Array(await uploaded.arrayBuffer());
  } catch {
    return jsonFailure("INVALID_ATTACHMENT", "The selected file could not be read.", 400);
  }
  if (!isSupportedAttachmentSignature(uploaded.type, fileBytes)) {
    return jsonFailure("INVALID_ATTACHMENT", "The file content does not match its declared type.", 415);
  }

  const model = process.env.GEMINI_MODEL || "gemini-3.8-flash";
  const context = getConversationContext(parsed.messages);
  const isVideo = uploaded.type.startsWith("video/");
  const prompt = [
    "You are Ozlind, a careful multimodal AI assistant.",
    "Analyze the attached file and answer the user's request using only information supported by the file and conversation.",
    "For PDFs, refer to page numbers when possible. For images, describe relevant visible details without guessing.",
    "For videos, cover both visual and audio events and include MM:SS timestamps for important moments where possible.",
    "If the file is unclear, incomplete, or unreadable, state that directly. Never claim to have read content that is not visible.",
    "",
    "Conversation:",
    context
  ].join("\n");
  const base64 = Buffer.from(fileBytes).toString("base64");

  try {
    const endpoint = isVideo
      ? "https://generativelanguage.googleapis.com/v1beta/interactions"
      : `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;
    const requestBody = isVideo
      ? {
          model,
          input: [
            { type: "text", text: prompt },
            { type: "video", data: base64, mime_type: uploaded.type }
          ],
          store: false
        }
      : {
          contents: [{
            role: "user",
            parts: [
              { text: prompt },
              { inline_data: { mime_type: uploaded.type, data: base64 } }
            ]
          }],
          generationConfig: { temperature: 0.2, maxOutputTokens: 4096 }
        };
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": process.env.GEMINI_API_KEY
      },
      body: JSON.stringify(requestBody),
      cache: "no-store",
      signal: AbortSignal.any([request.signal, AbortSignal.timeout(55_000)])
    });

    if (!response.ok) {
      return jsonFailure("VISION_PROVIDER_FAILED", "Gemini could not analyze this attachment. Please try a smaller file or try again.", 502);
    }

    const payload: unknown = await response.json();
    if (!payload || typeof payload !== "object") {
      return jsonFailure("VISION_PROVIDER_FAILED", "Gemini returned an invalid analysis response.", 502);
    }

    let answer = "";
    if (isVideo) {
      const record = payload as { output_text?: unknown; steps?: unknown };
      if (typeof record.output_text === "string") answer = record.output_text.trim();
      if (!answer && Array.isArray(record.steps)) {
        const textParts: string[] = [];
        for (const step of record.steps) {
          if (!step || typeof step !== "object") continue;
          const content = (step as { content?: unknown }).content;
          if (!Array.isArray(content)) continue;
          for (const part of content) {
            if (part && typeof part === "object" && typeof (part as { text?: unknown }).text === "string") {
              textParts.push((part as { text: string }).text);
            }
          }
        }
        answer = textParts.join("\n").trim();
      }
    } else {
      const candidates = (payload as { candidates?: unknown }).candidates;
      const first = Array.isArray(candidates) && candidates[0] && typeof candidates[0] === "object"
        ? candidates[0] as { content?: unknown }
        : null;
      const parts = first?.content && typeof first.content === "object"
        ? (first.content as { parts?: unknown }).parts
        : null;
      answer = Array.isArray(parts)
        ? parts.filter((part): part is { text: string } => !!part && typeof part === "object" && typeof (part as { text?: unknown }).text === "string")
          .map((part) => part.text)
          .join("\n")
          .trim()
        : "";
    }

    if (!answer) {
      return jsonFailure("VISION_EMPTY_RESPONSE", "Gemini did not return an analysis for this file.", 502);
    }

    return Response.json({ text: answer, provider: "gemini", model }, {
      headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" }
    });
  } catch {
    if (request.signal.aborted) {
      return jsonFailure("REQUEST_CANCELLED", "The file analysis request was cancelled.", 499);
    }
    return jsonFailure("VISION_PROVIDER_FAILED", "Gemini file analysis timed out or failed. Please try again.", 502);
  }
}
