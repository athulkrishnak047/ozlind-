export const MAX_CHAT_BODY_BYTES = 48 * 1024;
export const MAX_MESSAGES = 20;
export const MAX_MESSAGE_CHARS = 8_000;
export const MAX_TOTAL_CHARS = 24_000;

export type ChatRole = "user" | "assistant";
export type ChatMessage = { role: ChatRole; content: string };
export type PreferredProvider = "auto" | "gemini" | "groq";

export type ParsedChatRequest =
  | { ok: true; messages: ChatMessage[]; preferredProvider: PreferredProvider }
  | { ok: false; code: "INVALID_JSON" | "INVALID_MESSAGES" | "PAYLOAD_TOO_LARGE"; message: string };

export function parseChatRequest(raw: string): ParsedChatRequest {
  if (new TextEncoder().encode(raw).byteLength > MAX_CHAT_BODY_BYTES) {
    return { ok: false, code: "PAYLOAD_TOO_LARGE", message: "The request is too large." };
  }

  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    return { ok: false, code: "INVALID_JSON", message: "The request body must be valid JSON." };
  }

  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { ok: false, code: "INVALID_MESSAGES", message: "The request format is invalid." };
  }

  const body = value as Record<string, unknown>;
  const provider = body.provider ?? "auto";
  if (provider !== "auto" && provider !== "gemini" && provider !== "groq") {
    return { ok: false, code: "INVALID_MESSAGES", message: "The selected provider is not supported." };
  }

  if (!Array.isArray(body.messages) || body.messages.length === 0 || body.messages.length > MAX_MESSAGES) {
    return { ok: false, code: "INVALID_MESSAGES", message: "Provide between 1 and 20 messages." };
  }

  let totalChars = 0;
  const messages: ChatMessage[] = [];
  for (const item of body.messages) {
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      return { ok: false, code: "INVALID_MESSAGES", message: "A message has an invalid format." };
    }

    const message = item as Record<string, unknown>;
    if ((message.role !== "user" && message.role !== "assistant") ||
        typeof message.content !== "string" ||
        message.content.trim().length === 0 ||
        message.content.length > MAX_MESSAGE_CHARS) {
      return { ok: false, code: "INVALID_MESSAGES", message: "A message has an invalid role or content." };
    }

    totalChars += message.content.length;
    if (totalChars > MAX_TOTAL_CHARS) {
      return { ok: false, code: "PAYLOAD_TOO_LARGE", message: "The conversation is too large." };
    }
    messages.push({ role: message.role, content: message.content });
  }

  if (messages[messages.length - 1]?.role !== "user") {
    return { ok: false, code: "INVALID_MESSAGES", message: "The final message must be from the user." };
  }

  return { ok: true, messages, preferredProvider: provider };
}
