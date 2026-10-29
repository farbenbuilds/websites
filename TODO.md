# Editorial documentation design and living ASCII butterfly heroes

This is the implementation plan for the uWebZockets and ventiws documentation
sites. It covers two coupled tracks: an editorial design system for the site
chrome, content components, and documentation home pages, with the visual grammar
of [vizejs.dev](https://vizejs.dev/) as its reference; and the already-decided
ASCII butterfly heroes for the home pages. The hero also adopts the animation and
material grammar of the ASCII koi pond on [daoho.dev](https://www.daoho.dev/),
studied in its [public repository](https://github.com/Dao-Ho/portfolio). The
ascii-sharks field remains the density and engineering base; the koi pond supplies
the material, atmosphere, and choreography that make it feel alive. All boxes
below describe future work; this document does not implement either track.

Vize is a visual reference, not a source to copy. Its documentation theme is
built for Ox Content and Vue, while these sites use Blume, Astro, and Svelte.
Adopt the grammar: paper surfaces, hairline rules, square geometry, display
type, mono metadata, numbered indexes, and quiet chrome. Keep Farben's own
fonts, accents, copy, artwork, and component code.

## Scope: current apps and future apps

`apps/` currently contains two applications, both Blume documentation sites:

| Path                 | Status          | Framework                    | Covered by this plan |
| -------------------- | --------------- | ---------------------------- | -------------------- |
| `apps/uwz-docs`      | Exists          | Blume, Astro, Svelte islands | Yes                  |
| `apps/vws-docs`      | Exists          | Blume, Svelte available      | Yes                  |
| Future marketing app | Not initialized | Undecided                    | No                   |
| Future shop app      | Not initialized | Undecided                    | No                   |

This plan covers the two existing docs apps and their localized home pages:
two apps times English and Vietnamese locales, four routes in total. It does not
initialize the marketing site, the merchandise shop, or any third app, and it does
not choose their framework. A future app may use another framework, a different
rendering model, or no shared UI package. If one is added, it gets its own
`apps/<name>` workspace member, framework, and build configuration. Reuse the
editorial grammar and tokens where they fit; do not assume Blume, Astro, Svelte,
or `@farben/ui` for a future app.

Throughout this plan, "docs home page" means `/` or `/vi/` inside an existing
docs app. It does not mean a separate marketing or branding site.

`packages/ui` is currently a Svelte and shadcn-svelte package. A future app on
another framework can share design tokens and CSS decisions, but it cannot consume
the Svelte components directly. Adding a framework-specific shared package is a
separate decision with its own plan.

## Status and decisions

| Decision                                              | Status                                                                       |
| ----------------------------------------------------- | ---------------------------------------------------------------------------- |
| Blume remains the framework for the two docs apps     | Decided. Do not eject or hand-edit generated output.                         |
| Vize supplies the visual grammar                      | Decided. Do not copy its code, palette, identity, or assets.                 |
| Dao Ho's koi pond supplies the hero animation grammar | Decided. Study only. The repository has no license, so do not copy anything. |
| Docs home pages use Blume's `mode: custom`            | Decided. Only the two existing Blume apps; not a future framework decision.  |
| The butterfly field uses Svelte, Canvas 2D, and CSS   | Decided. Dense field; no Three.js, Threlte, or WebGL.                        |
| Large specimens rasterize procedurally into cells     | Decided. Small and midground butterflies use a cached sprite atlas.          |
| Both docs sites share one editorial grammar           | Decided. Keep each site's accent and paper temperature.                      |
| Blume keeps docs routing, search, i18n, and discovery | Decided. Restyle only the presentation boundary.                             |

uWebZockets keeps its orange accent over warm paper. ventiws keeps its teal
accent over cool paper. The layout, type, rules, and component grammar are
shared. The hero keeps the same two-temperature structure while adopting one
animation grammar.

### Hero technology decision

The earlier plan assumed three to five DOM text blocks. The intended hero is a
dense ASCII field, closer to the
[ascii-sharks reference](https://github.com/stackedlol/ascii-sharks): its home
scene runs 85 to 340 small fish plus four large sharks on a Canvas 2D cell grid.
Replacing those fish and sharks with a butterfly population at that density makes
one DOM node per glyph the wrong renderer.

The animation target is not a decorative sprinkle. The koi pond on
[daoho.dev](https://www.daoho.dev/) is a single-screen ASCII habitat: a
full-viewport Canvas 2D cell field in which a few large, procedurally outlined koi
carry the subject, many smaller details carry depth, and wake, ripples, shadow,
food, and bite flashes make the field feel inhabited. The butterfly hero adopts
that material and motion grammar at documentation scale. Two to four poster-scale
specimen butterflies are rasterized procedurally into cells with real wing
anatomy, veins, and eyespots. A dense midground of smaller butterflies comes from
a cached sprite atlas. A quiet atmosphere of drifting pollen, wingbeat downdraft,
and fading air traces gives the field weather. The hero remains a bounded region,
not a page-wide canvas, but inside that frame it should read as one continuous
living illustration rather than a repeated icon pattern.

Use Svelte for the component lifecycle, a Canvas 2D context for the field, and
CSS for the surrounding hero. The canvas draws monospace glyphs into a cell grid;
the simulation handles drift, wing phase, depth, body-space texture, and wrapping.
Three.js, Threlte, and WebGL are unnecessary for a two-dimensional cell field.
GSAP is not the right driver for a cell simulation, so it does not own the hero
loop.

Canvas cannot render without JavaScript, so keep a server-rendered static ASCII
arrangement behind it. The canvas replaces the static art only after hydration; if
the canvas fails or the reader has no JavaScript, the static art remains. Draw
original butterflies and write independent simulation code. Adapt the engineering
principles shared by ascii-sharks and the koi pond, such as a fixed timestep,
capped device pixel ratio, content avoidance, offscreen pausing, one coherent
still frame under reduced motion, and cleanup on unmount, not their classes or
code. The koi pond repository publishes no license file, so treat it as all
rights reserved and copy nothing from it.

## Goal and non-goals

The goal is that the four localized docs home routes, two apps times two locales,
and both documentation sets read as one publication: a warm paper surface,
ink-like text, square controls, fine rules, mono labels, one accent per site, and
a poster-scale docs home hero that does not push the first useful link out of a
mobile viewport. The second goal is that the butterfly scenes remain decorative,
accessible, and cheap to render.

Non-goals for this plan:

- Do not initialize the marketing site, merchandise shop, or any third app, and
  do not choose their framework, rendering model, or shared UI package.
- Do not make `@farben/ui` or Blume a requirement for a future app. Share tokens
  and editorial grammar only where the chosen framework can consume them.
- Do not add a new third-party font, UI framework, CSS framework, or motion
  dependency.
- Do not replace Blume's search, localization, navigation, or generated
  `llms.txt` and `llms-full.txt` output.
- Do not clone Vize's layout pixel for pixel or reuse its palette and assets.
- Do not reproduce a koi pond, koi, water, feeding behavior, or the koi pond's
  palette, fonts, copy, code, or artwork.
- Do not copy or adapt code from Dao Ho's portfolio. The repository publishes no
  license file, so it is a study reference only.
- Do not turn the hero into a game, a full-page canvas, or a click-to-feed
  interaction.
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
few surfaces, one rule weight, and metadata that is visibly secondary. Vize's
full-page WebGL canvas, hidden header, and bottom mobile action bar are not part
of the grammar we need. The butterfly field is a bounded Canvas 2D hero, not a
page-wide background.

### Adopt, adapt, reject

| Vize move                                  | Farben decision                                                                                                         |
| ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| Warm paper and ink surfaces                | Adopt as one structure with two temperatures: warm for uWebZockets, cool for ventiws. Verify contrast in both modes.    |
| Zero radius and 1px rules                  | Adopt through `theme.radius: "none"` and a zero `--radius` mapping.                                                     |
| Mono uppercase labels and index numbers    | Adopt for labels, index numbers, keyboard hints, and footer metadata. Never use mono for body copy.                     |
| Poster display type with negative tracking | Adapt to a clamp on the docs home page and a 2rem heading in docs; never use a 20vw title inside a reading page.        |
| Numbered two-column feature index          | Adopt on the docs home page in place of a card grid.                                                                    |
| Transparent sidebar with hairline groups   | Adopt at the token and selector layer while keeping Blume's layout and focus behavior.                                  |
| Compact header controls                    | Adopt the density and square geometry, but keep Blume's 64px sticky header and its built-in search and drawer behavior. |
| 100vh entry page                           | Adapt into a custom-mode docs home page whose first action remains visible at 320x568 without scrolling.                |
| Hidden header until scroll                 | Reject. Documentation navigation must stay available without a scroll script.                                           |
| Bottom mobile action bar                   | Reject. Blume's built-in drawer, search, and theme controls cover the need; M1 verifies them.                           |
| Fixed full-page ambient WebGL canvas       | Reject. Use a bounded Canvas 2D butterfly field inside the hero; no page-wide canvas.                                   |
| Vize palette, Helvetica, name, logo, copy  | Reject. Keep Google Sans Flex, Be Vietnam Pro, JetBrains Mono, and Farben's butterfly mark.                             |

## Reference study: Dao Ho koi pond

Checked on 2026-10-29 against the live site and the repository at commit
`914651c`. The home page is one single-screen scene: a full-viewport Canvas 2D
ASCII koi pond behind a small monospace prose block, a centered one-line nav, and
a theme toggle. The field is the hero, and the text behaves like a caption to it.

The repository has no license file and no license metadata. Treat it as all
rights reserved. This study records observable behavior and animation principles
only; it does not grant permission to copy code, artwork, palettes, fonts, or
copy.

| Surface              | Observed behavior                                                                                                                                                                                                                                |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Stage                | `100dvh`, no scroll, canvas `absolute inset-0`, text and nav above it, prose bottom-aligned with wide gutters. Dark is the default theme.                                                                                                        |
| Cell grid            | Near-square cells about 8 to 12px wide and 2px taller, roughly 125 columns. Per-cell typed buffers hold glyph, color, alpha, tile color, tile alpha, and a text-dimming multiplier.                                                              |
| Anatomy              | Koi are procedural, not sprites: a 20-node spine, analytic body half-width, fanned tail, pectoral fins, eye, and barbels. Cell coverage is sampled at the center and four sub-points.                                                            |
| Material             | Every cell can carry a tinted tile and a glyph. Tiles are mixed toward the page background, shaded by body curvature, and etched with a density-ranked glyph. Red patches run a multi-stop color ramp with a travelling sheen.                   |
| Body-locked texture  | Markings, scale grain, and glints are keyed to body coordinates and koi id, so the pattern rides with the skin instead of shimmering through the grid.                                                                                           |
| Water                | Layered systems make the pond feel inhabited: a blurred wake-energy field deposited by tails and the pointer, expanding ASCII ripple rings, a depth-offset shadow, and short-lived pellets and bite flashes.                                     |
| Behavior             | Koi wander, burst and coast with tail beats, drift between depth layers, turn curious near the pointer, flee a fast swipe, and race toward food dropped by a click. Chasing raises speed, turn rate, and body wave amplitude together.           |
| Composition          | One large subject group, a few young fish for scale, and a field of small effects. No cards or colored panels in the stage; the only chrome is a small mono nav and hover cards.                                                                 |
| Text hierarchy       | Monospace throughout at 13 to 15px. A 0.6-opacity quote with a blinking caret, a 0.2s-delayed fade-in for the prose, and opacity steps at 0.6, 0.4, and 0.32 for metadata and socials.                                                           |
| Content safety       | Nodes marked for avoidance are measured every 30 frames, nearby boxes merge at a 160px gap, koi steer around them, and cells under text dim to 0.15.                                                                                             |
| Interaction feedback | Hovering a citation dims the rest of the prose with `:has`, underlines firm from 35% to full foreground, and a source card enters in 0.12s.                                                                                                      |
| Loop and resilience  | Fixed 1/60s step, at most four steps per frame, delta clamped to 0.1s. DPR capped at 2. Reduced motion pre-simulates four seconds and holds one frame. Resize and intersection observers schedule work; every listener and observer is released. |
| Theme                | Two palette objects, one per mode, swapped through the renderer; the stage transitions its colors in 300ms while controls use 150ms.                                                                                                             |

### Why it looks alive

1. Scale contrast. Two or three large bodies carry the subject while dozens of
   small marks carry depth. The eye reads anatomy first and texture second.
2. Material honesty. Tiles and glyphs are composed like ink on paper. The field
   is not a wall of characters, and it is not a smooth illustration with ASCII
   decoration on top.
3. Body-locked detail. Markings, grain, and glints belong to the creature. The
   grid never crawls underneath them.
4. Rhythm. Burst-and-coast tail beats, depth changes, curiosity, and startle give
   the motion a pulse. A constant speed with a constant sine wave would read as a
   screensaver.
5. Memory. The wake field diffuses and decays, so the scene retains a short
   history of movement. Motion leaves a trace instead of disappearing.
6. Inverted hierarchy. The art is large and the prose is small. The typography is
   confident enough to step back.
7. Restraint. Two neutral surfaces, one accent, one glyph family, one cell grid.
   The home chrome is mostly borderless. Hover cards add a quiet shadow, which
   Farben does not adopt.

### What the butterfly hero adopts

| Koi pond move                         | Farben decision                                                                                                                          |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Large procedural subjects             | Adopt for two to four foreground specimen butterflies with real wing outlines, veins, antennae, and eyespots.                            |
| Tinted cell tiles plus glyphs         | Adopt with original butterfly anatomy and Farben palettes. Tiles carry wing color; glyphs carry veins, edges, and body texture.          |
| Body-locked markings and glints       | Adopt. Key wing bands, eyespots, and vein detail to body coordinates so they do not shimmer.                                             |
| A layered living field                | Adapt water to air: a diffusing wingbeat downdraft field, drifting pollen, and short-lived air traces. No water, ripples, food, or fish. |
| Burst-and-coast behavior              | Adopt as flap-and-glide cycles, with depth, phase, and scale variation so the field never visibly loops.                                 |
| Pointer curiosity and feeding         | Adapt to a calm breeze only. A nearby pointer lifts and parts the field; no click, no feeding, no touch capture, no gameplay.            |
| Content avoidance and dimming         | Adopt. Measure hero content boxes, merge nearby boxes, steer around them, and dim cells under text.                                      |
| Mono caption prose over a large field | Adapt. Keep the editorial display h1 and readable body copy, but bottom-align the hero text and let the field rise above and beside it.  |
| Full-page canvas and no-scroll stage  | Reject. The docs hero stays bounded and the first useful action stays visible at 320x568.                                                |
| Koi pond palette, fonts, and copy     | Reject. Keep Farben's tokens, fonts, copy, and butterfly identity.                                                                       |
| Click-to-feed interaction             | Reject. A documentation home page must not become a toy or hide navigation behind pointer play.                                          |
| Blinking caret and native transitions | Reject in docs chrome. Keep motion inside the hero and short control transitions.                                                        |
| Repository code and artwork           | Reject. The repository is unlicensed. Reimplement the behavior from written principles and original geometry.                            |

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
- Use the accent for interactive meaning, not large fills. A primary docs home
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
- Expose `--farben-field-paper`, `--farben-field-ink`,
  `--farben-field-muted`, and `--farben-field-accent` in each app. The shared
  field receives those values through a typed palette and never reads
  `--blume-*` directly.

### Type

| Role     | Family           | Size, weight, tracking                                  | Use                                       |
| -------- | ---------------- | ------------------------------------------------------- | ----------------------------------------- |
| Display  | Google Sans Flex | Docs home `clamp(2.75rem, 9vw, 5.5rem)`, 600, `-0.05em` | Docs home h1 only                         |
| Display  | Google Sans Flex | Docs h1 `2rem`, 600, `-0.04em`, 1.15 line height        | Page title                                |
| Display  | Google Sans Flex | h2 `1.375rem`, 600, `-0.02em`; h3 `1.125rem`, 600       | Section hierarchy; h2 gets a 1px rule     |
| Body     | Be Vietnam Pro   | `1rem`, 400, 1.7 line height                            | Prose, controls, navigation               |
| Small    | Be Vietnam Pro   | `0.875rem`, 400, 1.55 line height                       | Card copy, captions, footer links         |
| Label    | JetBrains Mono   | `0.68rem`, 600, `0.12em`, uppercase                     | Section labels, kbd hints                 |
| Metadata | JetBrains Mono   | `0.64rem`, 500, `0.08em`                                | Index numbers, rail headings, footer meta |

Do not set body copy in mono. Do not use wide tracking on sentences. Keep
localized labels short because uppercase and tracking can slow Vietnamese
diacritic reading.

### Geometry and spacing

- One corner radius: zero.
- One rule weight: 1px at the border token. Use rules to separate groups,
  sections, and the footer; do not box every element.
- Controls are square. Use 36px icon buttons on desktop and 44px touch targets
  on coarse pointers. Never go below the 24px WCAG 2.2 target minimum.
- Docs home sections use generous vertical padding, around 3.5rem to 5.75rem.
  Docs sections stay compact enough to read continuously.
- Docs home content is capped around 1120px. Docs content keeps Blume's
  `--blume-content-width`.
- No shadows. A dialog may use a 1px border and a solid paper surface instead.

### Motion and states

- Controls transition color, background, border, and transform in 120-180ms.
  Do not animate layout properties.
- The docs home copy may enter once on load with a 240-360ms opacity and 4-8px
  translate fade. Stagger the eyebrow, heading, summary, and actions by no more
  than 80ms. Do not add scroll-triggered reveals.
- Do not add a blinking caret, a typewriter effect, a marquee, a parallax layer,
  or a cursor-following ornament outside the hero field.
- Focus is a visible 2px accent ring with a 2px offset. Do not remove an outline
  without a replacement.
- Hover shifts text to foreground and background to muted; active rows add
  weight. Disabled controls use reduced opacity plus a cursor change.
- A citation or inline link may dim its surrounding text only when the
  destination is a supplement to the sentence, not when the sentence depends on
  the linked words. Keep the dimming at or above 32% foreground and restore it on
  Escape, blur, and pointer leave.
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
| Docs home colophon            | App          | Links and copyright from the docs home content                       | Same visual grammar as the footer; used only where custom mode drops Blume's footer   |

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
- Blume's custom page mode drops the footer. The docs home pages therefore need
  the app-local docs home colophon described later in this plan; docs pages keep
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
- Keep each stylesheet under 400 lines. Split chrome selectors from article
  component selectors before the limit.

## Documentation home page contract

Every home route uses `mode: custom` in frontmatter. Blume then renders the
header only; the page owns its heading, layout, and page end. The frontmatter
`title` and `description` still supply navigation, SEO, and generated metadata.

The docs home page has five regions:

1. A short mono eyebrow, localized and factual. No decorative Japanese text.
2. The product name as the only h1, at the display clamp above.
3. The summary, with the first useful action visible at 320x568 without
   scrolling.
4. Two actions: Getting Started as the ink-filled primary link, GitHub as the
   bordered secondary link.
5. A dense Canvas 2D butterfly field in a bounded decorative region beside or
   behind the text, never over the heading, paragraph, or actions.

On desktop, use an asymmetric composition: text bottom-aligned in roughly a 5/12
column, with the canvas in a 7/12 field that bleeds to the right and top edges of
the hero. The field should feel like a plate printed on the page, not a widget in
a box. On mobile, stack the text first and place a shorter canvas band after it;
never put art behind the summary. A paper scrim may sit between the canvas and the
text, but no glyph may cross the text exclusion area. The hero carries the
reference's inverted hierarchy at documentation scale: the field is large and the
metadata is small, while the h1 stays a real display heading and the first action
stays above the fold.

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
- End with the docs home colophon: copyright, source, and documentation links, plus
  a license link only when the product repository publishes one. It must match
  the docs footer visually and use the same destinations.
- Keep the English and Vietnamese pages equivalent. Translate labels; do not
  translate product names or code identifiers.

Do not add a second h1, a 100vh lock, a page-wide canvas, or a card grid.
The page should read as an editorial front page, not a marketing splash.

## Butterfly hero contract

The hero is decoration with a job: give each site a quiet, recognizable identity
without competing with documentation. It should read as one living printed plate:
two to four large specimen butterflies, a dense midground population, and
drifting air share one cell grid. The reference is the koi pond's sense of
habitat, material, and rhythm, not its fish, water, palette, or code. It is a
dense field, not a sparse accent.

### Field and sprites

- Use a hybrid renderer. Render every butterfly into a Canvas 2D cell grid, but
  split the population by size. Two to four foreground specimen butterflies are
  rasterized procedurally per frame. The 80 to 160 small and midground
  butterflies are pre-rendered sprites drawn with `drawImage`. At 320px start
  with 24 to 48 small butterflies plus one specimen, then tune from measured
  frame time. The specimen count is a hard cap, not a tuning variable.
- Size the cell grid from the mono face. Start near 8 to 12px wide with a cell
  2px taller than it is wide. Derive the column count from the measured canvas,
  not from breakpoints; expect roughly 60 to 110 columns on desktop and 35 to 60
  on a narrow hero.
- Draw original butterfly anatomy for the specimens: a spine, thorax, abdomen,
  antennae, forewing, hindwing, wing margin, veins, and an eyespot. Use analytic
  wing outlines and sample cell coverage at the center plus four sub-points, like
  a tiny rasterizer. Do not trace a photograph or copy a reference sprite.
- Use the koi pond's tile-plus-glyph material. A wing cell may carry a tinted
  tile for the wing wash and a glyph for the vein, margin, or texture. Cells near
  the edge get partial alpha and sparse glyphs. The field should read as ink and
  pigment, not as a wall of characters.
- Pre-render each midground species at three wing phases and two or three scales
  into an offscreen atlas. Rebuild the atlas when the palette, mono face, or DPR
  changes, or tint mask sprites at draw time. Keep each silhouette legible at its
  smallest rendered size and inspect the atlas at 1x and 2x DPR. A sprite smaller
  than roughly 6 by 4 cells is a dot, not a butterfly; use a mote instead.
- Lock pattern detail to body coordinates. Wing bands, eyespots, veins, and grain
  must ride with the wing through the flap cycle, keyed by body position and
  instance id. Never let a random per-frame hash shimmer across the texture.
- Build depth from alpha, glyph density, and scale, not from blur, shadow, or
  color temperature. Foreground specimens keep full contrast. Midground
  butterflies sit around 40 to 70% and the far field around 20 to 35%, with
  sparser glyphs as they recede.
- uWebZockets uses orange, amber, and yellow wing accents over the warm neutral
  surface. ventiws uses blue, green, and teal accents over the cool neutral
  surface. Keep the site accent for eyespots, pollen highlights, and the
  brightest wing edge. Use hue or brightness variation within the site palette,
  not a rainbow. Set palettes at the host layer, never inside shared field logic.
- Give the field weather. A diffusing wingbeat downdraft field, drifting pollen
  motes, and short fading air traces make the scene feel inhabited. This replaces
  the pond's water, wake, ripples, and food; do not draw water, bubbles, ripples,
  pellets, or fish.
- Use a calm editorial print composition: generous space, asymmetric balance,
  fine rules, crisp mono glyphs, and selective color. Avoid decorative cultural
  text, symbols, or imagery that suggests an unverified product connection. The
  field must not spell readable words.
- Keep the heading, summary, and links as semantic MDX or HTML. Treat the
  butterfly field as decoration, never as the only way to convey information.
  Do not put decorative glyphs into headings or link names.
- Bound the canvas to the hero region and keep a hard exclusion area around the
  title, summary, actions, navigation, search, and code. A paper scrim may sit
  between the canvas and the text. Never draw glyphs over reading text.
- Reduce density, not just canvas size, on narrow screens.

### Rendering and motion

- Compose in a fixed layer order: air field, far butterflies, midground
  butterflies, air traces, specimen tiles, specimen glyphs, pollen highlights,
  then the text-dimming pass. Draw only occupied cells; never loop over every
  possible glyph string each frame.
- Measure content safety from the DOM. Mark the hero title, summary, actions,
  and any other protected block with a field-avoid hook, measure their boxes on
  resize and every 30 frames, and merge boxes closer than about 160px so
  butterflies are not squeezed into a slot between them. Steer the field around
  the merged boxes with a soft repulsion and dim cells under text to about 0.15
  with a smoothstep falloff over four cells.
- Read the host `--farben-field-*` palette aliases for paper, ink, muted, and
  accent on mount and when the theme attribute changes through a
  `MutationObserver`. The shared code does not read `--blume-*` directly. Update
  the palette, rebuild the sprite atlas, and redraw the current frame; draw a
  still only when reduced motion is active or the field is paused.
- Wait up to two seconds for the mono face with `document.fonts.load` before the
  first draw. If it fails, draw with the system mono fallback and redraw when the
  face loads. Recompute the cell grid and rebuild the atlas after the font is
  ready. Canvas text can start before a webfont is ready, and a late font swap
  would change the cell metrics.
- Render the full first-frame composition as one server-rendered `<pre>`, not one
  node per glyph. Constrain it to the same hero art box with overflow hidden and
  no layout shift. Keep it in the DOM behind the canvas; hide it only after the
  first successful canvas frame, and restore it if the canvas context is lost.
  The static arrangement is decorative and `aria-hidden` too. The page must
  remain readable with no JavaScript or a failed canvas.
- Cap the fallback markup at 32KB and record its node count and HTML size. A
  single `<pre>` is the fallback; a reduced still is only an option under reduced
  motion, not the default no-JavaScript art.
- Mark the canvas `aria-hidden="true"` and `pointer-events-none`. Keep the pause
  control outside that subtree with an accessible name and visible focus.
- Respect `prefers-reduced-motion: reduce`: pre-simulate about four seconds so the
  butterflies spread and settle, then hold one coherent frame. Do not start the
  loop. React when the preference changes.
- Give the motion a rhythm. Each butterfly flaps and glides on its own cycle, with
  a short burst of wingbeats followed by a longer glide. Vary phase, scale, depth,
  heading, and speed. A foreground specimen may settle for a few seconds, hold
  its wings closed, then leave. The field must never visibly loop or beat in
  unison.
- If motion lasts more than five seconds alongside content, provide a
  keyboard-operable pause and resume control and persist its state for the page
  visit. Pausing stops the loop without hiding the still field.
- Use one fixed-timestep `requestAnimationFrame` loop, starting at 1/60s with at
  most four steps per frame and a delta clamp of 0.1s. Cap the device pixel ratio
  at 2 and recompute it on resize; rebuild the cell grid and sprite atlas when it
  changes. Pause on `visibilitychange` and when the hero leaves the viewport
  through an `IntersectionObserver`. Resume only when the document is visible,
  the hero is intersecting, the reader has not paused the field, and reduced
  motion is off.
- Recompute the cell grid and density from a `ResizeObserver`. Do not add scroll
  listeners or a page-wide canvas.
- Keep the loop bounded to the component. Disconnect observers, cancel the
  animation frame, and release typed buffers on unmount.
- A pointer may act as a soft breeze, not a game. Within about 180px, lift and
  part nearby butterflies and carry a little pollen. Do not capture the pointer,
  block text selection, react on touch, or respond to clicks. Ship the field
  without pointer reaction if it distracts, and keep it fully alive without a
  pointer.
- Do not use GSAP for the field or the hero. Both apps still declare GSAP from
  the earlier plan, but the hero no longer uses it; remove it separately if no
  other code imports it. The canvas loop owns the butterfly motion.
- Profile with the browser performance panel at 4x CPU slowdown. Avoid per-frame
  allocations, reuse typed arrays, and lower sprite density before lowering the
  cell resolution. Do not add a second canvas or WebGL.
- Draw original butterflies. Do not copy the koi pond's code, artwork, palette,
  or copy. If any upstream art or code is used in a later change, retain its
  license, record provenance, and rewrite the code to the repository's functional
  rules.

## Implementation architecture

Every `apps/*` path in this table belongs to the two existing docs apps. The
table does not reserve paths or architecture for the future marketing or shop
apps.

| Layer                | Responsibility                                                                               | Candidate files                                                                      | Status   |
| -------------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | -------- |
| Shared editorial CSS | Neutral label, rule, index, and square utilities that do not import Blume                    | `packages/ui/src/lib/styles/editorial.css`, `packages/ui/package.json` export        | New      |
| Shared hero          | Mount the canvas, own lifecycle, typed palette, density, labels, static fallback             | `packages/ui/src/lib/components/butterfly-hero/butterfly-hero.svelte` and `index.ts` | New      |
| Shared species       | Species definitions, palettes, wing-phase frames, scale steps, deterministic ids             | `butterfly-data.ts` under the same component folder                                  | New      |
| Shared anatomy       | Procedural specimen outline, wing and body masks, body-space texture sampling                | `butterfly-shape.ts` under the same component folder                                 | New      |
| Shared field         | Spawn, heading, flap-and-glide state, depth, avoidance, breeze, wrapping, seed               | `butterfly-field.ts` under the same component folder                                 | New      |
| Shared sprites       | Offscreen sprite atlas, palette, font, and DPR cache, tint and draw helpers                  | `butterfly-sprites.ts` under the same component folder                               | New      |
| Shared atmosphere    | Wingbeat downdraft diffusion, pollen motes, air traces, typed buffers                        | `butterfly-atmosphere.ts` under the same component folder                            | New      |
| Shared renderer      | Canvas 2D cell grid, tile and glyph layers, DPR handling, font readiness, theme, still frame | `butterfly-renderer.ts` under the same component folder                              | New      |
| Shared loop          | Fixed-timestep animation frame, resize, visibility, intersection, reduced motion, cleanup    | `butterfly-loop.ts` under the same component folder                                  | New      |
| Docs home colophon   | Static per-app footer with copyright and links                                               | `apps/*/components/site-colophon.astro`, `apps/*/components.ts`                      | New      |
| Site tokens          | Import shared tokens, map shadcn variables and field palette aliases                         | `apps/uwz-docs/theme.css`, new `apps/vws-docs/theme.css`                             | Mixed    |
| Site chrome CSS      | Blume-specific header, sidebar, footer, search, and TOC selectors                            | `apps/*/styles/blume-chrome.css`                                                     | New      |
| Site component CSS   | Blume-specific cards, callouts, code, tables, tabs, steps, and pagination                    | `apps/*/styles/blume-content.css`                                                    | New      |
| Site config          | Radius, background, footer content, GitHub links                                             | `apps/*/blume.config.ts`                                                             | Existing |
| Docs home content    | Custom-mode hero, numbered index, example, colophon                                          | `apps/*/docs/index.mdx`, `apps/*/docs/vi/index.mdx`                                  | Existing |
| Site registry        | Register hero and colophon for MDX                                                           | `apps/uwz-docs/components.ts`, new `apps/vws-docs/components.ts`                     | Mixed    |
| Site dependency      | Add the shared package to ventiws; no new third-party runtime packages                       | `apps/vws-docs/package.json`, lockfile                                               | Existing |

Boundaries:

- The shared editorial CSS must not import Blume, name Blume selectors, or read
  Blume tokens implicitly. Hosts map their theme into the shared primitives.
- Blume-specific selectors stay in the apps. Do not put `data-blume-*` rules in
  `packages/ui`.
- Shared primitives live in `@farben/ui`; app-local components own site-specific
  links and Blume selectors. Keep the docs home colophon and docs footer
  destinations in sync with a parity check.
- The shared field and renderer receive a typed palette resolved from
  `--farben-field-*` aliases. Only the app `theme.css` maps those aliases to
  Blume tokens; shared code never reads `--blume-*` directly.
- The anatomy, field, and atmosphere modules stay pure and data-driven. DOM,
  Canvas, observers, and the clock live in the Svelte component and the loop
  module. The renderer owns only Canvas context state and typed cell buffers.
- Do not add a new third-party runtime dependency. Add the existing
  `@farben/ui` workspace package to ventiws. The hero uses the browser Canvas 2D
  API; no renderer package or GSAP dependency is added to `packages/ui`.
- Do not edit `.blume/` or `dist/`. No `part-2` files; split anatomy, sprites,
  atmosphere, field, renderer, and loop modules by responsibility before any
  reaches 400 lines.

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

### M3: Docs home structure and colophon

- [ ] Set `mode: custom` on all four localized docs home pages and author the
      eyebrow, h1, summary, and actions in MDX. Keep frontmatter `title` and
      `description` accurate for navigation and SEO.
- [ ] Replace the home `CardGroup` with the numbered index. Keep the existing
      product facts, example, and Getting Started and GitHub destinations.
- [ ] Add the app-local colophon component, register it, and place it at the end
      of each home page. Confirm its links match the docs footer.
- [ ] Verify that the first action is visible at 320x568 in the initial viewport
      without scrolling, that there is exactly one h1, and that the English and
      Vietnamese pages have equivalent content.
- [ ] Check the generated route, page title, description, search entry, and
      Markdown twin after the build.

**Exit:** All four localized docs home routes read as editorial front pages with
no duplicate heading, no missing action, and no broken locale or discovery output.

### M4: Butterfly hero component

- [ ] Draw three to five original butterfly species and inspect them in the cell
      grid at 1x and 2x device pixel ratio. For each species, define the body,
      antennae, forewing, hindwing, margin, veins, and any eyespot, plus three
      wing phases. Record the dimensions, the smallest legible scale, and the
      smallest size that should become a mote instead.
- [ ] Implement the pure species, anatomy, field, and atmosphere modules first,
      with no DOM or Canvas import. Keep the renderer and loop effectful at the
      component edge. Keep every source file at or below 400 lines and split by
      responsibility. Do not add GSAP to the field.
- [ ] Build the offscreen sprite atlas for small and midground butterflies. Cache
      palette, font, and DPR variants; rebuild on change; tint masks at draw time
      where that is cheaper than rebuilding. Measure atlas size and draw cost.
- [ ] Build the procedural specimen rasterizer: analytic wing outlines, center
      plus four sub-points, partial coverage at edges, tinted wing tiles, vein
      and margin glyphs, and body-locked bands and eyespots. Cap it at four
      specimens and confirm the texture does not shimmer through the flap.
- [ ] Build the Canvas 2D renderer with the fixed layer order, a capped DPR, mono
      font readiness, the host palette aliases, the text-dimming pass, and a first
      frame derived from the same seed as the static fallback.
- [ ] Add the wingbeat downdraft field, pollen motes, and air traces. Keep them
      lower contrast than the butterflies. Confirm no frame reads as water,
      bubbles, ripples, or a particle screensaver.
- [ ] Add the fixed-timestep loop, flap-and-glide states, depth, wrapping,
      content avoidance, density targets, a reduced-motion pre-roll and still
      frame, pause and resume, resize, visibility, and intersection observers,
      and complete unmount cleanup.
- [ ] Implement the optional pointer breeze only after the static and
      reduced-motion paths pass. Confirm it does not capture the pointer, block
      selection, react on touch, or respond to clicks.
- [ ] Render the full first-frame composition as one server-rendered `<pre>`,
      constrained to the art box and capped at 32KB, and restore it if the canvas
      context is lost. Record its node count and HTML size.
- [ ] Verify the static-to-canvas handoff does not pop, resume happens only when
      the field is visible, not paused, and motion is enabled, and the sprite
      atlas rebuilds after a palette, font, or DPR change.
- [ ] Test only the pure spawn, wrap, density, seed, avoidance, and atmosphere
      logic under `tests/<category>/`, importing from `vite-plus/test`. Inspect
      no-JavaScript, reduced-motion, DPR, font fallback, and pointer behavior in
      the browser.

**Exit:** The isolated field reads as one living print, is dense and readable,
stays static without JavaScript, is motion-safe, type-checks through
`@farben/ui#check`, hands off without a visible pop, and has browser evidence for
reduced motion, no JavaScript, pause and resume, pointer breeze, and both pixel
ratios.

### M5: Integrate and tune both sites

- [ ] Register the hero in both `components.ts` files with the verified
      hydration directive and place it on all four localized docs home routes
      with the site palette and localized control labels.
- [ ] Tune species mix, the number of visible specimens up to the cap, sprite
      density, cell size, DPR, placement, and the field bleed at 320px, 768px,
      and desktop. Keep every glyph away from the title, summary, actions,
      navigation, and code.
- [ ] Bottom-align the hero text, stagger the copy entrance by no more than 80ms,
      and verify that the first action remains visible at 320x568 without
      scrolling.
- [ ] Check both palettes against the editorial surfaces: the field must stay
      inside its hero family, keep the site accent readable, and never reduce the
      contrast of nearby text.
- [ ] Review the flap-and-glide rhythm at normal speed. Remove unison, visible
      loops, constant-speed drift, and any specimen that reads as a static icon.
- [ ] Verify English and Vietnamese copy, links, navigation, search, theme
      toggle, generated routes, and `llms.txt` after both builds.
- [ ] Profile the field on a lower-end mobile device at 4x CPU slowdown. Lower
      sprite density before lowering the cell resolution; do not add WebGL or a
      second canvas.

**Exit:** Both sites use the shared field behavior with their own palette, the
hero reads as a living print rather than a repeated sprite pattern, frame time
stays within the agreed budget, and normal documentation interaction still works
in both locales.

### M6: Review and release

- [ ] Compare before and after captures for every site, locale, breakpoint, and
      theme. Check text overlap, clipping, visible actions, and rule alignment.
- [ ] Use the keyboard only to reach links, theme toggle, search, locale menu,
      navigation, and the pause control. Check focus order and visible focus.
- [ ] Test reduced motion, no JavaScript, the static-to-canvas handoff, fallback
      node count, canvas context loss, a failed or slow font load, theme-toggle
      redraw, sprite-atlas rebuild, pause and resume, tab visibility, scroll out
      and back, repeated mount and unmount, DPR 1, 2, and a mid-session change,
      pointer breeze on and off, text selection over the hero, and a 320px
      viewport.
- [ ] Watch the field for at least a minute and confirm there is no unison flap,
      no visible loop, no strobing, and no butterfly that collapses into a
      static icon.
- [ ] Profile the field with the browser performance panel and record frame time,
      long tasks, specimen raster cost, sprite draw count, and the effect of the
      density caps.
- [ ] Check contrast, target sizes, and the decorative glyphs' effect on text
      contrast. Confirm no information is conveyed by color alone and no glyph
      crosses a protected text box.
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
  Do not trap focus in the docs home page.
- Keep a skip link and a logical heading order. The docs home page has one h1.
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
  Clean up observers, listeners, and animation frames on unmount.
- Do not strobe. Keep alpha and color changes below the WCAG flash threshold and
  never pulse the whole field. Pollen and glints are small, sparse, and slow.
- The pointer breeze is supplementary. The field must be complete, alive, and
  legible without a pointer, and the breeze must never capture the pointer,
  prevent text selection, or run on touch.
- Text safety is absolute. The field dims under measured text boxes, never the
  other way around, and no glyph may cross the title, summary, actions,
  navigation, or code.
- Use one Canvas 2D loop, bounded to the hero. Do not add WebGL, a second loop,
  or a page-wide canvas. The canvas never receives focus.
- No new fonts or dependencies. Keep the canvas draw cost bounded: cap
  procedural specimens at four, iterate only occupied cells, reuse typed buffers,
  and profile before increasing density.
- Target 60fps on a mid-tier desktop and hold at least 30fps at the mobile
  density under 4x CPU slowdown. Reduce sprite density before lowering the cell
  resolution, and lower the cell resolution before adding a second canvas.
- Keep the page useful without JavaScript: links, headings, the summary, the
  example, the header controls, and the static butterfly arrangement must all
  render.

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
| Docs home pages    | 320x568, 768, 1280+ | Light, dark | en, vi  | First action, one h1, no overlap, colophon       |
| Docs chrome        | 320, 768, 1280+     | Light, dark | en, vi  | Keyboard, focus, drawer, search, theme, contrast |
| Content components | 320, 768, 1280+     | Light, dark | en, vi  | Overflow, copy, tabs, tables, pagination         |
| Butterfly field    | 320, 768, 1280+     | Light, dark | en, vi  | No JS, reduced motion, pause, DPR, frame time    |

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
- [MDN Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
  documents the 2D context used for the field.
- [MDN requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame)
  and [devicePixelRatio](https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio)
  document the loop and the capped backing-store scale.
- [MDN FontFaceSet.load](https://developer.mozilla.org/en-US/docs/Web/API/FontFaceSet/load)
  documents the mono-font readiness check before the first draw.
- [MDN ResizeObserver](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver)
  and [IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver)
  document the grid and viewport pause boundaries.
- [WCAG 2.2.2 Pause, Stop, Hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html)
  defines the control requirement for ongoing automatic motion.
- [WCAG 2.2 target size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
  and [focus appearance](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html)
  define the control geometry and focus checks.
- [ascii-sharks](https://github.com/stackedlol/ascii-sharks), its
  [engine](https://raw.githubusercontent.com/stackedlol/ascii-sharks/main/src/engine.ts),
  and its [cell renderer](https://raw.githubusercontent.com/stackedlol/ascii-sharks/main/src/renderer.ts)
  are the density and engineering reference for the butterfly field.
- [daoho.dev](https://www.daoho.dev/) and the
  [Dao-Ho/portfolio repository](https://github.com/Dao-Ho/portfolio) at commit
  `914651c` are the animation and material study for the butterfly hero. The
  relevant source files are
  [koi-pond.tsx](https://github.com/Dao-Ho/portfolio/blob/main/src/app/components/koi-pond/koi-pond.tsx)
  for lifecycle and interaction,
  [world.ts](https://github.com/Dao-Ho/portfolio/blob/main/src/app/components/koi-pond/world.ts)
  for behavior and fluids,
  [renderer.ts](https://github.com/Dao-Ho/portfolio/blob/main/src/app/components/koi-pond/renderer.ts)
  for cell tiles, glyphs, and wakes, and
  [shape.ts](https://github.com/Dao-Ho/portfolio/blob/main/src/app/components/koi-pond/shape.ts)
  for procedural anatomy. The
  [front page](https://github.com/Dao-Ho/portfolio/blob/main/src/app/components/front-page.tsx)
  and [globals.css](https://github.com/Dao-Ho/portfolio/blob/main/src/app/globals.css)
  show the caption-scale typography and entrance timing.
- Vize is MIT licensed, but no Vize code, CSS, artwork, copy, or identity is
  copied. If a rule is adapted beyond generic layout grammar, record its source
  in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) and retain the license.
- Dao-Ho/portfolio publishes no license file and no license metadata. It is
  all rights reserved by default. Do not copy or adapt its code, artwork,
  palettes, fonts, or copy, and do not add a third-party notice that implies a
  license that does not exist. The hero is an independent implementation of
  written animation principles.
- If any upstream code or artwork is copied instead of independently written,
  retain its license, record provenance in the third-party notices, and rewrite
  copied code to the repository's functional rules: no classes, prototypes, or
  `this`.
