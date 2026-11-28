# Ozlind frontend architecture

## Scope

This document governs UI/UX implementation in the existing Next.js App Router repository. It does not authorize backend expansion in the current UI-first phase.

## Current source map

```text
src/
  app/
    page.tsx                 # public landing route
    layout.tsx               # root layout and global providers/styles
    globals.css              # legacy/base styles; inspect before modifying
    ozlind-design.css        # current final-layer product styling
    workspace/page.tsx       # assistant workspace route
    settings/page.tsx        # settings route
    api/                     # existing server routes; out of scope for UI-only work
  components/
    landing-page.tsx
    chat-workspace.tsx
    settings-panel.tsx
    command-palette.tsx
    rich-text.tsx
    theme-provider.tsx
    theme-toggle.tsx
    ozlind-mark.tsx
  lib/
    ai/                      # provider and AI contracts; preserve during UI work
```

## Ownership boundaries

- Route files compose screens and metadata; keep them thin.
- Page-level components own screen composition and page state.
- Reusable visual primitives own presentation and accessible interaction.
- Theme provider owns theme state and persistence.
- CSS tokens and shared primitives own visual consistency.
- AI routes/providers own server behavior and must not be changed for visual polish.
- Browser-local history remains an explicit local-only persistence boundary.

## Styling strategy

- Treat `ozlind-design.css` as the current product-level refinement layer.
- Before editing `globals.css`, identify whether a rule is still consumed.
- Prefer semantic tokens and component classes over broad element selectors.
- Avoid stacking more “last stylesheet wins” layers. Consolidate duplicate rules when touching a component.
- Preserve pure #fff light canvas and pure #000 dark canvas.
- Use surface tokens for elevation; no global gradient canvas.
- Keep effects inexpensive and ensure contrast/focus in both themes.

## React and state rules

- Keep state local to the smallest component that owns it.
- Avoid global state for one-screen overlays and menus.
- Keep event handlers stable only where needed; do not over-optimize prematurely.
- Do not store secrets, API keys or private provider configuration in client components.
- Do not duplicate AI/network requests in effects.
- Preserve current stream cancellation and local history semantics when refactoring chat UI.

## File creation convention

- Components: PascalCase file or existing kebab-case convention; follow neighboring files consistently.
- Hooks: `use-*.ts` only for reusable stateful logic.
- Styles: extend the current design-system stylesheet; do not create per-screen global CSS without need.
- Tests: colocate component tests or place them in the established test convention.
- Documentation: product behavior in `docs/product/`; implementation decisions in `docs/engineering/`; architecture in `docs/architecture/`.

## UI-only change checklist

1. Read the component and its related CSS before changing it.
2. Map existing interactions; preserve working handlers and state.
3. Implement one cohesive screen slice.
4. Test empty, loading, streaming, error, disabled and success states as applicable.
5. Test 360/390/430/768/1024/1280/1440 widths.
6. Test keyboard, focus, contrast and reduced motion.
7. Check low-data impact and bundle dependencies.
8. Run lint, typecheck, tests and build.
9. Review the diff; do not bundle unrelated backend refactors.
