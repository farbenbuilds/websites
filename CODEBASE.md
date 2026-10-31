# Farben Websites Codebase

## Scope

This repository is Farben's public web presence. It currently ships two
documentation sites and a shared Svelte component package. The marketing and
branding site and the merchandise shop are not initialized; their frameworks are
undecided, and they may not use Blume, Astro, or Svelte. Each future app gets its
own workspace member, framework, build configuration, and security review.

- `apps/uwz-docs` documents uWebZockets.
- `apps/vws-docs` documents ventiws.
- `packages/ui` publishes `@farben/ui`, the shared shadcn-svelte source
  components and design tokens.
- `apps/*` and `packages/*` are pnpm workspace members. `tools/*` is reserved
  for shared workspace tooling.

The repository is documentation-first. There is no application server, database,
authentication boundary, or payment flow yet. When those surfaces arrive, they
get their own app and their own security review rather than growing inside a
docs site.

## Toolchain

Vite+ (`vp`) is the unified toolchain: Vite, Rolldown, Vitest, Oxlint, Oxfmt,
and the task runner. Node.js 22.22.3 or newer and pnpm 12.4.2 are specified by
`package.json`, the Nix flake, and the CI workflows.

Use the project-local CLI through pnpm on every host:

```sh
pnpm lint
pnpm format:check
pnpm typecheck
pnpm test
pnpm exec vp run -r build
```

The global `vp` binary is intended for environment and scaffolding work. On
musl hosts it cannot load the musl native bindings that pnpm installs, so
project commands always go through `pnpm exec vp`.

The Nix flake provides the web toolchain for `x86_64-linux`, `aarch64-linux`,
and `aarch64-darwin`. It exposes a glibc shell and a musl shell; `.envrc`
selects the matching shell. `pnpm-workspace.yaml` installs both libc variants
of native packages so a checkout remains usable after a shell switch. Oxfmt
formats `.astro` and `.svelte` files through its `astro` and `svelte` options,
which resolve `@astrojs/compiler-rs` and `svelte` from the root dev
dependencies.

## Layout

```text
websites/
├── apps/
│   ├── uwz-docs/                 # uWebZockets documentation
│   │   ├── docs/                # English Markdown and MDX source
│   │   ├── docs/vi/             # Vietnamese translations
│   │   ├── components/          # landing, index-cards, support, benchmark, colophon
│   │   ├── components.ts        # MDX component and island registration
│   │   ├── blume.config.ts      # site title, theme, i18n, GitHub edit links
│   │   └── theme.css            # host Tailwind entry and tokens
│   └── vws-docs/                 # ventiws documentation
│       ├── components/           # landing and index-cards Astro components
│       ├── components.ts         # MDX component registration
│       ├── docs/                 # English Markdown and MDX source
│       ├── docs/vi/              # Vietnamese translations
│       └── blume.config.ts       # site title, theme, i18n, GitHub edit links
├── packages/
│   └── ui/                       # @farben/ui source components
│       ├── src/lib/components/   # shadcn-svelte components
│       ├── src/lib/styles/       # shared theme tokens
│       └── components.json       # shadcn CLI aliases
├── tests/                        # root Vitest suites grouped by category
├── tools/oxlint/anti-slop/       # vendored anti-slop Oxlint plugin
├── LICENSES/                     # third-party license texts
├── THIRD_PARTY_NOTICES.md        # vendored content provenance
├── .agents/skills/               # installed, project-owned, and tool skills
│   └── graphify-codex/           # generated Codex graphify skill
├── .opencode/                    # OpenCode agents, skills, and project config
│   ├── agents/
│   └── skills/graphify/          # generated OpenCode graphify skill
├── .codex/                       # Codex agents and config
├── .github/                      # community templates and workflows
├── .oxfmtrc.json                 # Oxfmt settings and ignores
├── .oxlintrc.json                # Oxlint rules, plugins, and overrides
├── lefthook.yml                  # pre-commit hook definition
├── vitest.config.ts              # root Vitest configuration
├── AGENTS.md                     # root agent instructions
├── CODING_CONVENTION.md          # engineering contract
├── TEAM_WORKFLOW.md              # architect/developer/reviewer/integrator flow
├── CODEBASE.md                   # this document
└── SKILL.md                      # project master skill
```

## Documentation pipeline

Each docs app is a Blume project. Blume reads `blume.config.ts`, loads Markdown
and MDX from `docs/`, and generates an Astro site with navigation, search,
`llms.txt`, `llms-full.txt`, an OpenAPI surface, and agent-readable output.

The runtime flow is:

```text
docs/*.mdx
    |
    v
Blume config and content loader
    |
    v
Astro route generation and MDX rendering
    |
    +--> static HTML, JSON, Markdown, llms.txt
    +--> search index
    +--> Svelte island hydration
```

`apps/uwz-docs` uses the full stack: Blume, Astro, Svelte, `@farben/ui`, and
client-only hero chrome. `apps/vws-docs` uses Blume with local Astro landing
components. Each `index.mdx` lists its page sections explicitly; the section
components live under `components/landing/`, `components/index-cards/`, and the
other named section folders. Both apps run the same package scripts: `dev`,
`build`, `preview`, `check`, `test`, and `doctor`.

