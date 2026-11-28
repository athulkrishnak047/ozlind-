# Ozlind Operational Communication Templates

**Status:** Internal templates. Use only after the described event is verified.  
**Rule:** Never invent an incident, impact, resolution time, security finding or service-level commitment.

## 1. Service disruption

**Subject:** Ozlind service disruption

We are investigating an issue affecting **[verified feature/service]** beginning at **[time and timezone]**. The confirmed impact is **[specific user impact]**.

We are working to **[current mitigation]**. We will provide the next update by **[time and timezone]**, or sooner if the status changes materially.

Do not include speculative root causes or unverified recovery estimates.

## 2. Service restored

**Subject:** Ozlind service restored

The issue affecting **[feature/service]** has been mitigated as of **[time and timezone]**. We have verified **[specific checks completed]**.

Some requests started during the incident may need to be retried. We are continuing to monitor the service and will publish a follow-up if further action is required.

## 3. Planned maintenance

**Subject:** Scheduled Ozlind maintenance

Ozlind plans maintenance on **[date]** from **[start time]** to **[end time] [timezone]**. During this period, **[specific services]** may be unavailable or degraded.

We will update this notice if the schedule or expected impact changes.

Publish only after the maintenance window and impact have been approved.

## 4. Security or privacy notification

**Subject:** Important information about your Ozlind data

We are contacting you about **[verified incident or event]**. Based on our current investigation, **[specific categories of data and affected period]** may have been involved.

We have taken **[verified containment steps]**. We recommend **[specific protective action, if applicable]**.

For questions, use **[verified privacy/security contact]**. We will update this notice as material facts are confirmed.

Security/privacy notifications require review by the incident owner and qualified legal/privacy counsel before sending, where required.

## 5. Product release note

**Title:** Ozlind update — [version/date]

### What's new
- [User-visible change and its benefit.]

### Improvements
- [Measured or verified improvement.]

### Fixes
- [Issue resolved and affected workflow.]

### Known limitations
- [Remaining limitation users should know.]

Do not list internal refactors as user benefits unless they measurably change user experience.

## 6. Support acknowledgement

Thank you for contacting Ozlind. We have received your message and will review it through our support process.

Please do not send passwords, API keys, payment card details or unrelated sensitive information. If we need more information, we will ask for the minimum details required to investigate.

Use only when a monitored support system has actually received the request.

## 7. Approval record

Before publication, record:
- Content owner:
- Incident/release owner:
- Facts independently verified by:
- Legal/privacy review (if applicable):
- Approved channels:
- Publication time and timezone:
- Next update owner/time:
