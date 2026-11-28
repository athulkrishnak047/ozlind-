# Ozlind third-party services disclosure

**Status:** Draft inventory — verify before publication.

Ozlind's current repository documents the following service categories. Actual enabled providers and processing terms must be checked against production configuration.

| Service / provider | Purpose | Data potentially processed | Verification needed |
|---|---|---|---|
| Google Gemini | Chat provider and supported multimodal file analysis; research grounding where configured | Prompts, conversation context, supported file content | Exact models, regions, retention, training controls, DPA and current terms |
| Groq | Chat provider, research fallback and speech-to-text | Prompts/context, research requests and submitted audio | Exact endpoints/models, retention, training controls, regions and current terms |
| Vercel | Hosting, deployment and serverless execution | Request metadata, IP/technical logs and data passing through app routes | Log retention, regions, access, subprocessors and DPA |
| GitHub | Source repository and CI/CD | Source code and repository metadata; secrets should be stored in protected settings | Repository access, action permissions, retention and secret configuration |

## Rules for the public disclosure

- List only providers actually enabled in production.
- Link to each provider's current privacy notice and terms.
- Explain which categories of user data are sent and for what purpose.
- Distinguish Ozlind's role from the provider's independent processing.
- Do not promise zero retention, no training or a particular data region without current written evidence.
- Update this document whenever providers, models, routes or deployment vendors change.

## Official policy links to verify at publication

- Google: https://policies.google.com/privacy and https://cloud.google.com/terms
- Groq: https://groq.com/privacy-policy/ and https://groq.com/terms-of-use/
- Vercel: https://vercel.com/legal/privacy-policy
- GitHub: https://docs.github.com/site-policy/privacy-policies/github-privacy-statement

The legal operator should verify the correct product-specific contract and policy URLs before publishing.
