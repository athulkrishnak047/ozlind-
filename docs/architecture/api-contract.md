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

`POST /api/chat` is an anonymous public Server-Sent Events endpoint. It accepts a constrained provider preference plus user/assistant messages and emits `start`, `delta`, `done`, and `error` events. Request limits, model defaults, failover behavior, and abuse controls are documented in [AI orchestration](../ai/orchestration.md).

No visitor-supplied owner or provider bearer token is required. Provider credentials remain server-side. The current bounded in-memory sliding-window limiter is per serverless instance and is not a global quota.

## Other public AI routes

- `POST /api/research`: bounded chat-shaped request; performs live web research using Gemini Google Search grounding with Groq Compound fallback.
- `POST /api/transcribe`: multipart audio upload; accepts bounded supported audio types and returns a transcript using Groq Whisper.
- `POST /api/vision`: multipart PDF, image, or short-video analysis through Gemini; validates MIME type and file signature and enforces a 10 MB file limit.

Each route validates input, limits expensive work, normalizes public errors, and keeps provider credentials server-side.

## Rules

- Use stable machine-readable error codes.
- Do not return stack traces, raw provider errors, secrets, or internal implementation details.
- Include a request ID on API responses where applicable.
- Use `Cache-Control: no-store` unless a route has an explicit, reviewed caching policy.
- Validate request bodies, query parameters, uploads, and external responses at trust boundaries.
- Treat prompts, attachments, retrieved web pages, citations, and model/tool outputs as untrusted data. Prompt text is not authorization.
- Do not expose privileged backend tools until server-side authorization, explicit allowlists, approval gates for side effects, output limits, and adversarial tests exist.
- Document authentication and authorization requirements for every route. Current routes are intentionally anonymous and public.
- Set explicit payload, timeout, output, and abuse limits before accepting expensive work.
- The current in-memory rate limiter is best-effort per instance only. It must not be described as an atomic shared/global quota.
- Cross-origin browser access must follow an explicit CORS allowlist; do not enable wildcard origins by default.
