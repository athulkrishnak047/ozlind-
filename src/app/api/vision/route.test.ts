import { afterEach, describe, expect, it } from "vitest";
import { POST } from "./route";

const originalGeminiKey = process.env.GEMINI_API_KEY;

afterEach(() => {
  if (originalGeminiKey === undefined) delete process.env.GEMINI_API_KEY;
  else process.env.GEMINI_API_KEY = originalGeminiKey;
});

describe("POST /api/vision", () => {
  it("returns a safe unavailable response when Gemini is not configured", async () => {
    delete process.env.GEMINI_API_KEY;
    const response = await POST(new Request("https://ozlind.test/api/vision", {
      method: "POST",
      headers: { "x-real-ip": "vision-no-provider-test" }
    }));

    expect(response.status).toBe(503);
    expect(await response.json()).toMatchObject({
      ok: false,
      error: { code: "VISION_NOT_CONFIGURED" }
    });
  });

  it("rejects non-multipart requests", async () => {
    process.env.GEMINI_API_KEY = "test-only-key";
    const response = await POST(new Request("https://ozlind.test/api/vision", {
      method: "POST",
      headers: {
        "x-real-ip": "vision-invalid-content-type-test",
        "content-type": "application/json"
      },
      body: "{}"
    }));

    expect(response.status).toBe(415);
    expect(await response.json()).toMatchObject({
      ok: false,
      error: { code: "INVALID_CONTENT_TYPE" }
    });
  });

  it("rejects a file whose bytes do not match its MIME type", async () => {
    process.env.GEMINI_API_KEY = "test-only-key";
    const form = new FormData();
    form.set("file", new File([new Uint8Array([0xff, 0xd8, 0xff])], "not-really.png", { type: "image/png" }));
    form.set("messages", JSON.stringify([{ role: "user", content: "What is in this image?" }]));
    const response = await POST(new Request("https://ozlind.test/api/vision", {
      method: "POST",
      headers: { "x-real-ip": "vision-mismatched-signature-test" },
      body: form
    }));

    expect(response.status).toBe(415);
    expect(await response.json()).toMatchObject({
      ok: false,
      error: { code: "INVALID_ATTACHMENT" }
    });
  });

  it("rejects chunked multipart uploads beyond the hard request limit", async () => {
    process.env.GEMINI_API_KEY = "test-only-key";
    const oversizedBody = new Uint8Array(10 * 1024 * 1024 + 128 * 1024 + 1);
    const response = await POST(new Request("https://ozlind.test/api/vision", {
      method: "POST",
      headers: {
        "x-real-ip": "vision-oversized-chunked-test",
        "content-type": "multipart/form-data; boundary=ozlind-test-boundary"
      },
      body: oversizedBody
    }));

    expect(response.status).toBe(413);
    expect(await response.json()).toMatchObject({
      ok: false,
      error: { code: "PAYLOAD_TOO_LARGE" }
    });
  });
});
