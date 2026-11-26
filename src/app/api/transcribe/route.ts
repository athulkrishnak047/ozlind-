import { transcribe } from "ai";
import { createGroq } from "@ai-sdk/groq";
import { consumeAiRateLimit } from "@/lib/ai/access";
import { jsonFailure } from "@/lib/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

const MAX_AUDIO_BYTES = 4 * 1024 * 1024;
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

function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",").at(-1)?.trim();
  return request.headers.get("x-real-ip") || forwarded || "unknown";
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

  const declaredLength = Number(request.headers.get("content-length") || 0);
  if (declaredLength > MAX_AUDIO_BYTES + 64 * 1024) {
    return jsonFailure("AUDIO_TOO_LARGE", "Audio must be smaller than 4 MB.", 413);
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
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
