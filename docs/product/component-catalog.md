# Ozlind reusable component catalog

This is the component contract. Reuse existing components where suitable; do not create parallel versions of the same primitive.

## Foundations

- **AppShell:** route-level frame, theme and responsive content boundary.
- **PageContainer:** consistent width and horizontal padding.
- **Surface:** semantic neutral surface with border/radius variants; no arbitrary color per instance.
- **IconButton:** icon-only button with accessible name, tooltip and 44px practical hit target.
- **Button:** primary, secondary, quiet and destructive variants.
- **TextField / TextArea:** labels, hint, error and disabled states.
- **Switch / Select:** native or accessible controls with explicit value labels.
- **Tooltip:** supplementary only; never the only source of critical information.
- **Toast / StatusMessage:** concise status, non-blocking and screen-reader announced appropriately.
- **Skeleton:** stable layout placeholder; avoid flashing or fake progress.

## Navigation

- **BrandMark:** existing Ozlind identity.
- **WorkspaceSidebar:** new chat, recent local history, search and settings.
- **MobileNavigationDrawer:** backdrop, close action, safe areas and focus lifecycle.
- **WorkspaceHeader:** current context, search/command launcher, theme.
- **CommandPalette:** searchable, grouped actions and keyboard navigation.
- **ConversationListItem:** title, selected state, optional timestamp, overflow actions.

## Chat

- **ConversationView:** message list, empty state and scroll management.
- **MessageGroup:** author and content grouping.
- **UserMessage:** user content with edit affordance.
- **AssistantMessage:** rich response rendering.
- **MessageActions:** copy, regenerate, export when applicable.
- **Composer:** multiline draft, attachments, contextual actions and send/stop.
- **AttachmentChip:** file metadata, validation and remove action.
- **PromptSuggestion:** concise optional starter.
- **StreamingIndicator:** truthful request status; no simulated token output.
- **CitationLink / SourceList:** grounded source references with external-link semantics.

## Settings and utilities

- **SettingsSection:** heading, description and grouped preferences.
- **SettingRow:** label, explanation, control and persistence hint.
- **ConfirmationDialog:** destructive scope and explicit confirmation.
- **EmptyState:** helpful explanation and one next action.
- **ErrorState:** plain-language cause and recovery action.

## Component implementation rules

- Prefer composition and semantic HTML over monolithic components.
- Keep business logic and provider details out of visual primitives.
- Define variants centrally; do not add ad-hoc CSS selectors for one-off visual differences.
- Avoid adding UI libraries or icon packs without a clear need and bundle-size review.
- Every component documents its states, keyboard behavior and responsive behavior.
- Do not add an unused “future feature” component to production navigation.
- Keep component styling in the agreed design-system layer; avoid competing global CSS overrides.

## Component acceptance record

For each new component record: purpose, owner/file path, props/data contract, states, accessibility behavior, responsive behavior, tests and whether it is used in production.
