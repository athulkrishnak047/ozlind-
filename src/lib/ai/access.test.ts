import { describe, expect, it } from "vitest";
import { consumeAiRateLimit, isValidAiAccessToken } from "./access";

describe("AI access controls", () => {
  it("requires a long bearer token and compares it safely", () => {
    const token = "a".repeat(40);
    expect(isValidAiAccessToken(`Bearer ${token}`, token)).toBe(true);
    expect(isValidAiAccessToken("Bearer wrong", token)).toBe(false);
    expect(isValidAiAccessToken(`Bearer ${token}`, "short")).toBe(false);
    expect(isValidAiAccessToken(null, token)).toBe(false);
  });

  it("limits each client to eight requests per minute in local development", async () => {
    const client = `test-${Math.random()}`;
    for (let i = 0; i < 8; i += 1) expect(await consumeAiRateLimit(client, 10_000 + i)).toBe(true);
    expect(await consumeAiRateLimit(client, 10_100)).toBe(false);
    expect(await consumeAiRateLimit(client, 71_001)).toBe(true);
  });
});
