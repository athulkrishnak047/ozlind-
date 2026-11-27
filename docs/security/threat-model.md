# AI platform threat model

**Scope:** Public anonymous Gemini/Groq chat, live research, multimodal file analysis, speech-to-text, and browser-local chat workspace.

## Security principles

- Treat user prompts, prior assistant turns, uploaded files, transcripts, retrieved pages, search snippets, and tool outputs as untrusted data.
- Never let untrusted content grant permissions, change system/developer policy, reveal secrets, or authorize backend actions.
- Keep provider credentials server-side. Never accept a visitor-supplied provider key as authority.
- Do not expose general-purpose shell, database, filesystem, network, or repository tools to the model.
- Validate every trust boundary on the server, not only in the browser.
- Fail closed when authorization, validation, provider configuration, or safety checks cannot be established.
- Do not claim that prompt instructions alone can guarantee resistance to all prompt injection.

## Current controls

| Threat | Control in this phase | Remaining requirement |
| --- | --- | --- |
| Provider key disclosure | Server-only environment variables; no secret status endpoint; keys are not sent to client | Secret scanning, rotation runbook, deployment secret audit |
| Unauthorized model spend | Bounded request/output sizes, provider timeouts, best-effort per-instance rate limit | Shared quotas, identity-based budgets, concurrency and spend caps |
| API abuse and cost exhaustion | In-memory sliding-window limiter, bounded inputs/uploads and provider duration | Edge/WAF controls, distributed abuse detection, billing and spend alerts |
| Direct prompt injection | System policy treats user and prior assistant messages as untrusted; no privileged tools in standard chat | Adversarial evals, policy regression tests, model-specific safeguards |
| Research/web prompt injection | Research system policy treats user content and web results as untrusted; research tools limited to web search and page visits | Tool-output isolation, domain policy, adversarial page tests, source review |
| Attachment prompt injection | Gemini vision system instruction separates policy from user/file content; embedded instructions are treated as file content | Adversarial PDF/image/video test corpus, OCR/parser isolation and malware scanning |
| Unauthorized backend actions | No general-purpose privileged tool loop, shell, database or filesystem access exposed to models | Typed tool registry, per-tool authorization, approval gates and audit trail before tools |
| Cross-user data exposure | No server-side conversation persistence; history stays in browser | Tenant-scoped authorization and isolation tests before accounts/sync |
| Sensitive logs | No prompts, completions, credentials, or raw provider errors intentionally logged | Central redaction policy and log access controls |
| Provider outage | Pre-first-token fallback for chat; research provider fallback; bounded timeouts | Provider health metrics and measured routing policy |
| Malicious uploads | MIME allowlist, signature checks and strict body/file size limits | Malware scanning, isolated parsing, quotas, retention and deletion before broader uploads |
| Cross-origin abuse | No permissive wildcard CORS policy | Explicit origin policy and CSRF/abuse review if browser integrations expand |
| Local device exposure | Browser-local history only; users can clear local conversations | Optional local lock and explicit retention controls |
| Supply-chain compromise | Exact direct dependency versions and lockfile | Automated dependency advisories, secret scanning, reviewed updates and provenance checks |

## Known limitations

- The in-memory limiter is per serverless instance, not a global quota. A caller may reach multiple instances, and client identity depends on trusted hosting-proxy headers. Do not present it as robust distributed abuse prevention.
- Prompt-injection instructions in system prompts are defense-in-depth, not a formal guarantee. Models can still make mistakes.
- Web research may retrieve malicious or misleading pages. Sources must be independently assessed; page content must never be treated as trusted policy.
- File signature checks establish a plausible file type, not that a file is safe. Provider-side processing does not replace malware scanning or isolated parsing.
- Current endpoints are anonymous and public. No authenticated user identity, tenant isolation, account-level quotas, or server-side data ownership exists yet.
- No general-purpose model tool execution is currently enabled. Do not add privileged tools until the controls below are implemented.

## Required release gates before new capabilities

### Before any tool or agent execution
1. Typed, explicit tool allowlist; no arbitrary URL fetch, shell, filesystem, SQL, or code execution by default.
2. Server-side authorization for every tool call; model output is never authorization.
3. Least-privilege credentials scoped to one action/resource.
4. Validate and normalize all arguments; enforce timeouts, response-size limits, concurrency and spend budgets.
5. Treat tool output as untrusted data and prevent it from changing the agent's policy.
6. Require explicit human approval for external side effects, publication, payments, account changes, destructive actions, or disclosure of sensitive data.
7. Audit who requested what, which tool ran, what was authorized, and the outcome without logging secrets or full private prompts.
8. Add adversarial prompt-injection, cross-tenant and authorization tests.

### Before accounts, server-side history or memory
- Define data ownership, tenant isolation, retention, export and deletion behavior.
- Enforce authorization in every query and storage operation.
- Test IDOR, cross-tenant reads/writes, session fixation, CSRF, account recovery and privilege escalation.
- Keep memory inspectable, user-controlled and deletable; propagate deletion to derived indexes.

### Before public launch of expanded backend features
- Run lint, strict typecheck, unit, route-contract, integration and security regression suites.
- Add dependency and secret scanning.
- Add rate/concurrency/spend caps and operator alerts.
- Verify headers, CORS, cache behavior, upload handling and error redaction.
- Perform a deployment smoke test and maintain a rollback path.

## Data classification

- **Secrets:** Provider API keys and future signing keys. Never log or commit.
- **Personal data:** Account identifiers, prompts, uploads, and memory. Collect only for a declared purpose and retention period.
- **Operational metadata:** Request IDs, latency, status, model IDs, and usage counters. Avoid prompt/body capture by default.

## Security posture

Ozlind uses layered controls, but this early public platform is not certified exploit-proof. New backend capabilities must not ship based solely on a prompt instruction or a frontend restriction; enforce policy and authorization server-side and test adversarially.
