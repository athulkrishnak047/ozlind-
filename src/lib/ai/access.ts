import { timingSafeEqual } from "node:crypto";

const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 8;
const requestsByClient = new Map<string, number[]>();

export function isValidAiAccessToken(header: string | null, expectedToken: string | undefined): boolean {
  if (!expectedToken || expectedToken.length < 32 || !header?.startsWith("Bearer ")) return false;
  const supplied = Buffer.from(header.slice(7));
  const expected = Buffer.from(expectedToken);
  return supplied.length === expected.length && timingSafeEqual(supplied, expected);
}

export function consumeAiRateLimit(clientKey: string, now = Date.now()): boolean {
  const recent = (requestsByClient.get(clientKey) ?? []).filter((timestamp) => now - timestamp < WINDOW_MS);
  if (recent.length >= MAX_REQUESTS_PER_WINDOW) {
    requestsByClient.set(clientKey, recent);
    return false;
  }

  recent.push(now);
  requestsByClient.set(clientKey, recent);

  if (requestsByClient.size > 2_000) {
    for (const [key, timestamps] of requestsByClient) {
      if (timestamps.every((timestamp) => now - timestamp >= WINDOW_MS)) requestsByClient.delete(key);
    }
  }
  return true;
}
