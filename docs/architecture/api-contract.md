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

`POST /api/chat` is a protected Server-Sent Events endpoint. It requires a bearer token and accepts only a constrained provider preference plus user/assistant messages. It emits `start`, `delta`, `done`, and `error` events. Request limits, model defaults, failover behavior, and access requirements are documented in [AI orchestration](../ai/orchestration.md).

The route is disabled until the server-side `OZLIND_AI_ACCESS_TOKEN` is configured. Do not put that token in browser code.

## Rules

- Use stable machine-readable error codes.
- Do not return stack traces, raw provider errors, secrets, or internal implementation details.
- Set a request ID on every API response.
- Use Cache-Control: no-store unless a route has an explicit, reviewed caching policy.
- Validate request bodies, query parameters, and external responses at trust boundaries.
- Document authentication and authorization requirements for every non-public route.
- Set explicit payload, timeout, and rate limits before accepting expensive work.
- A per-instance in-memory rate limiter is not a substitute for shared/global quotas.
