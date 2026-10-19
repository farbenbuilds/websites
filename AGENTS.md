# Farben Websites Agent Guide

## Project

Farben's official web presence: a pnpm monorepo for the documentation hub, the
landing and branding page, and the merchandise shop. Today the repository ships
two Blume documentation sites and a shared Svelte component package.

This is a documentation-first, static-web codebase. Treat content, presentation,
and tooling as separate products with separate owners.

## Documentation Map

| Document                                                     | Read it for                                                              |
| ------------------------------------------------------------ | ------------------------------------------------------------------------ |
| [CODEBASE.md](CODEBASE.md)                                   | Architecture, workspace layout, docs pipeline, ownership boundaries      |
| [CODING_CONVENTION.md](CODING_CONVENTION.md)                 | Non-negotiable coding rules, FP, separation of concerns, file-size limit |
| [TEAM_WORKFLOW.md](TEAM_WORKFLOW.md)                         | Architect, Developer, Reviewer, Integrator, specialist handoffs          |
| [CONTRIBUTING.md](.github/CONTRIBUTING.md)                   | Environment, commands, branch and PR process                             |
| [SECURITY.md](SECURITY.md)                                   | Reporting, supported versions, trust boundaries                          |
| [SKILL.md](SKILL.md)                                         | Project master skill and skill routing                                   |
| [.github/COMMIT_CONVENTION.md](.github/COMMIT_CONVENTION.md) | Commit message format                                                    |

## Non-Negotiable Rules

The full contract is [CODING_CONVENTION.md](CODING_CONVENTION.md). These are the
rules agents most often break:

- No emoji characters in repository-authored files. Not in source,
  documentation, commit messages, issue bodies, UI copy, test names, or logs.
  Vendored third-party skills under `.agents/skills` are upstream content and
  are exempt; do not edit them to satisfy this rule.
- Reduce comments to the minimum. Keep only a short "why" for a non-obvious
  constraint, workaround, or safety boundary. Never restate the code, never
  leave commented-out code, and never add `TODO`, `FIXME`, `XXX`, or `HACK`.
- Functional programming over object-oriented programming. No classes,
  prototypes, `this`, inheritance, or hidden mutable state. Data is plain,
  transformations are pure, and effects stay at the edges.
- Separation of concerns is mandatory. Content, presentation, styling, domain
  logic, integration, and tooling do not leak into each other.
- A source file targets 150 to 200 lines and must not exceed 200 lines. Split
  by responsibility into a named sibling module before the limit. Never create
  a `part-2` file.
- Svelte 5 runes only. No legacy reactive syntax, no `<style>` blocks. Use
  Tailwind utilities and `@farben/ui/theme.css` tokens.
- TypeScript strict. No `any`, no unchecked casts, no non-null assertions to
  silence a real uncertainty.
- Semicolons, double quotes, and trailing commas are mandatory. Oxfmt owns the
  formatting settings in `.oxfmtrc.json`.
- Files are kebab-case; Svelte components are PascalCase. Functions are
  camelCase, except exported HTTP method handlers such as `GET`.
- Vitest tests live in root `tests/` and import from `vite-plus/test`.
- Do not weaken lint rules, type checks, tests, builds, accessibility, or CI to
  make a change pass.
- Do not commit `dist/`, `.blume/`, `node_modules/`, local env files, or secrets.

## Commands

Use the project-local Vite+ CLI through pnpm on every host. The global `vp` is
for environment and scaffolding work and cannot load musl bindings on musl
hosts.

```sh
pnpm install
pnpm ready                              # lint, format, typecheck, size, tests, builds
pnpm lint                               # Oxlint, anti-slop, project rules
pnpm lint:fix                           # apply safe lint fixes
pnpm format                             # Oxfmt with .oxfmtrc.json
pnpm format:check                       # verify formatting without writing
pnpm typecheck                          # every workspace check task
pnpm test                               # root Vitest suite
pnpm test:watch                         # Vitest watch mode
pnpm check:size                         # enforce the 200-line source limit
pnpm exec vp run -r test                # every workspace test task
pnpm exec vp run -r build               # every workspace build
pnpm dev:uwz                            # uWebZockets docs dev server
pnpm dev:vws                            # ventiws docs dev server
pnpm exec vp run uwz-docs#check
pnpm exec vp run vws-docs#check
pnpm exec vp run uwz-docs#build
pnpm exec vp run vws-docs#build
pnpm exec vp run @farben/ui#check
```

Docs apps are Blume/Astro projects. Their dev servers start through their package
scripts, not `vp dev`. On musl hosts, `pnpm exec vp ...` is the supported path.

If setup, runtime, or package-manager behavior looks wrong, run
`pnpm exec vp env doctor` and include the output in the report.

Vite+ notes:

- `vp <name>` runs a built-in command. `vp run <name>` runs a `package.json`
  script or a `vite.config.ts` task. Check the project before assuming they
  match.
- `vp toolchain` shows the active tool graph; `vp why <package>` shows the
  dependency graph.
- Oxfmt does not format `.svelte` files yet. Oxlint checks their `<script>`
  blocks, and `svelte-check` covers their types.
- Formatting lives in `.oxfmtrc.json`; linting lives in `.oxlintrc.json`; the
  vendored anti-slop rules live in `tools/oxlint/anti-slop/`. Do not add another
  formatter or linter.
