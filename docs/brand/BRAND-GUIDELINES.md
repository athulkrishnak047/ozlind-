# Ozlind Brand Guidelines

**Status:** Working brand standard — v1.1  
**Owner:** Ozlind product team  
**Last reviewed:** 2026-11-28  
**Purpose:** Keep every product surface, asset, document and communication recognizably Ozlind.

## 1. Brand foundation

Ozlind is a capable, calm and trustworthy AI workspace. Its identity should communicate intelligence without noise, depth without intimidation, and technical capability without unnecessary complexity.

**Brand attributes**
- Precise: clear hierarchy, deliberate language and consistent behavior.
- Capable: sophisticated workflows presented simply.
- Trustworthy: honest capability labels, privacy clarity and visible user control.
- Adaptable: works across desktop, tablet and mobile, including constrained networks.
- Distinctive: a restrained violet accent and original geometric symbol.

**Voice:** confident, direct, useful, respectful and transparent. Avoid exaggerated claims such as “perfect”, “unlimited”, “fully secure” or “human-level”.

## 2. Logo system

### Approved source files
- `public/brand/ozlind-symbol.svg` — standalone mark.
- `public/brand/ozlind-logo.svg` — default horizontal logo.
- `public/brand/ozlind-logo-light.svg` — use on light surfaces.
- `public/brand/ozlind-logo-dark.svg` — use on dark surfaces.

Use the supplied SVG files as the source of truth. Do not redraw, skew, rotate, stretch, add effects to, or rearrange the mark and wordmark. Keep the original aspect ratio.

### Clear space and minimum size
- Maintain clear space around the logo at least equal to the symbol's inner-mark height.
- Do not place text, edges, or other logos inside this clear space.
- Prefer the full wordmark when there is room; use the symbol alone for compact app, favicon and avatar contexts.
- Do not reduce the horizontal logo below 112 CSS px wide. If it becomes illegible, use the symbol.

### Background selection
- Use the light logo on white or light neutral surfaces.
- Use the dark logo on black or dark neutral surfaces.
- Check actual contrast at the final rendered size.
- Never place the logo on a busy image without a quiet, high-contrast backing surface.

## 3. Color system

The product design system is authoritative for UI tokens. Brand anchors:

| Role | Value | Usage |
|---|---|---|
| Light canvas | `#FFFFFF` | Primary light page background |
| Dark canvas | `#000000` | Primary dark page background |
| Light primary text | `#111111` | Main text on light surfaces |
| Dark primary text | `#F5F5F5` | Main text on dark surfaces |
| Brand violet | `#6D5CE8` | Light-theme primary accent |
| Dark-theme violet | `#A99BFF` | Accent on dark surfaces |
| Soft violet | `#F1EEFF` | Subtle accent surface in light mode |

Use pure white and pure black for the page canvas. Raised surfaces may use the near-neutral values specified in `docs/product/design-system.md`. Do not use violet for long passages, large page backgrounds, or every interactive element. Status colors must retain their semantic meaning and accessible contrast.

## 4. Typography

- Use the existing Inter/system sans-serif stack.
- Do not bundle a new font unless performance, licensing and rendering tests justify it.
- Use clear hierarchy, readable line lengths and comfortable line-height.
- Prefer weight and spacing over decorative font treatments.
- Never convert the logo wordmark into ordinary UI text and assume it is the approved logo artwork.

## 5. Visual language

Select styles according to purpose; they are not competing global themes:
- Minimal / Swiss hierarchy for navigation, reading and settings.
- Flat, high-contrast controls for forms and dense utility surfaces.
- Restrained glass for transient overlays and floating controls only where legibility remains excellent.
- Bento layouts for meaningful capability grouping and comparisons.
- Aurora or gradient accents for occasional brand moments, never as the default canvas.
- Neumorphic, 3D, skeuomorphic or HUD treatments only when they improve comprehension or feedback.

Do not combine multiple decorative treatments in one component without a clear reason. Avoid visual noise, excessive shadows, gratuitous blur, neon overload and motion that does not communicate state.

## 6. Iconography and illustration

- Use `OzlindIcon` from `src/components/ozlind-icon.tsx` for every new React UI icon. It references the canonical `public/icons/ozlind-brand-system.svg` sprite.
- Keep `public/icons/ozlind-ui.svg` as a legacy compatibility asset only; do not introduce new references to it.
- Do not use Unicode glyphs or emoji as substitutes for interface icons. Text symbols are acceptable only when they are meaningful content, such as keyboard shortcut labels.
- Keep stroke weight, optical size, alignment and visual density consistent.
- Icons must have accessible labels when they are the only visible control content.
- Do not download icon fonts or remote icon packs at runtime.
- Use illustrations only when they explain a workflow or improve orientation. Decorative media must never block the primary task.
- Verify external SVG sprite behavior and CSP before broad production use.

## 7. Motion and sound

- Motion should communicate navigation, progress, focus or state change.
- Respect `prefers-reduced-motion`.
- Avoid autoplay sound, animated backgrounds and attention-grabbing loops.
- Keep transitions short and consistent with the product design system.

## 8. Writing and communications

- Use “Ozlind” consistently; do not alternate capitalization or spelling.
- Explain limitations before users rely on a capability.
- Distinguish generated content from verified facts and cite sources where applicable.
- Use short labels, specific errors and actionable recovery guidance.
- Never promise a support response time unless the team can meet it.

## 9. Partner and third-party use

Do not imply endorsement, partnership, certification or affiliation without written authorization. Third-party provider names and marks must follow their current brand and attribution rules. Ozlind must remain visually distinct from other AI products.

## 10. Release checklist

- [ ] Correct light/dark logo selected.
- [ ] Mark and wordmark proportions preserved.
- [ ] Contrast checked at actual display size.
- [ ] Icon labels and touch targets verified.
- [ ] No remote asset dependency added without approval.
- [ ] Reduced-motion behavior checked.
- [ ] Mobile and low-bandwidth rendering checked.
- [ ] Third-party marks and licenses reviewed.
- [ ] Brand asset inventory updated when a new asset is added.

## Related references

- [Product design system](../product/design-system.md)
- [Asset inventory](../assets/ASSET-INVENTORY.md)
- [Accessibility specification](../product/accessibility-specification.md)
- [Performance and low-data UX](../product/performance-and-low-data.md)
