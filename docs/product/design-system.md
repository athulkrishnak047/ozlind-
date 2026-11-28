# Ozlind Product Design System

**Status:** Approved direction — hybrid product design, UI/UX-first, responsive web + tablet + mobile  
**Product principle:** OpenAI-inspired capability and workflow depth + Anthropic-inspired clarity and craft + an unmistakably original Ozlind identity.

This is an implementation contract for the product UI, not a screenshot specification and not a copy of another company's interface.

## 1. Product experience principles

1. **Clarity before complexity.** Every screen has one primary purpose and one visually dominant next action.
2. **Capability without clutter.** Keep advanced tools available through progressive disclosure, contextual controls, and a command palette.
3. **Intent before implementation details.** Users choose tasks such as chat, research, or file analysis; provider names and technical configuration remain secondary.
4. **Honest interface states.** Never present a planned, unavailable, loading, failed, or disconnected feature as working.
5. **User control.** Make cancel, stop, edit, retry, delete, export, privacy, and theme controls discoverable and predictable.
6. **One coherent system.** Shared tokens and components across landing, workspace, settings, and future product surfaces.
7. **Accessibility is product quality.** Keyboard, touch, screen-reader, contrast, zoom, and reduced-motion support are part of acceptance criteria.
8. **Performance is design.** Avoid heavy blur, oversized animation, layout shifts, and unnecessary client-side work.

## 2. Brand and visual thesis

Ozlind should feel calm, precise, capable, and quietly distinctive. Use a neutral monochrome foundation, a restrained violet brand accent, strong typography, careful spacing, and selective material effects.

Use design styles selectively:
- Minimalism and Swiss-inspired hierarchy for core navigation, reading, and settings.
- Restrained glass surfaces for overlays, floating navigation, menus, and the composer where supported.
- Bento composition for dashboards or capability overviews where comparison is useful.
- Flat surfaces for dense controls, forms, tables, and settings.
- Aurora/gradient accents only for rare brand moments, not as a default page background.
- 3D and decorative motion only when they communicate state or improve understanding.

Do not turn every component into a glass card. Avoid excessive gradients, neon, decorative pills, arbitrary card grids, and animation without a user benefit.

## 3. Design tokens

### Canvas and surfaces

| Token | Light | Dark |
|---|---|---|
| Canvas | #FFFFFF | #000000 |
| Primary surface | #FFFFFF | #090909 |
| Raised surface | #F7F7F7 | #111111 |
| Subtle surface | #FAFAFA | #161616 |
| Primary text | #111111 | #F5F5F5 |
| Secondary text | #555555 | #A3A3A3 |
| Muted text | #737373 | #858585 |
| Border | rgba(0,0,0,.10) | rgba(255,255,255,.12) |
| Strong border | rgba(0,0,0,.18) | rgba(255,255,255,.20) |
| Brand accent | #6D5CE8 | #A99BFF |
| Accent soft | #F1EEFF | #211B38 |
| Success | #16794A | #65C995 |
| Warning | #946200 | #E7BD69 |
| Error | #B42332 | #FF7A86 |

The page canvas must remain pure white in light mode and pure black in dark mode. Elevated surfaces may use near-white or near-black values to establish hierarchy. Do not tint the canvas with ambient gradients.

### Typography

- Use the existing Inter/system sans-serif stack; do not add a font dependency without a measurable benefit.
- Use a restrained type scale: 12, 13, 14, 16, 18, 20, 24, 30, 36, 44px.
- Body text should generally be 14–16px with comfortable line height.
- Long-form assistant responses should prioritize reading width, paragraph spacing, headings, lists, code, and citations.
- Use weight and spacing before introducing extra typefaces or decorative text treatments.
- Support browser zoom and user text scaling without clipping.

### Spacing, sizing, and shape

