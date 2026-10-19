---
name: Agent Team Orchestration
description: Run the Architect, Developer, Reviewer, and Integrator pipeline with specialist handoffs, parallelization rules, and evidence-based completion for OpenCode and Codex.
---

# Agent Team Orchestration

Use this skill when a task needs more than one role or when the root agent is
coordinating subagents. The canonical contract is
[TEAM_WORKFLOW.md](../../../TEAM_WORKFLOW.md).

## Team

Core roles:

- `architect`: read-only planning, scope, ownership, acceptance criteria.
- `developer`: implementation of one scoped slice.
- `reviewer`: independent read-only review.
- `integrator`: combined diff, evidence, delivery summary.

Specialists:

- `docs-writer`: technical documentation.
- `ui-stylist`: visual design, responsive behavior, accessibility.
- `astro-blume`: Astro and Blume integration.
- `svelte-engineer`: Svelte 5 components and islands.
- `verification`: lint, type check, tests, builds, CI parity.
- `security-reviewer`: trust boundaries, secrets, injection, dependencies.

## Orchestration Loop

```text
request
  |
  v
architect plan ---- conflicts? ---- root resolves with user
  |
  v
developer slice <---- specialist guidance
  |
  v
reviewer verdict ---- changes requested ---- developer revises
  |
  v
integrator check
  |
  v
root final report
```

Do not skip a phase. Do not run the reviewer and developer on the same slice at
the same time. Do not let the integrator rewrite reviewed code without a new
review.

## Handoff: Architect to Developer

The Architect returns:

```text
Goal:
Assumptions:
Scope:
Non-goals:
Affected boundaries:
Specialists:
Slices:
Acceptance criteria:
Checks:
Risks:
```

The Developer accepts one slice and returns:

```text
Slice:
Files changed:
Behavior:
Tests or docs:
Commands and outcomes:
Deviations:
Blockers:
```

## Handoff: Developer to Reviewer

The Reviewer receives the final diff, the Architect criteria, and the Developer
report. It returns:

```text
Verdict:
Findings:
- severity, file:line, failure scenario, requested change
Verification gaps:
```

The Reviewer checks correctness, ownership, file size, security, accessibility,
evidence, documentation, and scope, in that order.

## Handoff: Reviewer to Integrator

The Integrator receives all prior artifacts and returns:

```text
Acceptance criteria:
- criterion, status, evidence
Findings closed:
Verification:
Remaining risk:
Follow-ups:
Delivery actions:
```

Delivery actions are commit, push, and pull request. They happen only with user
authorization.

## Routing Table

| Change | Core role | Specialists |
| --- | --- | --- |
| MDX page or guide | Developer | docs-writer, astro-blume |
| Visual redesign | Developer | ui-stylist, svelte-engineer |
| Shared component | Developer | svelte-engineer, ui-stylist |
| Blume pipeline | Developer | astro-blume, docs-writer |
| Agent or skill files | Developer | docs-writer, verification |
| Dependency update | Developer | verification, security-reviewer |
| Security-sensitive surface | Architect | security-reviewer, verification |

## Parallelism

- Parallelize read-only exploration and independent specialist reviews.
- Serialize edits to the same file, lockfile, generated output, or shared token.
- Parallelize app slices only when they do not share imports or generated files.
- Start the reviewer after the developer reports completion.
- Start the integrator after the reviewer verdict.

## Escalation

Return to the root agent when requirements conflict, a new dependency or trust
boundary appears, a file would exceed 200 lines, a check fails outside the
slice, or two agents disagree on ownership. The root agent resolves with the
user when scope, risk, cost, or public behavior changes.

## Root Final Report

Keep it short:

1. What changed.
2. Which checks ran and their outcomes.
3. What remains or was intentionally deferred.
4. Which delivery actions were taken.

Never claim an unrun check passed.
