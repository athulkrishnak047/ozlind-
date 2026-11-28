# Ozlind accessibility specification

Target: WCAG 2.2 AA as the design and implementation goal. Accessibility defects block completion of affected core workflows.

## Semantics and structure

- Use landmarks: header, navigation, main, complementary content when applicable, footer.
- One meaningful page-level heading; maintain logical heading order.
- Use native buttons, links, inputs, labels and form controls before custom ARIA widgets.
- Icon-only controls require an accessible name and a tooltip or nearby label where useful.
- Use `aria-live` sparingly for send status, transcription and concise success/error announcements; do not announce every streamed token.
- Mark decorative icons as hidden from assistive technology.
- Use `aria-expanded`, `aria-controls`, `aria-current` and dialog semantics only when their behavior is implemented correctly.

## Keyboard

- All core workflows work without a pointer.
- Visible focus indicator is never removed.
- Logical tab order follows visual order.
- Escape closes non-critical overlays.
- Menus, dialogs and command palette follow expected keyboard interaction.
- No keyboard trap except inside a correctly managed modal dialog.
- Shortcuts do not override typing in text fields or conflict with browser/assistive technology commands.

## Visual accessibility

- Meet WCAG AA text and non-text contrast.
- Do not communicate state using color alone; add text, icon shape or semantics.
- Support 200% zoom and text enlargement without clipping.
- Avoid tiny low-contrast secondary text.
- Respect forced-colors/high-contrast settings.
- Focus rings must remain visible on both pure white and pure black canvas themes.

## Motion and sensory

- Honor `prefers-reduced-motion: reduce` and the app preference.
- Avoid flashing, parallax and perpetual motion.
- Provide pause/stop for any non-essential continuous animation if one is ever introduced.
- Do not use sound as the only status signal.

## Forms, uploads and errors

- Every field has a programmatic label and useful instructions.
- Validation is associated with the field and summarized when needed.
- Error messages describe the issue and next step.
- Upload status and permission state are announced.
- Destructive confirmation identifies the exact scope.

## Assistive technology test matrix

At minimum, test:
- Keyboard-only on desktop.
- NVDA with Firefox or Chrome on Windows when available.
- VoiceOver with Safari on iOS when available.
- TalkBack with Chrome on Android when available.
- Browser zoom and system text scaling.
Automated axe checks are useful but do not replace manual testing.

## Release checklist

- [ ] Landmark and heading structure is coherent.
- [ ] All controls have accessible names.
- [ ] Keyboard focus is visible and predictable.
- [ ] Dialog/drawer focus management works.
- [ ] Status/error announcements are meaningful and not noisy.
- [ ] Contrast and zoom are checked in both themes.
- [ ] Reduced motion is verified.
