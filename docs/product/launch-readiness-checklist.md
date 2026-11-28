# Ozlind Launch Readiness Checklist

**Status:** Living release gate — not evidence that any unchecked item is complete.  
**Rule:** A release is not ready because a checklist exists. Each item needs an owner, evidence and a verified result.

## 1. Product scope and truthfulness

- [ ] Public feature list matches implemented and tested behavior.
- [ ] Planned capabilities are labeled as planned, not presented as available.
- [ ] Provider/model availability, quotas, limits and fallback behavior are described accurately.
- [ ] Upload types, maximum sizes, retention and processing behavior are clear before upload.
- [ ] Error, empty, loading, disabled, offline and rate-limit states are designed.
- [ ] User can stop generation and recover from interrupted requests.
- [ ] No hidden or misleading default opt-ins.

## 2. Brand and product assets

- [ ] Brand guidelines approved and applied consistently.
- [ ] Light/dark logo and standalone symbol checked on actual devices.
- [ ] Favicon checked in current desktop and mobile browsers.
- [ ] Apple touch icon exported and validated in a supported raster format if required.
- [ ] PWA manifest and 192/512/maskable icons added only if installability is a product requirement.
- [ ] Open Graph/Twitter social preview image checked at 1200×630.
- [ ] All icon buttons have accessible names.
- [ ] Font, image and animation assets have documented licenses and acceptable size.
- [ ] No placeholder, stock or unlicensed asset remains.

## 3. Legal, privacy and user trust

- [ ] Terms of Service reviewed by qualified counsel and approved by the operator.
- [ ] Privacy Policy matches actual collection, processing, sharing, retention and deletion.
- [ ] Data processor/provider list and applicable terms are accurate.
- [ ] Cookie/local-storage behavior and consent requirements are verified for target markets.
- [ ] AI limitations and generated-content disclosure are visible at appropriate points.
- [ ] Acceptable Use Policy and abuse reporting process are operational.
- [ ] Copyright, IP complaint and takedown workflow is staffed.
- [ ] Support and grievance contact details are real and monitored.
- [ ] Operator legal identity, address, governing law and effective dates are filled in.
- [ ] Age requirements and child-safety controls are defined for intended markets.
- [ ] No draft legal document is linked as an approved live policy.

## 4. Security and abuse resistance

- [ ] Threat model reviewed against the release architecture.
- [ ] Provider keys and secrets exist only in server-side secret storage.
- [ ] No secrets, private prompts, personal data or uploaded content leak into logs.
- [ ] Authentication and authorization are tested for every protected resource.
- [ ] Rate limits are effective across production instances, not only in-memory per instance.
- [ ] Request size, token, timeout and concurrency budgets are enforced.
- [ ] File MIME, extension, content and size validation are tested.
- [ ] SSRF, prompt injection, malicious links and untrusted file content are considered.
- [ ] CORS, CSP, security headers and dependency audit are reviewed.
- [ ] Backup, recovery, incident escalation and credential rotation are documented.

## 5. Accessibility and experience

- [ ] Keyboard-only journey works from entry to completion.
- [ ] Screen reader names, roles, announcements and focus order are tested.
- [ ] Contrast meets WCAG 2.2 AA for text and meaningful UI controls.
- [ ] Zoom/reflow works at 200% and narrow mobile widths.
- [ ] Reduced motion is respected.
- [ ] Touch targets and safe-area behavior are verified.
- [ ] Responsive layouts are checked at 360, 390, 430, 768, 1024, 1280 and 1440 CSS px.
- [ ] No horizontal overflow except intentional code/data regions.

## 6. Performance and low-data use

- [ ] Production bundle and route-level JavaScript budgets measured.
- [ ] First load works on a throttled mobile connection.
- [ ] Images are sized, compressed and lazy-loaded where appropriate.
- [ ] No unnecessary remote font, icon or animation dependency.
- [ ] Caching and revalidation behavior are documented.
- [ ] Streaming and cancellation are tested on unstable networks.
- [ ] No repeated large download is required for ordinary navigation.
- [ ] Core Web Vitals measured on representative devices.

## 7. Reliability and operations

- [ ] Lint, typecheck, unit, integration and production build pass.
- [ ] Critical flows have automated tests.
- [ ] Production smoke test covers chat, research, upload, transcription and settings as applicable.
- [ ] Provider outages, quota exhaustion and malformed responses have tested fallbacks.
- [ ] Monitoring alerts are actionable and avoid collecting sensitive content.
- [ ] Incident owner and escalation path are assigned.
- [ ] Rollback and deployment verification are rehearsed.
- [ ] Status communication and user notification templates are prepared.

## 8. Release evidence

For every release, record:
- Release version and commit SHA.
- Environment and deployment URL.
- Test commands and results.
- Known limitations and accepted risks.
- Open critical/high severity issues.
- Legal and security approvals where required.
- Release owner and approval date.

## Go / no-go rule

Do not release with unresolved critical security defects, materially misleading capability claims, unreviewed public legal policies, broken data deletion/consent promises, or a production outage in a core user journey. Document and explicitly accept all remaining risks.