- `lefthook` installs through pnpm and runs the pre-commit gate. Do not bypass
  it with `--no-verify`.

## Repository Shape

- `apps/uwz-docs` documents uWebZockets. It uses Blume, Astro, Svelte islands,
  and `@farben/ui`.
- `apps/vws-docs` documents ventiws. It currently uses Blume only.
- `packages/ui` is `@farben/ui`, shared shadcn-svelte source components and
  design tokens. Add components with the shadcn-svelte CLI from inside the
  package.
- `tests` holds the root Vitest suite.
- `.agents/skills` holds installed third-party skills and project-owned skills.
- `.opencode/agents` and `.codex/agents` mirror the same agent team.
- `.oxlintrc.json`, `.oxfmtrc.json`, and `tools/oxlint/anti-slop` define lint
  and format enforcement.
- `lefthook.yml` defines the pre-commit gate.
- `.github` holds community, security, and pull-request templates plus the
  `ci`, `lint`, and `test` workflows.

## Skill Library

Load the narrowest skill that fits the phase. Do not load every skill because it
is available. Every role has a required routing row in
[TEAM_WORKFLOW.md](TEAM_WORKFLOW.md#8-skill-routing); load those skills before
planning, implementing, reviewing, or verifying. Third-party skills are pinned
by `skills-lock.json`; update them with the `skills` CLI instead of editing
vendored copies.

### Project Skills

| Skill                      | Use                                                                  |
| -------------------------- | -------------------------------------------------------------------- |
| `websites-conventions`     | Repository rules, file-size limit, FP, separation of concerns        |
| `agent-team-orchestration` | Phase routing, handoffs, parallel work, definition of done           |
| `docs-site-authoring`      | Blume and MDX content, navigation, search, docs verification         |
| `web-ui-styling`           | Design tokens, Tailwind, shadcn-svelte, responsive and accessible UI |
| `verification-and-release` | Local gates, CI parity, PR readiness, evidence format                |
| `web-security-review`      | Trust boundaries, secrets, injection, dependency risk                |

### Installed Skills

| Area       | Skills                                                                               |
| ---------- | ------------------------------------------------------------------------------------ |
| Process    | `find-skills`, `grill-me`, `ponytail`, `caveman`, `pragmatic-functional-programming` |
| Review     | `thermo-nuclear-code-quality-review`, `typescript-best-practices`                    |
| TypeScript | `typescript-advanced-types`, `install-anti-slop`                                     |
| Svelte     | `svelte-core-bestpractices`, `svelte5-best-practices`, `shadcn-svelte`               |
| Styling    | `tailwind-design-system`, `ui-ux-pro-max`, `impeccable`, `gsap-core`                 |
| Docs       | `technical-documentation`, `blume`, `astro`, `context7`                              |
| Build      | `vite`, `vitest`, `chrome-devtools`, `nix-best-practices`                            |

## Agent Team

The canonical workflow is [TEAM_WORKFLOW.md](TEAM_WORKFLOW.md). OpenCode and
Codex expose the same roles.

Core roles:

1. `architect` is read-only. It states assumptions, scope, ownership, slice
   order, and verifiable acceptance criteria.
2. `developer` implements one assigned slice and reports changed files,
   commands, outcomes, and blockers.
3. `reviewer` is read-only. It reports actionable findings by severity with file
   and line references and a concrete failure scenario.
4. `integrator` checks the combined diff, acceptance criteria, and evidence, then
   prepares the delivery summary.

Specialists:

- `docs-writer` owns technical documentation accuracy, structure, and style.
- `ui-stylist` owns visual hierarchy, layout, typography, color, responsive
  behavior, and accessibility.
- `astro-blume` owns Astro and Blume integration, content loading, navigation,
  search, and generated output.
- `svelte-engineer` owns Svelte 5 components and islands.
- `verification` owns lint, type check, tests, builds, and regression evidence.
- `security-reviewer` owns trust boundaries, secrets, injection, and dependency
  risk.

The root agent assigns specialists. A subagent does not silently change another
specialist's surface. Read the owning module and the relevant skill before
editing. Keep edits to shared files serialized; parallelize only independent
slices.

## Workflow Summary

1. Architect plans and assigns. No edits.
2. Developer implements the slice. New concerns return to the Architect.
3. Reviewer verifies independently. Findings return to the Developer.
4. Integrator checks the combined result and reports delivery evidence.

No phase advances while its required artifact is missing. Report exact commands
and actual outcomes. Never claim an unrun check passed.

## Delivery

- Branch names use `docs/`, `feat/`, `fix/`, `refactor/`, `test/`, `ci/`, or
  `chore/` followed by a short kebab-case description.
- Commits follow [.github/COMMIT_CONVENTION.md](.github/COMMIT_CONVENTION.md):
  `type(scope): subject`, imperative, no trailing period.
- A pull request states the changed behavior, the verification commands, and any
  remaining risk. Assign the requested maintainer and use the repository labels.
- Do not commit, push, or open a pull request unless the root agent has user
  authorization for that action.

## graphify

When `graphify-out/graph.json` exists, use the graphify skill before broad
codebase exploration. Query the graph for architecture and relationship
questions, and confirm behavior in source. Do not regenerate the graph as a
side effect of a scoped code change.
