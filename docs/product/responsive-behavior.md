# Ozlind responsive behavior

## Validation widths

Required viewport widths: 360, 390, 430, 768, 1024, 1280 and 1440 CSS pixels. Also test browser zoom at 200% and a short-height mobile viewport.

## Layout bands

These are behavior bands, not rigid device categories:
- Small mobile: 320–389px — drawer navigation, one-column content, minimal composer toolbar.
- Large mobile: 390–767px — one-column workspace, compact header, contextual secondary actions.
- Tablet: 768–1023px — collapsible sidebar or drawer; do not squeeze full desktop navigation.
- Small desktop: 1024–1279px — persistent or collapsible rail depending on available content width.
- Wide desktop: 1280px+ — stable navigation rail and centered reading column; do not expand prose to full width.

## Mobile requirements

- Use `100dvh` with a safe fallback; account for browser chrome.
- Include `env(safe-area-inset-top)` and `env(safe-area-inset-bottom)` where appropriate.
- Composer must remain visible above the software keyboard; test actual Android Chrome keyboard resize behavior.
- No horizontal page scroll at 320px and above.
- Keep core touch targets at least 44×44 CSS px where practical.
- Sidebar drawer includes backdrop, close button, Escape, focus management and scroll lock.
- Tapping a conversation closes the drawer.
- Avoid hover-only interactions.
- Do not rely on tiny icon-only controls without accessible labels and adequate hit area.
- Keep message actions reachable without forcing a long-press gesture.

## Tablet requirements

- Use drawer or compact rail rather than a squeezed desktop sidebar.
- Ensure composer actions wrap or collapse intentionally.
- If using split view, both panes must retain useful minimum widths.
- Preserve reading width and comfortable line length.

## Desktop requirements

- Navigation width target 248–264px where persistent.
- Conversation reading width target 680–800px.
- Composer width aligns with reading column.
- Keyboard navigation and command palette remain available.
- Avoid huge blank margins or over-wide tables.

## Responsive acceptance

- [ ] No horizontal document overflow.
- [ ] No clipped controls or hidden primary action.
- [ ] Composer does not cover the latest message or focused element.
- [ ] Keyboard-open layout remains usable.
- [ ] Drawer is operable by touch and keyboard.
- [ ] Long URLs, code and tables have bounded overflow.
- [ ] 200% zoom preserves content and actions.
