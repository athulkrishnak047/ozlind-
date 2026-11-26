import { afterEach, describe, expect, it } from "vitest";
import { POST } from "./route";

const originalGroqKey = process.env.GROQ_API_KEY;

afterEach(() => {
  if (originalGroqKey === undefined) delete process.env.GROQ_API_KEY;
  else process.env.GROQ_API_KEY = originalGroqKey;
});

describe("POST /api/transcribe", () => {
  it("returns a safe unavailable response when transcription is not configured", async () => {
    delete process.env.GROQ_API_KEY;
    const response = await POST(new Request("https://ozlind.test/api/transcribe", {
      method: "POST",
      headers: { "x-real-ip": "transcribe-no-provider-test" }
    }));

    expect(response.status).toBe(503);
    expect(await response.json()).toMatchObject({
      ok: false,
      error: { code: "TRANSCRIPTION_UNAVAILABLE" }
    });
  });

  it("rejects non-multipart requests before attempting to parse an upload", async () => {
    process.env.GROQ_API_KEY = "test-only-key";
    const response = await POST(new Request("https://ozlind.test/api/transcribe", {
      method: "POST",
      headers: {
        "x-real-ip": "transcribe-invalid-content-type-test",
        "content-type": "application/octet-stream"
      },
      body: "not a multipart upload"
    }));

    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({
      ok: false,
      error: { code: "INVALID_AUDIO" }
    });
  });

  it("bounds chunked upload bytes even when content-length is absent", async () => {
    process.env.GROQ_API_KEY = "test-only-key";
    const oversizedBody = new Uint8Array(4 * 1024 * 1024 + 64 * 1024 + 1);
    const request = new Request("https://ozlind.test/api/transcribe", {
      method: "POST",
      headers: {
        "x-real-ip": "transcribe-oversized-chunked-test",
        "content-type": "multipart/form-data; boundary=ozlind-test-boundary"
      },
      body: oversizedBody
    });

    expect(request.headers.get("content-length")).toBeNull();
    const response = await POST(request);

    expect(response.status).toBe(413);
    expect(await response.json()).toMatchObject({
      ok: false,
      error: { code: "AUDIO_TOO_LARGE" }
    });
  });
});
