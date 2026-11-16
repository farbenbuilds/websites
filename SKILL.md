---
name: farben-websites
description: Master workflow for Farben's websites monorepo. Covers Blume documentation, Astro, Svelte 5, Tailwind, shared shadcn-svelte components, Vite+, Nix, and the agent team.
---

# Farben Websites

Master project skill for the `websites` monorepo.

## When to Use

Load this skill before a task that spans more than one app or package, or when
you need the project map, commands, and ownership boundaries. Load a narrower
project skill for a single surface:

- `websites-conventions` for the engineering contract.
- `agent-team-orchestration` for multi-agent planning and handoffs.
- `docs-site-authoring` for Blume and MDX work.
- `web-ui-styling` for design, Tailwind, and shadcn-svelte work.
- `verification-and-release` for gates and pull-request readiness.
- `web-security-review` for security-sensitive changes.

## Project Overview

- `apps/uwz-docs`: uWebZockets documentation. Blume, Astro, Svelte islands,
  `@farben/ui`.
- `apps/vws-docs`: ventiws documentation. Blume.
- `apps/` currently contains only those two documentation apps. The marketing
  and branding site and the merchandise shop are not initialized; their
  frameworks are undecided and may not use Blume or Svelte.
- `packages/ui`: `@farben/ui`, shared shadcn-svelte source components and theme
  tokens. A future app on another framework can share tokens, not the Svelte
  components.
- Toolchain: Vite+ through pnpm, Node.js 22.22.3 or newer, pnpm 12.4.2, Nix flake
  with glibc and musl shells.

## Commands

```sh
pnpm install
pnpm ready
pnpm lint
pnpm lint:fix
pnpm format
pnpm format:check
pnpm typecheck
pnpm i18n:check
pnpm test
pnpm test:watch
pnpm test:all
pnpm check:size
pnpm check:unused
pnpm check:css
pnpm build
pnpm dev:uwz
pnpm dev:vws
pnpm check:uwz
pnpm check:vws
pnpm check:ui
pnpm validate:docs
pnpm audit:uwz
```

Use these pnpm scripts on every host. They resolve the project-local Vite+ CLI;
the global `vp` cannot load musl native bindings on musl systems.

## Engineering Contract

- No emojis in repository-authored files. Vendored third-party skills are
  upstream content and are exempt.
- Comments only for a non-obvious why. No commented-out code, `TODO`, `FIXME`,
  `XXX`, or `HACK`.
- Functional programming over OOP. No classes, prototypes, `this`, or
  inheritance.
- Separation of concerns: content, presentation, styling, domain, integration,
  and tooling stay in their layer.
- Source files target 150 to 400 lines and never exceed 400. Split by
  responsibility into a named sibling module.
- For Svelte and Astro code in the current docs apps: Svelte 5 runes only, no
  `<style>` blocks, Tailwind utilities, and shared tokens. A future app on
  another framework follows its own conventions.
- Blume app CSS is Tailwind-first: `@apply` for declarations, `@theme inline`
  for tokens, `@utility` for repeated custom patterns, and `@source` for
  workspace packages. Raw declarations stay limited to token blocks,
  `@keyframes`, `@font-face`, `@property`, and data-driven custom properties.
  Author color literals as `oklch()`; `pnpm check:css` rejects hex colors in app
  and package CSS.
- x18n owns component UI copy only. Documentation content stays in mirrored
  `docs/` and `docs/vi/` MDX pages. Never add MDX files, page prose,
  frontmatter, or docs routes to locale JSON or x18n resources.
