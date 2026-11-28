# Ozlind Support and Incident Playbook

**Status:** Internal operating template — not evidence of a staffed support function.  
**Owner:** Assign an accountable operator before public launch.

## 1. Support readiness

Before publishing a support address or form:
- Assign an owner and backup.
- Verify the mailbox, form delivery and access controls.
- Define supported languages, operating hours and realistic response targets.
- Restrict access to submitted personal data.
- Publish a privacy notice and retention schedule for support tickets.
- Test acknowledgements, escalation and closure.

Never advertise a response SLA that the team cannot reliably meet.

## 2. Intake categories

Classify requests as:
1. Account/access (only when accounts exist).
2. Billing/refund (only when payments exist).
3. Technical issue or outage.
4. Privacy/data request.
5. Safety or abuse report.
6. Copyright/IP complaint.
7. Accessibility issue.
8. General product feedback.

Collect only information necessary to investigate. Ask users not to send passwords, API keys, payment card details, or unrelated sensitive information.

## 3. Severity model

| Severity | Example | Initial action |
|---|---|---|
| SEV-1 Critical | Confirmed data exposure, secret compromise, widespread core outage | Start incident response immediately; restrict impact |
| SEV-2 High | Major feature unavailable, active abuse, repeated serious failures | Assign incident owner; mitigate promptly |
| SEV-3 Medium | Limited workflow broken with workaround | Prioritize in normal engineering queue |
| SEV-4 Low | Cosmetic issue, question or suggestion | Track and respond through normal support |

Severity is based on user impact, scope, data sensitivity and ongoing risk—not on how loudly a report is phrased.

## 4. Incident response lifecycle

### Detect and triage
- Record detection time, affected service, environment and reporter channel.
- Confirm impact using privacy-safe telemetry.
- Assign one incident commander and one technical owner.
- Preserve relevant logs without collecting additional user content unnecessarily.

### Contain
- Disable or rate-limit the affected endpoint or feature when needed.
- Revoke and rotate compromised credentials.
- Block malicious traffic using proportionate controls.
- Preserve evidence and access records.
- Avoid destructive changes before evidence is secured unless required to stop active harm.

### Eradicate and recover
- Identify root cause and affected versions/data.
- Patch and test the issue.
- Restore service gradually.
- Verify monitoring, authentication, permissions and data integrity.
- Roll back if recovery increases impact.

### Communicate
- Share confirmed facts, impact, mitigation and next update time.
- Do not speculate or disclose another user's data.
- Notify affected users and relevant authorities when required by law or contract.
- Keep a record of decisions and approvals.

### Learn
- Write a blameless post-incident review.
- Record timeline, root cause, contributing factors and impact.
- Create tracked corrective actions with owners and due dates.
- Update threat model, tests, runbooks and user-facing disclosures.

## 5. Privacy and rights requests

Route access, correction, deletion, objection and complaint requests to the designated privacy owner. Verify identity proportionately before disclosing or changing personal data. Do not promise deletion until all relevant systems, backups, providers and legal retention obligations have been checked.

## 6. Abuse and safety reports

Preserve the report and relevant context securely. Apply the Acceptable Use Policy consistently. Escalate credible threats, exploitation, child-safety concerns or imminent harm to the designated safety/legal owner and follow applicable law. Limit internal access to those who need it.

## 7. Copyright and IP complaints

Use the separate copyright/IP workflow. Record claimant contact details, work identification, disputed material, URL/location, statement of good-faith belief and required declarations. Do not remove or restore content automatically without following the approved process and applicable law.

## 8. Operational templates

### Incident record
- Incident ID:
- Severity:
- Incident commander:
- Technical owner:
- First detected:
- User impact:
- Affected services:
- Containment:
- Recovery:
- Notifications:
- Root cause:
- Corrective actions:

### User acknowledgement
“Thank you for reporting this to Ozlind. We have received your message and will review it. Please do not send passwords, API keys or payment details. We will contact you through this channel if more information is required.”

Use this template only after a real support system has received the request.

## 9. Launch gate

- [ ] Named support and incident owners.
- [ ] Working, monitored support channel.
- [ ] Privacy and retention rules for tickets.
- [ ] Escalation contacts and on-call coverage.
- [ ] Incident response rehearsal.
- [ ] Provider outage and credential-rotation procedure.
- [ ] Legal/privacy notification process.
- [ ] Public support details verified end-to-end.
