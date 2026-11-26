# Phase 3: Ozlind chat experience

**Status:** Frontend implementation on main; protected API remains owner-gated.

## Product surface

- Responsive, mobile-first chat workspace.
- Gemini, Groq, and automatic provider preference selector.
- Streaming text rendering using Server-Sent Events.
- Stop-generation control, retry-friendly errors, and copy response action.
- Prompt starter cards and new-conversation action.
- Conversation state is in memory for the current tab/session only; it is not persisted to a server or browser storage.
- Service access token is entered by the owner and held in component memory only. It is not written to localStorage, sessionStorage, cookies, or analytics.
- No account, public identity, persistent history, or memory features are represented as implemented.

## Protected preview access

The chat UI calls `POST /api/chat` with a bearer token. The project owner must configure `OZLIND_AI_ACCESS_TOKEN` in Vercel and enter the same value in the private preview's Connect service dialog. The token is not bundled into client JavaScript or saved by the browser.

If the server token is absent, the API intentionally returns 503. If it does not match, it returns 401. Provider keys remain server-only.

## Release boundary

This is a private owner-preview interaction model, not public-user authentication. Before opening the chat to the public, implement real user identity, authorization, shared/global usage budgets, abuse controls, and a reviewed data retention/deletion model. Do not expose a shared owner token to end users.
