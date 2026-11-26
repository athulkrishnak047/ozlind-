# Engineering definition of done

A foundation or feature is complete only when all applicable checks pass:

- [ ] Architecture and trade-offs are documented.
- [ ] Scope and non-goals are explicit.
- [ ] Types and input/output contracts are defined.
- [ ] Secrets and personal data have clear handling rules.
- [ ] Failure modes and abuse cases are considered.
- [ ] Unit and contract tests cover critical behavior.
- [ ] Lint and strict typecheck pass.
- [ ] Production build succeeds.
- [ ] Preview deployment is verified.
- [ ] Accessibility and responsive behavior are checked for UI changes.
- [ ] Logs and metrics do not expose secrets or private content.
- [ ] Rollback and operational ownership are documented.
- [ ] No unrelated feature work is bundled into the change.

A green deployment alone is not proof that a feature is correct or secure.
