# Ozlind Product Blueprint — ChatGPT × Claude Adaptation

**Version:** 1.0  
**Status:** Product direction approved; UI/UX-first implementation  
**Platforms:** Responsive web, tablet, mobile  
**Design thesis:** Adopt the most useful public product patterns from ChatGPT and Claude, then express them through an original Ozlind design system. This is a product adaptation, not a pixel-level clone or use of third-party branding/assets.

## 1. Executive direction

Ozlind is a focused AI workspace. It should feel immediately approachable for a first-time visitor and become more capable as the user discovers its tools.

The product combines:
- ChatGPT-inspired breadth: a central conversation surface, discoverable tools, multimodal entry points, research workflows, and a path toward dedicated workspaces.
- Claude-inspired craft: calm reading surfaces, strong typography, task-oriented prompts, editable-work philosophy, and transparent progress.
- Ozlind identity: pure white / pure black canvases, neutral surfaces, restrained violet accents, a distinctive mark, and a clear, low-noise interface.

**Core promise:** One thoughtful workspace to ask, explore, understand, and create — with honest capability boundaries.

## 2. Competitive adaptation matrix

| Product pattern | ChatGPT lesson | Claude lesson | Ozlind adaptation |
|---|---|---|---|
| First-use experience | Immediate chat entry and tool discovery | Calm, task-oriented invitation | One central prompt with clear quick starts |
| Navigation | Chat and specialist work surfaces | Projects and work-oriented organization | Compact workspace navigation; add destinations only when live |
| Composer | Multimodal and tool affordances | Minimal, readable input | Spacious composer; contextual tools; progressive disclosure |
| Responses | Rich structured output and citations | Excellent long-form readability | Strong markdown typography, source links, copy/edit/regenerate |
| Research | Search and deeper research workflow | Source-backed synthesis | Explicit research mode with visible source list and clear retrieval status |
| Files | Upload and analyze many content types | Document-focused workflows | Attachment preview, limits, progress, and provider-specific clarity |
| Work products | Workspaces for documents, data, and code | Editable Artifacts | Add editable artifact workspace only after editor and persistence exist |
| Agents | Multi-step tool workflows | Plans, parallel tasks, approvals | Future task timeline, bounded tools, approvals, pause and stop controls |
| Personalization | Projects and memory | Projects, preferences, skills | Start with local settings/history; future memory must be inspectable and user-controlled |
| Trust | Tool controls and source citations | Careful permission and safety framing | Capability truth, visible limitations, explicit consent, and recovery paths |

Do not copy ChatGPT or Claude logos, product names, proprietary assets, exact screen compositions, or private implementation. Learn from publicly visible interaction principles and build an original system.

## 3. Product truth: current vs future

### Available in the existing repository
- Next.js App Router workspace and landing page.
- Streaming AI chat via server-side Gemini and Groq adapters.
- Automatic/provider preference selection.
- Stop generation, copy, edit, regenerate, and markdown export actions.
- Browser-local conversation history and search.
- Live research route with source links.
- PDF, image, and supported short-video analysis through a separate Gemini route.
- Browser microphone capture and speech-to-text.
- Light/dark theme and local preferences.
- Settings for profile, compact mode, reduced motion, and local data clearing.

### Not yet implemented; do not show as live
- Accounts, authentication, cross-device sync, server-side conversation history.
- Durable memory or project-level memory.
- Editable Artifacts/document editor.
- Coding agent or repository write access.
- General model tool loop, agent runtime, background tasks, or multi-agent orchestration.
- Real-time bidirectional voice.
- Billing, teams, shared workspaces, or enterprise administration.
- Image generation or in-product image editing.

The UI must never make a future feature look operational. A roadmap or disabled preview may be shown only when clearly labeled as planned and not actionable.

## 4. Information architecture

### Current release navigation
1. Assistant — primary conversation workspace.
2. Settings — appearance, profile, accessibility preferences, and local privacy/data controls.
3. Recent chats — local conversation search and history.
4. Command palette — quick actions and keyboard navigation.
5. Landing page — product introduction, current capabilities, and entry into workspace.

