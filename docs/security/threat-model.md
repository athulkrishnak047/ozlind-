# AI platform threat model

**Scope:** Core platform and protected Gemini/Groq streaming endpoint.

| Threat | Control in this phase | Remaining requirement |
| --- | --- | --- |
| Provider key disclosure | Server-only env vars; no secret status endpoint | Secret scanning and rotation runbook |
| Unauthorized model spend | Long bearer-token gate; route disabled without it | Real user identity and per-user authorization before browser exposure |
| API abuse and cost exhaustion | Body/token limits, per-instance rate limit, provider timeout | Shared distributed quotas, concurrency controls, edge/WAF limits and spend alerts |
| Prompt injection | No tools, retrieval, or privileged actions; constrained role/content contract | Untrusted-content isolation and tool allowlists before tools are introduced |
| Cross-user data exposure | No persistence or user-specific data in this phase | Tenant-scoped authorization and isolation tests |
| Sensitive logs | No prompts, completions, credentials, or raw provider errors logged | Central redaction policy and log access controls |
| Provider outage | Pre-first-token fallback; bounded per-provider timeout | Provider health metrics and measured routing policy |
| Supply-chain compromise | Exact direct dependency versions and Dependabot | Committed lockfile, vulnerability scanning and reviewed updates |

## Data classification

- **Secrets:** API keys, access tokens, signing keys. Never log or commit.
- **Personal data:** account identifiers, prompts, uploads, memory. Collect only for a declared purpose and retention period.
- **Operational metadata:** request IDs, latency, status, model IDs, usage counters. Avoid prompt/body capture by default.

## Release gates

Before public browser access or user-specific AI features, require authentication, tenant isolation, shared rate/usage controls, concurrency budgets, provider spend alerts, safe failure behavior, retention/deletion behavior, and an operator runbook.
