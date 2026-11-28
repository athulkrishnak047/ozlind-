# Ozlind content and microcopy

## Voice

Ozlind speaks clearly, calmly and directly. It is helpful without being overly familiar, technical without exposing implementation details, and honest about uncertainty and limitations.

- Prefer short sentences and familiar words.
- Describe user intent, not internal provider architecture.
- Use action labels that name the result: “New chat”, “Search chats”, “Analyze file”.
- Avoid exaggerated claims such as “perfect”, “unlimited”, “always accurate” or “best AI”.
- Avoid fake urgency and celebratory noise.
- Keep English as the initial product language; plan high-quality Malayalam localization without machine-translated UI fragments.

## Naming

- Product: Ozlind.
- Primary surface: Assistant or Chat, choose one label and use consistently.
- Use “Research” only for the real web-grounded research action.
- Use “Analyze file” for supported document/image/video analysis.
- Use “Voice input” for transcription; do not label it “Live voice”.
- Use “History on this device” or “Saved in this browser” while storage remains local.
- Do not label a feature “Memory”, “Projects”, “Artifacts”, “Agents” or “Integrations” as available before it exists.

## Composer copy

Placeholder should invite an open-ended task, e.g. “Ask anything…”; helper text can explain Enter to send and Shift+Enter for a new line when that convention is active. File support and size limits must be visible near upload affordance or in its help.

## Error copy pattern

Use: what happened + what the user can do.

Examples:
- Network: “Couldn’t connect. Check your connection and try again.”
- Provider unavailable: “Ozlind can’t reach the selected AI service right now. Try again in a moment or choose another available option.”
- Unsupported file: “This file type isn’t supported. Choose a PDF, image, or supported video.”
- File too large: “This file is too large. Choose a file under the displayed size limit.”
- Microphone denied: “Microphone access is blocked. Allow it in your browser settings, or keep typing.”
- Empty search: “No matching chats on this device.”
- Local data: “This history is stored in this browser and won’t sync to other devices.”

## Privacy language

Never imply local browser history is cloud-backed, encrypted at rest by Ozlind, synced or recoverable from another device unless those capabilities are implemented. Explain data flow in plain language. Avoid vague phrases like “your data is safe” without a specific basis.

## Status language

Use factual status:
- “Sending…”
- “Generating response…”
- “Searching the web…”
- “Preparing file…”
- “Transcribing audio…”
- “Stopped”
- “Copied”
Do not invent percentages, wait times, source counts or provider availability.

## Localization readiness

- Avoid concatenating fragments that break translation.
- Keep UI strings in a central message catalog when localization is implemented.
- Allow text expansion; avoid fixed-width labels and controls.
- Use locale-aware date/number formatting.
- Preserve accessible names and error semantics across languages.
