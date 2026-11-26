# ADR 0001: Platform foundation

- **Status:** Accepted
- **Date:** 2026-11-26

## Context

The repository previously contained a single static HTML test page. Ozlind needs a maintainable full-stack foundation without coupling the product to one AI provider or prematurely selecting persistence and identity vendors.

## Decisions

1. Adopt Next.js App Router and React for a unified web and HTTP application.
2. Use strict TypeScript and Node.js 26.
3. Deploy request/response APIs as Vercel Functions in the same project initially.
4. Keep domain and application contracts provider-neutral. Provider SDKs belong only in adapter modules.
5. Keep credentials in server-only environment variables. No secret may use a NEXT_PUBLIC_ prefix.
6. Use structured API envelopes with request IDs and no-store caching by default.
7. Require lint, strict typecheck, unit tests, and production build to pass.
8. Do not provision a database or identity provider until data lifecycle, residency, tenancy, and cost requirements are documented.
9. Commit directly to main only after automated quality gates pass; keep rollback available and do not deploy unverified code.

## Consequences

- One deployable application is simpler and cost-efficient at the current stage.
- Route Handlers can later be separated if independent scaling or release cycles justify it.
- Persistence and authentication remain explicit future decisions rather than hidden assumptions.
- A future Content Security Policy must use nonce-aware rendering; this baseline applies other security headers first.