Both sites publish English at the root and Vietnamese under `/vi`. English
content lives at the root of `docs/`, and Vietnamese translations live in
`docs/vi/` with matching page paths. Blume owns the language switcher, fallback
routing, translated UI strings, locale-aware search, `llms.txt`, and the JSON
API. Keep translated headings pinned to their English anchor ids so fragment
links resolve in both languages.

Documentation source is the product. Do not edit generated output under
`dist/` or generated Blume state under `.blume/`; those directories are
ignored by Git and recreated by the build.

## Shared UI

`packages/ui` is consumed as source. There is no package build step. Apps import
components directly through the `exports` map and import the token stylesheet
from their Tailwind entry:

```css
@import "@farben/ui/theme.css";
@source "../../packages/ui/src";
```

Components use Svelte 5 runes, Tailwind utilities, `tailwind-variants`, and the
shadcn-svelte primitives. The package deliberately exports `.js`-suffixed
aliases because the shadcn CLI writes internal imports such as
`@farben/ui/utils.js`.

Add a component only when no existing primitive fits. Install from inside the
package with the pinned local CLI; never re-add or update an existing component:

```sh
cd packages/ui
pnpm exec shadcn-svelte add <component>
```

A standard registry primitive may be installed when no existing primitive fits,
even if one app uses it first. A custom shared component is justified only when
at least two apps use it. App-specific composition stays in the app.

## Ownership boundaries

| Boundary                      | Owner             | Rule                                                  |
| ----------------------------- | ----------------- | ----------------------------------------------------- |
| Documentation prose           | docs-writer       | Accurate, task-led, no unverified claims              |
| Visual design                 | ui-stylist        | Tokens, hierarchy, responsive behavior, accessibility |
| Blume and Astro integration   | astro-blume       | Config, content loading, build output                 |
| Svelte components and islands | svelte-engineer   | Runes, props, local interaction                       |
| Verification                  | verification      | Exact commands, regression evidence                   |
| Security and privacy          | security-reviewer | Threat model, secrets, dependency risk                |
| Cross-cutting change          | architect         | Scope, ownership, acceptance criteria                 |
| Delivery                      | integrator        | Coherent diff, reported checks, handoff               |

Specialists do not silently cross boundaries. A docs change that needs a new
island hands the island contract to `svelte-engineer`; a styling change that
needs different content hands the copy contract to `docs-writer`.

## Quality gates

`pnpm ready` is the single local gate CI mirrors:

```sh
pnpm lint
pnpm format:check
pnpm typecheck
pnpm check:size
pnpm test
vp run -r test
vp run -r build
```

`pnpm lint` runs Oxlint with `.oxlintrc.json`, the vendored anti-slop plugin,
project rules, and type-aware checks. The config also loads `eslint-plugin-svelte`
and a local adapter for `eslint-plugin-astro` under `tools/oxlint/astro-plugin/`.
Oxlint has no custom parser support, so Svelte template rules and Astro
template rules are not available; the adapter enables the Astro frontmatter
rules, and the Svelte rules apply to the extracted `<script>` block. `pnpm
format:check` runs Oxfmt with `.oxfmtrc.json`. `pnpm typecheck` runs every
workspace `check` task, including `svelte-check` and `blume check`. `pnpm test`
runs the root Vitest suite.
Workspace `test` tasks run `blume validate`; workspace `build` tasks run
`blume build`.

`lefthook` runs lint, format, size, typecheck, and tests on pre-commit. The
GitHub workflows split the same gate into `lint.yml`, `test.yml`, and `ci.yml`.
Path filters limit each workflow to the files it can affect, and the jobs report
through the `Lint`, `Test`, and `Build` environments.

The full gate is intentionally short. A change that needs a protocol compliance
suite, browser matrix, or load test adds a targeted workflow for that surface
instead of inflating the default command.

## Security posture

The current public surface is static documentation and source components. The
relevant risks are supply-chain compromise, injected HTML in MDX, unsafe links,
secret leakage in examples, and dependency vulnerabilities. There is no
server-side user data today.

When checkout, accounts, or analytics are added, the change must document the
new trust boundary in `SECURITY.md`, add server-side validation, and receive a
security review before launch. Client-side checks are not a security boundary.

## Repository hygiene

- Do not commit `node_modules`, `dist`, `.blume`, `.direnv`, `graphify-out/`, or
  local env files.
- Do not add a second package manager, formatter, linter, or test runner.
- Do not add a dependency for a behavior the platform or an existing package
  already provides.
- Do not edit third-party skills under `.agents/skills`; update them through
  `skills-lock.json` and the `skills` CLI. The tool-managed graphify copies are
  the exception and follow [CONTRIBUTING.md](.github/CONTRIBUTING.md#optional-knowledge-graph).
- Project-owned skills, agents, and commands live beside the installed skills
  but are maintained in this repository.
