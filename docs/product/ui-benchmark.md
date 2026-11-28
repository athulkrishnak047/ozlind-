# Ozlind UI benchmark: ChatGPT and Claude

**Reviewed:** 2026-11-27  
**Scope:** Public official product pages and Ozlind's live mobile workspace. The authenticated ChatGPT and Claude application interiors are not fully accessible from a logged-out public scrape, so this benchmark distinguishes observed product pages from inferred in-app behavior.

## Sources inspected with Firecrawl

- ChatGPT public app: https://chatgpt.com/
- ChatGPT product overview: https://chatgpt.com/overview/
- Claude public app: https://claude.ai/
- Claude product overview: https://claude.com/product/overview
- Ozlind live workspace: https://ozlind-git-main-ozlind-enterprise.vercel.app/workspace

## Competitive observations

### ChatGPT
- The product overview makes three distinct work intents legible: Chat, Work, and Codex.
- It describes Work as an end-to-end deliverable workflow (documents, slides, spreadsheets, charts, PDFs, images) and Codex as a coding lifecycle (understand, plan, write, test, review, ship).
- The public app's logged-out mobile surface is minimal and puts the conversation at the center; authentication gates saved history and advanced capabilities.
- The observed public surface uses restrained typography, simple surfaces, and a neutral canvas. Avoid overloading the workspace with decoration.

### Claude
- The product overview is task/outcome-oriented: hand Claude a task, create an editable result, extend what users can do.
- Its public presentation uses generous whitespace, a warm neutral palette, serif display typography paired with sans-serif body text, and strong examples of finished work.
- The public Claude app scrape redirected to a login surface. No claim is made here about inaccessible signed-in app details.
- The useful lesson is the task-to-outcome framing and calm visual hierarchy, not a copy of its colors or branding.

### Ozlind before this UI pass
- The live mobile workspace already had a focused welcome state and recent-chat sidebar.
- The composer exposed model selection as a technical MODEL label followed by provider options and a generic Web button, which made the control row feel technical rather than task-oriented.
- A command palette component and keyboard shortcut state existed in source, but the palette was not mounted in the workspace and there was no visible launcher.
- The first-use experience offered prompt suggestions but did not expose the already-working research, file-analysis, and voice capabilities as direct shortcuts.
- Some older CSS layers competed with one another, making theme-specific and mobile behavior harder to reason about.

## Changes in this benchmark pass

1. Added a visible workspace command-search launcher with a keyboard hint, and mounted the existing command palette so its shortcuts and actions are reachable.
2. Reframed the welcome state around a concrete work intent instead of a generic greeting.
3. Added functional quick actions for live research, file analysis, and voice input. These call existing working handlers; they do not advertise unimplemented tools.
4. Reorganized the composer into a clearer message area with an unobtrusive context line, an accessible model selector, explicit Research action, attachment, voice and send/stop controls.
5. Refined sidebar hierarchy, welcome cards, message reading width, composer surface, focus states, and small-screen spacing.
6. Preserved pure black dark canvas and pure white light canvas. Visual effects remain on layered surfaces and controls, not the page canvas.
7. Kept the existing Ozlind mark and visual identity; no third-party logo, wordmark, or proprietary UI assets were copied.

## Design principles going forward

- **Intent before model internals:** users choose what they want to do; provider details remain available without dominating the composer.
- **One clear primary action:** the message composer remains the visual anchor.
- **Progressive disclosure:** advanced controls and commands appear when relevant, not as a dense toolbar.
- **Mobile-first:** touch targets, safe-area spacing, a real slide-in navigation drawer, and compact controls.
- **Honest capabilities:** expose only actions backed by working routes; label provider-specific limitations.
- **Accessible by default:** semantic labels, keyboard operation, visible focus, contrast, and reduced-motion support.
- **Consistent themes:** #000000 canvas in dark mode and #FFFFFF canvas in light mode; neutral elevated surfaces carry the interface hierarchy.

## Next UI milestones (not implemented by this pass)

- A unified task switcher for Chat, Research, and File analysis only when those modes have distinct working experiences.
- A right-side source inspector for research with source status and citations.
- Editable artifacts and split-pane workspace after an actual artifact editor exists.
- Visible task progress and approval checkpoints when a real agent/tool execution system is implemented.
- Visual regression checks at 360px, 390px, 768px, 1024px and wide desktop breakpoints.

## Quality gates

Run lint, strict typecheck, tests, and a production build. Verify the live mobile and desktop workspaces in both themes, check the sidebar drawer, command palette, quick actions, attachments, research toggle, voice recording, stop generation, and keyboard focus. Do not claim a feature is live until its production deployment is ready and smoke-tested.


## Hybrid design-system implementation update — 2026-11-28

The approved product blueprint is documented in [ozlind-product-blueprint.md](./ozlind-product-blueprint.md). A dedicated final-layer stylesheet, [ozlind-design.css](../../src/app/ozlind-design.css), is loaded after the existing stylesheet to establish a coherent visual authority while avoiding a risky rewrite of the current workspace component and its working interactions.

This pass refines:
- Monochrome canvas and semantic surface tokens for both themes.
- Sidebar hierarchy, history rows, profile area, top bar, and command launcher.
- Empty state, suggestion cards, conversation reading width, message actions, citations, and composer.
- Command palette surface and settings surfaces.
- Landing page surfaces and typography to align with the product identity.
- Tablet/mobile drawer, composer wrapping, settings navigation, and reduced-motion overrides.

The Next.js App Router remains the application entry point. No AI API route, provider adapter, storage contract, or conversation state logic was intentionally changed by this UI pass.

**Verification status:** GitHub Actions quality workflow is triggered by pushes to main. Its result must be checked before claiming lint, typecheck, tests, or production build passed. Visual QA across real browsers, themes, and device widths remains a separate release gate; the CSS commit itself is not proof of visual correctness or deployment.
