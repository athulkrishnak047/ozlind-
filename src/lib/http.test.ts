import { describe, expect, it } from "vitest";
import { jsonFailure, jsonSuccess } from "./http";

describe("API response helpers", () => {
  it("returns a success envelope with a request ID and no-store headers", async () => {
    const response = jsonSuccess({ status: "ok" });
    const body = await response.json();
    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toContain("no-store");
    expect(response.headers.get("x-request-id")).toBe(body.requestId);
    expect(body).toMatchObject({ ok: true, data: { status: "ok" } });
    expect(body.requestId).toEqual(expect.any(String));
  });

  it("returns a safe, structured error envelope", async () => {
    const response = jsonFailure("INVALID_REQUEST", "The request is invalid.", 400);
    const body = await response.json();
    expect(response.status).toBe(400);
    expect(body).toMatchObject({
      ok: false,
      error: { code: "INVALID_REQUEST", message: "The request is invalid." }
    });
    expect(body.requestId).toEqual(expect.any(String));
  });
});
