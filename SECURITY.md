# Security policy

## Reporting a vulnerability

Do not publish credentials, exploit details, or sensitive user data in public issues. Report suspected vulnerabilities privately through GitHub's repository security reporting flow when available. Include affected paths, impact, and reproducible steps while avoiding real user data.

## Credential handling

- Never commit provider keys, access tokens, passwords, or private certificates.
- Never expose secrets through browser-visible environment variables.
- If a credential is exposed, revoke and rotate it immediately at its provider.
- Do not include secrets in screenshots, logs, issues, or support messages.

## Scope

This policy covers the Ozlind repository and deployed application. Third-party provider vulnerabilities should be reported to the relevant provider.
