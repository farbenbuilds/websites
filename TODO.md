# Editorial documentation design and ASCII butterfly heroes

This is the implementation plan for the uWebZockets and ventiws documentation
sites. It covers two coupled tracks: an editorial design system for the site
chrome, content components, and landing pages, with the visual grammar of
[vizejs.dev](https://vizejs.dev/) as its reference; and the already-decided ASCII
butterfly heroes for the home pages. All boxes below describe future work; this
document does not implement either track.

Vize is a visual reference, not a source to copy. Its documentation theme is
built for Ox Content and Vue, while these sites use Blume, Astro, and Svelte.
Adopt the grammar: paper surfaces, hairline rules, square geometry, display
type, mono metadata, numbered indexes, and quiet chrome. Keep Farben's own
fonts, accents, copy, artwork, and component code.

## Status and decisions

| Decision                                                   | Status                                                       |
| ---------------------------------------------------------- | ------------------------------------------------------------ |
| Blume remains the documentation framework                  | Decided. Do not eject or hand-edit generated output.         |
| Vize supplies the visual grammar                           | Decided. Do not copy its code, palette, identity, or assets. |
| Landing pages use Blume's `mode: custom`                   | Decided. Author the page heading in MDX.                     |
| The butterfly hero uses Svelte, GSAP, and CSS              | Decided. No Three.js, Threlte, WebGL, or Canvas renderer.    |
| Both sites share one editorial grammar                     | Decided. Keep each site's accent and paper temperature.      |
| Blume keeps routing, search, i18n, and generated discovery | Decided. Restyle only the presentation boundary.             |

uWebZockets keeps its orange accent over warm paper. ventiws keeps its teal
accent over cool paper. The layout, type, rules, and component grammar are
shared.

### Hero technology decision

The butterflies are flat groups of monospace characters. Svelte can render them
as text, Tailwind can place and color their wrappers, and GSAP can move those
wrappers with transforms. Three.js and Threlte would add a scene, camera,
renderer, and WebGL lifecycle without contributing to a two-dimensional result,
so neither belongs in the dependency set.

The [ascii-sharks reference](https://github.com/stackedlol/ascii-sharks) draws
ASCII fish on a Canvas 2D cell grid with a TypeScript engine. It is a reference
for recognizable silhouettes, restrained color, and layered movement, not code
to copy. Draw original butterflies and write independent motion code.

## Goal and non-goals

The goal is that the four home routes and both documentation sets read as one
publication: a warm paper surface, ink-like text, square controls, fine rules,
mono labels, one accent per site, and a poster-scale landing hero that does not
push the first useful link out of a mobile viewport. The second goal is that the
butterfly scenes remain decorative, accessible, and cheap to render.

Non-goals for this plan:

- Do not build the landing, shop, or marketing site outside these docs apps.
- Do not add a new third-party font, UI framework, CSS framework, or motion
  dependency.
- Do not replace Blume's search, localization, navigation, or generated
  `llms.txt` and `llms-full.txt` output.
- Do not clone Vize's layout pixel for pixel or reuse its palette and assets.
- Do not implement the design or hero in the pull request that lands this
  document.

## Reference study: Vize

Checked on 2026-10-27 against the live site and the `docs/` source. Vize extends
Ox Content's default theme in `docs/vite.config.ts`, then overrides it in
`docs/theme/style.css`, `features.css`, `navigation.css`, and
`entry-layout.css`.

| Surface    | Observed grammar                                                                                                                       |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Tokens     | Warm paper `#e2ded2` in light, `#141414` in dark; near-black ink; zero corner radius; Helvetica Neue with JetBrains Mono for metadata. |
| Geometry   | 60px header, 260px sidebar, 960px maximum content width; 1px rules; no cards on the entry page.                                        |
| Header     | Fixed and borderless. Transparent and hidden on the entry page until scroll; compact icon controls; search, GitHub, theme, locale.     |
| Sidebar    | Transparent with no rail. Groups separated by hairline rules. Mono uppercase group labels. Square active rows, no pills.               |
| Entry page | Full-height poster hero with a huge name, vertical mono tagline, square buttons, and a numbered feature index.                         |
| Content    | Flat code blocks, hairline tables, no decorative left rails on callouts or the table of contents; strong display hierarchy.            |
| Footer     | A small colophon at 60% opacity with a top rule, not a link farm or a social icon wall.                                                |
| Motion     | Short 0.15-0.3s color and opacity transitions; a fixed full-page ambient WebGL canvas.                                                 |

The reference is useful because the composition is disciplined: one accent,
few surfaces, one rule weight, and metadata that is visibly secondary. The
canvas, the hidden header, and the bottom mobile action bar are not part of the
grammar we need.

### Adopt, adapt, reject

| Vize move                                  | Farben decision                                                                                                         |
| ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| Warm paper and ink surfaces                | Adopt as one structure with two temperatures: warm for uWebZockets, cool for ventiws. Verify contrast in both modes.    |
| Zero radius and 1px rules                  | Adopt through `theme.radius: "none"` and a zero `--radius` mapping.                                                     |
| Mono uppercase labels and index numbers    | Adopt for labels, index numbers, keyboard hints, and footer metadata. Never use mono for body copy.                     |
| Poster display type with negative tracking | Adapt to a clamp on the landing page and a 2rem heading in docs; never use a 20vw title inside a reading page.          |
| Numbered two-column feature index          | Adopt on the landing page in place of a card grid.                                                                      |
| Transparent sidebar with hairline groups   | Adopt at the token and selector layer while keeping Blume's layout and focus behavior.                                  |
| Compact header controls                    | Adopt the density and square geometry, but keep Blume's 64px sticky header and its built-in search and drawer behavior. |
| 100vh entry page                           | Adapt into a custom-mode landing page whose first action remains visible at 320x568 without scrolling.                  |
| Hidden header until scroll                 | Reject. Documentation navigation must stay available without a scroll script.                                           |
| Bottom mobile action bar                   | Reject. Blume's built-in drawer, search, and theme controls cover the need; M1 verifies them.                           |
| Fixed full-page ambient canvas             | Reject. The butterfly scene is the only ambient motion.                                                                 |
| Vize palette, Helvetica, name, logo, copy  | Reject. Keep Google Sans Flex, Be Vietnam Pro, JetBrains Mono, and Farben's butterfly mark.                             |

## Design grammar

### Surface and color

These are starting values, not final brand tokens. Confirm them with a contrast
check in both themes during M0 before committing them.

| Token                      | Light candidate | Dark candidate | Use                                                                                |
| -------------------------- | --------------- | -------------- | ---------------------------------------------------------------------------------- |
| `--blume-background`       | `#f4f0e6`       | `#161513`      | Page and header paper                                                              |
| `--blume-foreground`       | `#171512`       | `#ece6da`      | Body and display ink                                                               |
| `--blume-muted`            | `#ebe5d8`       | `#211f1b`      | Callouts, table headers, quiet surfaces                                            |
| `--blume-muted-foreground` | `#5f5a52`       | `#a39c90`      | Secondary text, labels, metadata                                                   |
| `--blume-border`           | `#d3ccbe`       | `#2c2a25`      | 1px rules, borders, dividers                                                       |
| `--blume-radius`           | `0`             | `0`            | Every control, card, code block, and dialog                                        |
| `--blume-content-width`    | `42rem`         | `42rem`        | Keep the readable prose measure; evaluate 44rem only if line length stays readable |

Set the accent through `theme.accent` in the site config: `"orange"` for
uWebZockets and `"teal"` for ventiws. Blume resolves those presets into
`--blume-accent` and `--blume-accent-foreground` with per-mode AA values. Do not
assign a preset name to the CSS token.

The values above are the uWebZockets warm candidates. ventiws starts from the
same structure with a cool cast: background `#f1f4f1`, muted `#e5eae6`, border
`#cbd4ce`, dark background `#121615`, dark muted `#1b211f`, and dark border
`#28322e`. Treat those as candidates too, and verify contrast instead of trusting
the values.

Rules:

- Keep Blume's 4rem header, 17.5rem rails, and 42rem prose measure. The
  editorial feel comes from type, rules, and square geometry, not from forcing
  Vize's grid.
- Use the accent for interactive meaning, not large fills. A primary landing
  call to action uses ink fill with paper text; a secondary action uses a 1px
  border. The one-accent rule governs chrome and interactive states. The hero
  may use a bounded analogous family around the site accent, such as
  orange/amber/yellow or blue/green/teal, but keep it inside the hero and out of
  the UI chrome.
- Do not recolor Blume's syntax tokens. Flatten code geometry and chrome, but
  keep the shipped code theme so highlighting contrast stays tested.
- No gradients, glass, backdrop blur, drop shadows, glow, or colored card
  fills. Borders and spacing carry hierarchy.
- Decorative rules may use the border candidate. Interactive boundaries such as
  inputs, secondary actions, and focus rings must reach 3:1 against the adjacent
  surface. If the candidate border fails, add a darker interactive border token
  rather than raising the contrast of every rule.
- Do not use color alone to mark state. Pair it with weight, a rule, an icon,
  or text.

### Type

| Role     | Family           | Size, weight, tracking                                | Use                                       |
| -------- | ---------------- | ----------------------------------------------------- | ----------------------------------------- |
| Display  | Google Sans Flex | Landing `clamp(2.75rem, 9vw, 5.5rem)`, 600, `-0.05em` | Landing h1 only                           |
| Display  | Google Sans Flex | Docs h1 `2rem`, 600, `-0.04em`, 1.15 line height      | Page title                                |
| Display  | Google Sans Flex | h2 `1.375rem`, 600, `-0.02em`; h3 `1.125rem`, 600     | Section hierarchy; h2 gets a 1px rule     |
| Body     | Be Vietnam Pro   | `1rem`, 400, 1.7 line height                          | Prose, controls, navigation               |
| Small    | Be Vietnam Pro   | `0.875rem`, 400, 1.55 line height                     | Card copy, captions, footer links         |
| Label    | JetBrains Mono   | `0.68rem`, 600, `0.12em`, uppercase                   | Section labels, kbd hints                 |
| Metadata | JetBrains Mono   | `0.64rem`, 500, `0.08em`                              | Index numbers, rail headings, footer meta |

Do not set body copy in mono. Do not use wide tracking on sentences. Keep
localized labels short because uppercase and tracking can slow Vietnamese
diacritic reading.

### Geometry and spacing

- One corner radius: zero.
- One rule weight: 1px at the border token. Use rules to separate groups,
  sections, and the footer; do not box every element.
- Controls are square. Use 36px icon buttons on desktop and 44px touch targets
  on coarse pointers. Never go below the 24px WCAG 2.2 target minimum.
- Landing sections use generous vertical padding, around 3.5rem to 5.75rem.
  Docs sections stay compact enough to read continuously.
- Landing content is capped around 1120px. Docs content keeps Blume's
  `--blume-content-width`.
- No shadows. A dialog may use a 1px border and a solid paper surface instead.

### Motion and states

- Controls transition color, background, border, and transform in 120-180ms.
  Do not animate layout properties.
- Focus is a visible 2px accent ring with a 2px offset. Do not remove an outline
  without a replacement.
- Hover shifts text to foreground and background to muted; active rows add
  weight. Disabled controls use reduced opacity plus a cursor change.
- Every non-essential transition has a `prefers-reduced-motion: reduce` path.

## Site chrome contract

| Surface                       | Owner        | Keeps                                                                | Changes                                                                               |
| ----------------------------- | ------------ | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Header and navbar             | Blume        | Routing, search dialog, locale dropdown, theme toggle, mobile drawer | Paper bar, hairline bottom rule, no blur or shadow, square 36px controls, mono locale |
| Search dialog                 | Blume        | Cmd/Ctrl+K, index, filters, focus handling                           | Square dialog, paper surface, 1px border, mono kbd hints                              |
| Sidebar and mobile navigation | Blume        | Nav tree, drawer, active-page centering                              | Transparent rail, hairline group rules, mono group labels, square active rows         |
| Table of contents and actions | Blume        | Scroll spy, copy and open actions                                    | Mono heading, no left rail, muted page actions                                        |
| Breadcrumbs and pagination    | Blume        | Link semantics and order                                             | Hairline top rule, mono direction labels, bare links with arrows                      |
| Feedback                      | Blume        | Rating behavior and comments                                         | Square buttons, hairline top rule                                                     |
| Footer                        | Blume config | Repository, social, and consent links                                | Colophon row, copyright, two or three links, small mono type, 70% opacity             |
| Landing colophon              | App          | Links and copyright from the landing content                         | Same visual grammar as the footer; used only where custom mode drops Blume's footer   |

Header decisions:

- Keep the header sticky and visible. Do not add a scroll listener that hides it.
- Keep Blume's 64px height because its sticky offsets are built around it.
- Prefer Blume theme tokens first and a small app-local selector adapter second.
  Use only `data-blume-*` hooks that M0 verifies in the built HTML. They are an
  observed integration surface, not a public API, so re-check them after every
  Blume upgrade.
- If a required change cannot be expressed in CSS, use the documented
  `blume add <slot>` source override or a layout slot. Never edit `.blume/`.
- Do not fake a visible search shortcut with generated content. Keep Blume's
  built-in trigger and modal. If a visible label is required, copy the Search
  slot source into the app and preserve Cmd/Ctrl+K, focus handling, and Escape
  behavior, then re-test keyboard and screen-reader use.
- Keep the mobile drawer. Style the trigger, drawer, and focus states; do not
  replace the interaction model with a bottom bar.

Footer decisions:

- Configure `footer.copyright` and two or three `footer.links` in each app
  instead of inventing a new footer. The GitHub icon comes from `github.owner`
  and `github.repo` and points at the monorepo; the product repository belongs in
  a labeled text link. Keep those destinations distinct.
- Do not add a social icon wall. GitHub is the relevant destination.
- Add a license link only when the product repository publishes its own license
  file. Do not imply a product license from the monorepo's MIT license.
- If a consent link exists, keep it.
- Blume's custom page mode drops the footer. The landing pages therefore need
  the app-local landing colophon described later in this plan; docs pages keep
  the built-in footer.

## Component contract

| Component               | Visual contract                                                                                                                 | Must preserve                                           |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| Cards and card groups   | Flat paper surface, 1px border, zero radius, accent border on hover or focus. Small line icons only; no filled tiles or shadow. | Link semantics, focus order, external-link hints        |
| Numbered index          | Two columns on desktop, one on mobile; mono number, title, short description, arrow. No card chrome.                            | Semantic ordered list, descriptive links                |
| Callouts                | 1px border, muted surface, mono uppercase label or icon, no colored rail or fill stripe.                                        | Note, warning, and tip meaning; accessible heading      |
| Code blocks             | 1px border, zero radius, flat surface, 0.84rem mono, square copy control; no title gradient.                                    | Copy button behavior, language label, horizontal scroll |
| Tables                  | Hairline row rules, no zebra stripes, mono uppercase headers, horizontal scroll on narrow screens.                              | Header association, scroll containment                  |
| Tabs, steps, accordions | Square controls, 1px rules, accent underline or text for the active item; no pills.                                             | ARIA state, keyboard behavior, focus visibility         |
| Badges                  | Transparent surface, 1px border, mono uppercase label.                                                                          | Text contrast and meaning                               |
| Search results          | Square rows, hairline separators, muted scope label, foreground on hover or selection.                                          | Result ranking, keyboard navigation, focus return       |
| Table of contents       | Mono heading, 0.875rem links, active weight and foreground; no vertical rail.                                                   | Scroll spy and current-section semantics                |
| Pagination and feedback | Hairline top rule, bare links or square buttons, mono direction labels.                                                         | Previous/next order, rating state, comments link        |

Implementation rules:

- Do not add `!important` to beat Blume utilities. Increase specificity through
  the owning selector or use a supported token. If neither works, use a
  documented source override.
- Component styling must not change markup semantics, focus order, or keyboard
  behavior.
- Keep each stylesheet under 200 lines. Split chrome selectors from article
  component selectors before the limit.

## Landing page contract

Every home route uses `mode: custom` in frontmatter. Blume then renders the
header only; the page owns its heading, layout, and page end. The frontmatter
`title` and `description` still supply navigation, SEO, and generated metadata.

The landing page has five regions:

1. A short mono eyebrow, localized and factual. No decorative Japanese text.
2. The product name as the only h1, at the display clamp above.
3. The summary, with the first useful action visible at 320x568 without
   scrolling.
4. Two actions: Getting Started as the ink-filled primary link, GitHub as the
   bordered secondary link.
5. The butterfly field as a bounded decorative region beside or behind the
   text, never over the heading, paragraph, or actions.

On desktop, use an asymmetric composition: text in roughly a 5/12 column and
art in a 7/12 field that may bleed to the right edge. On mobile, stack the text
first and place a smaller art band after it; never put art behind the summary.

Below the hero:

- A numbered index replaces the current `CardGroup`. Use three to five rows for
  Getting Started, the source repository, and the strongest product facts. Each
  row has a mono number, title, one-sentence description, and a descriptive link.
- Do not drop the existing Highlights or the incomplete-documentation note. Move
  the strongest facts into the index and keep the rest as a compact list below
  it; keep the status note near the documentation links. Never present the site
  as complete when the copy says it is still being written.
- Keep the existing complete-example code block and the explanation that
  follows it. Put it on the paper surface with a hairline rule and no card.
- End with the landing colophon: copyright, source, and documentation links, plus
  a license link only when the product repository publishes one. It must match
  the docs footer visually and use the same destinations.
- Keep the English and Vietnamese pages equivalent. Translate labels; do not
  translate product names or code identifiers.

Do not add a second h1, a 100vh lock, a full-screen canvas, or a card grid.
The page should read as an editorial front page, not a marketing splash.

## Butterfly hero contract

The hero is decoration with a job: give each site a quiet, recognizable identity
without competing with documentation.

- Use three to five original butterfly glyph designs, drawn as monospace text
  with preserved spaces and line breaks. Inspect them at real mobile and desktop
  sizes. Each design is one accessible-decorative unit.
- uWebZockets uses orange, amber, and yellow wing accents over the warm neutral
  surface. ventiws uses blue, green, and teal accents over the cool neutral
  surface. Use hue or brightness variation within the site palette, not a
  rainbow. Set palettes at the host layer, never inside shared motion logic.
- Use a calm print composition inspired by Japanese print and garden
  composition: generous space, asymmetric balance, fine rules, crisp mono
  glyphs, and selective color. Avoid decorative Japanese text, cultural
  symbols, or imagery that suggests an unverified product connection.
- Keep the heading, summary, and links as semantic MDX or HTML. Treat the
  butterfly field as decoration, never as the only way to convey information.
  Do not put decorative glyphs into headings or link names.
- Concentrate the scene in a bounded hero region. Keep a clear exclusion area
  around the title, summary, actions, navigation, search, and code.
- Reduce the count on narrow screens. Never place glyphs over reading text.
- Derive the surfaces and glyph colors from the host theme tokens. Confirm the
  hero works with the existing theme toggle, and do not replace documentation
  body typography solely to create the effect.
- Render a stable static arrangement server-side. The page must remain readable
  and useful when JavaScript is unavailable, and the CSS static state must stay
  visible if animation setup fails.
- Mark the artwork `aria-hidden="true"` and `pointer-events-none`. Keep the
  pause control outside that subtree with an accessible name and visible focus.
- Respect `prefers-reduced-motion: reduce` before starting any tween, and react
  when the preference changes. If motion lasts more than five seconds alongside
  content, provide a keyboard-operable pause and resume control and persist its
  state for the page visit.
- Start scoped GSAP tweens on mount, using `gsap.matchMedia()` for viewport and
  reduced-motion conditions. Select only elements inside the component root.
  Pause on `visibilitychange` and when the hero leaves the viewport through an
  `IntersectionObserver`; resume only when motion is enabled. Disconnect the
  observers, revert the media query, and kill the tweens on unmount.
- Animate transform and, sparingly, opacity. Do not animate text content or
  layout properties. Do not add scroll listeners or use page-wide selectors.
- Keep the initial element count and positions stable so hydration does not
  shift the scene.
- This plan renders the butterflies as DOM text. Do not switch to Canvas or
  WebGL inside this slice. If measured DOM density fails the performance budget,
  return to the architect with measurements and a new plan that keeps a static
  text fallback.

## Implementation architecture

| Layer                | Responsibility                                                             | Candidate files                                                                                 | Status   |
| -------------------- | -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | -------- |
| Shared editorial CSS | Neutral label, rule, index, and square utilities that do not import Blume  | `packages/ui/src/lib/styles/editorial.css`, `packages/ui/package.json` export                   | New      |
| Shared hero          | Render original glyphs, typed palette and density, static fallback         | `packages/ui/src/lib/components/butterfly-hero/butterfly-hero.svelte` and named sibling modules | New      |
| Shared glyph data    | Plain frames, positions, and deterministic motion parameters               | Sibling data module under `packages/ui/src/lib/components/butterfly-hero/`                      | New      |
| Shared motion        | Scoped GSAP timelines, media-query and visibility cleanup                  | Sibling motion module under `packages/ui/src/lib/components/butterfly-hero/`                    | New      |
| Landing colophon     | Static per-app footer with copyright and links                             | `apps/*/components/site-colophon.astro`, `apps/*/components.ts`                                 | New      |
| Site tokens          | Import shared tokens, map shadcn variables, set site accent and background | `apps/uwz-docs/theme.css`, new `apps/vws-docs/theme.css`                                        | Mixed    |
| Site chrome CSS      | Blume-specific header, sidebar, footer, search, and TOC selectors          | `apps/*/styles/blume-chrome.css`                                                                | New      |
| Site component CSS   | Blume-specific cards, callouts, code, tables, tabs, steps, and pagination  | `apps/*/styles/blume-content.css`                                                               | New      |
| Site config          | Radius, background, footer content, GitHub links                           | `apps/*/blume.config.ts`                                                                        | Existing |
| Site landing content | Custom-mode hero, numbered index, example, colophon                        | `apps/*/docs/index.mdx`, `apps/*/docs/vi/index.mdx`                                             | Existing |
| Site registry        | Register hero and colophon for MDX                                         | `apps/uwz-docs/components.ts`, new `apps/vws-docs/components.ts`                                | Mixed    |
| Package dependencies | Declare the existing GSAP catalog entry because the shared hero imports it | `packages/ui/package.json`, lockfile                                                            | Existing |
| Site dependency      | Add the shared package to ventiws; no new runtime packages                 | `apps/vws-docs/package.json`, lockfile                                                          | Existing |

Boundaries:

- The shared editorial CSS must not import Blume, name Blume selectors, or read
  Blume tokens implicitly. Hosts map their theme into the shared primitives.
- Blume-specific selectors stay in the apps. Do not put `data-blume-*` rules in
  `packages/ui`.
- Shared primitives live in `@farben/ui`; app-local components own site-specific
  links and Blume selectors. Keep the landing colophon and docs footer
  destinations in sync with a parity check.
- Do not add a new third-party runtime dependency. Add the existing
  `@farben/ui` workspace package to ventiws, and declare the existing `gsap`
  catalog entry in `packages/ui` because the shared hero imports it. Both apps
  already declare Svelte and GSAP.
- Do not edit `.blume/` or `dist/`. No `part-2` files; split styles by
  responsibility.

Register the hero through Blume's `defineComponents` descriptor. Prefer
`client: "visible"` when the hero sits in the first viewport and the static
arrangement is acceptable until hydration. Verify the generated HTML and measure
the behavior before choosing a directive; do not assume it.

## Milestones and checklists

### M0: Baseline and verified Blume path

- [ ] Capture both sites at 320px, 768px, and a wide desktop viewport, in light
      and dark mode, for `/` and `/vi`. Record the current first action, header,
      footer, and theme behavior.
- [ ] Read the installed Blume documentation for theming, customization, footer
      configuration, and page layout. Confirm `theme.radius`, per-mode
      background colors, footer copyright and links, and `mode: custom` behave as
      this plan assumes.
- [ ] Build a throwaway page with `mode: custom` and a minimal reskin, inspect
      the generated HTML, and list the `data-blume-*` hooks that are actually
      present. Record whether custom mode drops the footer.
- [ ] Confirm that a shared CSS file can be imported from `theme.css` and that
      Tailwind utilities in it survive Blume's build. Confirm ventiws needs and
      accepts `@farben/ui`, `theme.css`, and `components.ts`.
- [ ] Check the candidate surface, muted text, interactive border, and focus
      ring against WCAG 2.2 AA in both themes. Record the measured ratios and
      require 3:1 for interactive boundaries and focus indicators.
- [ ] Record the reference captures and decisions in the pull request. Do not
      commit scratch pages.

**Exit:** Baseline captures exist, every Blume claim used by this plan has been
verified against the installed version, and no selector is invented.

### M1: Editorial foundation and chrome

- [ ] Add `packages/ui/src/lib/styles/editorial.css` with the neutral label,
      rule, index, and square utilities, then export it from the package.
- [ ] Set `theme.radius: "none"` and the verified per-mode background values in
      both apps. Add the verified footer copyright and links.
- [ ] Add `apps/vws-docs/theme.css`, `apps/vws-docs/components.ts`, and the
      `@farben/ui` workspace dependency.
- [ ] Confirm `@source "../../packages/ui/src";` in the uWebZockets
      `theme.css`, add it to the ventiws `theme.css`, and confirm the shared
      component utilities are emitted.
- [ ] Split the app-local chrome and content rules into the files named in the
      architecture table and import them from each `theme.css`.
- [ ] Reskin the header, search trigger and dialog, sidebar, mobile drawer,
      table of contents, page actions, and footer through app-local CSS.
- [ ] Verify focus order, visible focus, keyboard search, locale switching,
      theme toggle, drawer scrolling, and 320px layout in both themes.

**Exit:** Both docs sites show the same chrome grammar with their own accent,
Blume behavior is unchanged, and keyboard and contrast checks have evidence.

### M2: Content components

- [ ] Style cards, callouts, code blocks, tables, tabs, steps, accordions,
      badges, pagination, feedback, search results, and page actions.
- [ ] Remove decorative card chrome from reading pages; keep cards only where a
      card communicates a discrete destination.
- [ ] Verify code copy, language labels, table scrolling, tab keyboard behavior,
      accordion state, and pagination order.
- [ ] Check the component set at 320px, 768px, and desktop in both themes and
      both locales. Fix overflow before tuning color.

**Exit:** A page using the full component set has consistent editorial styling,
no horizontal overflow, no lost keyboard behavior, and recorded captures.

### M3: Landing structure and colophon

- [ ] Set `mode: custom` on all four home pages and author the eyebrow, h1,
      summary, and actions in MDX. Keep frontmatter `title` and `description`
      accurate for navigation and SEO.
- [ ] Replace the home `CardGroup` with the numbered index. Keep the existing
      product facts, example, and Getting Started and GitHub destinations.
- [ ] Add the app-local colophon component, register it, and place it at the end
      of each home page. Confirm its links match the docs footer.
- [ ] Verify that the first action is visible at 320x568 in the initial viewport
      without scrolling, that there is exactly one h1, and that the English and
      Vietnamese pages have equivalent content.
- [ ] Check the generated route, page title, description, search entry, and
      Markdown twin after the build.

**Exit:** All four home routes read as editorial front pages with no duplicate
heading, no missing action, and no broken locale or discovery output.

### M4: Butterfly hero component

- [ ] Draw three to five original silhouettes as plain text data and inspect
      spacing at real mobile and desktop sizes.
- [ ] Implement the typed shared Svelte component and the pure data helpers.
      Declare the existing `gsap` catalog entry in `packages/ui/package.json`
      before the component imports it. Keep every source file at or below 200
      lines; split by responsibility.
- [ ] Render stable initial positions and a static no-JavaScript arrangement.
- [ ] Add scoped GSAP drift and flutter, responsive counts, a reduced-motion
      branch, and complete mount, media-query, viewport, visibility, and unmount
      cleanup.
- [ ] Add the pause and resume control with localized labels, visible focus, and
      persisted state for the page visit.
- [ ] Test only the pure position and count logic under `tests/<category>/`,
      importing from `vite-plus/test`. Inspect motion and keyboard behavior in
      the browser.

**Exit:** The isolated component is readable, static without JavaScript,
motion-safe, type-checks through `@farben/ui#check`, and has browser evidence
for reduced motion and no JavaScript.

### M5: Integrate and tune both sites

- [ ] Register the hero in both `components.ts` files with the verified
      hydration directive and place it on all four home routes with the site
      palette and localized control labels.
- [ ] Tune count, placement, and exclusion zones at 320px, 768px, and desktop.
      Keep the art away from the title, summary, actions, navigation, and code.
- [ ] Verify English and Vietnamese copy, links, navigation, search, theme
      toggle, generated routes, and `llms.txt` after both builds.
- [ ] Profile the hero on a lower-end mobile device. Reduce count or motion if
      frame rate suffers; do not change the renderer in this slice.

**Exit:** Both sites use the shared motion behavior with their own palette, and
normal documentation interaction still works in both locales.

### M6: Review and release

- [ ] Compare before and after captures for every site, locale, breakpoint, and
      theme. Check text overlap, clipping, visible actions, and rule alignment.
- [ ] Use the keyboard only to reach links, theme toggle, search, locale menu,
      navigation, and the pause control. Check focus order and visible focus.
- [ ] Test reduced motion, no JavaScript, tab visibility, scroll out and back,
      repeated mount and unmount, and a 320px viewport.
- [ ] Check contrast, target sizes, and the decorative glyphs' effect on text
      contrast. Confirm no information is conveyed by color alone.
- [ ] Run the full repository gate, review the diff for generated output,
      unexpected dependencies, copied source, and unrelated changes.
- [ ] Record exact commands and outcomes in the pull request. Do not claim an
      unrun check.

**Exit:** Accessibility and visual evidence is recorded, both docs builds pass,
and the shared package passes the repository gate.

## Accessibility, motion, and performance

- Every interactive element is reachable by keyboard and has a visible focus
  state. Icon-only controls have accessible names.
- Keep Blume's search focus handling, Escape behavior, and focus return intact.
  Do not trap focus in the landing page.
- Keep a skip link and a logical heading order. The landing page has one h1.
- Set `scroll-padding-top` so anchored headings are not hidden under the sticky
  header.
- Meet WCAG 2.2 AA contrast for text, controls, borders, and focus in both
  themes. Muted metadata must still meet the text threshold where it carries
  meaning.
- Touch targets are at least 24px, and 44px where the layout allows.
- Do not use color alone for active, warning, or error states.
- Motion is limited to the butterfly scene and short control transitions. Respect
  `prefers-reduced-motion` and provide the pause control required by WCAG 2.2.2.
- Pause or stop the hero when the tab is hidden or the hero scrolls out of view.
  Clean up observers, listeners, and tweens on unmount.
- Do not add WebGL, a physics loop, or a page-wide animation frame.
- No new fonts or dependencies. Keep the hero DOM small and the static state
  cheap. Profile before increasing count.
- Keep the page useful without JavaScript: links, headings, the summary, the
  example, and the header controls must all render.

## Verification and evidence

This document is a plan, not an implementation. The pull request that lands it
changes `TODO.md` only. Its checks are:

```sh
pnpm format:check
git diff --stat
```

`pnpm lint`, `pnpm check:size`, `pnpm test`, the app checks, and the builds do not
validate a root Markdown plan. Do not claim them as evidence for this document.
When the implementation starts, use the full gate and the narrowest app checks:

```sh
pnpm exec vp run @farben/ui#check
pnpm exec vp run uwz-docs#check
pnpm exec vp run vws-docs#check
pnpm exec vp run uwz-docs#build
pnpm exec vp run vws-docs#build
pnpm ready
```

Record the working directory, command, and outcome for each run. The evidence
matrix is:

| Surface            | Viewports           | Themes      | Locales | Checks                                           |
| ------------------ | ------------------- | ----------- | ------- | ------------------------------------------------ |
| Landing pages      | 320x568, 768, 1280+ | Light, dark | en, vi  | First action, one h1, no overlap, colophon       |
| Docs chrome        | 320, 768, 1280+     | Light, dark | en, vi  | Keyboard, focus, drawer, search, theme, contrast |
| Content components | 320, 768, 1280+     | Light, dark | en, vi  | Overflow, copy, tabs, tables, pagination         |
| Butterfly hero     | 320, 768, 1280+     | Light, dark | en, vi  | Reduced motion, no JS, pause, tab visibility     |

Use generated `dist/` and `.blume/` output only for inspection. Never edit it.

## Research references

- [Vize documentation](https://vizejs.dev/) and the
  [Vize repository](https://github.com/ubugeeei-prod/vize).
- [Vize theme configuration](https://github.com/ubugeeei-prod/vize/blob/main/docs/vite.config.ts)
  shows the paper, dark, accent, radius, and font tokens.
- [Vize theme overrides](https://github.com/ubugeeei-prod/vize/blob/main/docs/theme/style.css),
  [feature index](https://github.com/ubugeeei-prod/vize/blob/main/docs/theme/features.css),
  [navigation](https://github.com/ubugeeei-prod/vize/blob/main/docs/theme/navigation.css),
  and [entry layout](https://github.com/ubugeeei-prod/vize/blob/main/docs/theme/entry-layout.css)
  show the header, sidebar, footer, hero, and numbered index grammar.
- [Blume theming](https://useblume.dev/docs/configuration/theming) documents
  radius, per-mode colors, fonts, and `theme.css` tokens.
- [Blume customization](https://useblume.dev/docs/configuration/customization)
  documents component and layout overrides, islands, and ejection.
- [Blume frontmatter layout](https://useblume.dev/docs/content/frontmatter#layout)
  documents `mode: custom` and the other page modes.
- [Blume configuration](https://useblume.dev/docs/configuration#footer) documents
  footer links, copyright, and social profiles.
- [Astro framework components](https://docs.astro.build/en/guides/framework-components/)
  explains server rendering and client hydration of Svelte islands.
- [Svelte lifecycle hooks](https://svelte.dev/docs/svelte/lifecycle-hooks)
  documents mount and teardown boundaries.
- [GSAP matchMedia](https://gsap.com/docs/v3/GSAP/gsap.matchMedia/) documents
  responsive conditions and automatic animation reversion.
- [WCAG 2.2.2 Pause, Stop, Hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html)
  defines the control requirement for ongoing automatic motion.
- [WCAG 2.2 target size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
  and [focus appearance](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html)
  define the control geometry and focus checks.
- [ascii-sharks](https://github.com/stackedlol/ascii-sharks) and its
  [engine source](https://raw.githubusercontent.com/stackedlol/ascii-sharks/main/src/engine.ts)
  are the motion and glyph reference for the butterfly scene.
- Vize is MIT licensed, but no Vize code, CSS, artwork, copy, or identity is
  copied. If a rule is adapted beyond generic layout grammar, record its source
  in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) and retain the license.
- If any upstream code or artwork is copied instead of independently written,
  retain its license, record provenance in the third-party notices, and rewrite
  copied code to the repository's functional rules: no classes, prototypes, or
  `this`.
