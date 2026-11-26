# ADR 0002: Provider-neutral AI orchestration

- **Status:** Accepted
- **Date:** 2026-11-26

## Context

Ozlind needs an AI backend that can use Gemini and Groq without binding application contracts to either vendor. Provider outages and latency must not force a client-side redesign. Provider credentials must remain private, and an unauthenticated public endpoint must not be able to spend API credits.

## Decisions

1. Use the Vercel AI SDK with dedicated Google and Groq adapters.
2. Keep provider choice, model IDs, and credentials on the server. The request may select only a preferred provider from a fixed allowlist.
3. In automatic mode, try Gemini first and Groq second. Fail over only before the first streamed text delta.
4. Bound request size, message count, per-message characters, output tokens, provider timeout, and per-instance request frequency.
5. Require a server-side bearer token of at least 32 characters; keep the endpoint disabled until configured.
6. Do not expose the bearer token to browser code. Public UI access waits for real user authentication and shared quotas.
7. Do not persist conversations or expose tools in this phase.

## Consequences

- The backend can stream text and route between the two providers without leaking provider keys.
- Failover cannot safely switch providers after partial output; the stream reports interruption instead.
- The in-memory limiter is only a per-instance guard and is not a global abuse-control mechanism.
- Provider quotas, billing, and model availability remain controlled by Google and Groq.
- Browser chat, identity, persistence, memory, and global quota storage remain separate work.
