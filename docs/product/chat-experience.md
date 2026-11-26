# Ozlind chat experience

**Status:** Public landing page and anonymous AI workspace.

## Product surface

- Responsive landing page and dedicated `/workspace` route.
- Mobile-first glassmorphism design with reduced-motion support and readable contrast.
- Gemini, Groq, and automatic provider preference selector.
- Streaming text rendering using Server-Sent Events.
- Stop-generation control, retry-friendly errors, and copy response action.
- Prompt starter cards and multiple local conversations.
- Conversation titles and messages persist in browser local storage on the current device.
- Clear conversation and start-new-chat actions.
- No account, cross-device sync, server-side history, or long-term memory is represented as implemented.

## Privacy boundary

Browser-local history remains in that browser's local storage. It is not sent to a conversation database and is not available on other devices. Users sharing a device should clear their history. Provider requests are sent to the configured AI provider through Ozlind's server route.

## Release boundary

The AI route is anonymously accessible and protected by a shared per-IP rate limit. It is a public beta baseline, not a full identity, per-user quota, billing, or enterprise abuse-control system.
