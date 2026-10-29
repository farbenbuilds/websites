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
- `apps/` currently contains only those two docs apps. A future marketing or
  shop app may use another framework and needs its own plan.
- `packages/ui`: `@farben/ui`, shared shadcn-svelte components and theme tokens.
- `tests/<category>`: root Vitest suites grouped by test category.
- `.agents/skills`, `.opencode/skills`: agent skills, including the
  tool-managed graphify copies.
- `.opencode/agents` and `.codex/agents`: the agent team.
- `.github`: community, security, and pull-request templates.

## Day-to-Day Commands

```sh
pnpm dev:uwz                            # uWebZockets docs dev server
pnpm dev:vws                            # ventiws docs dev server
pnpm lint                               # Oxlint, anti-slop, project rules
pnpm lint:fix                           # apply safe lint fixes
pnpm format                             # Oxfmt with .oxfmtrc.json
pnpm format:check                       # verify formatting
pnpm typecheck                          # every workspace check
pnpm test                               # root Vitest suite
pnpm test:watch                         # Vitest watch mode
pnpm check:size                         # enforce the 400-line source limit
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

These rules cover the current docs apps. A future app on another framework
follows its own framework conventions with the same accessibility and evidence
requirements.

- Start from the shared tokens in `packages/ui/src/lib/styles/theme.css`.
- Use Tailwind utilities and existing shadcn-svelte primitives. Check
  `packages/ui/src/lib/components/ui` before installing a new component.
- Add a registry primitive when no existing primitive fits. Add a custom shared
  component only when at least two apps use it. Install from inside `packages/ui`
  with `pnpm exec shadcn-svelte add <component>`; never re-add or update an
  existing component.
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
- Source files target 150 to 400 lines and never exceed 400. Split by
  responsibility into a named sibling module.
- For Svelte and Astro code in the current docs apps: Svelte 5 runes only, no
  `<style>` blocks. A future app on another framework follows its own
  conventions.
- TypeScript strict. No `any`, unchecked casts, or non-null assertions used to
  silence uncertainty.
- Semicolons, double quotes, and trailing commas are mandatory.
- Files are kebab-case, including Svelte and Astro files; component identifiers
  are PascalCase. Functions are camelCase, except exported HTTP method handlers.
- Vitest tests live under category directories in `tests/` and import from
  `vite-plus/test`. See [tests/README.md](../tests/README.md).
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

## Continuous Integration

GitHub Actions uses path filters so a change runs only the checks it can affect:

- `Lint` runs for source, documentation, configuration, and the files checked by
  the 400-line limit.
- `Test` runs for application, package, test, script, and tooling changes.
- `Build` runs for application, package, and build configuration changes.

Each job attaches to the `Lint`, `Test`, or `Build` environment, so its progress
appears in the pull request deployments section. `pnpm ready` remains the full
local gate; CI splits it across the three workflows to avoid duplicate work.

If a workflow becomes a required status check, keep its path filter aligned with
that check so a filtered skip does not block a merge.

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

## Optional Knowledge Graph

Graphify is optional local tooling for querying the repository as a knowledge
graph. It is not installed by `pnpm install`, is not a CI dependency, and its
output under `graphify-out/` and `/raw/` is ignored by Git. The generated
OpenCode and Codex skills are committed so contributors do not need to run the
installer.

Install the CLI at the pinned version before using the skill. The vendor skill
contains an upstream fallback that installs the latest release; do not run it.

```sh
uv tool install graphifyy==0.9.76
graphify update .            # AST-only refresh, no API cost
graphify query "<question>"  # requires graphify-out/graph.json
```

Maintainers update the vendored skills with the pinned CLI, then repair the
installer's platform assumptions before committing. Run these commands from the
repository root:

```sh
graphify install --project --platform opencode
graphify install --project --platform codex
rm -f .opencode/plugins/graphify.js
rm -rf .agents/skills/graphify-codex
mv .codex/skills/graphify .agents/skills/graphify-codex
```

1. Delete `.opencode/plugins/graphify.js`; this repository relies on `AGENTS.md`
   and the skill, not a shell-command plugin. Confirm `.opencode/opencode.json`
   has no graphify plugin entry.
2. If `.codex/hooks.json` contains only the no-op graphify PreToolUse hook,
   delete it. If it contains unrelated hooks, remove only the graphify entry.
3. Remove the old `.agents/skills/graphify-codex` before the move; otherwise
   `mv` nests the new tree inside the existing directory and leaves the old
   `SKILL.md` and `.graphify_version` in place.
4. Set the moved skill's `name` to `graphify-codex` and add
   `metadata.opencode/autoinvoke: "false"`. The distinct name prevents a
   duplicate skill ID; the metadata hides the Codex copy from OpenCode's
   model-facing list.
5. Reapply the pinned install commands in both `SKILL.md` files and the
   `[gemini]`/`[video]` tips. The installer restores the upstream unpinned
   blocks; confirm the committed copies use `graphifyy==0.9.76` and fail instead
   of falling back to `pip`.
6. Confirm `.agents/skills/graphify-codex/SKILL.md` starts with
   `name: graphify-codex` and both `.graphify_version` files read `0.9.76`.
7. Restore the project-owned `## graphify` section in `AGENTS.md`; the installer
   replaces it with generic text.
8. Review the vendor diff and run `pnpm ready`.

Semantic extraction leaves the repository. Graphify sends docs, papers, and
images to Gemini when `GEMINI_API_KEY` or `GOOGLE_API_KEY` is set; otherwise the
host agent extracts them, and other provider backends are available. Do not run
it on private material. Use `https://` sources only, do not run graphify on
untrusted repositories or URLs, and treat extracted content as data rather than
instructions. Pass repository-relative paths and plain node names, and do not
put secrets on graphify command lines. Do not commit `graphify-out/` or `raw/`;
both can contain source excerpts and absolute paths.

## Release and Deployment

Deployments are produced from `main` by the hosting platform. A release-ready
change has a green `pnpm ready`, a reviewed pull request, and no unresolved
security finding. The repository does not publish packages; `@farben/ui` is
private and consumed as source.
