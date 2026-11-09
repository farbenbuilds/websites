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
- `styles/`: Blume chrome, reading shell, and landing CSS.
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
- Code samples follow their source language, not this repository's TypeScript
  style. Zig samples follow the µWebZockets API: `snake_case` functions, variables, parameters, and
  fields, `PascalCase` types, and the exact public API spelling. Never
  camel-case a Zig identifier or rename an API for style.
- Internal links are root-relative, such as `/docs/getting-started`.
- External links name the destination instead of using "click here".
- No emoji, exclamation mark, marketing filler, or unverified claim.
- One topic has one canonical page. Before adding a page, search for an existing
  page with the same reader goal. If one exists, fold the unique material into
  it and delete the duplicate instead of creating a parallel tutorial, guide, or
  example.
- When pages merge, keep one route: delete the English and Vietnamese MDX, add a
  301 in the app's Blume redirect config (`blume-redirects.ts` in `uwz-docs`),
  and repoint every index, card, and prose link.
- A guide owns only its unique recipe. Do not repeat the program, contract
  tables, or failure reference of the page that owns the subsystem.

## CSS

Blume inlines `theme.css` into its generated Tailwind entry. Every app CSS file
can use Tailwind v4 syntax.

- Use `@apply` for declarations, including arbitrary values and arbitrary
  properties when no named utility exists.
- Define host tokens in `@theme inline` and repeated custom patterns in
  `@utility`.
- Keep raw declarations only in token blocks, `@keyframes`, `@font-face`,
  `@property`, and data-driven custom properties such as `--bar-width`.
- Author color literals as `oklch()`; `pnpm check:css` rejects hex colors in
  app and package CSS.
- Target Blume's rendered DOM with a scoped selector and apply utilities inside
  it. Do not add classes to generated markup.
- Keep `theme.css` imports relative to its generated location and use `@source`
  for workspace packages.
- Run `pnpm check:css` and the app build after a CSS change. Review light and
  dark mode at narrow and wide viewports.

```css
.docs-home-section {
  @apply mx-auto w-[min(100%_-_2.5rem,70rem)] border-t border-border py-12;
}
```

## Documentation Surfaces

µWebZockets documentation serves two audiences in separate surfaces.

**Application pages** treat µWebZockets as an installed dependency. The reader
adds it with `zig fetch --save` and works in their own `build.zig` and `src/`.
They do not clone, build, test, or develop the framework repository.

- Start from `zig fetch --save`, the reader's `build.zig.zon`, and their `src/`.
- Use application commands: `zig build`, `zig build run`, `zig build test` when
  their build defines it, and client tools such as `curl`, `wscat`, or `h2load`.
- Never ask a reader to run framework test, compliance, sanitizer, C ABI, or Nix
  commands in an application page.
- Cite framework source only to prove a claim. Do not make reading or editing
  `src/` a prerequisite.
- Demonstrate behavior with the public API and code adapted from
  `examples/*.zig` into the reader's project.
- Present framework compliance results as dated upstream evidence, not as a task.

**Contributor pages** under `/docs/operations` document changing the framework
repository. They open with a `:::note[Contributing to µWebZockets]` block, link
`CONTRIBUTE.md`, and may use clone, `nix develop`, test, sanitizer, fuzz, and
release commands. They link the application alternative from the same page and
stay out of tutorials, Getting Started, Deployment, and Guides.

**Advanced application surfaces** such as WASM, eBPF, kTLS, and AF_XDP are
application pages. Show `zig fetch --save`, the consumer `build.zig` step, the
installed artifact path, and the public module import. Label a framework named
build step as a contributor shortcut.

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
pnpm check:css
pnpm --filter uwz-docs exec blume validate --strict
pnpm --filter uwz-docs exec blume audit --fail-on warning
pnpm i18n:check
```

Use the app's own scripts. Blume/Astro dev servers are not started by `vp dev`.

## Review Checklist

- Frontmatter is present and accurate.
- The page answers one reader goal and does not duplicate a canonical page.
- A merged page has one route, a 301 from the old route, and no stale links.
- The English and Vietnamese MDX files exist; docs content was not added to
  x18n resources.
- Vietnamese pages keep English technical terms and read naturally without
  literal translations, typos, or broken grammar.
- Commands are copy-pasteable and tested.
- Links resolve and external links are descriptive.
- Code fences have a language and no secrets.
- Navigation and search reach the page.
- App CSS uses Tailwind syntax and `oklch()` colors, and passes
  `pnpm check:css`.
- The build succeeds and generated output is not edited by hand.
- No emoji, filler, or unverified claim was added.
