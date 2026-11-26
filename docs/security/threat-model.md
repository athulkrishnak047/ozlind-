# AI platform threat model

**Scope:** Public anonymous Gemini/Groq streaming endpoint and browser-local chat workspace.

| Threat | Control in this phase | Remaining requirement |
| --- | --- | --- |
| Provider key disclosure | Server-only environment variables; no secret status endpoint | Secret scanning and rotation runbook |
| Unauthorized model spend | Atomic shared per-IP rate limit; request/output limits; provider timeouts | Identity, per-account quotas, concurrency budgets, spend alerts |
| API abuse and cost exhaustion | Upstash Redis sliding-window limiter, fail-closed production behavior, bounded inputs | Edge/WAF controls, adaptive abuse detection, billing and spend caps |
| Prompt injection | No tools, retrieval, or privileged actions; constrained role/content contract | Untrusted-content isolation and tool allowlists before tools are introduced |
| Cross-user data exposure | No server-side conversation persistence; local history stays in browser | Tenant-scoped authorization and isolation tests before accounts/sync |
| Sensitive logs | No prompts, completions, credentials, or raw provider errors intentionally logged | Central redaction policy and log access controls |
| Provider outage | Pre-first-token fallback; bounded provider timeout | Provider health metrics and measured routing policy |
| Local device exposure | Browser-local history only; users can clear local conversations | Optional local lock and explicit retention controls |
| Supply-chain compromise | Exact direct dependency versions | Committed lockfile, vulnerability scanning and reviewed updates |

## Data classification

- **Secrets:** API keys, Redis tokens, signing keys. Never log or commit.
- **Personal data:** account identifiers, prompts, uploads, memory. Collect only for a declared purpose and retention period.
- **Operational metadata:** request IDs, latency, status, model IDs, usage counters. Avoid prompt/body capture by default.

## Release gates

Before accounts, server-side history, memory, tools, uploads, or billing are added, require identity, tenant isolation, data retention/deletion behavior, authorization tests, spend budgets, safe failure behavior, and an operator runbook.
