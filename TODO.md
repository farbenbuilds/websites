# ASCII butterfly heroes for the documentation home pages

This is an implementation plan for developers and agents working on the
uWebZockets and ventiws documentation home pages. Deliver a small, colorful
ASCII butterfly scene that gives each page a quiet Japanese-inspired identity
while keeping documentation, navigation, and code examples easy to read. All
boxes below describe future work; this document does not implement the hero.

## Decision: Svelte and GSAP, without Three.js

**Three.js and Threlte are unnecessary for this effect.** The butterflies are
flat, small groups of monospace characters. Svelte can render them as text;
Tailwind can place and color them; GSAP can move their wrappers with transforms.
Three.js and Threlte would add a scene, camera, renderer, and WebGL lifecycle
without contributing to the desired two-dimensional result. Neither package
belongs in the dependency set for this plan.

The [ascii-sharks reference](https://github.com/stackedlol/ascii-sharks)
draws ASCII fish and sharks on a **Canvas 2D cell grid** with a TypeScript
engine; it does not use Svelte, GSAP, or Three.js. Adapt its visual principles
of recognizable glyph silhouettes, restrained color, and layered movement.
Draw original butterflies and write independent motion code. If any upstream
code or art is copied instead, retain its MIT license, record provenance in the
repository's third-party notices, and rewrite copied code to the repository's
functional rules: no classes, prototypes, or `this`.

## Existing project boundaries

| Concern             | uWebZockets                          | ventiws                                                        |
| ------------------- | ------------------------------------ | -------------------------------------------------------------- |
| English home        | `apps/uwz-docs/docs/index.mdx`       | `apps/vws-docs/docs/index.mdx`                                 |
| Vietnamese home     | `apps/uwz-docs/docs/vi/index.mdx`    | `apps/vws-docs/docs/vi/index.mdx`                              |
| Blume config        | `apps/uwz-docs/blume.config.ts`      | `apps/vws-docs/blume.config.ts`                                |
| MDX island registry | `apps/uwz-docs/components.ts` exists | Add `apps/vws-docs/components.ts`                              |
| Host Tailwind entry | `apps/uwz-docs/theme.css` exists     | Add `apps/vws-docs/theme.css` if Blume integration requires it |
| Existing accent     | Orange                               | Teal                                                           |

Both apps already declare Svelte and GSAP. Only uWebZockets declares
`@farben/ui`; add it to ventiws when the shared component is consumed. Check
Blume's theme entry and MDX registration behavior in a small spike before
choosing the final import path. Keep Blume in charge of routes, navigation,
search, locale switching, and generated output.

## Experience contract

- Preserve each page's product summary, Getting Started link, GitHub link,
  highlights, example, and English/Vietnamese routes. Put the hero near the
  introduction without pushing the first useful link out of the mobile view.
- Keep the heading, summary, and links as semantic MDX/HTML. Treat the
  butterfly field as decoration, never as the only way to convey information.
- Use a calm editorial feel inspired by Japanese print and garden composition:
  generous white space, asymmetric but balanced placement, fine rules, crisp
  mono glyphs, and selective color. Avoid decorative Japanese text, cultural
  symbols, or imagery that suggests an unverified product connection.
- Use a warm paper-like light surface and a quiet ink-like dark surface. Derive
  both from Blume/shared semantic tokens; confirm the hero works with the
  existing theme toggle. Do not replace documentation body typography solely
  to create an aesthetic effect.
- Use three to five **small** original butterfly glyph designs, each legible at
  its rendered size. Use monospace text with preserved spaces and line breaks;
  keep each design a single accessible-decorative unit. Use hue or brightness
  variation within each site's palette, not a rainbow across the whole page.
- uWebZockets: orange, amber, and yellow wing accents over warm neutral
  surfaces. ventiws: blue, green, and teal wing accents over cool neutral
  surfaces. Set site-specific values at the host/theme layer rather than
  hard-coding colors inside shared motion logic.
- Concentrate butterflies in a bounded hero region, with only a few visible at
  once. Keep a clear exclusion area around titles, body copy, CTAs, nav,
  search, and code. On narrow screens, reduce count and keep the scene behind
  or beside a dedicated visual region, never over reading text.

## Implementation architecture

| Owner/layer         | Proposed responsibility                                                                                       | Candidate files                                                                           |
| ------------------- | ------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Shared presentation | Render decorative glyphs; accept a typed palette and density variant; expose a static fallback                | `packages/ui/src/lib/components/butterfly-hero/butterfly-hero.svelte`, sibling `index.ts` |
| Shared domain       | Store original glyph frames and deterministic positions or motion parameters as plain data and pure functions | Named sibling modules under `packages/ui/src/lib/components/butterfly-hero/`              |
| Shared motion       | Start scoped GSAP tweens on mount; stop and clean them on unmount, media-query change, and visibility change  | A named sibling module when the Svelte file approaches 200 lines                          |
| Site integration    | Register the island, place it once on each localized home page, and preserve Blume content                    | Each app's `components.ts` and `docs/{,vi/}index.mdx`                                     |
| Site styling        | Define semantic hero colors for light and dark modes; make Tailwind scan shared source                        | Existing uwz `theme.css`; new vws `theme.css` if confirmed by the spike                   |
| Dependencies        | Add `gsap` to `packages/ui` if the shared component imports it; add `@farben/ui` to ventiws                   | `packages/ui/package.json`, `apps/vws-docs/package.json`, lockfile                        |

Keep the static HTML useful before hydration: the introductory text and links
must render even when JavaScript is unavailable. Render a still butterfly
arrangement server-side, then hydrate only the decorative island. Follow the
existing Blume `defineComponents` pattern in uWebZockets; choose its supported
client directive after verifying generated HTML. Prefer `client: "visible"` if
the island remains in the first viewport and static art is acceptable until it
hydrates; measure the behavior instead of assuming it.

Use Svelte 5 runes and typed props. Keep a stable butterfly list so hydration
does not change element count or positions. In `onMount`, select only elements
inside the component root, create GSAP animations there, and return cleanup.
Use `gsap.matchMedia()` for viewport and `prefers-reduced-motion` conditions;
revert it on teardown. Animate `transform` and, sparingly, `opacity`; avoid
per-frame text changes, layout properties, scroll listeners, and page-wide
selectors. A CSS static state must remain visible if animation setup fails.

## Motion, accessibility, and performance requirements

- Motion should resemble drifting and wing flutter through short, subtle
  position/rotation cycles, not a full-screen swarm. Stagger starts and vary
  paths deterministically so the first frame is stable across SSR/hydration.
- Respect `prefers-reduced-motion: reduce` before starting a tween; show the
  static arrangement and react if the preference changes. If motion runs
  automatically for more than five seconds alongside content, provide a
  visible, keyboard-operable pause/resume control as required by
  [WCAG 2.2.2](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html).
  Persist its state for the current page visit; pausing stops all butterfly
  motion without hiding reading content.
- Mark the artwork `aria-hidden="true"` and `pointer-events-none`; keep the
  pause control outside that hidden subtree with an accessible name and visible
  focus ring. Do not put decorative glyphs into headings or link names.
- Avoid color-only meaning. Verify normal text, links, controls, and focus
  states meet WCAG 2.2 AA contrast in both themes. Check the decorative glyphs
  do not reduce the contrast of text beneath them.
- Bound animation to the hero. Pause or stop it when the hero is off screen or
  the tab is hidden, and restore it only if motion is enabled. Use an observer
  only if the actual island behavior needs it; clean up observer and event
  listeners on unmount.
- Set a small count by breakpoint after visual review, then profile a lower-end
  mobile device. Use reduced count or no motion where frame rate suffers.
  Do not switch to Canvas merely because the reference uses it; consider
  Canvas 2D only if measured DOM density becomes a real bottleneck.

## Milestones and checklists

### M0: Record the visual and technical baseline

- [ ] Capture both sites at 320px, 768px, and wide desktop in light and dark
      mode, for `/` and `/vi`.
- [ ] Record the current first useful link position, text readability, and
      theme behavior so the hero can be judged against them.
- [ ] Inspect Blume's MDX registry and host theme entry from the installed
      version; prove the smallest test island renders in both apps.
- [ ] Confirm component ownership, palette tokens, and whether vws needs a
      `theme.css` import/entry. Do not edit generated `.blume/` or `dist/`.

**Exit:** A reviewer has baseline captures and a verified integration path;
the design uses the existing docs layout rather than an assumed route API.

### M1: Build the original shared butterfly scene

- [ ] Draw three to five original ASCII silhouettes as plain text data; inspect
      spacing with the site's monospace font at real mobile and desktop sizes.
- [ ] Implement the typed shared Svelte component and small pure data helpers.
      Keep every source file at or below 200 lines; split by responsibility.
- [ ] Render stable initial positions and a static no-JavaScript state.
- [ ] Add scoped GSAP drift/flutter, responsive counts, reduced-motion branch,
      and complete mount/unmount cleanup.
- [ ] Add the pause/resume control and keyboard/focus behavior if automatic
      motion lasts longer than five seconds.
- [ ] Test pure position/count logic only where it carries behavior, under
      `tests/<category>/` and importing from `vite-plus/test`; inspect visual
      and keyboard behavior in the browser.

**Exit:** The isolated component is readable, static without JavaScript,
motion-safe, type-checks through `@farben/ui#check`, and has recorded browser
evidence for reduced motion and no JavaScript.

### M2: Integrate uWebZockets

- [ ] Add the hero to the existing `components.ts` registry and to both
      localized `index.mdx` pages, leaving factual documentation intact.
- [ ] Add warm hero tokens in uwz `theme.css` for light and dark. Keep normal
      body, link, and focus colors tied to semantic Blume/shared tokens.
- [ ] Verify English and Vietnamese copy, links, nav, search, and generated
      output after the build.

**Exit:** Both uwz home routes show the same decorative system, with correct
locale content and a readable first viewport in both themes.

### M3: Integrate ventiws

- [ ] Add `@farben/ui` as `workspace:*` and use the
      shared component; add the Blume island registry and host theme entry.
- [ ] Add cool blue/green/teal hero tokens for light and dark, without copying
      uwz's palette or changing shared neutral tokens for both sites.
- [ ] Add the hero to English and Vietnamese home pages and verify generated
      output, links, nav, and search.

**Exit:** Both vws home routes use the shared motion behavior with their own
palette, while normal documentation interaction still works.

### M4: Review, tune, and release

- [ ] Compare before/after screenshots at every baseline viewport and theme.
      Check text overlap, clipping, visible CTAs, and consistency across locales.
- [ ] Use keyboard only to reach links, theme toggle, and motion control; check
      focus order, visible focus, and that decorative glyphs are skipped.
- [ ] Test reduced motion, no JavaScript, tab visibility, scroll out/in,
      repeated mount/unmount, and a narrow 320px viewport.
- [ ] Check contrast and profile the hero on a lower-end mobile device; tune
      count and paths based on measured behavior, not novelty.
- [ ] Run the full repository gate and review the final diff for generated
      output, unexpected dependencies, copied source, and unrelated changes.

**Exit:** Accessibility and visual checks have recorded evidence, both docs
builds pass, and the shared component passes the repository gate.

## Commands and evidence to record during implementation

Run these project-local commands from the repository root and record each
result. The checklist describes future verification; these commands have not
been run for the planned hero.

```sh
pnpm exec vp run @farben/ui#check
pnpm exec vp run uwz-docs#check
pnpm exec vp run vws-docs#check
pnpm exec vp run uwz-docs#build
pnpm exec vp run vws-docs#build
pnpm ready
```

For each command, record the working directory, outcome, and first actionable
error if it fails. Include screenshots for each site, locale, breakpoint, and
theme; record reduced-motion and keyboard checks. Inspect generated routes and
`llms.txt` only as build artifacts. Follow [the repository workflow](TEAM_WORKFLOW.md)
for Architect, Developer, Reviewer, and Integrator handoffs before delivery.

## Research and implementation references

- [ascii-sharks repository and README](https://github.com/stackedlol/ascii-sharks)
  and its [engine source](https://raw.githubusercontent.com/stackedlol/ascii-sharks/main/src/engine.ts)
  show the visual reference and Canvas 2D lifecycle techniques.
- [Astro framework components](https://docs.astro.build/en/guides/framework-components/)
  explains server rendering and client hydration of Svelte islands.
- [Svelte lifecycle hooks](https://svelte.dev/docs/svelte/lifecycle-hooks)
  documents mount and teardown boundaries.
- [GSAP matchMedia](https://gsap.com/docs/v3/GSAP/gsap.matchMedia/)
  documents responsive conditions and automatic animation reversion.
- [WCAG 2.2.2 Pause, Stop, Hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html)
  defines the control requirement for ongoing automatic motion.
