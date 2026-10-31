---
name: Docs Site Authoring
description: Write, structure, and verify Blume documentation in the Farben websites monorepo, including MDX frontmatter, navigation, links, search, llms.txt, and build checks.
---

# Docs Site Authoring

Use this skill for any change under `apps/uwz-docs/docs` or
`apps/vws-docs/docs`, or for Blume configuration, navigation, search, and
generated documentation output.

## Owned Surface

- `apps/uwz-docs`: uWebZockets documentation.
- `apps/vws-docs`: ventiws documentation.
- `blume.config.ts`: site title, description, theme, GitHub edit links.
- `theme.css`: host Tailwind entry and token overrides.
- `components/`: Svelte components registered for MDX in `components.ts`.

Blume owns routing, search, `llms.txt`, `llms-full.txt`, OpenAPI output, and the
Astro build. Do not hand-roll replacements.

## Page Contract

Every page starts with:

```mdx
---
title: Getting Started
description: Install the package, run the first example, and verify the result.
---
```

- `title` is sentence case and specific.
- `description` states the reader outcome in one sentence.
- Headings use sentence case and follow a logical outline.
- The first paragraph states what the page helps the reader do.
- Procedures use numbered steps with one action per step.
- Reference detail follows the task, not the reverse.
- Every code fence declares a language.
- Internal links are root-relative, such as `/getting-started`.
- External links name the destination instead of using "click here".
- No emoji, exclamation mark, marketing filler, or unverified claim.

## Page Types

| Type | Shape |
| --- | --- |
| Tutorial | Goal, prerequisites, numbered steps, result, next step |
| How-to | Problem, assumptions, procedure, verification |
| Reference | Stable API or configuration facts, examples, limits |
| Explanation | Concept, tradeoffs, architecture, links to tasks |

Do not mix a tutorial with a reference dump. Split the page when the reader's
goal changes.

## MDX Components

Use existing Blume components before adding one. A new interactive component is
a Svelte island and needs a contract:

```text
Props:
States:
Keyboard behavior:
Accessibility:
Failure behavior:
```

Hand the island implementation to `svelte-engineer` and the visual review to
`ui-stylist`. Keep static content in MDX.

## Localization

Documentation content is localized by mirrored MDX, not x18n.

- English page: `docs/<slug>.mdx`.
- Vietnamese page: `docs/vi/<slug>.mdx`.
- Future pages such as `getting-started.mdx` and `api.mdx` follow the same
  pattern.
- Keep translated headings pinned to the English anchor ids so fragment links
  resolve across locales.
- Do not add MDX files, page prose, frontmatter, or docs routes to
  `x18n.config.ts` or `locales/*.json`.
- x18n checks component UI copy only. A docs-only change does not need
  `pnpm i18n:check`; a component copy change does.

## Navigation and Discovery

- Check that a new page appears in the expected navigation group.
- Check previous and next links at the top and bottom of the reading flow.
- Search for the page title and a distinctive phrase after the build.
- Inspect `dist/llms.txt` when the page purpose or summary changes.
- Keep slugs short and stable. A renamed public URL needs a redirect.

## Commands

```sh
pnpm dev:uwz
pnpm dev:vws
pnpm exec vp run uwz-docs#check
pnpm exec vp run vws-docs#check
pnpm exec vp run uwz-docs#build
pnpm exec vp run vws-docs#build
```

Use the app's own scripts. Blume/Astro dev servers are not started by `vp dev`.

## Review Checklist

- Frontmatter is present and accurate.
- The page answers one reader goal.
- The English and Vietnamese MDX files exist; docs content was not added to
  x18n resources.
- Commands are copy-pasteable and tested.
- Links resolve and external links are descriptive.
- Code fences have a language and no secrets.
- Navigation and search reach the page.
- The build succeeds and generated output is not edited by hand.
- No emoji, filler, or unverified claim was added.
