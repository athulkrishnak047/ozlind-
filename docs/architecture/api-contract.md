# API contract baseline

## JSON success envelope

```json
{
  "ok": true,
  "data": {},
  "requestId": "uuid"
}
```

## JSON failure envelope

```json
{
  "ok": false,
  "error": {
    "code": "INVALID_REQUEST",
    "message": "The request is invalid."
  },
  "requestId": "uuid"
}
```

## Streaming AI contract

`POST /api/chat` is an anonymous public Server-Sent Events endpoint protected by a shared Upstash Redis sliding-window rate limit in production. It accepts a constrained provider preference plus user/assistant messages and emits `start`, `delta`, `done`, and `error` events. Request limits, model defaults, failover behavior, and rate-limit configuration are documented in [AI orchestration](../ai/orchestration.md).

No visitor-supplied bearer token is required. Provider keys and Redis credentials remain server-side. Production requests fail closed if the shared limiter is unavailable.

## Rules

- Use stable machine-readable error codes.
- Do not return stack traces, raw provider errors, secrets, or internal implementation details.
- Set a request ID on every API response.
- Use Cache-Control: no-store unless a route has an explicit, reviewed caching policy.
- Validate request bodies, query parameters, and external responses at trust boundaries.
- Document authentication and authorization requirements for every non-public route.
- Set explicit payload, timeout, and rate limits before accepting expensive work.
- Production expensive endpoints must use shared atomic quotas; in-memory rate limiting is permitted only for local development and tests.
