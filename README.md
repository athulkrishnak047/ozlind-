# Ozlind

Ozlind is a public, provider-independent AI workspace designed to grow into a reliable multimodal AI platform. Its engineering priorities are correctness, user trust, security, low latency, operational clarity, and measured evolution.

## Current product status

The current foundation includes:
- A public Next.js App Router application and chat workspace.
- Streaming text chat through server-side Gemini and Groq adapters.
- Provider preference with pre-first-token fallback.
- Live web research through Gemini Google Search grounding, with Groq Compound fallback.
- Gemini-powered analysis for supported PDFs, images, and short videos (10 MB upload limit).
- Browser microphone capture and Groq Whisper speech-to-text.
- Browser-local conversation history; no account or cloud synchronization.
- Bounded request validation, provider timeouts, output limits, and best-effort in-memory abuse protection.

This is an early platform foundation, not a claim of feature parity with ChatGPT. Real-time bidirectional voice, durable memory, accounts, cloud history, tool execution, agents, and billing remain future capabilities. File understanding is available through a separate Gemini-powered multimodal route.

## Technology foundation

- Next.js App Router, React, and strict TypeScript
- Node.js 26 runtime
- Vercel Functions and Git-based deployments
- Vercel AI SDK adapters for Gemini and Groq
- Vitest unit and contract tests
- No Redis or external rate-limit database in the current phase

## Local development

Requirements: Node.js 26 and npm.

~~~bash
npm install
cp .env.example .env.local
npm run dev
~~~

Configure at least one provider key locally to enable AI responses. Provider credentials must remain server-side and must never use `NEXT_PUBLIC_` prefixes.

## Production configuration

In Vercel Project Settings → Environment Variables, configure at least one:
- `GEMINI_API_KEY`
- `GROQ_API_KEY`

Optional model overrides:
- `GEMINI_MODEL`
- `GROQ_MODEL`

Apply secrets to the intended environments and redeploy. A configured key does not guarantee provider availability, quota, or free-tier access.

## Quality checks

~~~bash
npm run lint
npm run typecheck
npm run test
npm run build
~~~

Or run all checks in sequence with `npm run verify`.

## Product experience

The public landing page is in `src/components/landing-page.tsx`; the chat workspace is served at `/workspace`. The workspace supports streamed Gemini/Groq responses, provider preference, stop generation, copy, prompt starters, live research, voice-to-text, and browser-local conversation history. Local history is not synced across devices.

## UI/UX-first development

The current development priority is the Ozlind experience: visual consistency, responsive navigation, chat composer, message readability, settings, accessibility and low-data performance. Backend expansion is intentionally paused unless a UI requirement cannot be met without it.

Start with the [UI/UX documentation index](docs/product/ui-ux-index.md).

## Brand assets and legal documents

- [Brand guidelines](docs/brand/BRAND-GUIDELINES.md)
- [Brand and UI asset inventory](docs/assets/ASSET-INVENTORY.md)
- [Standalone Ozlind symbol](public/brand/ozlind-symbol.svg)
- [Horizontal Ozlind logo](public/brand/ozlind-logo.svg)
- [Light-theme logo](public/brand/ozlind-logo-light.svg)
- [Dark-theme logo](public/brand/ozlind-logo-dark.svg)
- [UI SVG symbol library](public/icons/ozlind-ui.svg)
- [Legal documents index — drafts only](docs/legal/README.md)
- [Terms of Service draft](docs/legal/TERMS-OF-SERVICE.md)
- [Privacy Policy draft](docs/legal/PRIVACY-POLICY.md)
- [Acceptable Use Policy draft](docs/legal/ACCEPTABLE-USE-POLICY.md)
- [Third-party services disclosure](docs/legal/THIRD-PARTY-SERVICES.md)
- [Cookie and local storage notice](docs/legal/COOKIE-AND-LOCAL-STORAGE-NOTICE.md)
- [Copyright and IP notice](docs/legal/COPYRIGHT-AND-IP.md)
- [Support and complaints process](docs/legal/COMPLAINTS-AND-SUPPORT.md)
- [Legal launch checklist](docs/legal/LEGAL-LAUNCH-CHECKLIST.md)

