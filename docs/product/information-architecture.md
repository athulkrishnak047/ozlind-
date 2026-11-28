# Ozlind information architecture

## Product structure

Ozlind is a workspace, not a collection of unrelated mini-apps. Navigation should help a person start a task, return to prior work, and manage preferences without learning internal model/provider terminology.

## Live navigation (current repository)

| Destination | Route / behavior | Visibility |
|---|---|---|
| Home / product intro | `/` | Public |
| Assistant workspace | `/workspace` | Primary |
| New chat | Workspace action | Always available |
| Recent conversations | Workspace sidebar; browser-local | Only when history exists, with useful empty state |
| Search conversations | Workspace search/command action | Available for local history |
| Settings | `/settings` | Global utility |
| Theme | Theme control | Global utility |
| Command palette | Overlay | Keyboard and visible launcher |

Research, file analysis and voice input are currently composer actions/flows, not separate full applications. Keep them contextual until they provide distinct navigation-level workflows.

## Future information architecture (not live)

- Projects: project list, project home, project instructions, files and conversations.
- Research: research session, source list, source detail, report export.
- Artifacts: document/code/table/chart editor and version history.
- Tasks: run list, run detail, plan, approvals and activity log.
- Integrations: connected apps, scopes, access review and revoke.
- Account: profile, sessions, security, data export and deletion.
- Developer: API keys, usage, docs and webhooks.

Do not show these as active destinations until the underlying product workflow exists. If a roadmap preview is later introduced, label it “Planned” and do not give it an action that appears to work.

## Navigation rules

- Keep one primary “New chat” action.
- Keep the active destination visually clear without relying on color alone.
- Conversation history is distinct from product destinations.
- Search should search only the data the user can actually access; current search is local history only.
- Settings and theme are utilities, not competing primary destinations.
- Mobile navigation is a drawer with backdrop, close action, Escape handling and focus return.
- On route change, close the mobile drawer and restore focus to the page heading or main region.
- Preserve a predictable back-navigation path; do not unexpectedly discard a draft.

## Route and URL conventions

- Use lowercase, readable route segments.
- Keep URLs stable; avoid route names that expose provider internals.
- Deep-link to a conversation only when a durable, share-safe identifier and access model exist. Browser-local IDs are not share links.
- Future routes must define authentication, ownership, empty state, loading state and not-found behavior before implementation.

## Navigation acceptance checklist

- [ ] Every visible destination exists and works.
- [ ] Active state is clear for pointer, keyboard and screen-reader users.
- [ ] Mobile drawer opens, closes, traps/returns focus correctly and respects safe areas.
- [ ] No empty/fake destinations.
- [ ] Search scope and local-only persistence are explained accurately.
- [ ] New chat, settings and theme are reachable without excessive taps.
