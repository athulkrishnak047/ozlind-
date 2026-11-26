import { transcribe } from "ai";
import { createGroq } from "@ai-sdk/groq";
import { consumeAiRateLimit } from "@/lib/ai/access";
import { jsonFailure } from "@/lib/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

const MAX_AUDIO_BYTES = 4 * 1024 * 1024;
const MAX_MULTIPART_BODY_BYTES = MAX_AUDIO_BYTES + 64 * 1024;
const SUPPORTED_TYPES = new Set([
  "audio/webm",
  "audio/mp4",
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/x-wav",
  "audio/ogg",
  "audio/flac"
]);

class AudioPayloadTooLargeError extends Error {
  constructor() {
    super("The audio upload is too large.");
    this.name = "AudioPayloadTooLargeError";
  }
}

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
      if (totalBytes > MAX_MULTIPART_BODY_BYTES) {
        await reader.cancel().catch(() => undefined);
        throw new AudioPayloadTooLargeError();
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

export async function POST(request: Request): Promise<Response> {
  if (!await consumeAiRateLimit(clientKey(request))) {
    const response = jsonFailure("RATE_LIMITED", "Too many requests. Please wait and try again.", 429);
    response.headers.set("Retry-After", "60");
    return response;
  }

  if (!process.env.GROQ_API_KEY) {
    return jsonFailure("TRANSCRIPTION_UNAVAILABLE", "Voice transcription is not configured yet.", 503);
  }

  const contentType = request.headers.get("content-type") || "";
  if (!/^multipart\/form-data\s*;/i.test(contentType)) {
    return jsonFailure("INVALID_AUDIO", "Upload a supported audio recording.", 400);
  }

  const declaredLength = request.headers.get("content-length");
  if (declaredLength && /^\d+$/.test(declaredLength) && Number(declaredLength) > MAX_MULTIPART_BODY_BYTES) {
    return jsonFailure("AUDIO_TOO_LARGE", "Audio must be smaller than 4 MB.", 413);
  }

  let form: FormData;
  try {
    const body = await readBoundedBody(request);
    form = await new Response(body, { headers: { "content-type": contentType } }).formData();
  } catch (error) {
    if (error instanceof AudioPayloadTooLargeError) {
      return jsonFailure("AUDIO_TOO_LARGE", "Audio must be smaller than 4 MB.", 413);
    }
    return jsonFailure("INVALID_AUDIO", "Upload a supported audio recording.", 400);
  }

  const audio = form.get("audio");
  if (!(audio instanceof File) || audio.size === 0) {
    return jsonFailure("INVALID_AUDIO", "Choose a non-empty audio recording.", 400);
  }
  if (audio.size > MAX_AUDIO_BYTES) {
    return jsonFailure("AUDIO_TOO_LARGE", "Audio must be smaller than 4 MB.", 413);
  }

  const mimeType = audio.type.toLowerCase().split(";")[0];
  if (!SUPPORTED_TYPES.has(mimeType)) {
    return jsonFailure("UNSUPPORTED_AUDIO", "Use a WebM, MP4, MP3, WAV, OGG, or FLAC recording.", 415);
  }

  try {
    const groq = createGroq({ apiKey: process.env.GROQ_API_KEY });
    const result = await transcribe({
      model: groq.transcription("whisper-large-v3-turbo"),
      audio: new Uint8Array(await audio.arrayBuffer())
    });
    const transcript = result.text.trim();
    if (!transcript) {
      return jsonFailure("EMPTY_TRANSCRIPT", "No speech could be detected. Try recording again.", 422);
    }
    return Response.json({ text: transcript, language: result.language ?? null });
  } catch {
    return jsonFailure("TRANSCRIPTION_FAILED", "Voice transcription failed. Please try again.", 502);
  }
}
