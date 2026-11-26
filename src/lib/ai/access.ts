const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 8;
const MAX_CLIENT_ENTRIES = 5_000;

// Best-effort per-instance protection. No external database or Redis required.
// Serverless instances do not share memory, so this is not a global quota.
const requestsByClient = new Map<string, number[]>();

export class RateLimitUnavailableError extends Error {
  constructor() {
    super("The local rate limiter is unavailable.");
    this.name = "RateLimitUnavailableError";
  }
}

function consumeLocalRateLimit(clientKey: string, now: number): boolean {
  const recent = (requestsByClient.get(clientKey) ?? []).filter(
    (timestamp) => now - timestamp < WINDOW_MS
  );

  if (recent.length >= MAX_REQUESTS_PER_WINDOW) {
    requestsByClient.set(clientKey, recent);
    return false;
  }

  recent.push(now);
  requestsByClient.set(clientKey, recent);

  if (requestsByClient.size > MAX_CLIENT_ENTRIES) {
    for (const [key, timestamps] of requestsByClient) {
      if (timestamps.every((timestamp) => now - timestamp >= WINDOW_MS)) {
        requestsByClient.delete(key);
      }
    }
    if (requestsByClient.size > MAX_CLIENT_ENTRIES) {
      const oldestKey = requestsByClient.keys().next().value;
      if (oldestKey) requestsByClient.delete(oldestKey);
    }
  }

  return true;
}

export async function consumeAiRateLimit(
  clientKey: string,
  now = Date.now()
): Promise<boolean> {
  return consumeLocalRateLimit(clientKey || "unknown", now);
}
