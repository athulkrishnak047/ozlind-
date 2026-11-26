# Ozlind platform roadmap

**Product direction:** Build an original, public AI platform with the breadth and reliability users expect from a leading assistant—not a visual clone and not a claim of parity before capabilities exist.

This roadmap is the product source of truth. Work is delivered in complete vertical slices: contract → implementation → tests → security review → deployment verification → operational notes. Existing working features must not regress.

## Product principles

1. **Useful by default:** a fast, clear chat experience with sensible model routing.
2. **Truthful:** distinguish model output, retrieved evidence, tool results, and uncertainty.
3. **Provider-independent:** Gemini and Groq are adapters, not the product architecture.
4. **Multimodal by design:** text, speech, images, documents, and video share consistent conversation semantics.
5. **Safe tool use:** tools are explicitly permissioned, scoped, observable, and cancellable.
6. **Privacy first:** minimize collection; make memory and retention understandable and controllable.
7. **Accessible and responsive:** keyboard, screen readers, mobile, and low-bandwidth networks are first-class.
8. **Operationally honest:** no capability is marked complete without tests and a verified deployment.

## Current baseline (implemented, not feature parity)

- Public Next.js workspace and landing experience.
- Streaming Gemini/Groq text chat with provider preference and pre-first-token fallback.
- Gemini Google Search grounding with Groq Compound research fallback.
- Groq Whisper speech-to-text.
- Browser-local conversation history.
- Bounded request validation, timeouts, output limits, and best-effort per-instance in-memory abuse limiting.
- Unit/contract tests and a GitHub Actions quality workflow.

Known gaps: no real-time two-way voice, no image/document/video input pipeline, no server-side accounts or sync, no durable memory, no general tool execution, no agent runtime, no user-level quotas, and no billing. In-memory rate limiting is not a globally shared quota. A green build does not prove provider credentials, quotas, or runtime integrations work.

## Delivery phases

### Phase 0 — Engineering foundation and release confidence
- [x] Document system boundaries, public API contracts, threat model, and definition of done.
- [x] Establish lint, typecheck, test, and production-build quality workflow.
- [x] Keep provider credentials server-side and avoid visitor-supplied owner tokens.
- [x] Remove Redis as a current-phase dependency.
- [ ] Confirm a reproducible dependency lockfile and clean-install build.
- [ ] Resolve all CI and production build failures; verify the current main commit on Vercel.
- [ ] Add structured, redacted operational telemetry and a release/rollback runbook.
- [ ] Add end-to-end browser smoke tests for landing, workspace, chat errors, and mobile layout.

**Exit gate:** clean install, lint, strict typecheck, tests, production build, smoke tests, and a READY deployment for the exact main SHA.

### Phase 1 — Chat experience and AI core
- [ ] Normalize provider adapters behind a stable internal model interface.
- [ ] Add explicit routing policy for latency, capability, availability, and cost; retain user override.
- [ ] Add cancellation propagation, retry budgets, timeout classification, and safe fallback semantics.
- [ ] Normalize usage, provider metadata, citations, and errors.
- [ ] Improve conversation UX: rename, search, export, delete, regenerate, edit/resend, and keyboard shortcuts.
- [ ] Add message rendering for Markdown, code, tables, math, and accessible copy controls.
- [ ] Evaluate answer quality, latency, refusal behavior, and provider regressions with a repeatable test set.

**Exit gate:** deterministic route tests, provider contract tests, evaluation baselines, and no silent stream replay or duplicated output.

### Phase 2 — Live research and knowledge work
- [x] Initial live research routes and source extraction.
- [ ] Harden source normalization, citation-to-claim mapping, and source opening.
- [ ] Add research planning and bounded search/visit loops.
- [ ] Add freshness indicators and explicit distinction between search snippets and opened sources.
- [ ] Add research summaries and exportable reports.
- [ ] Add prompt-injection isolation for all retrieved web content.

**Exit gate:** citation correctness tests, hostile-page tests, bounded tool budgets, and verified live-provider integration.

