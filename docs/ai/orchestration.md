# AI orchestration

**Status:** Public anonymous beta endpoint with server-side provider credentials and best-effort in-memory rate limiting.  
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

- No Redis, Upstash, or external rate-limit database is required.
- A bounded in-memory sliding window limits each observed client key to 8 requests per minute per running server instance.
- Serverless instances do not share memory; this is best-effort abuse protection, not a global or account-level quota. A distributed limiter can be added later if traffic requires it.
- Request bodies and output are bounded. No external tools are exposed to the standard chat model in this phase. Live research and Gemini file analysis are separate, explicitly selected routes.
- Each provider attempt has a 25-second timeout; the route has a 60-second maximum duration.
- Provider fallback only occurs before the first emitted text. After streaming starts, the client receives a clear interruption event rather than duplicated output.
- No prompt, completion, key, or raw upstream error is intentionally written to logs.

## Deployment configuration

In Vercel Project Settings → Environment Variables, configure at least one:
- `GEMINI_API_KEY`
- `GROQ_API_KEY`

Optional:
- `GEMINI_MODEL`
- `GROQ_MODEL`

Apply secrets to the intended environments and redeploy. A successful build does not prove that provider credentials or quotas are valid; verify with a controlled live request.

## Current limitations

The endpoint is public and anonymous. The in-memory IP limit is a baseline anti-abuse control, not per-account quotas, identity, billing, or a guarantee against sophisticated distributed abuse. Browser-local chat history is not synced or backed up. Account identity, server-side persistence, durable memory, retrieval, in-chat tool execution/agents, real-time voice, and billing need separate designs and tests. A separate Gemini route already supports bounded PDF, image, and short-video analysis.
