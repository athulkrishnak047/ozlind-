# Ozlind + Cloudflare

This repository contains a server-side Cloudflare connection check for the Ozlind Vercel deployment.

## Current scope

- `GET /api/cloudflare/status` checks whether a Cloudflare API token is configured.
- When configured, it calls Cloudflare's token verification endpoint.
- The token is read only from the Vercel server environment. It is never sent to browser code or included in API responses.
- This is a connection foundation, not yet a full Cloudflare dashboard or AI tool integration.

## Configure safely

1. In Cloudflare, create an API token using the smallest permissions needed. Do not use the Global API Key.
2. In Vercel, open the `ozlind-` project settings, then Environment Variables.
3. Add `CLOUDFLARE_API_TOKEN` with the token value. Select the environments you want to use.
4. Redeploy the project so the server function receives the new variable.
5. Open `/api/cloudflare/status` on the deployed Ozlind site. A successful response reports `state: connected`.

Never put the token in `Index.html`, client-side JavaScript, GitHub files, chat messages, or a public repository. If a token is exposed, revoke it in Cloudflare and create a new one.

## Next implementation stages

- Add narrowly scoped, read-only account and Workers inventory endpoints.
- Add explicit authorization and audit logging before any write-capable actions.
- Connect those server-side capabilities to Ozlind's AI tool layer only after that layer exists.
