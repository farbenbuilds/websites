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
title: Getting started
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
- Internal links are root-relative, such as `/docs/getting-started`.
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
- Use the ISO 639-1 language code `vi` in the URL prefix. Do not use `vn`, which
  is a country code, not a language code.
- Future pages such as `getting-started.mdx` and `api.mdx` follow the same
  pattern.
- Keep translated headings pinned to the English anchor ids so fragment links
  resolve across locales.
- Keep core technical terms in English in Vietnamese prose: `slab`, `capacity`,
  `backpressure`, `async token`, `worker`, `shared-nothing`, `handler`,
  `middleware`, `route`, `request`, `response`, `connection`, `transport`,
  `event loop`, `completion`, `buffer`, `queue`, `package`, `dependency`,
  `runtime`, `server`, `cluster`. Write natural Vietnamese around them.
- Use `build` for the build step and `biên dịch` only when source is compiled.
- Apply the same terminology to `locales/vi.json` and landing-page copy.
- Review Vietnamese pages for grammar and typos as well as key parity.
- Do not add MDX files, page prose, frontmatter, or docs routes to
  `x18n.config.ts` or `locales/*.json`.
- x18n checks component UI copy only. A docs-only change does not need
  `pnpm i18n:check`; a component copy change does.

## Documentation UI

- Keep breadcrumbs as a full ancestor trail from `Documentation` down to the
  current page. Every ancestor crumb links to its own route; the current page is
  plain text with `aria-current="page"`. Vietnamese trails use `/vi` routes and
  labels.
- Use generated sidebar groups for sections. Keep them collapsible, with the
  active group open and visually marked by a warm accent surface and a one-pixel
  tinted border, not a blurred halo.
- Do not add a hover effect to category summaries. Page rows inside a category
  may use the normal hover state.
- Keep the docs footer identical to the landing `SiteColophon`. Do not create a
  second footer design.
- Do not add a header tab until every route under it resolves. The current docs
  tree has no `Docs` tab.
- Preserve route stability when flattening or regrouping navigation; add
  redirects for every moved URL.

## Navigation and Discovery

- Do not set `sidebar.order` on a folder `index` page. Blume places the index
  first by default; an explicit `order: 0` ties with the first page ranked by
  `meta.ts` and falls back to label sorting, which can move the index below a
  child in Vietnamese.
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
pnpm --filter uwz-docs exec blume validate --strict
pnpm --filter uwz-docs exec blume audit --fail-on warning
pnpm i18n:check
```

Use the app's own scripts. Blume/Astro dev servers are not started by `vp dev`.

## Review Checklist

- Frontmatter is present and accurate.
- The page answers one reader goal.
- The English and Vietnamese MDX files exist; docs content was not added to
  x18n resources.
- Vietnamese pages keep English technical terms and read naturally without
  literal translations, typos, or broken grammar.
- Commands are copy-pasteable and tested.
- Links resolve and external links are descriptive.
- Code fences have a language and no secrets.
- Navigation and search reach the page.
- The build succeeds and generated output is not edited by hand.
- No emoji, filler, or unverified claim was added.
