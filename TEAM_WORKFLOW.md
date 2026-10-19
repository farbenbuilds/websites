# Agent Team Workflow

This document defines how the Architect, Developer, Reviewer, and Integrator
work together, and how specialist agents attach to each phase. The same workflow
applies to OpenCode and Codex. Platform-specific agent files only translate the
role contract into that platform's format.

The root agent owns orchestration, user communication, and the final result. A
phase is complete only when its required artifact exists. No agent may claim a
check that was not run, skip a gate to land a change, or silently resolve a
contradiction between project rules.

## 1. Role Map

| Core role  | Mode         | Owns                                                                                     | Must not                                                                           |
| ---------- | ------------ | ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Architect  | Read-only    | Scope, assumptions, ownership boundaries, dependencies, acceptance criteria, slice order | Edit files or choose between conflicting requirements                              |
| Developer  | Write        | The assigned slice, tests, documentation for changed behavior, command evidence          | Expand scope or weaken a gate                                                      |
| Reviewer   | Read-only    | Independent correctness, security, accessibility, convention, and evidence review        | Edit files or turn preference into a defect                                        |
| Integrator | Coordinating | Combined diff, ownership overlap, gate evidence, delivery summary, remaining risk        | Hide a finding, rewrite reviewed code without re-review, or commit without request |

Specialist agents attach to a phase. They are not a second chain of command:
the Architect assigns them during planning, the Developer consults them during
implementation, the Reviewer invokes them for independent checks, and the
Integrator confirms their findings are closed.

| Specialist          | Works with                                 | Focus                                                                           |
| ------------------- | ------------------------------------------ | ------------------------------------------------------------------------------- |
| `docs-writer`       | Architect, Developer, Reviewer             | Technical documentation, README, guides, API docs, changelog, docs accuracy     |
| `ui-stylist`        | Architect, Developer, Reviewer             | Visual hierarchy, layout, typography, color, responsive behavior, accessibility |
| `astro-blume`       | Architect, Developer, Integrator           | Astro and Blume config, content loading, navigation, search, build output       |
| `svelte-engineer`   | Developer, Reviewer                        | Svelte 5 components and islands, props, local state, events, a11y markup        |
| `verification`      | Architect, Developer, Reviewer, Integrator | Lint, type check, tests, builds, regression evidence, CI parity                 |
| `security-reviewer` | Architect, Reviewer, Integrator            | Trust boundaries, secrets, injection, dependency and supply-chain risk          |

## 2. Phase Contract

### Phase 1: Architect

Input: user request, repository instructions, current diff, relevant source and
documentation.

Output:

1. Restated goal in observable terms.
2. Assumptions and unresolved questions.
3. Scope and explicit non-goals.
4. Affected boundaries and specialist assignments.
5. Ordered slices that can each be verified independently.
6. Acceptance criteria and the exact checks that prove them.
7. Risks and rollback considerations.

The Architect does not edit. If requirements conflict, it returns the conflict
to the root agent instead of inventing a resolution.

### Phase 2: Developer

Input: Architect plan, accepted assumptions, assigned slice, applicable skills.

Output:

1. Files changed, grouped by responsibility.
2. Behavior implemented and tests or documentation added.
3. Exact commands run with real outcomes.
4. Deviations from the plan and why.
5. Remaining risks, blockers, or follow-up slices.

The Developer reads the owning module before editing, keeps changes inside the
assigned slice, and stops when a new concern appears. A new concern returns to
the Architect for a plan update rather than becoming an unplanned edit.

### Phase 3: Reviewer

Input: final diff, Developer report, Architect acceptance criteria.

Output:

1. Findings ordered by severity, with file and line references.
2. A concrete failure scenario for each finding.
3. Verification gaps and commands that still need to run.
4. A clear verdict: approve, approve with follow-ups, or request changes.

The Reviewer checks in this order: correctness, ownership and separation,
file-size limit, security and accessibility, test and build evidence,
documentation accuracy, and scope. Changed work after a request-changes verdict
receives another review.

### Phase 4: Integrator

Input: Architect plan, Developer report, Reviewer findings, specialist reports.

Output:

1. Coherent final diff and ownership check.
2. Confirmation that every acceptance criterion is met or explicitly deferred.
3. Exact verification evidence, including failures.
4. Delivery summary, remaining risk, and follow-up list.
5. Commit, push, and pull-request actions only when the root agent has user
   authorization.

The Integrator routes unresolved findings back to the Developer. It does not
suppress a finding, reclassify a failure, or weaken a check to close the phase.

## 3. Routing by Change Type

