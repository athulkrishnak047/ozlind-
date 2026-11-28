# Ozlind AI Transparency Standard

**Status:** Product policy draft — align with shipped behavior before publication.  
**Audience:** Product, engineering, support and users.

## 1. Purpose

Ozlind uses AI systems to generate, transform, summarize and analyze content. This document defines the minimum transparency expected in the product. It is not a guarantee that every future AI capability is already available.

## 2. What users should be told

At the point of use, explain in plain language:
- Whether a response is AI-generated or AI-assisted.
- Whether a task uses web search, a connected provider, uploaded files, audio transcription or another external service.
- What input is sent to a provider, including relevant file/audio content.
- Important size, format, context, rate and availability limits.
- Whether output may be incomplete, inaccurate, biased, outdated or fabricated.
- Whether citations are available and what they do—and do not—verify.
- Whether user content is stored locally, transmitted to a provider, retained by Ozlind, or used for service improvement, based on verified implementation and provider contracts.

## 3. Output reliability

AI output is probabilistic and can be wrong. Users should independently verify high-impact information, especially legal, medical, financial, safety, employment, education and other consequential decisions.

A citation is a path to a source, not proof that the source supports every generated claim. Research results should distinguish source-derived statements from model synthesis and clearly flag missing or conflicting evidence.

## 4. Human review and consequential use

Unless a specific feature has been reviewed and explicitly documented otherwise:
- Ozlind output is assistance, not a substitute for qualified professional judgment.
- Users remain responsible for reviewing generated text, code, files and actions before relying on or publishing them.
- Do not imply that a human has reviewed a response when no such review occurred.
- Do not imply that an AI system has authority to make decisions for a person.

If future Ozlind features can execute external actions, require clear previews, scoped permissions, confirmation for consequential actions, visible execution status and a recoverable audit trail.

## 5. Third-party AI providers

Provider routing, model selection, fallback and provider-side retention can change. The live product disclosure must be generated from the actual provider configuration and current provider contracts—not copied from an outdated static list.

Before sending data to a provider, document:
- Provider legal name and service.
- Data categories transmitted.
- Purpose and processing location where known.
- Provider retention and training settings.
- Contractual role and applicable data-processing terms.
- User-facing notice and any required choice or consent.

## 6. Generated media and provenance

Where Ozlind generates or materially transforms media, label it clearly when users could reasonably mistake it for an authentic recording, photograph, statement or document. Preserve provenance metadata when supported and appropriate. Do not claim watermarking, content credentials or detection capabilities unless implemented and tested.

## 7. Prompt injection and untrusted content

Web pages, uploaded files, transcripts and retrieved content are untrusted input. They must not silently override system rules, reveal secrets, authorize external actions or change permissions. Product copy must not suggest that retrieved content is safe merely because it was processed by AI.

## 8. User control

Provide clear controls, where applicable, to:
- Stop generation or cancel processing.
- Review and remove uploaded content before submission.
- Delete local conversation history.
- Manage provider or feature preferences.
- Report unsafe, illegal, infringing or misleading output.
- Request support or privacy assistance through a monitored channel.

Only promise controls that are implemented and tested in the current release.

## 9. Review requirements before publication

- [ ] Map every disclosure to the current code and data flow.
- [ ] Verify provider names, data transfer and retention settings.
- [ ] Verify generated-media labeling behavior.
- [ ] Confirm citation and browsing limitations.
- [ ] Review accessibility and localization.
- [ ] Obtain legal/privacy review for launch markets.
- [ ] Remove statements about capabilities that are not shipped.

This standard is an internal product baseline. It must be reconciled with the Privacy Policy, Terms, third-party disclosure and actual implementation before being published to users.
