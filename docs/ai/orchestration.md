# Phase 2: AI orchestration

**Status:** Implemented; protected endpoint is disabled until an access token is configured.  
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

Model availability, quotas, pricing, and free-tier eligibility are controlled by the provider and can change. A configured key does not guarantee free or unlimited inference. Check the provider consoles before enabling production traffic.

## Request contract

`POST /api/chat`

Headers:
- `Authorization: Bearer <OZLIND_AI_ACCESS_TOKEN>`
- `Content-Type: application/json`

Body:
```json
{
  "provider": "auto",
  "messages": [
    { "role": "user", "content": "Hello, Ozlind" }
  ]
}
```

- `provider` is optional: `auto`, `gemini`, or `groq`.
- `auto` tries Gemini first, then Groq. Selecting one provider makes it preferred, not exclusive.
- Only user and assistant messages are accepted. The final message must be from the user.
- Maximum 20 messages, 8,000 characters per message, 24,000 total characters, and 48 KiB request body.
- The endpoint streams Server-Sent Events: `start`, `delta`, `done`, or `error`.
- The first provider that emits text wins. If a provider fails before its first text chunk, the next configured provider is attempted. Once output has begun, the stream is not silently restarted on another model because that could duplicate or contradict already delivered text.

## Safety and operational controls

- The route returns 503 until `OZLIND_AI_ACCESS_TOKEN` is configured with at least 32 characters. Generate one locally using `openssl rand -base64 48`.
- The token is a temporary server-to-server gate, not a user identity system. Do not put it in browser code.
- A per-instance in-memory limit of 8 requests per client per minute is included as defense in depth. It is not a distributed/global quota and can reset when Vercel instances recycle.
- Before public browser access, add real user authentication, tenant-level quotas, and a shared rate-limit/usage store or enforce equivalent controls at the edge. Do not treat the in-memory limiter as sufficient protection against distributed abuse.
- Each provider attempt has a 25-second timeout; the route has a 60-second maximum duration.
- No prompt, completion, key, or raw upstream error is written to logs by this implementation.
- No tools are exposed to the model in this phase; model output is plain text only.
- Responses are not persisted. Conversation history is supplied by the caller on each request.

## Deployment configuration

In Vercel Project Settings → Environment Variables, add:
- `GEMINI_API_KEY`
- `GROQ_API_KEY`
- `OZLIND_AI_ACCESS_TOKEN` (generate privately; do not send it in chat)

Optional:
- `GEMINI_MODEL`
- `GROQ_MODEL`

Apply the secrets to the intended environments and redeploy. The app does not reveal whether any credential is present. A live provider call must be verified with a valid token and provider quota; build success alone is not proof of provider connectivity.

## Non-goals

This phase does not add browser chat UI, login/accounts, persistent chat history, memory, retrieval, tools/agents, multimodal uploads, billing, or a global quota store. These require separate security and data-lifecycle decisions.
