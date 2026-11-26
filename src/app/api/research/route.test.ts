import { afterEach, describe, expect, it } from "vitest";
import { POST } from "./route";

const originalGeminiKey = process.env.GEMINI_API_KEY;
const originalGroqKey = process.env.GROQ_API_KEY;

afterEach(() => {
  if (originalGeminiKey === undefined) delete process.env.GEMINI_API_KEY;
  else process.env.GEMINI_API_KEY = originalGeminiKey;
  if (originalGroqKey === undefined) delete process.env.GROQ_API_KEY;
  else process.env.GROQ_API_KEY = originalGroqKey;
});

describe("POST /api/research", () => {
  it("returns a safe unavailable response when no provider is configured", async () => {
    delete process.env.GEMINI_API_KEY;
    delete process.env.GROQ_API_KEY;
    const response = await POST(new Request("https://ozlind.test/api/research", {
      method: "POST",
      headers: { "x-real-ip": "research-no-provider-test" },
      body: JSON.stringify({ messages: [{ role: "user", content: "Find recent AI news" }] })
    }));

    expect(response.status).toBe(503);
    expect(await response.json()).toMatchObject({
      ok: false,
      error: { code: "WEB_SEARCH_UNAVAILABLE" }
    });
  });

  it("rejects malformed input before making an upstream provider request", async () => {
    process.env.GEMINI_API_KEY = "test-only-key";
    delete process.env.GROQ_API_KEY;
    const response = await POST(new Request("https://ozlind.test/api/research", {
      method: "POST",
      headers: { "x-real-ip": "research-invalid-input-test", "content-type": "application/json" },
      body: "{"
    }));

    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({
      ok: false,
      error: { code: "INVALID_JSON" }
    });
  });
});