### Future navigation (only after implementation)
- Research workspace — source inspector, research plan, citations, and export.
- Projects — scoped instructions, files, and conversation organization.
- Artifacts — editable documents, code, tables, charts, and diagrams.
- Tasks — long-running jobs, approvals, pause/resume, and activity log.
- Integrations — connected services and permission management.

Avoid creating empty sidebar destinations just to imitate another product.

## 5. Screen blueprint

### A. Landing page /
**Purpose:** Explain Ozlind in seconds and move visitors into a useful first interaction.

Structure:
- Header: Ozlind identity, concise capability/approach links, theme toggle, primary “Open workspace” action.
- Hero: one strong statement, one sentence explaining value, primary CTA, secondary capability link.
- Product preview: accurate representation of the actual workspace, not a fake feature demo.
- Current capabilities: chat, live research, file understanding, voice input — only those that work.
- Trust/approach section: clarity, capability honesty, privacy boundary, and quality principles.
- Footer: product identity and useful legal/help links when their pages exist.

UX rules:
- One primary CTA.
- No oversized decorative animation that delays access.
- Clearly state that history is browser-local and no account sync exists yet.
- The landing page and workspace must share the same tokens and typography.

### B. Assistant workspace /workspace
**Purpose:** Make starting, continuing, and controlling a conversation effortless.

Desktop layout:
- Left navigation rail (target 248–264px) with brand, New chat, primary destinations, searchable recent chats, local-history note, and profile/settings entry.
- Top bar with current workspace label, command/search launcher, local-history status, and theme control.
- Main conversation area centered to a comfortable reading width.
- Composer anchored at the bottom with attachment, provider preference, research toggle, voice input, and send/stop.
- Optional inspectors are not part of the current release; do not reserve empty panels.

Tablet layout:
- Collapsible rail or drawer.
- Main reading column remains centered and readable.
- Composer controls wrap without overlap.
- Avoid shrinking the desktop sidebar into a narrow unusable strip.

Mobile layout:
- Sidebar becomes a true slide-in drawer with backdrop, Escape/backdrop close, safe-area padding, and focus management.
- Header remains compact and keeps menu, current context, and theme/search access discoverable.
- Composer stays above keyboard and safe-area inset.
- Primary actions remain visible; secondary controls may move into a contextual menu only if their function remains discoverable.
- No horizontal page overflow.

First-use / empty state:
- Compact brand mark and task-oriented headline.
- Prompt field is the visual center of gravity.
- Quick actions: research, analyze a file, voice input.
- Prompt starter cards: think through an idea, explain something, make a plan, review code.
- Keep suggestions concise and visually secondary to the composer.
- Do not present unsupported actions (e.g. image generation, coding agent) as available.

Conversation state:
- Clear visual separation between user and assistant messages without turning every message into a heavy card.
- Reading width around 680–800px depending on viewport.
- Assistant response uses semantic headings, lists, tables, links, blockquotes, and code formatting.
- Source links are grouped and labeled.
- Actions appear near the relevant message: copy, edit user prompt, regenerate latest answer.
- Provider/model metadata is secondary, not a headline.
- Streaming has a subtle, accessible status indicator; stop remains available.
- Errors explain what happened and how to retry.

Composer:
- One clear text input with a comfortable minimum height and natural growth.
- Enter sends; Shift+Enter inserts a newline; behavior is hinted.
- Attachment chip includes filename, type, size, remove control, and provider note.
- When an attachment forces Gemini, visibly explain the limitation and lock the selector.
- Research toggle is explicit and mutually exclusive with file analysis if the request path cannot run both.
- Voice requires a deliberate action and visibly shows recording/transcribing/error states.
- Send/stop button has accessible labels and clear disabled/loading states.
- Avoid exposing a row of technical controls as the dominant interface.

### C. Command palette
**Purpose:** Make navigation and common actions fast for keyboard and touch users.

