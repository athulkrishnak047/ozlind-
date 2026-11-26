import { timingSafeEqual } from "node:crypto";

const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 8;
const MAX_CLIENT_ENTRIES = 5_000;
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

  if (requestsByClient.size > MAX_CLIENT_ENTRIES) {
    for (const [key, timestamps] of requestsByClient) {
      if (timestamps.every((timestamp) => now - timestamp >= WINDOW_MS)) requestsByClient.delete(key);
    }
    if (requestsByClient.size > MAX_CLIENT_ENTRIES) {
      const oldestKey = requestsByClient.keys().next().value;
      if (oldestKey) requestsByClient.delete(oldestKey);
    }
  }
  return true;
}
