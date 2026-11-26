import { createHash, randomUUID } from "node:crypto";

const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 8;
const MAX_CLIENT_ENTRIES = 5_000;
const requestsByClient = new Map<string, number[]>();

export class RateLimitUnavailableError extends Error {
  constructor() {
    super("The shared rate limiter is not configured or is unavailable.");
    this.name = "RateLimitUnavailableError";
  }
}


async function consumeDistributedRateLimit(clientKey: string, now: number): Promise<boolean> {
  const url = process.env.UPSTASH_REDIS_REST_URL?.replace(/\/$/, "");
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) throw new RateLimitUnavailableError();

  const digest = createHash("sha256").update(clientKey).digest("hex");
  const key = `ozlind:rate-limit:${digest}`;
  const script = [
    "redis.call('ZREMRANGEBYSCORE', KEYS[1], '-inf', ARGV[1] - ARGV[2])",
    "local count = redis.call('ZCARD', KEYS[1])",
    "if count >= tonumber(ARGV[3]) then return 0 end",
    "redis.call('ZADD', KEYS[1], ARGV[1], ARGV[1] .. ':' .. ARGV[4])",
    "redis.call('PEXPIRE', KEYS[1], ARGV[2])",
    "return 1"
  ].join("\n");

  let response: Response;
  try {
    response = await fetch(`${url}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify([[
        "EVAL", script, "1", key, String(now), String(WINDOW_MS),
        String(MAX_REQUESTS_PER_WINDOW), randomUUID()
      ]]),
      cache: "no-store",
      signal: AbortSignal.timeout(2_500)
    });
  } catch {
    throw new RateLimitUnavailableError();
  }

  if (!response.ok) throw new RateLimitUnavailableError();
  const result: unknown = await response.json().catch(() => null);
  if (!Array.isArray(result) || !result[0] || typeof result[0] !== "object" || !("result" in result[0])) {
    throw new RateLimitUnavailableError();
  }
  const value = (result[0] as { result?: unknown }).result;
  if (typeof value !== "number") throw new RateLimitUnavailableError();
  return value === 1;
}

function consumeLocalRateLimit(clientKey: string, now: number): boolean {
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

export async function consumeAiRateLimit(clientKey: string, now = Date.now()): Promise<boolean> {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    return consumeDistributedRateLimit(clientKey, now);
  }
  if (process.env.NODE_ENV === "production") throw new RateLimitUnavailableError();
  return consumeLocalRateLimit(clientKey, now);
}