- Base spacing unit: 4px.
- Preferred spacing steps: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64px.
- Use 8px control radii, 10–12px compact card radii, and 14–18px large workspace surfaces.
- Use consistent 36–44px control heights; touch targets should be at least 44×44px where practical.
- Keep content widths intentional: reading surfaces should not span the entire desktop viewport.
- Use borders and subtle shadows for hierarchy before adding blur.

### Motion

- Typical interaction transition: 120–200ms.
- Larger panel transition: 180–260ms.
- Use a consistent ease curve; avoid spring/bounce by default.
- Animate only meaningful changes: drawer, menu, focus, send/stop, progress, and content reveal.
- Respect prefers-reduced-motion across the entire application.
- Never block input or navigation behind decorative animation.

## 4. Responsive platform behavior

Design and validate at 360, 390, 430, 768, 1024, 1280, and 1440px widths.

### Desktop
- Persistent navigation rail with clear active state.
- Main content uses a readable max-width and stable vertical rhythm.
- Optional inspector or side panel only when it adds task-relevant context.
- Keyboard shortcuts and command palette are first-class navigation tools.
- Avoid wasting the viewport with oversized marketing-style hero content inside the working application.

### Tablet
- Navigation may collapse to an icon rail or drawer depending on available width.
- Keep the composer and primary action reachable.
- Use split panes only when both panes remain readable and independently usable.
- Do not simply scale down the desktop layout.

### Mobile
- Use a genuine slide-in navigation drawer with backdrop, safe-area padding, and reliable close behavior.
- Keep the message composer anchored above the on-screen keyboard and safe area.
- Preserve full-width readable messages and comfortable horizontal padding.
- Avoid horizontal scrolling except inside intentionally scrollable code or data regions.
- Put secondary actions in contextual menus instead of compressing the composer toolbar.
- Ensure all controls have usable touch targets.

## 5. Application information architecture

### Primary workspace
- Chat
- Research (only as a distinct mode if its working experience is meaningfully different)
- Files / file analysis
- Projects (future; do not expose as live before implementation)

### Global navigation and utilities
- Conversation search and history
- New conversation
- Command palette
- Theme and preferences
- Account and privacy controls
- Help and legal information

### Future workspace surfaces
- Editable documents and artifacts
- Data analysis
- Coding workspace
- Voice conversation
- Agent/task activity and approvals

Future surfaces must be introduced only when the underlying workflow exists and has been tested.

## 6. Core interaction patterns

### Chat
- The composer is the primary visual anchor.
- Keep model/provider selection secondary to the user's intent.
- Support Enter/Shift+Enter behavior with a clear, configurable convention.
- Show attachments before send, with file type, name, size, and remove action.
- Show clear connecting, streaming, stopping, completed, and failed states.
- Keep stop generation available while streaming.
- Provide copy, edit, regenerate, and export actions where supported.
- Preserve message order and readable response formatting.
- Never show fake typing or fake completion after a failed request.

### Research
- Clearly distinguish a research action from a normal chat request.
- Show source titles, domains, links, and citations in context.
- Distinguish retrieved evidence from model-generated synthesis.
- Show searching, source retrieval, partial results, and errors honestly.
- A source inspector is appropriate when it helps users inspect multiple citations.

### File analysis
- Show supported types and size limits before upload.
- Provide file preview and removal before submission.
- Show upload/analysis progress and actionable errors.
- Never imply a file was stored permanently if it is only processed for the request.

### Voice
- Explain microphone permission when needed.
- Make recording, stop, transcription, and failure states visually distinct.
- Always provide a text alternative.
- Do not start recording without an explicit user action.

### Settings
- Group settings by Appearance, Chat, Accessibility, Privacy & data, and Account when those controls exist.
- Use switches for binary preferences, selects for bounded choices, and clear descriptions for consequential settings.
- Confirm destructive actions and explain their scope.
- Persist settings only where storage behavior is clear to the user.

## 7. Component standards

