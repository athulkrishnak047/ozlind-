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
| `public/icons/ozlind-ui.svg` | Legacy UI symbol sprite | Retained for backward compatibility; do not add new product UI references |
| `public/icons/ozlind-brand-system.svg` | Canonical UI icon sprite | 63 `oz-*` symbols; use through the typed `OzlindIcon` component |

## Extended symbol groups

- Brand and model: `oz-logo`, `oz-logo-small`, `oz-logo-text`, `oz-model-flash`, `oz-model-pro`, `oz-model-max`, `oz-avatar`.
- Sidebar: `oz-new-chat`, `oz-search`, `oz-library`, `oz-history`, `oz-star`, `oz-star-fill`, `oz-folder`, `oz-projects`, `oz-gpts`, `oz-video`, `oz-artifacts`, `oz-code`, `oz-image`, `oz-trash`, `oz-archive`.
- Chat: `oz-attach`, `oz-mic`, `oz-send`, `oz-send-outline`, `oz-stop`, `oz-copy`, `oz-check`, `oz-like`, `oz-dislike`, `oz-regenerate`, `oz-edit`, `oz-share`, `oz-download`, `oz-sparkles`, `oz-thinking`, `oz-voice-wave`, `oz-globe`, `oz-bookmark`, `oz-pin`.
- Topbar: `oz-chevron-down`, `oz-chevron-up`, `oz-chevron-left`, `oz-chevron-right`, `oz-menu`, `oz-close`, `oz-more`, `oz-more-vertical`, `oz-expand`, `oz-collapse`, `oz-notification`.
- Settings/account: `oz-settings`, `oz-upgrade`, `oz-crown`, `oz-key`, `oz-shield`, `oz-user`, `oz-logout`, `oz-help`, `oz-moon`, `oz-sun`, `oz-language`.

## Usage

Use the typed shared component in React:

~~~tsx
import { OzlindIcon } from "@/components/ozlind-icon";

<OzlindIcon name="oz-search" size={20} />
~~~

Direct `<svg><use /></svg>` references are reserved for non-React documents and static assets.

Use `currentColor` to inherit the surrounding control's color. Give icon-only interactive controls an accessible name with `aria-label`; decorative SVGs should use `aria-hidden="true"`. Prefer 20–24 px for standard controls and preserve the viewBox proportions for brand marks. Do not inline the entire sprite into every page or download icon packs at runtime.

`ozlind-brand-system.svg` is the single source of truth for all new product UI icons. `ozlind-ui.svg` is a legacy compatibility asset only; do not add new references to it. The typed `OzlindIcon` component is the preferred React interface.

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
