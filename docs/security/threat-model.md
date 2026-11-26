# Initial threat model

**Scope:** Core platform foundation, before user accounts and AI provider calls.

| Threat | Initial control | Required before public AI launch |
| --- | --- | --- |
| Provider key disclosure | Server-only environment variables; no public env status endpoint | Secret scanning and key rotation runbook |
| Prompt/request injection | No model/tool execution in this phase | Input boundaries, tool allowlists, output validation, untrusted-content isolation |
| API abuse and cost exhaustion | No expensive public endpoints | Per-user/IP rate limits, quotas, concurrency limits, spend alerts |
| Cross-user data exposure | No user data persistence in this phase | Tenant-scoped authorization and isolation tests |
| Sensitive logs | Response helpers avoid internal error details | Structured redaction policy and log access controls |
| Browser-based attacks | Security headers; no authenticated surface yet | Nonce-based CSP and CSRF strategy for cookie-authenticated mutations |
| Supply-chain compromise | Exact direct dependency versions; automated checks required | Lockfile, dependency update policy, vulnerability scanning and review |

## Data classification

- **Secrets:** API keys, tokens, signing keys. Never log or commit.
- **Personal data:** account identifiers, prompts, uploads, memory. Collect only for a declared purpose and retention period.
- **Operational metadata:** request IDs, latency, status, model IDs, usage counters. Avoid prompt/body capture by default.

## Release gates

Before a feature handles user data or spends provider credits, it must have an abuse-case review, authorization tests, rate/usage controls, safe failure behavior, retention/deletion behavior, and an operator runbook.