- TypeScript strict. No `any` and no unchecked casts.
- Semicolons, double quotes, and trailing commas are mandatory.
- Files are kebab-case, including Svelte and Astro files; component identifiers are PascalCase. Repository-authored TypeScript functions are camelCase. Zig samples follow the upstream µWebZockets API style: snake_case functions and variables, PascalCase types, exact public spelling.
- Vitest tests live under category directories in `tests/` and import from `vite-plus/test`. See [tests/README.md](tests/README.md).
- `lefthook` runs the pre-commit gate. Do not bypass it.
- Do not weaken a lint, test, build, accessibility, or CI gate.
- µWebZockets documentation has two surfaces. Application pages start from
  `zig fetch --save` and the reader's own `build.zig`; contributor pages under
  `/docs/operations` say they target the framework repository, link
  `CONTRIBUTE.md`, and keep maintainer commands out of application pages. WASM,
  eBPF, kTLS, and AF_XDP are application pages and show consumer build wiring.
  See `uWZ-TODO.md` section 8.12.

The full document is [CODING_CONVENTION.md](CODING_CONVENTION.md).

## Documentation Workflow

1. Place content in `apps/<app>/docs/<page>.mdx`.
2. Add the Vietnamese counterpart at `apps/<app>/docs/vi/<page>.mdx`. Do not add
   documentation pages to x18n.
3. Add `title` and `description` frontmatter.
4. Lead with the task, then explanation, then reference detail.
5. Use root-relative internal links and descriptive external link text.
6. Declare a language on every code fence.
7. Verify with the app's `check` and `build` tasks.
8. Inspect generated `llms.txt` when navigation or page purpose changes.

Blume owns routing, search, and generated output. Do not hand-roll those.

## UI Workflow

These steps cover the current docs apps. A future app on another framework
follows its own framework conventions with the same accessibility and evidence
requirements.

1. Search `modern-web-guidance` before choosing a platform pattern, then start
   from the existing token palette in `packages/ui/src/lib/styles/theme.css`.
   Author any new color literal as `oklch()`.
2. Compose with Tailwind utilities and existing shadcn-svelte primitives. Check
   `packages/ui/src/lib/components/ui` before installing one.
3. Write Blume app CSS with `@apply`, `@theme inline`, `@utility`, and
   `@source`; run `pnpm check:css` after the change.
4. Add a registry primitive when no existing primitive fits. Add a custom shared
   component only when at least two apps use it. Install from inside `packages/ui`
   with the local CLI, and never re-add or update an existing component.
5. Keep interaction inside a Svelte island; keep static content in MDX or Astro.
6. Keep component UI copy in `locales/{locale}.json` and run `pnpm i18n:check`;
   keep documentation prose in MDX.
7. Add labels, focus states, keyboard behavior, and reduced-motion handling.
8. Verify the shared package type check and every consuming app build.

## Refactor Workflow

For a behavior-preserving refactor, load `untangle-codebase` and keep a decision
log of hidden links, needless links, surplus, and special cases. Refactor in
reversible slices, add behavior-level tests for extracted contracts, and run
`pnpm ready`. Do not remove tests or restyle comments unless the user opts in.

## Dead Code Workflow

Load `knip` before removing unused files, exports, or dependencies.

1. Run `pnpm check:unused` and read configuration hints before findings.
2. Fix the configuration first: add entry points for Blume content, metadata,
   and component registries, and declare the Astro and Svelte dependencies so
   Knip registers their compilers.
3. Remove unused files first, then dependencies, then exports and types.
4. Remove an export when no other module imports it, unless the type is part of
   an exported value's public signature.
5. Re-run `pnpm check:unused` after each batch. A clean report is the evidence.

## Agent Team

The canonical workflow is [TEAM_WORKFLOW.md](TEAM_WORKFLOW.md).

Core roles: `architect`, `developer`, `reviewer`, `integrator`.

Specialists: `docs-writer`, `ui-stylist`, `astro-blume`, `svelte-engineer`,
`verification`, `security-reviewer`.

The root agent orchestrates. The Architect plans without editing. The Developer
implements one slice. The Reviewer verifies independently. The Integrator checks
the combined result. A phase is complete only when its artifact exists.

## Delivery

- Conventional commits: `type(scope): subject`.
- Pull requests include changed behavior, exact verification commands, and
  remaining risk.
- Do not commit, push, or open a pull request without user authorization.
- Report unrun checks as unrun. Never present an estimate as a measurement.
