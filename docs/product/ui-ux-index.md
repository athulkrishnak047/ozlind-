# Ozlind UI/UX documentation

**Status:** Product direction and design contracts  
**Scope:** Current web application and future UI surfaces  
**Priority:** UI/UX first; no backend expansion in this phase

This directory is the source of truth for Ozlind's user experience. The existing [product blueprint](./ozlind-product-blueprint.md), [design system](./design-system.md), [chat experience](./chat-experience.md), and [competitive benchmark](./ui-benchmark.md) remain foundational. The following specifications make those decisions implementable.

## Required reading order

1. [Product blueprint](./ozlind-product-blueprint.md) — product promise, current capabilities, screen direction.
2. [Design system](./design-system.md) — visual language, tokens, typography and responsive principles.
3. [Information architecture](./information-architecture.md) — navigation, routes and feature visibility.
4. [Screen specifications](./screen-specifications.md) — layout and state requirements for every screen.
5. [Interaction specifications](./interaction-specifications.md) — control behavior and state transitions.
6. [Component catalog](./component-catalog.md) — reusable component contracts.
7. [Responsive behavior](./responsive-behavior.md) — desktop, tablet and mobile rules.
8. [Accessibility](./accessibility-specification.md) — keyboard, screen reader, contrast and motion requirements.
9. [Content and microcopy](./content-and-microcopy.md) — naming, labels, errors and tone.
10. [Performance and low-data UX](./performance-and-low-data.md) — network, rendering and mobile-data budgets.
11. [Frontend architecture](../engineering/frontend-architecture.md) — code ownership and implementation conventions.

## Current phase

Only improve and complete the existing public landing page, workspace, chat experience, research affordances, file-analysis affordances, settings and command palette. Do not add navigation links that imply Projects, Artifacts, Tasks, Integrations, accounts or real-time voice are operational. Those remain planned until implemented and tested.

## Implementation sequence

- A. Audit existing components against these documents.
- B. Fix global design tokens, typography, spacing, focus and surface consistency.
- C. Refine navigation, mobile drawer and command palette.
- D. Refine composer, attachments, message rendering and conversation actions.
- E. Refine landing, settings and research presentation.
- F. Add empty/loading/error/disabled/success states.
- G. Run responsive, keyboard, accessibility and low-bandwidth checks.
- H. Only then consider future screen prototypes; keep prototypes clearly marked as previews.

## Definition of UI completion

A screen is complete only when its primary task is obvious, all visible controls work, every relevant state is designed, mobile layout is usable, keyboard and assistive technology behavior is defined, reduced motion is respected, and it meets the low-data performance budget. A screenshot alone is not acceptance evidence.
