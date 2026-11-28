import { describe, expect, it } from "vitest";
import { GET } from "./route";

describe("GET /api/health", () => {
  it("returns a no-store liveness response with a request ID", async () => {
    const response = GET();
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toContain("no-store");
    expect(response.headers.get("x-content-type-options")).toBe("nosniff");
    expect(response.headers.get("x-request-id")).toBeTruthy();
    expect(payload).toMatchObject({
      ok: true,
      data: { service: "ozlind", status: "ok", version: "0.1.0" }
    });
    expect(payload.requestId).toBe(response.headers.get("x-request-id"));
  });

  it("does not disclose provider configuration or secret values", async () => {
    const response = GET();
    const body = await response.text();

    expect(body).not.toContain("GEMINI_API_KEY");
    expect(body).not.toContain("GROQ_API_KEY");
    expect(body).not.toContain("apiKey");
  });
});
