import { generateText, type ModelMessage } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { consumeAiRateLimit, RateLimitUnavailableError } from "@/lib/ai/access";
import { MAX_CHAT_BODY_BYTES, parseChatRequest, PayloadTooLargeError, readBoundedRequestBody } from "@/lib/ai/contracts";
import { jsonFailure } from "@/lib/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

type ExecutedTool = { type?: unknown; output?: unknown; arguments?: unknown };

function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",").at(-1)?.trim();
  return request.headers.get("x-real-ip") || forwarded || "unknown";
}

function extractSources(tools: unknown): { title: string; url: string }[] {
  if (!Array.isArray(tools)) return [];
  const sources = new Map<string, { title: string; url: string }>();
  for (const item of tools as ExecutedTool[]) {
    if (typeof item.output !== "string") continue;
    const urls = item.output.match(/https?:\/\/[^\s<>"')\]]+/g) ?? [];
    for (const rawUrl of urls) {
      try {
        const parsed = new URL(rawUrl.replace(/[.,;]+$/, ""));
        if (!["http:", "https:"].includes(parsed.protocol)) continue;
        if (!sources.has(parsed.href)) {
          sources.set(parsed.href, { title: parsed.hostname.replace(/^www\./, ""), url: parsed.href });
        }
      } catch {
        // Ignore malformed links returned in provider tool output.
      }
    }
  }
  return [...sources.values()].slice(0, 8);
}

function normalizeSources(value: unknown): { title: string; url: string }[] {
  if (!Array.isArray(value)) return [];
  const sources = new Map<string, { title: string; url: string }>();
  for (const item of value) {
    if (!item || typeof item !== "object") continue;
    const record = item as Record<string, unknown>;
    if (typeof record.url !== "string") continue;
    try {
      const parsed = new URL(record.url);
      if (parsed.protocol !== "https:" && parsed.protocol !== "http:") continue;
      const title = typeof record.title === "string" && record.title.trim()
        ? record.title.trim().slice(0, 120)
        : parsed.hostname.replace(/^www\\./, "");
      sources.set(parsed.href, { title, url: parsed.href });
    } catch {
      // Ignore malformed source URLs.
    }
  }
  return [...sources.values()].slice(0, 8);
}
export async function POST(request: Request): Promise<Response> {
  try {
    if (!await consumeAiRateLimit(clientKey(request))) {
      const response = jsonFailure("RATE_LIMITED", "Too many requests. Please wait and try again.", 429);
      response.headers.set("Retry-After", "60");
      return response;
    }
  } catch (error) {
    if (error instanceof RateLimitUnavailableError) {
      return jsonFailure("RATE_LIMIT_UNAVAILABLE", "The AI service is temporarily unavailable. Please try again shortly.", 503);
    }
    throw error;
  }

  if (!process.env.GEMINI_API_KEY && !process.env.GROQ_API_KEY) {
    return jsonFailure("WEB_SEARCH_UNAVAILABLE", "Live web search is not configured yet.", 503);
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
  if (!parsed.ok) return jsonFailure(parsed.code, parsed.message, parsed.code === "PAYLOAD_TOO_LARGE" ? 413 : 400);

  const modelMessages: ModelMessage[] = parsed.messages.map(({ role, content }) => ({ role, content }));
  const system = "You are Ozlind Research. Research the user question using live web search. Prefer primary and authoritative sources, distinguish verified facts from uncertainty, include dates when relevant, and never invent sources. Give a concise but useful answer.";
  const signal = AbortSignal.any([request.signal, AbortSignal.timeout(45_000)]);

  if (process.env.GEMINI_API_KEY) {
    try {
      const google = createGoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY });
      const modelId = process.env.GEMINI_MODEL || "gemini-3.8-flash";
      const result = await generateText({
        model: google(modelId),
        system,
        messages: modelMessages,
        tools: { google_search: google.tools.googleSearch({}) },
        maxOutputTokens: 2048,
        temperature: 0.2,
        abortSignal: signal
      });
      if (result.text.trim()) {
        return Response.json({
          text: result.text,
          provider: "gemini",
          model: modelId,
          sources: normalizeSources(result.sources)
        }, { headers: { "Cache-Control": "no-store" } });
      }
    } catch {
      if (request.signal.aborted) return jsonFailure("REQUEST_CANCELLED", "The research request was cancelled.", 499);
      // Fall back to Groq when Gemini Search is unavailable for this model or key.
    }
  }

  if (!process.env.GROQ_API_KEY) {
    return jsonFailure("WEB_SEARCH_FAILED", "Gemini web research is temporarily unavailable.", 502);
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
        "Groq-Model-Version": "latest"
      },
      body: JSON.stringify({
        model: "groq/compound",
        messages: [
          {
            role: "system",
            content: "You are Ozlind Research. Research the user's question using live web search. Prefer primary and authoritative sources, distinguish verified facts from uncertainty, include dates when relevant, and never invent sources. Give a concise but useful answer."
          },
          ...parsed.messages
        ],
        compound_custom: { tools: { enabled_tools: ["web_search", "visit_website"] } },
        temperature: 0.2,
        max_completion_tokens: 2048
      }),
      cache: "no-store",
      signal
    });

    if (!response.ok) {
      return jsonFailure("WEB_SEARCH_FAILED", "Live web research is temporarily unavailable. Please try again.", 502);
    }

    const payload: unknown = await response.json();
    if (!payload || typeof payload !== "object") {
      return jsonFailure("WEB_SEARCH_FAILED", "The research provider returned an invalid response.", 502);
    }
    const choices = (payload as { choices?: unknown }).choices;
    const message = Array.isArray(choices) && choices[0] && typeof choices[0] === "object"
      ? (choices[0] as { message?: unknown }).message
      : null;
    if (!message || typeof message !== "object") {
      return jsonFailure("WEB_SEARCH_FAILED", "The research provider returned no answer.", 502);
    }
    const record = message as { content?: unknown; executed_tools?: unknown };
    if (typeof record.content !== "string" || !record.content.trim()) {
      return jsonFailure("WEB_SEARCH_FAILED", "The research provider returned an empty answer.", 502);
    }

    return Response.json({
      text: record.content,
      provider: "groq",
      model: "groq/compound",
      sources: extractSources(record.executed_tools)
    }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return jsonFailure("WEB_SEARCH_FAILED", "Live web research timed out or failed. Please try again.", 502);
  }
}
