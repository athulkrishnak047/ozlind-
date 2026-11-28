# Ozlind cookies and browser storage notice

**Status:** Draft pending production audit

## Current documented behavior

Ozlind currently stores conversation history and selected preferences in browser storage on the current device/browser. This local history is not an account-backed cloud history and does not synchronize across devices.

Browser local storage is distinct from HTTP cookies. This notice must not be used as a statement that the deployed website sets no cookies.

## Before publication

Audit the production site and all dependencies for:
- First-party and third-party cookies.
- Local storage and session storage keys.
- Analytics, advertising pixels and telemetry.
- Authentication/session identifiers if accounts are introduced.
- Hosting/security technologies that may set cookies.

For each item record the name, provider, purpose, duration, whether essential, and whether consent is required. Add a consent interface only if actual non-essential technologies or applicable law require it. Do not display a meaningless consent banner if the site does not use technologies that require consent.

## User controls

Explain how to clear browser-local chat history using the in-product control and how to clear site data through browser settings. Clarify that clearing local browser data does not necessarily erase data already sent to AI providers or infrastructure logs.
