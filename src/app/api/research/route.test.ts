import { afterEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";

const originalGeminiKey = process.env.GEMINI_API_KEY;
const originalGroqKey = process.env.GROQ_API_KEY;

afterEach(() => {
  if (originalGeminiKey === undefined) delete process.env.GEMINI_API_KEY;
  else process.env.GEMINI_API_KEY = originalGeminiKey;
  if (originalGroqKey === undefined) delete process.env.GROQ_API_KEY;
  else process.env.GROQ_API_KEY = originalGroqKey;
  vi.unstubAllGlobals();
  it("uses the explicitly selected Groq research provider first", async () => {
    process.env.GEMINI_API_KEY = "test-gemini-key";
    process.env.GROQ_API_KEY = "test-groq-key";
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      choices: [{
        message: {
          content: "A researched answer.",
          executed_tools: [{ output: "Source: https://example.com/article" }]
        }
      }]
    }), { status: 200, headers: { "content-type": "application/json" } }));
    vi.stubGlobal("fetch", fetchMock);

    const response = await POST(new Request("https://ozlind.test/api/research", {
      method: "POST",
      headers: { "x-real-ip": "research-groq-preference-test", "content-type": "application/json" },
      body: JSON.stringify({
        provider: "groq",
        messages: [{ role: "user", content: "Research this topic" }]
      })
    }));

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ provider: "groq", model: "groq/compound" });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toBe("https://api.groq.com/openai/v1/chat/completions");
  });

  it("falls back to Gemini when the selected Groq research provider fails", async () => {
    process.env.GEMINI_API_KEY = "test-gemini-key";
    process.env.GROQ_API_KEY = "test-groq-key";
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response("unavailable", { status: 503 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({
        output_text: "Gemini fallback answer.",
        steps: []
      }), { status: 200, headers: { "content-type": "application/json" } }));
    vi.stubGlobal("fetch", fetchMock);

    const response = await POST(new Request("https://ozlind.test/api/research", {
      method: "POST",
      headers: { "x-real-ip": "research-groq-fallback-test", "content-type": "application/json" },
      body: JSON.stringify({
        provider: "groq",
        messages: [{ role: "user", content: "Research this topic" }]
      })
    }));

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ provider: "gemini", text: "Gemini fallback answer." });
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[0][0]).toBe("https://api.groq.com/openai/v1/chat/completions");
    expect(fetchMock.mock.calls[1][0]).toBe("https://generativelanguage.googleapis.com/v1beta/interactions");
  });

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
