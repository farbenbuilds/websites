---
name: Websites Conventions
description: Apply Farben's websites engineering contract for TypeScript, Svelte, Astro, docs, comments, functional style, separation of concerns, and the 400-line source limit.
---

# Websites Conventions

Use this skill before editing any file in the `websites` monorepo. The canonical
contract is [CODING_CONVENTION.md](../../../CODING_CONVENTION.md); this skill is
the working checklist.

## Start Here

1. Read the owning app or package, not only the file you plan to change.
2. Identify the layer: content, presentation, styling, domain, integration, or
   tooling.
3. Check the current file length. If the change pushes it past 400 lines, split
   by responsibility before adding behavior.
4. Load the narrower skill for the surface: `docs-site-authoring`,
   `web-ui-styling`, `verification-and-release`, or `web-security-review`.

## Hard Rules

- No emoji characters in repository-authored files. Vendored third-party skills
  are upstream content and are exempt.
- No classes, prototypes, `this`, inheritance, or hidden mutable state.
- No comments that restate code. Keep only a short why for a non-obvious
  constraint or safety boundary.
- No commented-out code and no `TODO`, `FIXME`, `XXX`, or `HACK`.
- No `any`, unchecked casts, or non-null assertions used to silence uncertainty.
- No `<style>` blocks in Svelte. No legacy Svelte syntax.
- No file over 400 lines. No `part-2` files.
- Semicolons, double quotes, and trailing commas are mandatory. Oxfmt settings
  live in `.oxfmtrc.json`.
- Files are kebab-case, including Svelte and Astro files; component identifiers
  are PascalCase. Functions are camelCase, except exported HTTP method handlers
  such as `GET`.
- Vitest tests live under category directories in `tests/` and import from `vite-plus/test`. See `tests/README.md`.
- No second formatter, linter, package manager, or test runner.
- Check `packages/ui/src/lib/components/ui` before installing a shadcn-svelte
  component. Never re-run `add`, `add --all`, `update`, `apply`, or `init` for an
  existing component, and never install a renamed duplicate or an unapproved
  URL or custom registry. See
  [CODING_CONVENTION.md](../../../CODING_CONVENTION.md) section 7.
- Do not weaken a gate to pass a change.

## Layer Check

| Layer | Allowed in | Forbidden in |
| --- | --- | --- |
| Content | MDX, frontmatter, navigation copy | Runtime state, layout logic |
| Presentation | Svelte components, Astro markup | Network calls, build config |
| Styling | Tailwind classes, theme tokens | Business logic |
| Domain | Pure TypeScript in `lib` | DOM, fetch, framework imports |
| Integration | Astro pages, Blume config, adapters | Visual design, copy |
| Tooling | Vite+, Nix, scripts, CI | Product behavior |

Dependencies point downward. A domain module never imports a component or a
page. A custom shared component lives in `packages/ui` only when at least two
apps use it. A standard shadcn-svelte registry primitive may be installed when
no existing primitive fits, even if one app uses it first.

## Functional Pattern

Prefer this shape:

```ts
type Input = { readonly title: string; readonly href: string };

export function toLink({ title, href }: Input): string {
  return `[${title}](${href})`;
}
```

Avoid this shape:

```ts
class LinkBuilder {
  private title = "";
  withTitle(title: string) {
    this.title = title;
    return this;
  }
}
```

Pure transformations receive explicit inputs and return values. Effects belong
at route, lifecycle, or build boundaries.

## File Split Pattern

When a file approaches 400 lines, extract the responsibility that changes for a
different reason:

```text
docs-page.ts          # orchestration and exports
docs-metadata.ts      # frontmatter parsing and validation
docs-navigation.ts    # previous and next link selection
docs-rendering.ts     # presentation helpers
```

Name files after the responsibility. Update imports. Do not leave forwarding
wrappers or duplicate types.

## Verification

Run the narrowest relevant command while working, then the full gate before
review:

```sh
pnpm lint
pnpm format:check
pnpm typecheck
pnpm test
pnpm exec vp run <workspace>#check
pnpm exec vp run <workspace>#build
pnpm ready
```

`lefthook` runs the same lint, format, size, typecheck, and test commands on
pre-commit. The anti-slop rules live in `.oxlintrc.json` and
`tools/oxlint/anti-slop/`; formatting lives in `.oxfmtrc.json`.

Report the exact command and result. If a command could not run, say so.

## Review Checklist

- The change is in the correct layer.
- No file exceeds 400 lines.
- No emoji, dead code, or unexplained marker was added.
- Comments explain only a non-obvious why.
- Types are explicit and external input is validated.
- Svelte uses runes and Tailwind, not `<style>`.
- Formatting follows `.oxfmtrc.json`; lint follows `.oxlintrc.json`.
- The narrowest check and the full gate are reported honestly.
