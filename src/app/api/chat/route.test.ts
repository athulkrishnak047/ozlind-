import { afterEach, describe, expect, it } from "vitest";
import { POST } from "./route";

const originalToken = process.env.OZLIND_AI_ACCESS_TOKEN;

afterEach(() => {
  if (originalToken === undefined) delete process.env.OZLIND_AI_ACCESS_TOKEN;
  else process.env.OZLIND_AI_ACCESS_TOKEN = originalToken;
});

describe("POST /api/chat access gate", () => {
  it("keeps the AI endpoint disabled until a strong server token is configured", async () => {
    delete process.env.OZLIND_AI_ACCESS_TOKEN;
    const response = await POST(new Request("https://ozlind.test/api/chat", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ messages: [{ role: "user", content: "Hello" }] })
    }));

    expect(response.status).toBe(503);
    expect(await response.json()).toMatchObject({
      ok: false,
      error: { code: "AI_ACCESS_NOT_CONFIGURED" }
    });
  });

  it("rejects requests without the configured bearer token", async () => {
    process.env.OZLIND_AI_ACCESS_TOKEN = "a".repeat(48);
    const response = await POST(new Request("https://ozlind.test/api/chat", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ messages: [{ role: "user", content: "Hello" }] })
    }));

    expect(response.status).toBe(401);
  });
});