- Launcher visible in desktop top bar; shortcut Ctrl/Cmd+K.
- Search filters commands as the user types.
- Arrow keys move selection; Enter runs; Escape closes.
- Include only actions that work: new chat, focus composer, toggle research, export, clear chat.
- Dialog has accessible label, focus handling, and focus return.
- Touch users can open it through the visible launcher; never require a keyboard shortcut.

### D. Settings /settings
**Purpose:** Give users predictable control over appearance and local data.

Sections:
1. Appearance — light/dark theme, reduced motion, compact mode.
2. Account & profile — local display name, with clear note that this is not an authenticated account.
3. Privacy & data — count and clear local conversation history; explain provider request boundary.
4. Future sections only when implemented: security, connected apps, memory, billing.

UX rules:
- Settings rail links to real sections.
- Each control has a visible label and short explanation.
- Save feedback is clear.
- Destructive actions require confirmation and explain scope.
- Mobile settings navigation stacks cleanly and does not rely on hover.

### E. Future research workspace
Only introduce after a distinct workflow is implemented:
- Research prompt and scope.
- Progress state: searching, reading sources, synthesizing.
- Source list with domain, title, status, and open link.
- Main synthesis area with inline citations.
- Export action.
- Explicitly distinguish retrieved evidence from generated synthesis.

### F. Future artifacts workspace
Only introduce after editing and persistence work:
- Split view between conversation and artifact.
- Editable canvas with autosave state and version history.
- Artifact types: document, code, table, chart, diagram.
- Contextual edit actions and export.
- Responsive mobile mode switches between chat and artifact tabs rather than compressing two panes.

### G. Future agent/task workspace
Only introduce after a bounded tool runtime exists:
- Task objective and plan.
- Current step, progress, outputs, and blockers.
- Tool action previews and approval checkpoints.
- Pause, resume, cancel, and audit history.
- Permission scope and cost/time boundaries.
- Never imply a background task continues after the process has stopped.

## 6. Shared design system

### Brand
- Primary identity: Ozlind wordmark/mark already in repository.
- Tone: calm, capable, direct, thoughtful.
- Accent: restrained violet for focus and key actions.
- Neutral monochrome foundation.

### Color rules
- Light page canvas: pure #FFFFFF.
- Dark page canvas: pure #000000.
- Elevated surfaces: near-white / near-black neutrals.
- Text: high contrast; muted text must remain readable.
- Accent color communicates focus/action, not decoration.
- Success, warning, and error colors are semantic and never conveyed by color alone.
- Avoid ambient gradient backgrounds that tint the page canvas.

### Typography
- Existing Inter/system sans-serif stack.
- Clear hierarchy with restrained font sizes and weights.
- Body 14–16px; comfortable line height.
- Long answers optimize for reading, not density.
- Code uses a legible monospace stack.

### Layout
- 4px spacing base.
- Common steps: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64.
- 8px control radius, 12px compact surface radius, 16px large surface radius.
- 44px minimum practical touch target.
- Content max-width 760–850px for conversation depending on available width.
- Use borders and restrained shadows before blur.

### Style allocation
- Minimal / Swiss hierarchy: core chat, navigation, settings, reading.
- Selective glass: floating menus, drawer, command palette, and composer if it improves separation.
- Bento: capability overviews and future dashboards only.
- Flat surfaces: dense controls, forms, tables, and settings.
- Gradients: occasional brand moments only.
- No universal neumorphism, heavy 3D, excessive glow, or decorative noise.

## 7. Component inventory and states

Shared components:
- App shell, sidebar, mobile drawer, top bar, navigation item.
- Button variants: primary, secondary, quiet, destructive, icon-only.
- Search input, textarea, select, switch, checkbox.
- Composer, attachment chip, provider selector, research toggle, voice control.
- Message row, message metadata, response content, source list, message actions.
- Empty state, loading/streaming indicator, error banner, toast.
- Dialog, popover, tooltip, command palette.
- Theme toggle and settings section.

