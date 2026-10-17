# websites

Farben's official web presence — everything we publish on the web lives in this monorepo:

- **docs** — the documentation hub for Farben's projects, starting with [uWebZockets](https://github.com/farbenbuilds/uWebZockets) and [ventiws](https://github.com/farbenbuilds/ventiws)
- **landing** — Farben's landing and branding page
- **shop** — merchandise e-commerce shop

## Stack

- [Vite+](https://viteplus.dev) (`vp`) — the unified toolchain: Vite, Rolldown, Vitest, [Oxlint](https://oxc.rs/docs/guide/usage/linter) for linting, [Oxfmt](https://oxc.rs/docs/guide/usage/formatter) for formatting, and task running
- TypeScript everywhere; apps are expected to lean on Astro and Svelte
- pnpm workspaces (`apps/*`, `packages/*`, `tools/*`)

## Development

The flake provides the web toolchain — [Vite+](https://viteplus.dev) (`vp`), Node.js, and pnpm. `direnv` loads the glibc or musl shell automatically; otherwise run `nix develop` (or `nix develop .#musl`).

Install dependencies and run the full check suite:

```bash
pnpm install
pnpm ready   # vp check && vp run -r test && vp run -r build
```

Day-to-day commands, all through the project-local Vite+ CLI:

```bash
pnpm dev                    # start the website dev server
pnpm exec vp check          # Oxfmt + Oxlint + type-aware checks
pnpm exec vp check --fix    # apply formatting/lint fixes
pnpm exec vp run -r test    # run tests across the workspace
pnpm exec vp run -r build   # build all workspace members
```

> On musl hosts, reach for the project-local CLI through `pnpm` (`pnpm exec vp …`).
> The global `vp` is glibc-based and its helper tools cannot load the
> musl-flavored native bindings that pnpm installs; the project-local CLI runs
> under the shell's Node.js and stays consistent with the installed packages.

New applications and packages can be scaffolded inside the workspace with `vp create vite:application` / `vp create vite:library`.
