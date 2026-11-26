# Ozlind

Ozlind is an extensible public AI workspace built with explicit architecture boundaries, secure defaults, and verified delivery.

## Technology foundation

- Next.js App Router + React + TypeScript
- Node.js 26
- Vercel Functions and Git-based production deployments
- Vercel AI SDK with Google Gemini and Groq provider adapters
- Vitest unit and contract tests
- Upstash Redis REST for atomic shared rate limiting in production

## Local development

Requirements: Node.js 26 and npm.

~~~bash
npm install
cp .env.example .env.local
npm run dev
~~~

Add at least one provider key to `.env.local` to enable AI responses. Provider credentials and Redis tokens must remain server-side. Never commit real credentials or use `NEXT_PUBLIC_` prefixes for secrets.

## Production configuration

In Vercel Project Settings → Environment Variables, configure:
- `GEMINI_API_KEY` and/or `GROQ_API_KEY`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

The public chat route fails closed in production if shared rate limiting is unavailable. The current shared limit is 8 requests per IP per minute. This is an anonymous public beta guardrail, not a full account-based quota or billing system.

## Quality checks

~~~bash
npm run lint
npm run typecheck
npm run test
npm run build
~~~

Or run all checks in sequence with `npm run verify`.

## Product experience

The public landing page is in `src/components/landing-page.tsx`; the chat workspace is served at `/workspace`. The workspace supports streamed Gemini/Groq responses, provider preference, stop generation, copy, prompt starters, and browser-local conversation history. Local history stays on the current browser and is not synced across devices.

## AI core

`POST /api/chat` validates bounded input, streams server-sent events, applies provider fallback before the first token, enforces provider timeouts and output limits, and uses atomic shared rate limiting through Upstash Redis in production. Provider keys and model IDs remain server-side.

See [AI orchestration](docs/ai/orchestration.md) for the API contract and operational boundaries.

## Architecture and security

- System architecture: docs/architecture/system-overview.md
- API contract: docs/architecture/api-contract.md
- AI orchestration: docs/ai/orchestration.md
- Threat model: docs/security/threat-model.md
- Definition of done: docs/engineering/definition-of-done.md
- Security policy: SECURITY.md

Account identity, cross-device synchronization, server-side chat history, long-term memory, retrieval, tools/agents, multimodal uploads, and billing are not represented as implemented. They require dedicated data lifecycle, tenancy, safety, and cost controls.
