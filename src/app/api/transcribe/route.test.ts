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
});
