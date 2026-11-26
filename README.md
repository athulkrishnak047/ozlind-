# Ozlind

Ozlind is being developed as a serious, extensible AI platform. The repository is organized around explicit architecture boundaries, secure defaults, and verified delivery rather than one-off prototypes.

## Technology foundation

- Next.js App Router + React
- TypeScript strict mode
- Node.js 26
- Vercel Functions and Git-based deployments
- Vercel AI SDK with Google Gemini and Groq provider adapters
- Vitest unit and contract tests

## Local development

Requirements: Node.js 26 and npm.

~~~bash
npm install
cp .env.example .env.local
npm run dev
~~~

Provider credentials and the AI access token must remain server-side. Never add real credentials to source control or variables prefixed with NEXT_PUBLIC_.

## Quality checks

~~~bash
npm run lint
npm run typecheck
npm run test
npm run build
~~~

Or run all checks in sequence with `npm run verify`.

## AI core

Phase 2 adds a protected streaming endpoint at `POST /api/chat`, Gemini-first/Groq-fallback routing, bounded retries through provider failover, request validation, timeouts, output limits, and safe error events. The endpoint stays disabled until `OZLIND_AI_ACCESS_TOKEN` is configured. It is not yet a public browser chat API: real user authentication and shared quotas are required first.

See [AI orchestration](docs/ai/orchestration.md) for model defaults, environment variables, API contract, and operational limits.

## Architecture and security

- System architecture: docs/architecture/system-overview.md
- API contract: docs/architecture/api-contract.md
- Initial architecture decision: docs/architecture/decisions/0001-platform-foundation.md
- AI orchestration: docs/ai/orchestration.md
- Threat model: docs/security/threat-model.md
- Definition of done: docs/engineering/definition-of-done.md
- Security policy: SECURITY.md

Database, identity provider, persistent memory, and user-facing chat UI remain separate phases because they require explicit data lifecycle, residency, retention, tenancy, and cost decisions.
