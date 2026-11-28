# Ozlind asset inventory

## Brand assets

| Path | Purpose | Notes |
|---|---|---|
| `public/brand/ozlind-symbol.svg` | Standalone symbol | Square symbol, scalable SVG |
| `public/brand/ozlind-logo.svg` | Horizontal wordmark | Generic currentColor text variant |
| `public/brand/ozlind-logo-light.svg` | Logo for light surfaces | Dark wordmark and light-on-dark symbol |
| `public/brand/ozlind-logo-dark.svg` | Logo for dark surfaces | Light wordmark and light-on-dark symbol |
| `src/app/icon.svg` | Next.js favicon | Browser icon source |
| `src/app/apple-icon.svg` | Apple icon vector source | Verify Next.js/platform output; raster PNG may still be needed |
| `public/icons/ozlind-ui.svg` | UI symbol sprite | 24 reusable symbols |

## UI symbol IDs

`arrow-up`, `arrow-left`, `arrow-right`, `plus`, `x`, `menu`, `search`, `settings`, `sun`, `moon`, `copy`, `edit`, `trash`, `paperclip`, `mic`, `stop`, `send`, `file`, `globe`, `check`, `alert`, `info`, `external-link`, `refresh`.

Example external SVG sprite reference:

~~~tsx
<svg aria-hidden="true" focusable="false" width="20" height="20">
  <use href="/icons/ozlind-ui.svg#search" />
</svg>
~~~

Browser support and CSP must be tested before adopting external SVG sprite references across the app. For inline critical icons, keep using the existing React SVG component or inline SVG. Do not download remote icon packs at runtime.

## Asset principles

- SVG first for logos and simple UI icons.
- UI symbols use currentColor so they can adapt to light/dark themes.
- Keep decorative media optional and never block initial workspace use.
- Do not add large font, video, raster illustration or animation dependencies without a measured reason.
- Provide accessible names on controls; SVG artwork is not a substitute for button labels.
- Keep one approved source of truth for each brand mark.

## Still needed for broader distribution

- [ ] Raster PNG 192×192 and 512×512 install icons if a PWA manifest is introduced.
- [ ] Apple touch icon PNG 180×180 if required by target platform; current SVG is a source, not proof of PNG compatibility.
- [ ] Maskable PWA icon with safe-zone validation, only if PWA is added.
- [ ] Social sharing image (Open Graph, 1200×630) after brand composition is approved.
- [ ] Monochrome/reverse variants only if a real surface requires them.
- [ ] Full favicon/browser test.
- [ ] Verify SVG sprite rendering and CSP in production.
- [ ] Confirm all logos render correctly in light/dark themes.

No binary PNG or social image has been generated in this pass. Avoid treating a vector source as a verified platform-ready raster asset.
