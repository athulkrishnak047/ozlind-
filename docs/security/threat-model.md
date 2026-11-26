# AI platform threat model

**Scope:** Public anonymous Gemini/Groq chat, live research, speech-to-text endpoints, and browser-local chat workspace.

| Threat | Control in this phase | Remaining requirement |
| --- | --- | --- |
| Provider key disclosure | Server-only environment variables; no secret status endpoint | Secret scanning and rotation runbook |
| Unauthorized model spend | Bounded requests/output, provider timeouts, best-effort per-instance rate limit | Shared quotas, identity-based budgets, concurrency and spend caps |
| API abuse and cost exhaustion | In-memory sliding-window limiter, bounded inputs, bounded audio and provider duration | Edge/WAF controls, distributed abuse detection, billing and spend alerts |
| Prompt injection | Chat has no privileged tools or retrieval; constrained role/content contract | Untrusted-content isolation and tool allowlists before tools are introduced |
| Cross-user data exposure | No server-side conversation persistence; history stays in browser | Tenant-scoped authorization and isolation tests before accounts/sync |
| Sensitive logs | No prompts, completions, credentials, or raw provider errors intentionally logged | Central redaction policy and log access controls |
| Provider outage | Pre-first-token fallback for chat; research provider fallback; bounded timeouts | Provider health metrics and measured routing policy |
| Malicious uploads | Audio MIME allowlist and strict size limit | File scanning, isolated parsing, quotas, retention and deletion before broader uploads |
| Cross-origin abuse | No permissive wildcard CORS policy | Explicit origin policy if third-party sites need direct API access |
| Local device exposure | Browser-local history only; users can clear local conversations | Optional local lock and explicit retention controls |
| Supply-chain compromise | Exact direct dependency versions | Lockfile review, vulnerability scanning and reviewed updates |

## Data classification

- **Secrets:** Provider API keys and future signing keys. Never log or commit.
- **Personal data:** Account identifiers, prompts, uploads, and memory. Collect only for a declared purpose and retention period.
- **Operational metadata:** Request IDs, latency, status, model IDs, and usage counters. Avoid prompt/body capture by default.

## Release gates

Before accounts, server-side history, memory, tools, uploads beyond the current bounded audio path, or billing are added, require identity, tenant isolation, data retention/deletion behavior, authorization tests, spend budgets, safe failure behavior, and an operator runbook.