Legal files are working drafts, not approved policies or legal advice. Replace placeholders, verify production data handling and provider contracts, and obtain qualified legal review before publishing.

## API health

- `GET /api/health` provides a minimal liveness check with a request ID. It confirms that the API process can respond; it does not verify AI provider credentials or external service readiness.

## AI core

- `POST /api/chat`: bounded JSON input and Server-Sent Events output.
- `POST /api/research`: grounded web research with provider fallback and normalized citations.
- `POST /api/transcribe`: bounded audio upload and speech-to-text.
- `POST /api/vision`: bounded PDF, image, and short-video analysis through Gemini.

Provider keys and model IDs remain server-side. See [AI orchestration](docs/ai/orchestration.md) for contracts, limits, fallback behavior, and deployment configuration. See the [AI transparency standard](docs/ai/AI-TRANSPARENCY.md) for product disclosure requirements.

## Security and scaling posture

- The current endpoints are anonymous and public; no visitor-supplied owner token is required.
- A bounded in-memory sliding window provides best-effort per-instance abuse protection. Vercel serverless instances do not share memory, so this is not a global quota or a guarantee against distributed abuse.
- Request bodies, audio size, provider timeouts, and output tokens are bounded.
- No Redis, Upstash, database, account system, or cloud conversation store is currently required.
- Provider secrets remain server-side. Do not expose them in client bundles or logs.
- External websites calling Ozlind APIs cross-origin require an explicit CORS policy; public browser access alone does not imply unrestricted cross-origin API access.

Identity, cloud persistence, durable memory, retrieval, in-chat tool execution, agents, real-time voice, and billing require dedicated privacy, tenancy, safety, cost, and lifecycle designs before release. Basic PDF, image, and short-video analysis is already available through `/api/vision`.

## Product and UI/UX documents

- [UI/UX documentation index](docs/product/ui-ux-index.md)
- [Product blueprint](docs/product/ozlind-product-blueprint.md)
- [Design system](docs/product/design-system.md)
- [Information architecture](docs/product/information-architecture.md)
- [Screen specifications](docs/product/screen-specifications.md)
- [Interaction specifications](docs/product/interaction-specifications.md)
- [Reusable component catalog](docs/product/component-catalog.md)
- [Responsive behavior](docs/product/responsive-behavior.md)
- [Accessibility specification](docs/product/accessibility-specification.md)
- [Content and microcopy](docs/product/content-and-microcopy.md)
- [Performance and low-data UX](docs/product/performance-and-low-data.md)
- [Chat experience](docs/product/chat-experience.md)
- [UI benchmark](docs/product/ui-benchmark.md)
- [Platform roadmap](docs/product/platform-roadmap.md)
- [Verified release status](docs/product/release-status.md)
- [Launch readiness checklist](docs/product/launch-readiness-checklist.md)

## Engineering and operations documents

- [Frontend architecture](docs/engineering/frontend-architecture.md)
- [System architecture](docs/architecture/system-overview.md)
- [API contract](docs/architecture/api-contract.md)
- [AI orchestration](docs/ai/orchestration.md)
- [AI transparency standard](docs/ai/AI-TRANSPARENCY.md)
- [Threat model](docs/security/threat-model.md)
- [Support and incident playbook](docs/operations/SUPPORT-AND-INCIDENT-PLAYBOOK.md)
- [Support communication templates](docs/operations/COMMUNICATION-TEMPLATES.md)
- [Help Center FAQ draft](docs/support/HELP-CENTER-FAQ.md)
- [Definition of done](docs/engineering/definition-of-done.md)
- [Security policy](SECURITY.md)
