# Contributing to Farben Websites

Farben Websites accepts focused changes that keep the documentation accurate,
the interface accessible, and the build reproducible.

Read [CODEBASE.md](../CODEBASE.md), [CODING_CONVENTION.md](../CODING_CONVENTION.md),
and [TEAM_WORKFLOW.md](../TEAM_WORKFLOW.md) before changing shared code or the
build graph. Report security defects privately as described in
[SECURITY.md](../SECURITY.md).

## Code of Conduct

Participation is governed by [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md). Be
direct about the work and respectful to the people doing it.

## Development Environment

The Nix flake provides Vite+, Node.js, and pnpm:

```sh
nix develop
```

`direnv` selects the glibc or musl shell automatically. Without Nix, use
Node.js 22.19 or newer and pnpm 12.4.2.

Install dependencies and run the full gate:

```sh
pnpm install
pnpm ready
```

Use the project-local CLI through pnpm. The global `vp` cannot load musl native
bindings on musl hosts.

## Repository Layout

- `apps/uwz-docs`: uWebZockets documentation, Blume, Astro, Svelte islands.
- `apps/vws-docs`: ventiws documentation, Blume.
- `packages/ui`: `@farben/ui`, shared shadcn-svelte components and theme tokens.
- `.agents/skills`: installed and project-owned skills.
- `.opencode/agents` and `.codex/agents`: the agent team.
- `.github`: community, security, and pull-request templates.

## Day-to-Day Commands

```sh
pnpm dev:uwz                            # uWebZockets docs dev server
pnpm dev:vws                            # ventiws docs dev server
pnpm check:size                         # enforce the 200-line source limit
pnpm exec vp check                      # format, lint, type-aware checks
pnpm exec vp check --fix                # apply fixes
pnpm exec vp run -r check               # every workspace check
pnpm exec vp run -r test                # every workspace test
pnpm exec vp run -r build               # every workspace build
pnpm exec vp run uwz-docs#check
pnpm exec vp run vws-docs#check
pnpm exec vp run uwz-docs#build
pnpm exec vp run vws-docs#build
pnpm exec vp run @farben/ui#check
```

Docs apps are Blume/Astro projects. Their dev servers start through their package
scripts, not `vp dev`. Run `pnpm exec vp env doctor` if the toolchain behaves
unexpectedly.

## Documentation Changes

- Put pages in the owning app's `docs/` directory.
- Add `title` and `description` frontmatter.
- Write in second person, active voice, and present tense.
- Lead with the task, then the explanation, then reference detail.
- Use root-relative internal links and descriptive external link text.
- Declare a language on every code fence.
- Verify with the app's `check` and `build` tasks.
- Do not edit generated files under `dist/` or `.blume/`.

A documentation change that adds a new interaction also needs a Svelte island
contract, an accessibility review, and both docs builds when shared UI changes.

## Interface Changes

- Start from the shared tokens in `packages/ui/src/lib/styles/theme.css`.
- Use Tailwind utilities and existing shadcn-svelte primitives.
- Add a shared component only when at least two apps use it.
- Keep static content in MDX or Astro and interaction in a Svelte island.
- Include labels, focus states, keyboard behavior, and reduced-motion handling.
- Verify the shared package type check and every consuming app build.

## Code Rules

The full contract is [CODING_CONVENTION.md](../CODING_CONVENTION.md). In short:

- No emojis in repository-authored files. Vendored third-party skills are
  upstream content and are exempt.
- Comments only for a non-obvious why. No commented-out code or `TODO` markers.
- Functional programming over OOP. No classes, prototypes, or `this`.
- Keep content, presentation, styling, domain, integration, and tooling separate.
- Source files target 150 to 200 lines and never exceed 200. Split by
  responsibility into a named sibling module.
- Svelte 5 runes only. No `<style>` blocks.
- TypeScript strict. No `any`, unchecked casts, or non-null assertions used to
  silence uncertainty.
- Do not weaken a lint, test, build, accessibility, or CI gate.

## Commits

Follow [COMMIT_CONVENTION.md](COMMIT_CONVENTION.md):

```text
type(scope): subject
```

Use the imperative present tense, keep the subject lowercase, and omit the
trailing period. Explain motivation and contrast with previous behavior in the
body. Reference issues in the footer.

## Pull Requests

Before opening a pull request:

- Rebase on the current `main`.
- Run `pnpm ready` or the narrowest relevant subset and record the exact result.
- Add or update documentation for changed behavior.
- Include regression coverage when behavior changes.
- Check the diff for generated files, secrets, and unrelated formatting.
- State breaking changes, remaining risk, and any command that could not run.

A pull request description includes:

1. What changed and why.
2. How it was verified, with exact commands.
3. Screenshots or recordings for visual changes.
4. Follow-up work that is intentionally out of scope.

## Agent-Assisted Contributions

Agent-assisted changes follow the same rules. The agent team is defined in
[TEAM_WORKFLOW.md](../TEAM_WORKFLOW.md).

- The Architect plans without editing.
- The Developer implements one scoped slice.
- The Reviewer verifies independently and reports actionable findings.
- The Integrator confirms the combined diff and evidence.

An agent must not claim a check it did not run, suppress a review finding, or
commit, push, and open a pull request without user authorization.

## Dependency Updates

- Explain why the dependency is needed and what it replaces.
- Review the lockfile diff, not only `package.json`.
- Confirm the license is compatible with MIT.
- Do not approve lifecycle scripts unless the build genuinely needs them.
- Run `pnpm ready` and the affected app builds.
- For toolchain or Nix changes, run the relevant shell checks and include the
  `vp env doctor` output when behavior looks wrong.

## Release and Deployment

Deployments are produced from `main` by the hosting platform. A release-ready
change has a green `pnpm ready`, a reviewed pull request, and no unresolved
security finding. The repository does not publish packages; `@farben/ui` is
private and consumed as source.
