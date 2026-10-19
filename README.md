# websites

Farben's official web presence — everything we publish on the web lives in this monorepo:

- **docs** — the documentation hub for Farben's projects, starting with [uWebZockets](https://github.com/farbenbuilds/uWebZockets) and [ventiws](https://github.com/farbenbuilds/ventiws)
- **landing** — Farben's landing and branding page
- **shop** — merchandise e-commerce shop

Both apps have landed: `apps/uwz-docs` is the [uWebZockets](https://github.com/farbenbuilds/uWebZockets) documentation site, and `apps/vws-docs` prepares the [ventiws](https://github.com/farbenbuilds/ventiws) docs — both built with [Blume](https://useblume.dev) from the Markdown in their `docs/` folders.

## Stack

- [Vite+](https://viteplus.dev) (`vp`) — the unified toolchain: Vite, Rolldown, Vitest, [Oxlint](https://oxc.rs/docs/guide/usage/linter) for linting, [Oxfmt](https://oxc.rs/docs/guide/usage/formatter) for formatting, and task running
- [Lefthook](https://lefthook.dev) pre-commit hooks, Oxlint anti-slop rules, and a root Vitest suite
- Documentation sites use [Blume](https://useblume.dev) — Markdown in `docs/`, Astro-generated output, plus search, `llms.txt`, and an MCP server out of the box
- TypeScript everywhere; apps are expected to lean on Astro and Svelte
- pnpm workspaces (`apps/*`, `packages/*`, `tools/*`)

## Development

The flake provides the web toolchain — [Vite+](https://viteplus.dev) (`vp`), Node.js, and pnpm. `direnv` loads the glibc or musl shell automatically; otherwise run `nix develop` (or `nix develop .#musl`).

Install dependencies and run the full check suite:

```bash
pnpm install
pnpm ready   # lint, format, typecheck, size, Vitest, workspace tests, builds
```

Day-to-day commands, all through the project-local Vite+ CLI:

```bash
pnpm dev:uwz                              # start the uWebZockets docs dev server
pnpm dev:vws                              # start the ventiws docs dev server
pnpm lint                                 # Oxlint, anti-slop, project rules
pnpm lint:fix                             # apply safe lint fixes
pnpm format                               # format with .oxfmtrc.json
pnpm format:check                         # verify formatting
pnpm typecheck                            # type-check every workspace
pnpm test                                 # run the root Vitest suite
pnpm test:watch                           # run Vitest in watch mode
pnpm exec vp run uwz-docs#build           # build the uWebZockets docs site
pnpm exec vp run uwz-docs#doctor          # diagnose the uWebZockets docs project
pnpm exec vp run @farben/ui#check         # type-check the shared UI package
pnpm exec vp run -r test                  # run tests across the workspace
pnpm exec vp run -r build                 # build all workspace members
```

> The docs sites are Blume/Astro apps, so their dev servers start through their
> package scripts. `vp dev` is Vite+'s built-in Vite server and cannot start
> them; use `pnpm dev:uwz` / `pnpm dev:vws` (or `pnpm exec vp run dev:uwz`).

> On musl hosts, reach for the project-local CLI through `pnpm` (`pnpm exec vp …`).
> The global `vp` is glibc-based and its helper tools cannot load the
> musl-flavored native bindings that pnpm installs; the project-local CLI runs
> under the shell's Node.js and stays consistent with the installed packages.

## Shared UI

`packages/ui` (`@farben/ui`) holds the [shadcn-svelte](https://www.shadcn-svelte.com) components every app reuses. Components are consumed as source — there is no build step — so apps compile them with their own Svelte tooling:

```svelte
import { Button } from "@farben/ui/components/ui/button";
```

The package ships the shadcn design tokens in `src/lib/styles/theme.css` (`@farben/ui/theme.css`). A Tailwind host imports them from its entry stylesheet and scans the package for the classes its components use:

```css
@import "@farben/ui/theme.css";
@source "../../packages/ui/src";
```

Add components with the [shadcn-svelte CLI](https://www.shadcn-svelte.com/docs/cli) from inside the package; `components.json` maps the CLI's aliases onto the package's own export paths (that is also why the `exports` map has `.js`-suffixed entries — the CLI writes internal imports such as `@farben/ui/utils.js`):

```bash
cd packages/ui
pnpm dlx shadcn-svelte@latest add <component>
```

## Contributing

Read [CONTRIBUTING.md](.github/CONTRIBUTING.md), [CODING_CONVENTION.md](CODING_CONVENTION.md), and [TEAM_WORKFLOW.md](TEAM_WORKFLOW.md) before changing shared code or the build graph. Report security issues privately as described in [SECURITY.md](SECURITY.md).

The short version:

- No emojis in repository-authored files.
- Comments only for a non-obvious why.
- Functional TypeScript over OOP.
- Keep content, presentation, styling, domain logic, and tooling separate.
- Source files target 150 to 200 lines and never exceed 200.
- Semicolons, double quotes, and trailing commas are mandatory.
- Files are kebab-case, including Svelte and Astro files; component identifiers are PascalCase.
- Vitest tests live under category directories in `tests/` and import from `vite-plus/test`. See [tests/README.md](tests/README.md).
- `lefthook` runs the pre-commit gate. Run `pnpm ready` before opening a pull request.

## Agents and skills

The repository ships a shared agent team for OpenCode and Codex. The canonical roles live in [AGENTS.md](AGENTS.md) and [TEAM_WORKFLOW.md](TEAM_WORKFLOW.md); platform files are mirrored under `.opencode/agents/` and `.codex/agents/`.

Third-party skills are pinned by `skills-lock.json` and installed under `.agents/skills/`. Project-owned skills cover repository conventions, docs authoring, UI styling, verification, security review, and team orchestration. Update third-party skills with the `skills` CLI instead of editing their vendored files.

## Scaffolding

New applications and packages can be scaffolded inside the workspace with `vp create vite:application` / `vp create vite:library`; documentation sites start with `blume init` in their app folder.