Build reusable components for:
- Buttons: primary, secondary, quiet, destructive, icon-only.
- Inputs: text, textarea, search, select, checkbox, switch.
- Navigation: sidebar, drawer, tabs, breadcrumbs, command palette.
- Feedback: toast, inline error, empty state, skeleton, progress, status indicator.
- Content: message, citation, code block, attachment, source list.
- Overlays: dialog, popover, tooltip, contextual menu, drawer.
- Layout: page shell, content column, split view, responsive panel.

Each component must define:
- Default, hover, focus-visible, active, disabled, loading, and error states as relevant.
- Keyboard behavior and accessible name.
- Responsive behavior.
- Light and dark theme behavior.
- Reduced-motion behavior.
- Empty and overflow behavior.

Prefer semantic HTML and the existing project component conventions. Avoid introducing a second component framework without a migration plan.

## 8. Accessibility and inclusive design

Target WCAG 2.2 AA as the minimum baseline.

- Normal text contrast: at least 4.5:1.
- Large text contrast: at least 3:1.
- Non-text controls and meaningful visual boundaries: at least 3:1 where required.
- All functionality available by keyboard.
- Visible focus indicators that are not clipped.
- Correct heading order, landmarks, labels, and accessible names.
- Announce meaningful asynchronous status changes without flooding screen readers.
- Dialogs manage focus and return focus to the invoking control.
- Respect reduced motion.
- Do not rely on color alone to convey status.
- Test zoom/reflow, touch targets, screen readers, and browser text scaling.

## 9. Content and trust standards

- Use concise, task-oriented labels.
- Prefer direct language over marketing copy inside the application.
- Explain why a permission is requested and what action it enables.
- Distinguish local-only data from server-side data and synced data.
- Be explicit when a feature is unavailable, experimental, or provider-limited.
- Avoid fake metrics, fabricated citations, placeholder account states that look real, or buttons without working actions.
- Provide recovery guidance for errors, not just error codes.

## 10. Engineering implementation rules

- The existing Next.js App Router + React + strict TypeScript application is the primary product. Do not replace it with the legacy standalone Index.html.
- Preserve existing working chat, streaming, research, file analysis, transcription, local history, settings, and provider contracts while improving the UI.
- Keep provider secrets and privileged operations on the server.
- Use shared CSS variables/tokens and reusable components rather than accumulating appended override layers.
- Avoid global CSS selectors that unintentionally affect unrelated pages.
- Keep server/client component boundaries intentional.
- Avoid adding dependencies for effects that can be implemented accessibly with existing primitives.
- Keep loading, error, empty, offline, and unsupported-browser states designed.
- Do not claim cross-device history, accounts, cloud sync, real-time voice, or agent execution until implemented and verified.

## 11. UI quality gates

Before accepting a UI change:
1. Run lint, typecheck, tests, and production build.
2. Verify desktop, tablet, and mobile breakpoints in both themes.
3. Test keyboard-only navigation and visible focus.
4. Test reduced-motion preference.
5. Test long prompts, long responses, code blocks, citations, and narrow viewports.
6. Test empty, loading, streaming, stopped, failed, and retry states.
7. Check for overflow, layout shift, clipped controls, and inaccessible contrast.
8. Confirm all visible actions work and no unavailable feature is presented as live.
9. Confirm the pure #FFFFFF and #000000 page canvases remain intact.
10. Review the experience as a complete user journey, not just isolated components.

## 12. Implementation sequence

1. Audit the current workspace and map existing UI components to this system.
2. Consolidate design tokens and remove conflicting/duplicated CSS overrides safely.
3. Refine the main chat workspace and responsive navigation.
4. Refine composer, message actions, streaming states, citations, and attachments.
5. Refine settings, accessibility, and privacy surfaces.
6. Align landing page and supporting pages with the same design language.
7. Run visual, accessibility, functional, and production checks at every stage.

**Definition of success:** Ozlind feels simple at first use, powerful as users explore, consistent across platforms, honest about its capabilities, and unmistakably its own product.
