# AI orchestration

**Status:** Public anonymous beta endpoint with server-side provider credentials and shared rate limiting.  
**Runtime:** Node.js Route Handler on Vercel.

## Components

- Vercel AI SDK provides the provider-neutral streaming interface.
- Google Generative AI adapter uses `@ai-sdk/google`.
- Groq adapter uses `@ai-sdk/groq`.
- Provider selection and model IDs are server-side configuration; clients cannot submit arbitrary model names.
- API keys are read only from `GEMINI_API_KEY` and `GROQ_API_KEY`. Never expose them through `NEXT_PUBLIC_*`.

## Defaults and overrides

| Provider | Default model | Environment override |
| --- | --- | --- |
| Gemini | `gemini-3.8-flash` | `GEMINI_MODEL` |
| Groq | `openai/gpt-oss-120b` | `GROQ_MODEL` |

Model availability, quotas, pricing, and free-tier eligibility are controlled by providers and can change. A configured key does not guarantee free or unlimited inference.

## Request contract

`POST /api/chat`

Headers:
- `Content-Type: application/json`

Body:
~~~json
{
  "provider": "auto",
  "messages": [{ "role": "user", "content": "Hello, Ozlind" }]
}
~~~

- `provider` is optional: `auto`, `gemini`, or `groq`.
- `auto` tries Gemini first, then Groq. Selecting one provider makes it preferred, not exclusive.
- Only user and assistant messages are accepted. The final message must be from the user.
- Maximum 20 messages, 8,000 characters per message, 24,000 total characters, and 48 KiB request body.
- The endpoint streams Server-Sent Events: `start`, `delta`, `done`, or `error`.
- The first provider that emits text wins. If a provider fails before its first text chunk, the next configured provider is attempted. Once output has begun, the stream is not silently restarted on another model.

## Safety and operational controls

- Production requests require Upstash Redis REST credentials. The route fails closed with 503 if the shared limiter is missing or unavailable.
- An atomic Redis sorted-set sliding window limits each client IP to 8 requests per minute across server instances.
- Client identifiers are SHA-256 hashed before being used as Redis keys.
- Local development and tests use an in-memory limiter; it is not used as a production fallback.
- Each provider attempt has a 25-second timeout; the route has a 60-second maximum duration.
- Request bodies and output are bounded. No tools are exposed to the model in this phase.
- Provider fallback only occurs before the first emitted text. After streaming starts, the client receives a clear interruption event rather than duplicated output.
- No prompt, completion, key, or raw upstream error is intentionally written to logs.

## Deployment configuration

In Vercel Project Settings → Environment Variables, configure:
- `GEMINI_API_KEY` and/or `GROQ_API_KEY`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

Optional:
- `GEMINI_MODEL`
- `GROQ_MODEL`

Apply secrets to the intended environments and redeploy. A successful build does not prove that provider credentials, quotas, or Redis connectivity are valid; verify with a controlled live request.

## Current limitations

The endpoint is public and anonymous. The shared IP limit is a baseline anti-abuse control, not per-account quotas, identity, billing, or a guarantee against sophisticated distributed abuse. Browser-local chat history is not synced or backed up. Account identity, server-side persistence, memory, retrieval, tools/agents, multimodal uploads, and billing need separate designs and tests.
