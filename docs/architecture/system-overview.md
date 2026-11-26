# Ozlind system architecture

**Status:** Foundation baseline  
**Last reviewed:** 2026-11-26

## Architectural goals

Ozlind is intended to grow into a multi-capability AI platform. The architecture prioritizes explicit boundaries, provider independence, secure-by-default behavior, observable operations, and reversible decisions.

## Current runtime baseline

- Web application: Next.js App Router with React Server Components by default.
- Runtime: Node.js 26 on Vercel.
- HTTP backend: Next.js Route Handlers deployed as Vercel Functions.
- Language: TypeScript in strict mode.
- Tests: Vitest unit and contract tests; deployment build as an integration gate.
- Deployment: Vercel Git integration; preview deployments are used for review.

## Logical boundaries

| Boundary | Responsibility | Rule |
| --- | --- | --- |
| Experience | Pages, layouts, accessible interaction | No provider secrets or direct model calls from the browser |
| HTTP/API | Authentication, validation, rate limits, response envelopes | Treat every request as untrusted |
| Application | Use cases and orchestration | Framework-independent business rules |
| Domain | Provider-neutral types and policies | No SDK-specific types in domain contracts |
| Adapters | Gemini, Groq, databases, identity, external tools | Secrets stay server-side; adapters are replaceable |
| Infrastructure | Logging, metrics, deployment, persistence | Minimize sensitive data in telemetry |

## Request lifecycle

1. Receive request at a Route Handler.
2. Assign or validate a correlation/request ID.
3. Authenticate and authorize the caller when the route is not public.
4. Validate input and enforce payload limits.
5. Apply rate and usage budgets before expensive work.
6. Invoke an application use case through a provider-neutral interface.
7. Normalize failures and validate output.
8. Return a typed response with no-store caching for private/dynamic data.
9. Emit operational telemetry without prompts, credentials, or personal content by default.

## Data and identity decisions

No production database, vector store, or identity provider is provisioned in this phase. Those choices depend on data residency, retention, deletion/export requirements, tenant isolation, expected traffic, and cost. They must be selected explicitly before storing user data or adding account features.

Memory must be opt-in, user-visible, inspectable, editable, and deletable. A vector index is not the source of truth for user consent or deletion.

## AI provider boundary

Gemini and Groq credentials are server-side Vercel secrets. This foundation intentionally does not call either provider. The AI orchestration phase will add provider adapters, capability metadata, budget enforcement, retries, timeout policy, fallback rules, and contract tests.

## Security posture

- No secrets in source control or client bundles.
- No public endpoint reports whether provider credentials are configured.
- API errors must not return stack traces or raw upstream provider payloads.
- Security headers are set centrally.
- Content Security Policy will be introduced with nonce-aware rendering before authenticated or interactive production surfaces are added; a permissive policy is not used as a shortcut.
- Authentication, authorization, rate limiting, abuse controls, and audit trails are mandatory before user-specific or costly endpoints become public.

## Scaling approach

Start with stateless HTTP functions and managed persistence selected by workload. Introduce queues/workflows only for durable asynchronous jobs, fan-out, or long-running operations. Do not add distributed infrastructure before measurements justify it.

## Operational signals

Every request should have a request ID. Production telemetry should capture route, latency, status, provider/model identifiers where applicable, retry count, and usage counters—never raw credentials or conversation content by default.