| Change                                  | Primary core role | Required specialists            | Minimum evidence                                        |
| --------------------------------------- | ----------------- | ------------------------------- | ------------------------------------------------------- |
| Documentation page or guide             | Developer         | docs-writer, astro-blume        | `vp run <app>#check`, `vp run <app>#build`, link review |
| Visual redesign or component styling    | Developer         | ui-stylist, svelte-engineer     | Both docs builds, keyboard and responsive review        |
| New shared Svelte component             | Developer         | svelte-engineer, ui-stylist     | `@farben/ui#check`, consuming app build                 |
| Blume configuration or content pipeline | Developer         | astro-blume, docs-writer        | Docs check, build, generated `llms.txt` review          |
| Agent, skill, or template change        | Developer         | docs-writer, verification       | JSON/TOML parse, command contract review                |
| Dependency or toolchain update          | Developer         | verification, security-reviewer | `pnpm ready`, lockfile review, advisory check           |
| Security-sensitive surface              | Architect         | security-reviewer, verification | Threat model, validation tests, explicit review         |

## 4. Parallelism

- Read-only exploration and specialist reviews may run in parallel.
- Edits to the same file are serialized.
- Independent slices in different apps may run in parallel when they do not
  share generated files, lockfiles, or theme tokens.
- The Reviewer never runs in parallel with the Developer on the same slice.
- The Integrator runs after the Reviewer verdict, not before.

## 5. Quality Gate

The default gate is `pnpm ready`. Targeted gates are additive:

```sh
pnpm lint
pnpm format:check
pnpm typecheck
pnpm check:size
pnpm test
pnpm exec vp run -r test
pnpm exec vp run -r build
pnpm exec vp run uwz-docs#check
pnpm exec vp run vws-docs#check
pnpm exec vp run @farben/ui#check
```

A report states the command, the working directory when it is not the root, the
result, and any command that could not run. "Should pass" is not evidence.

## 6. Definition of Done

A change is done when:

- The Architect's acceptance criteria are met.
- The diff respects separation of concerns and the file-size limit.
- No emoji, dead code, commented-out code, or unexplained `TODO` was added.
- Comments explain only non-obvious constraints.
- Functional style is preserved; no class or hidden mutable state was added.
- Documentation and templates match the actual commands and behavior.
- The required checks ran and passed, or a failure is reported with its cause.
- The Reviewer has no unresolved blocking finding.
- The Integrator has a coherent summary and the user has received the result.

## 7. Escalation

Escalate to the root agent when:

- Two project documents disagree.
- A change needs a new dependency, a new trust boundary, or a new public API.
- A source file would exceed 200 lines after the assigned change.
- A check fails for reasons outside the slice.
- A specialist and a core role disagree on ownership.

The root agent resolves with the user when the decision changes scope, risk,
cost, or public behavior.

## 8. Skill Routing

Skills live in `.agents/skills/<id>/SKILL.md`. OpenCode loads them with the
`skill` tool by ID. Codex reads the named `SKILL.md` before acting. Load the
narrowest set that fits the phase; do not load the whole library. If a listed
skill is missing, report the drift instead of guessing.

| Role                | Load first                                                                                                                      | Add for the task                                                                                                 |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `architect`         | `agent-team-orchestration`, `websites-conventions`, `grill-me`, `ponytail`                                                      | `pragmatic-functional-programming`, `thermo-nuclear-code-quality-review`, domain skills for the affected surface |
| `developer`         | `websites-conventions`, `agent-team-orchestration`, `pragmatic-functional-programming`, `ponytail`, `typescript-best-practices` | `typescript-advanced-types`, `install-anti-slop`, `vite`, `vitest`, domain skills for the slice                  |
| `reviewer`          | `websites-conventions`, `thermo-nuclear-code-quality-review`, `verification-and-release`                                        | `web-security-review`, `ui-ux-pro-max`, `impeccable`, `svelte5-best-practices`                                   |
| `integrator`        | `agent-team-orchestration`, `verification-and-release`, `technical-documentation`                                               | `ponytail`, `docs-site-authoring`, `web-security-review`                                                         |
| `docs-writer`       | `technical-documentation`, `docs-site-authoring`, `blume`, `astro`                                                              | `context7`, `websites-conventions`, `impeccable` for reader-facing structure                                     |
| `ui-stylist`        | `web-ui-styling`, `ui-ux-pro-max`, `impeccable`, `tailwind-design-system`, `shadcn-svelte`                                      | `gsap-core`, `chrome-devtools`, `svelte5-best-practices`                                                         |
| `astro-blume`       | `astro`, `blume`, `docs-site-authoring`, `vite`                                                                                 | `technical-documentation`, `context7`, `nix-best-practices`                                                      |
| `svelte-engineer`   | `svelte-core-bestpractices`, `svelte5-best-practices`, `shadcn-svelte`, `typescript-best-practices`                             | `typescript-advanced-types`, `web-ui-styling`, `vitest`                                                          |
| `verification`      | `verification-and-release`, `vitest`, `vite`, `thermo-nuclear-code-quality-review`                                              | `install-anti-slop`, `typescript-best-practices`, `nix-best-practices`                                           |
| `security-reviewer` | `web-security-review`, `context7`, `find-skills`                                                                                | `technical-documentation`, `verification-and-release`                                                            |

`caveman` is opt-in only when the user asks for terse output. `find-skills` is
for discovering a missing capability, not for loading a skill that is already
listed here. `context7` is for current library documentation, not for project
rules.