Every interactive component defines the relevant:
- Default, hover, focus-visible, active, disabled, loading, error states.
- Keyboard/touch behavior and accessible name.
- Light/dark theme.
- Responsive and overflow behavior.
- Reduced-motion behavior.

## 8. Accessibility and responsive acceptance

Target WCAG 2.2 AA:
- Text contrast 4.5:1 normal and 3:1 large.
- Visible keyboard focus.
- Semantic landmarks, heading order, labels, and button names.
- Dialog focus management and return focus.
- Keyboard-only completion of all core workflows.
- Screen-reader status announcements that are useful and not repetitive.
- 200% zoom/reflow without lost controls.
- 44px touch targets where practical.
- Reduced-motion support.
- Status never communicated by color alone.

Validate at 360, 390, 430, 768, 1024, 1280, and 1440px widths, in both themes.

## 9. UX principles to apply

- Hick's Law: limit visible choices and group advanced options.
- Fitts's Law: make primary controls easy to reach and large enough to hit.
- Jakob's Law: use familiar chat, search, navigation, and settings conventions.
- Progressive disclosure: reveal advanced controls only when relevant.
- Recognition over recall: labels and visible actions beat hidden gestures.
- Feedback: every action provides a clear response.
- Error prevention: constrain invalid combinations and explain provider limitations.
- User control: stop, cancel, undo where possible, export, clear, and delete.
- Cognitive load: one primary task per screen and concise helper copy.
- Consistency: the same component behaves the same way across every surface.

## 10. Implementation plan

### Stage 1 — Blueprint and audit
- Confirm current repository structure and feature boundaries.
- Map current screens/components to this blueprint.
- Record visual and interaction gaps.
- Do not replace the Next.js app with the legacy standalone HTML file.

### Stage 2 — Design foundation
- Consolidate color/spacing/type tokens.
- Remove conflicting historical CSS overrides safely.
- Preserve pure white and pure black canvases.
- Standardize focus, motion, borders, elevation, and surface layers.

### Stage 3 — Core workspace
- Refine desktop navigation and responsive mobile drawer.
- Improve empty state, message reading surface, composer, and tool affordances.
- Ensure research, attachment, voice, and model selector states are truthful.
- Keep current chat, streaming, stop, local history, export, and editing behavior intact.

### Stage 4 — Settings and landing
- Align settings with workspace visual language.
- Improve responsive settings navigation and destructive-action clarity.
- Align landing page preview and capability claims with current product reality.

### Stage 5 — Validation
- Run lint, strict typecheck, tests, and production build.
- Verify mobile/tablet/desktop in both themes.
- Check keyboard and reduced-motion behavior.
- Test long messages, code, sources, empty/loading/error states, attachment states, and streaming.
- Fix regressions before marking the pass complete.

## 11. Definition of done

A UI pass is complete only when:
- The blueprint and implementation match.
- All visible actions work.
- No unsupported capability is advertised as live.
- Existing API/provider contracts are unchanged unless explicitly documented and tested.
- Light canvas is exactly #FFFFFF; dark canvas is exactly #000000.
- Mobile drawer and composer work on narrow screens and with safe areas.
- Accessibility and reduced-motion checks pass.
- Lint, typecheck, tests, and production build pass.
- Deployment is verified separately; a successful GitHub commit alone is not a deployment.

## 12. Reference material

- ChatGPT product: https://chatgpt.com/overview/
- OpenAI capabilities: https://help.openai.com/en/articles/9260256-chatgpt-capabilities-overview
- Claude product: https://claude.com/product/overview
- Claude Artifacts: https://claude.com/features/artifacts
- WCAG 2.2: https://www.w3.org/TR/WCAG22/
- Apple Human Interface Guidelines: https://developer.apple.com/design/human-interface-guidelines/
- Material Design 3: https://m3.material.io/

Feature availability and UI can vary by plan, region, and rollout. These references inform product principles; they are not a claim of exact feature parity.
