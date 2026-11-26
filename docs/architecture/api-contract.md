# API contract baseline

## Success envelope

~~~json
{
  "ok": true,
  "data": {},
  "requestId": "uuid"
}
~~~

## Failure envelope

~~~json
{
  "ok": false,
  "error": {
    "code": "INVALID_REQUEST",
    "message": "The request is invalid."
  },
  "requestId": "uuid"
}
~~~

## Rules

- Use stable machine-readable error codes.
- Do not return stack traces, raw provider errors, secrets, or internal implementation details.
- Set a request ID on every API response.
- Use Cache-Control: no-store unless a route has an explicit, reviewed caching policy.
- Validate request bodies, query parameters, and external responses at trust boundaries.
- Document authentication and authorization requirements for every non-public route.
- Set explicit payload, timeout, and rate limits before accepting expensive work.
