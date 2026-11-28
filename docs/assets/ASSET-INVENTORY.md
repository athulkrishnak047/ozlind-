# Ozlind asset inventory

## Brand assets added

| Path | Purpose | Notes |
|---|---|---|
| `public/brand/ozlind-symbol.svg` | Standalone brand symbol | Vector, scalable |
| `public/brand/ozlind-logo.svg` | Horizontal wordmark | Uses current geometric mark; inherits text color |
| `src/app/icon.svg` | Next.js browser favicon | Lightweight vector icon |
| `public/icons/ozlind-ui.svg` | UI SVG symbol sheet | Reusable symbols via SVG `use`; current starter set |

## UI symbol IDs

`arrow-up`, `arrow-left`, `arrow-right`, `plus`, `x`, `menu`, `search`, `settings`, `sun`, `moon`, `copy`, `edit`, `trash`, `paperclip`, `mic`, `stop`, `send`, `file`, `globe`, `check`, `alert`, `info`, `external-link`, `refresh`.

Example reference (same-origin external SVG sprite):
```tsx
<svg aria-hidden="true" focusable="false" width="20" height="20">
  <use href="/icons/ozlind-ui.svg#search" />
</svg>
```

Browser support and CSP must be tested before adopting external SVG sprite references across the app. For inline critical icons, keep using the existing React SVG component or inline SVG. Do not download remote icon packs at runtime.

## Asset principles

- SVG first for logos and simple UI icons.
- Use currentColor for UI symbols so light/dark themes work.
- Keep decorative media optional and never block initial workspace use.
- Do not add large font, video, raster illustration or animation dependencies without a measured reason.
- Provide accessible names on controls; SVG artwork itself is not a substitute for button labels.
- Keep a single source of truth for each brand mark.

## Still needed before public app-store/PWA distribution

- [ ] PNG 192×192 and 512×512 install icons (generate and inspect from approved brand source).
- [ ] Apple touch icon PNG 180×180.
- [ ] Maskable PWA icon with safe-zone validation, only if PWA manifest is added.
- [ ] Social sharing image (Open Graph, 1200×630), only after final brand layout approved.
- [ ] Monochrome and reverse logo variants after brand approval.
- [ ] Full favicon/browser test across major browsers.
- [ ] Verify SVG sprite rendering/CSP in production.
