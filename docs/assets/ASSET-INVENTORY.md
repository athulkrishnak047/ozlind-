# Ozlind asset inventory

## Brand assets

| Path | Purpose | Notes |
|---|---|---|
| `public/brand/ozlind-symbol.svg` | Standalone symbol | Square symbol, scalable SVG |
| `public/brand/ozlind-logo.svg` | Horizontal wordmark | Generic currentColor text variant |
| `public/brand/ozlind-logo-light.svg` | Logo for light surfaces | Dark wordmark and light-on-dark symbol |
| `public/brand/ozlind-logo-dark.svg` | Logo for dark surfaces | Light wordmark and light-on-dark symbol |
| `src/app/icon.svg` | Next.js favicon | Browser icon source |
| `src/app/apple-icon.svg` | Apple icon vector source | Verify platform output; raster PNG may still be needed |
| `public/icons/ozlind-ui.svg` | Existing UI symbol sprite | 24 existing reusable symbols; IDs retained for compatibility |
| `public/icons/ozlind-brand-system.svg` | OzLind extended icon system | 64 additional `oz-*` symbols for brand, sidebar, chat, topbar and account UI |

## Extended symbol groups

- Brand and model: `oz-logo`, `oz-logo-small`, `oz-logo-text`, `oz-model-flash`, `oz-model-pro`, `oz-model-max`, `oz-avatar`.
- Sidebar: `oz-new-chat`, `oz-search`, `oz-library`, `oz-history`, `oz-star`, `oz-star-fill`, `oz-folder`, `oz-projects`, `oz-gpts`, `oz-video`, `oz-artifacts`, `oz-code`, `oz-image`, `oz-trash`, `oz-archive`.
- Chat: `oz-attach`, `oz-mic`, `oz-send`, `oz-send-outline`, `oz-stop`, `oz-copy`, `oz-check`, `oz-like`, `oz-dislike`, `oz-regenerate`, `oz-edit`, `oz-share`, `oz-download`, `oz-sparkles`, `oz-thinking`, `oz-voice-wave`, `oz-globe`, `oz-bookmark`, `oz-pin`.
- Topbar: `oz-chevron-down`, `oz-chevron-up`, `oz-chevron-left`, `oz-chevron-right`, `oz-menu`, `oz-close`, `oz-more`, `oz-more-vertical`, `oz-expand`, `oz-collapse`, `oz-notification`.
- Settings/account: `oz-settings`, `oz-upgrade`, `oz-crown`, `oz-key`, `oz-shield`, `oz-user`, `oz-logout`, `oz-help`, `oz-moon`, `oz-sun`, `oz-language`.

## Usage

Reference an individual symbol from the public sprite:

~~~tsx
<svg aria-hidden="true" focusable="false" width="20" height="20">
  <use href="/icons/ozlind-brand-system.svg#oz-search" />
</svg>
~~~

Use `currentColor` to inherit the surrounding control's color. Give icon-only interactive controls an accessible name with `aria-label`; decorative SVGs should use `aria-hidden="true"`. Prefer 20–24 px for standard controls and preserve the viewBox proportions for brand marks. Do not inline the entire sprite into every page or download icon packs at runtime.

The original `ozlind-ui.svg` sprite remains unchanged so existing references continue working. The extended library uses the `oz-` prefix to avoid ID collisions.

## Asset principles

- SVG first for logos and simple UI icons.
- Keep UI symbols theme-aware through `currentColor`.
- Keep decorative media optional and never block initial workspace use.
- Avoid large font, raster illustration, or animation dependencies without a measured reason.
- Provide accessible names on controls; SVG artwork is not a substitute for button labels.
- Keep one approved source of truth for each brand mark.
- Follow the [performance and low-data UX standard](../product/performance-and-low-data.md).

## Remaining checks

- [ ] Replace the wordmark text in `oz-logo-text` with approved vector paths if font-independent rendering is required.
- [ ] Review the white send-icon cutout against both themes; its white path is intentional for the filled send control.
- [ ] Verify external SVG sprite references and CSP in production.
- [ ] Test all symbols at 16, 20, 24 and 32 px.
- [ ] Complete favicon, PWA and social-image checks only when those platform features are introduced.
