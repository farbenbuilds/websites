---
name: Web UI Styling
description: Design and implement accessible interfaces in the Farben websites monorepo with Tailwind v4 tokens, shadcn-svelte source components, Svelte 5 islands, responsive layout, and strict visual review.
---

# Web UI Styling

Use this skill for visual design, layout, typography, color, responsive
behavior, motion, accessibility, and shared component work.

## Design Sources

- Shared tokens: `packages/ui/src/lib/styles/theme.css`.
- Shared components: `packages/ui/src/lib/components/ui`.
- Host theme entry: `apps/uwz-docs/theme.css`.
- Installed design skills: `ui-ux-pro-max`, `impeccable`,
  `tailwind-design-system`, `shadcn-svelte`, `gsap-core`.
- Project rules: [CODING_CONVENTION.md](../../../CODING_CONVENTION.md).

## Design Direction

The documentation sites should feel technical, calm, and precise. The content is
the primary visual element. Avoid decorative gradients, oversized hero copy,
glass effects, and animation that competes with reading.

- One clear hierarchy per page: title, summary, task content, reference detail.
- Generous line height for prose; tighter spacing inside controls.
- Color carries meaning only when paired with text or an icon.
- Motion is short, optional, and disabled under `prefers-reduced-motion`.
- Dark and light modes both meet contrast requirements.
- Mobile is designed first, then expanded.

## Token Rules

- Use semantic tokens such as `bg-background`, `text-foreground`,
  `border-border`, `bg-muted`, and `text-muted-foreground`.
- Use the shared accent token for links and focus rings. Do not hard-code a new
  palette in a component.
- A new token belongs in `packages/ui` only when multiple apps need it.
- Host-specific fonts, base layers, and `dark` variant setup stay in the host
  stylesheet.
- Do not use arbitrary color values when a semantic token exists.

## Tailwind Rules

- Utilities compose in markup; extract a component only when the composition is
  reused or carries behavior.
- Use responsive prefixes consistently: base mobile, then `sm`, `md`, `lg`.
- Prefer `gap` and grid or flex layout over margins between siblings.
- Do not add `!important` to win a specificity fight. Fix the component API.
- No `<style>` blocks in Svelte. No inline `style` attributes except a measured
  dynamic value that cannot be expressed as a class.
- Keep class strings readable. If a variant map grows beyond the component's
  responsibility, move it to a named module.

## Svelte Component Contract

- Props are typed with a single `type`.
- Use `$props`, `$state`, `$derived`, and `$effect` only where needed.
- Expose `class` and rest props for composition, following the shadcn pattern.
- Use `data-slot` for stable styling hooks.
- Bind `ref` only when the parent needs it.
- A component that fetches data, formats content, and renders is three modules.
  Extract the pure logic.
- A component file over 200 lines is a design smell even when it is mostly
  markup. Split the visual regions.

## Accessibility

- Every interactive element is reachable by keyboard and has a visible focus
  state.
- Icon-only controls have an accessible name.
- Forms have labels, descriptions, and error text tied to the input.
- Color contrast meets WCAG 2.2 AA for text and non-text UI.
- Motion respects `prefers-reduced-motion`.
- Images have useful alt text, or empty alt text when decorative.
- Do not remove outlines without replacing them.
- Test the page at 320px, 768px, and a wide desktop viewport.

## Motion

- Motion explains a state change; it does not decorate an idle page.
- Keep transitions under 200ms for controls and under 400ms for layout changes.
- Use opacity and transform. Avoid animating layout properties.
- GSAP is available for a deliberate sequence, not for basic hover states.
- Provide a reduced-motion path for every non-essential animation.

## Shared Components

Check `packages/ui/src/lib/components/ui` and the `@farben/ui/components/*`
exports first. Compose an existing primitive when it fits.

If no component fits, install from inside `packages/ui` with the pinned local
CLI:

```sh
cd packages/ui
pnpm exec shadcn-svelte add <component>
```

Do not use `pnpm dlx ...@latest`. Never run `add` for an existing component, and
do not pass `--overwrite`, `--skip-preflight`, or `--all`. Do not run `update`,
`update --all`, `apply`, or `init`; those commands replace local edits or rewrite
the project. Do not install a renamed duplicate. Port an upstream change into the
existing source manually.

Use only named components from the registry in `components.json`. A URL, custom
registry, or proxy needs explicit approval and a security and dependency review.
This project rule overrides the installed third-party `shadcn-svelte` skill's
update workflow.

Review the generated source, imports, and dependency changes. Adapt it to the
shared token palette, type the public props, keep accessibility, and verify both
docs apps.

Standard registry primitives live in `packages/ui`; a custom shared component
needs at least two consumers. Keep app-specific composition in the app.

## Verification

```sh
pnpm exec vp run @farben/ui#check
pnpm exec vp run uwz-docs#build
pnpm exec vp run vws-docs#build
```

For visual changes, include before and after screenshots, the viewports tested,
and the keyboard and contrast checks performed.

## Review Checklist

- Hierarchy is clear without color.
- Tokens are semantic and shared.
- The layout works at 320px and at desktop width.
- Focus, labels, contrast, and reduced motion are handled.
- No `<style>` block, inline style shortcut, or `!important` was added.
- No component exceeds 200 lines.
- Both docs builds pass when shared UI changes.