### Phase 3 — Voice
- [x] Initial microphone capture and speech-to-text draft flow.
- [ ] Add real-time bidirectional voice using a supported low-latency speech model/API.
- [ ] Add interruption/barge-in, turn detection, transcript synchronization, and playback controls.
- [ ] Add clear microphone consent, permission state, and recording retention rules.
- [ ] Test mobile browser behavior, network loss, and reconnects.

**Exit gate:** measured end-to-end latency, cancellation and reconnect tests, explicit consent, and mobile accessibility checks.

### Phase 4 — Multimodal understanding and creation
- [ ] Image input with bounded decoding, safe previews, and model capability routing.
- [ ] PDF/document ingestion with page-aware extraction, OCR fallback, and source references.
- [ ] Video understanding through bounded frame sampling and timestamped evidence.
- [ ] File validation, malware scanning, isolated parsing, storage lifecycle, and user deletion.
- [ ] Image generation/editing through an approved provider adapter, with provenance and policy checks.

**Exit gate:** per-format test corpus, upload abuse limits, retention/deletion verification, and cost budgets.

### Phase 5 — Tools and agents
- [ ] Typed tool registry with strict schemas, allowlists, and per-tool permissions.
- [ ] Approval gates for external side effects; read-only tools by default.
- [ ] Sandboxed code execution with network/filesystem/resource isolation.
- [ ] Durable agent runs, cancellation, checkpoints, bounded steps, and audit trails.
- [ ] Human-readable plans and transparent tool activity.
- [ ] Evaluation against prompt injection, data exfiltration, and unsafe action attempts.

**Exit gate:** sandbox threat review, adversarial tests, permission tests, and complete run observability.

### Phase 6 — Accounts, sync, and personal memory
- [ ] Select identity provider and define account recovery and session security.
- [ ] Define data model, tenant isolation, encryption, backup, export, and deletion.
- [ ] Add opt-in memory with inspect/edit/delete controls and provenance.
- [ ] Add cloud conversation sync and cross-device continuity.
- [ ] Define retention, privacy notices, consent, and data-subject workflows.

**Exit gate:** tenant-isolation tests, deletion/export drills, security review, and privacy documentation before public rollout.

### Phase 7 — Public platform and ecosystem
- [ ] Add documented public API with versioning, scoped keys, quotas, and abuse controls.
- [ ] Design explicit CORS allowlists for third-party browser clients; do not use wildcard origins by default.
- [ ] Add developer console, usage reporting, key rotation, and rate-limit headers.
- [ ] Add plugin/integration framework with permissions and revocation.
- [ ] Add billing only after cost accounting, abuse prevention, and transparent pricing exist.
- [ ] Add localization, including high-quality Malayalam and English experiences.

**Exit gate:** API security review, quota enforcement, support/incident runbooks, and transparent pricing/terms.

### Phase 8 — Reliability, scale, and continuous improvement
- [ ] Measure p50/p95 latency, first-token latency, availability, provider errors, and cost per successful task.
- [ ] Add SLOs, alerting, incident response, and graceful degradation.
- [ ] Load-test chat, research, voice, and upload paths independently.
- [ ] Introduce shared quotas or queues only when measured traffic and product needs justify them.
- [ ] Run regular dependency, secret, privacy, and model-behavior reviews.
- [ ] Maintain a public status page and clear incident communication.

**Exit gate:** load-tested capacity, monitored SLOs, tested rollback, and documented operational ownership.

## Non-goals and guardrails

- Do not copy OpenAI branding, proprietary UI assets, or claim to be ChatGPT.
- Do not claim unlimited/free model usage; provider quotas, pricing, and terms apply.
- Do not put provider API keys in browser code or ask visitors to supply the owner's key.
- Do not introduce Redis or another stateful service without a measured requirement and an explicit design.
- Do not expose arbitrary model IDs, unrestricted code execution, or privileged tools to anonymous callers.
- Do not enable wildcard CORS simply to make an API callable from anywhere.
- Do not mark a phase complete based only on code being committed.

## Release status vocabulary

- **Planned:** documented, not implemented.
- **In progress:** code is being changed; not yet release verified.
- **Implemented:** code exists and local/CI checks pass.
- **Verified:** exact commit deployed and runtime smoke checks passed.
- **Operational:** monitoring, rollback, ownership, and support procedures exist.
