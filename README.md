# Ozlind

Ozlind is being developed as a serious, extensible AI platform. The repository is organized around explicit architecture boundaries, secure defaults, and verified delivery rather than one-off prototypes.

## Technology foundation

- Next.js App Router + React
- TypeScript strict mode
- Node.js 26
- Vercel Functions and Git-based deployments
- Vitest unit tests
- Centralized API response helpers and security headers

## Local development

Requirements: Node.js 26 and npm.

~~~bash
npm install
cp .env.example .env.local
npm run dev
~~~

The current foundation does not call Gemini or Groq. Their server-side credentials are reserved for the AI orchestration phase. Never add API keys to source files or variables prefixed with NEXT_PUBLIC_.

## Quality checks

~~~bash
npm run lint
npm run typecheck
npm run test
npm run build
~~~

Or run all checks in sequence with npm run verify.

## Architecture and security

- System architecture: docs/architecture/system-overview.md
- API contract: docs/architecture/api-contract.md
- Architecture decision record: docs/architecture/decisions/0001-platform-foundation.md
- Initial threat model: docs/security/threat-model.md
- Definition of done: docs/engineering/definition-of-done.md
- Security policy: SECURITY.md

## Current scope

Phase 1 establishes the application/runtime structure, API conventions, baseline browser security headers, documentation, and quality gates. Database, identity provider, persistent memory, and AI provider adapters are intentionally not provisioned or implemented in this phase.
