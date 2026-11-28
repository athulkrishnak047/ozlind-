# Ozlind AI backend architecture

## Product boundary

Ozlind owns the AI backend contract and orchestration. The web application is a client of that backend, not the place where AI behavior is implemented. Provider SDKs are infrastructure adapters, not the product architecture.

## Request lifecycle

1. The API boundary enforces body limits, validates the conversation, applies abuse controls, and creates a request ID.
2. The Ozlind Intelligence Engine receives a normalized generation request.
3. The engine selects configured model adapters according to server-side routing policy.
4. The first adapter that successfully emits text owns the response. A fallback is allowed only before any text has been emitted.
5. The engine returns normalized lifecycle events. The API boundary maps these to the stable SSE contract.
6. Client disconnects and request cancellation propagate to the active model operation.

## Ownership layers

- API boundary: HTTP, validation, request IDs, streaming transport, rate limits.
- Intelligence engine: orchestration, system policy, model routing, fallback, timeout and output budgets.
- Model adapters: provider-specific SDKs and credentials, isolated behind a replaceable integration boundary.
- Context and memory: planned first-party subsystems; conversation history must be persisted and retrieved by Ozlind.
- Tools and agents: planned first-party execution runtime with explicit permissions, approval gates for side effects, and auditable execution.
- Data infrastructure: planned identity, database, vector retrieval, object storage, cache, and background jobs.

## Current implementation status

The src/lib/ai/engine.ts module is the first owned orchestration boundary. It centralizes system policy, provider fallback, timeouts, streaming lifecycle, and token usage normalization. The /api/chat route handles HTTP concerns and consumes only the engine event contract.

Gemini and Groq are currently the configured model adapters. This is not a proprietary foundation model and does not make inference independent of external providers. The architecture deliberately makes it possible to add self-hosted or Ozlind-trained models without rewriting the chat API.

## Independence roadmap

1. Engine and adapter contracts, lifecycle events, cancellation, and testable routing.
2. First-party identity, sessions, conversation persistence, and account-level quotas.
3. Context assembly, token budgeting, durable memory, and retrieval.
4. Tool registry, permission model, agent loop, and audit trail.
5. Self-hosted open-weight inference adapter and model evaluation pipeline.
6. Ozlind model training/fine-tuning, dataset governance, evaluation, and deployment only when compute and data are available.

## Non-goals

- Do not expose provider API keys to browsers.
- Do not let clients select arbitrary upstream model identifiers.
- Do not silently switch providers after partial output.
- Do not claim proprietary model ownership while inference still runs on third-party models.
- Do not add a database, vector store, or queue without a defined persistence or workload requirement.
