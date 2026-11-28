# Ozlind screen specifications

These are behavior and hierarchy contracts, not pixel-perfect mockups. Shared visual rules come from [design-system.md](./design-system.md).

## 1. Public landing page — `/`

**Job:** Explain the product and take a visitor into a real first task.

- Header: Ozlind mark, concise navigation, theme toggle, one primary “Open workspace” action.
- Hero: plain-language promise, short supporting explanation, primary CTA.
- Product preview: show the real workspace or a clearly labeled static preview; never fake a capability.
- Capabilities: streaming chat, live research, supported file analysis and voice-to-text only.
- Trust section: explain browser-local history and current privacy boundary accurately.
- Footer: links only to pages that exist.

States: normal, navigation menu open, theme changed, workspace navigation pending, reduced motion.

## 2. Assistant workspace — `/workspace`

**Job:** Start and continue conversations with minimal friction.

Desktop:
- Sidebar with brand, new chat, local history/search and settings access.
- Main column with compact header, conversation or welcome state, composer.
- Reading width target 680–800px; avoid stretching prose across ultrawide screens.
- Keep the composer visually anchored but do not cover the final message or keyboard focus.

Mobile:
- Compact top bar and real drawer.
- One-column messages; composer above safe area and software keyboard.
- Secondary controls may move into a menu, but must remain discoverable.
- No page-level horizontal overflow.

Welcome state:
- One useful headline, concise helper text, composer as visual focal point.
- Suggestions are optional accelerators, not competing cards.
- Quick actions must map to working handlers.

Conversation state:
- Distinct user/assistant authorship, restrained surfaces, readable markdown.
- Message actions are context-specific and keyboard reachable.
- Do not show provider internals unless the user opens technical details.

## 3. Composer and attachment flow

- Multiline text field with clear placeholder and accessible name.
- Send is the primary action when text is available; stop replaces send during generation.
- Enter sends only if this convention is explicitly communicated; Shift+Enter inserts a newline. On mobile, respect the platform keyboard send affordance and preserve multiline editing.
- Attachment action opens the native file picker; show selected file name, type and size before sending.
- Each attachment has a remove action and clear validation feedback.
- Research and voice controls have distinct active, unavailable, permission-denied and processing states.
- Never silently discard a draft when switching modes or opening menus.

## 4. Conversation message

- Body supports paragraphs, headings, ordered/unordered lists, tables, blockquotes, code and links as supported by the renderer.
- Long code blocks scroll internally and offer copy; do not force page-wide overflow.
- Message action group: copy; user prompt edit/resend; latest assistant response regenerate; export when available.
- Keep actions hidden or subdued until relevant, but provide keyboard access and accessible labels.
- Citation/source presentation must be visually distinct from generated prose.

## 5. Research result

Current implementation is a research action in the chat experience, not a full research studio.
- Indicate that research is active before the request.
- Show searching/working state only while work is occurring.
- Sources have readable title/domain and a direct open action.
- Distinguish citations from claims and avoid unsupported source metadata.
- Empty/error state explains whether research is unavailable or no sources were returned.
- Do not create fake source cards or fabricate retrieval progress.

## 6. File analysis

- State supported file formats and size limits before selection.
- Preview file name, type and size; allow removal.
- Explain when a file is processed for a request and not retained as cloud storage.
- Show uploading/analysing/completed/failed states.
- Errors should tell users how to recover (supported format, smaller file, retry).
- Never show progress percentage unless the client has actual progress data.

## 7. Voice input

Current capability is microphone capture followed by transcription into text.
- Explicit user action starts capture; never auto-start microphone.
- Distinguish permission prompt, recording, stopping, transcription, inserted draft, denied permission and failure.
- Provide text input as an equivalent path.
- Never imply two-way spoken conversation or audio playback.

## 8. Settings — `/settings`

Organize into concise groups:
- Appearance: theme and compact density.
- Chat: only real preferences.
- Accessibility: reduced motion and other implemented preferences.
- Privacy & data: explain browser-local history; clear data with confirmation and clear scope.
- Profile: label local profile fields as local if they are not account-backed.

Each setting needs a name, plain-language description, current value, immediate feedback and persistence boundary. Avoid controls that imply server account features.

## 9. Command palette

- Search/filter commands as the user types.
- Group actions by navigation, conversation and preferences.
- Show keyboard hints only when accurate.
- Support Arrow Up/Down, Enter, Escape and focus restoration.
- Empty result state offers a useful recovery hint.
- Only list actions that are currently executable.

## Shared state catalogue

Every screen must design these states where applicable:
- Initial/empty
- Loading
- Partial/streaming
- Success/complete
- Recoverable error
- Unavailable/disabled
- Permission denied
- Offline/network failure
- Destructive confirmation
- Narrow viewport / keyboard open
- Reduced motion / high zoom
