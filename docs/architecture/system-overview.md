# Ozlind system architecture

**Status:** Public AI workspace foundation  
**Last reviewed:** 2026-11-26

## Architectural goals

Ozlind is designed as a multi-capability AI platform. The architecture prioritizes correctness, provider independence, safe defaults, observable operations, low latency, privacy, and reversible decisions. Product capabilities must be introduced behind explicit contracts and tests rather than accumulating provider-specific logic in UI components.

## Current runtime baseline

- Web application: Next.js App Router; React Server Components by default.
- Runtime: Node.js 26 on Vercel.
- HTTP backend: Next.js Route Handlers deployed as Vercel Functions.
- Language: strict TypeScript.
- Tests: Vitest unit and contract tests; production build is an integration gate.
- Deployment: Vercel Git integration; main-branch production deployments.
- Persistence: browser-local history only; no production database currently provisioned.
- Abuse protection: bounded in-memory sliding window, best-effort per serverless instance; no Redis dependency.

## Logical boundaries

| Boundary | Responsibility | Rule |
| --- | --- | --- |
| Experience | Pages, layouts, accessible interaction | No provider secrets or direct model calls from the browser |
| HTTP/API | Validation, request IDs, rate controls, response contracts | Treat every request as untrusted |
| Application | Use cases and orchestration | Keep product policy separate from framework code |
| Domain | Provider-neutral types and policies | No SDK-specific types in domain contracts |
| Adapters | Gemini, Groq, external search and future tools | Secrets stay server-side; adapters are replaceable |
| Infrastructure | Deployment, telemetry, future persistence | Minimize sensitive data and avoid premature dependencies |

## Request lifecycle

1. Receive the request at a Route Handler.
2. Assign or propagate a safe correlation/request ID.
3. Validate bounded input and content type.
4. Apply the current best-effort per-instance abuse limit before expensive work.
5. Invoke a provider through the application boundary.
6. Normalize failures and validate provider output.
7. Return a typed response or stream with no-store caching.
8. Emit operational telemetry without prompts, credentials, or personal content by default.

Authentication and authorization are not currently implemented because the current chat, research, and transcription experience is anonymous and public. Any future user-specific route must introduce identity, authorization, and tenant isolation before it stores or exposes user data.

## Data and identity decisions

No production database, vector store, or identity provider is provisioned. Basic PDF, image, and short-video analysis is available through a separate Gemini route; durable cloud storage and identity are not. Choose these only after defining data residency, retention, deletion/export, tenant isolation, traffic, and cost requirements.

Memory must be opt-in, user-visible, inspectable, editable, and deletable. A vector index must never become the source of truth for user consent or deletion.

## AI provider boundary

The chat runtime uses Vercel AI SDK with Gemini and Groq adapters. Provider-specific SDK types stay in adapter modules. The chat route accepts a constrained message contract and never accepts arbitrary model IDs or system prompts from callers.

Automatic routing tries Gemini first and Groq second by default. A caller may change the preferred provider, but the other configured provider remains a fallback. Failover is permitted only before the first output token; after streaming begins, the route reports an interrupted stream rather than replaying content and risking duplicated or contradictory answers.

Live research uses Gemini Google Search grounding through the Interactions API, with Groq Compound as a fallback. Voice input uses Groq Whisper transcription. PDF, image, and short-video understanding uses a separate Gemini multimodal route with bounded uploads and file-signature checks. These capabilities have separate route contracts and bounded inputs.

Provider credentials and model overrides are server-only. Each provider attempt has a bounded timeout and output-token budget. The in-memory limiter is per-instance defense in depth only; it is not a global quota.

See [AI orchestration](../ai/orchestration.md) for request contracts, model defaults, limits, and operational boundaries.

## Security posture

- No secrets in source control or client bundles.
- API errors must not return stack traces, raw provider errors, secrets, or internal implementation details.
- Set request IDs and no-store headers on dynamic AI responses.
- Validate request bodies, upload types, sizes, and external provider responses.
- Public endpoints must use bounded work and have documented abuse/cost limitations.
- Do not use wildcard CORS as a shortcut. Cross-origin API access requires an explicit product policy and origin allowlist.
- Identity, shared quotas, abuse controls, and audit trails are mandatory before user-specific or high-cost capabilities are introduced.

## Scaling approach

Start with stateless functions and the simplest infrastructure that satisfies measured needs. Introduce managed persistence only for an explicit product requirement. Add queues/workflows for durable asynchronous jobs, fan-out, or long-running tasks. Add distributed rate limiting when measured abuse or traffic requires globally consistent quotas; do not introduce Redis by default.

## Operational signals

Every request should have a request ID. Production telemetry should capture route, latency, status, provider/model identifiers where applicable, retry count, and usage counters—never raw credentials or conversation content by default.

## Release discipline

A feature is complete only when its architecture, input/output contract, privacy and security behavior, critical tests, lint, strict typecheck, production build, deployment, and rollback behavior are verified. A successful compile alone does not prove live provider credentials or runtime behavior.
