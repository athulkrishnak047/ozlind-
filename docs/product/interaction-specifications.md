# Ozlind interaction specifications

## Global control behavior

- Every interactive control has a visible affordance, accessible name, focus state and deterministic result.
- Do not use clickable-looking decoration without an action.
- Disable controls only when the reason is clear; pair disabled states with explanatory text or a tooltip that works for keyboard and touch.
- Destructive actions require confirmation and state exactly what will be removed.
- Preserve typed drafts across non-destructive UI changes.
- Avoid surprise navigation, auto-submission and automatic microphone activation.

## Chat lifecycle

`idle → submitting → streaming → completed`

Failure branches:
- `submitting → failed`
- `streaming → failed`
- `streaming → stopping → stopped`

Rules:
- Prevent accidental duplicate sends while a request is active.
- Show a clear pending state immediately after send.
- Stop must cancel the active operation, not merely hide the loading indicator.
- Preserve partial output after a stream failure where safe; make retry explicit.
- Never silently replay a prompt to another provider after output has already begun.
- Retry is a user-visible action; explain when the prior response may be incomplete.
- Keep scroll position stable when the user has scrolled away from the newest message.

## Composer behavior

- Empty composer: send disabled; attachment/voice actions remain available only when supported.
- Non-empty composer: send enabled.
- Streaming: send becomes stop; draft behavior must be explicit and preserved.
- Enter/Shift+Enter convention must be consistent and documented.
- Pasting long text must not create layout overflow.
- Selected files show validation before request submission.
- Invalid files remain removable; do not lock the composer.

## Conversation controls

- New chat: create a clean conversation; confirm only if unsaved content would be lost.
- Edit prompt: load the selected user message into composer and make the resend effect clear.
- Regenerate: target the latest assistant response and avoid duplicate parallel generations.
- Copy: copy the intended message content; announce success accessibly without intrusive toast spam.
- Export: name the format and what is included; do not imply private hidden metadata is exported.
- Delete/clear: confirm scope and distinguish one conversation from all local history.

## Overlay and menu behavior

- Dialogs: initial focus inside; Escape closes unless a critical operation is underway; restore focus to trigger.
- Menus: Arrow keys and Escape work; click/tap outside closes when safe.
- Command palette: Cmd/Ctrl+K opens, Escape closes, arrow keys move, Enter activates.
- Mobile drawer: backdrop and close button close; body scroll is controlled; focus returns to menu trigger.
- Avoid nested modal stacks.

## Feedback and status

Use concise, non-blocking status messages:
- “Sending…”
- “Thinking…”
- “Searching the web…”
- “Transcribing…”
- “Copied”
- “Couldn’t connect. Check your connection and try again.”
Avoid fake percentages, fake source counts and decorative “AI thinking” animations.

## Acceptance tests

- [ ] Every visible button has a real action.
- [ ] Stop cancels the in-flight operation.
- [ ] No duplicate send on repeated tap/Enter.
- [ ] Draft survives menu, theme and drawer interactions.
- [ ] Dialog focus enters, remains usable and returns correctly.
- [ ] Keyboard and touch behavior are equivalent for core actions.
- [ ] Failure and offline states offer a recovery route.
