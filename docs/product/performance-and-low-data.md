# Ozlind performance and low-data UX

**User constraint:** Keep cellular/mobile data usage very low. This is a first-class product requirement.

## Network principles

- Prefer text and CSS over decorative images, video, animation assets and large screenshots.
- Do not autoplay video, animated backgrounds or remote media.
- Load images only when they provide task value; use responsive formats and dimensions.
- Avoid external font downloads; use the existing system font stack unless measured evidence justifies a self-hosted subset.
- Avoid polling. Use event-driven updates or existing streaming connections only when the user starts an action.
- Do not prefetch heavy routes or data on mobile without a clear interaction benefit.
- Avoid duplicate API calls when opening overlays or changing themes.
- Respect Save-Data and reduced-data preferences where browser support exists.
- Make uploads explicit and show size before transmission.
- Never silently upload a selected file before the user submits the task.

## UI engineering budgets

Targets to measure, not claims about current performance:
- Initial route JS: minimize and split by route; no large new dependency for cosmetic effects.
- No background video or auto-downloaded visual packs.
- Keep icons as existing local vector/icon components.
- Prefer CSS transitions over JavaScript animation frameworks for simple state changes.
- Avoid expensive full-screen backdrop blur on low-end devices.
- Avoid layout shifts when fonts, messages or attachment previews appear.
- Keep long chat history virtualized or paginated only when actual usage warrants it; do not introduce complexity prematurely.

## Core Web Vitals targets

Aim for good field performance:
- LCP ≤ 2.5s
- INP ≤ 200ms
- CLS ≤ 0.1
Measure on real mobile networks and low-end devices; do not infer from desktop alone.

## Data-conscious development workflow

- Use GitHub text/code operations instead of repeatedly downloading the full repository.
- Do not fetch screenshots unless a visual defect cannot be assessed from source or a single targeted capture is necessary.
- Batch related file changes into one release.
- Avoid repeated production deployments for documentation-only or tiny isolated changes.
- Inspect only the relevant changed files and logs.
- Tell the user before any step that could upload large files or consume significant data.

## Low-data UX acceptance

- [ ] No autoplay media or unnecessary remote assets.
- [ ] Initial screen useful without loading decorative media.
- [ ] Upload size and file types are visible before sending.
- [ ] No needless polling or duplicate requests.
- [ ] Theme and menu changes do not trigger network requests.
- [ ] Streaming starts only after explicit send.
- [ ] Mobile route has no heavy prefetch by default.
- [ ] Reduced-data behavior is verified where browser APIs permit.
