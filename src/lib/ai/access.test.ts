import { describe, expect, it } from "vitest";
import { consumeAiRateLimit } from "./access";

describe("AI access controls", () => {
  it("limits each client to eight requests per minute in local development", async () => {
    const client = `test-${Math.random()}`;
    for (let i = 0; i < 8; i += 1) expect(await consumeAiRateLimit(client, 10_000 + i)).toBe(true);
    expect(await consumeAiRateLimit(client, 10_100)).toBe(false);
    expect(await consumeAiRateLimit(client, 71_001)).toBe(true);
  });
});
