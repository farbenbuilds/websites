# Farben Websites Coding Convention

This document is the canonical engineering contract for every app, package,
tool, document, and agent instruction in this repository. A change that
violates it is rejected in review, not negotiated in a pull request.

## 1. Non-Negotiable Rules

- No emoji characters in repository-authored files: source, comments,
  documentation, commit messages, issue templates, UI copy, logs, or test names.
  Vendored third-party skills under `.agents/skills` are upstream content and
  are exempt; do not edit them to satisfy this rule.
- Comments are the exception, not the default. Keep a comment only when it
  explains a non-obvious constraint, protocol detail, workaround, or safety
  boundary. Never restate code, never narrate a diff, never keep commented-out
  code, and never add `TODO`, `FIXME`, `XXX`, or `HACK` markers.
- Functional programming wins over object-oriented programming. No classes,
  prototypes, `this`, inheritance, mixins, or behavior bound to hidden state.
- Separation of concerns is mandatory. Each module has one reason to change and
  one layer of responsibility.
- A source file targets 150 to 400 lines and must not exceed 400 lines. Split
  before the limit by extracting a named responsibility into a sibling module;
  do not create a `part-2` dumping ground.
- Never weaken a lint rule, type check, test, build step, accessibility
  requirement, or quality gate to make a change pass.
- Public behavior, limits, and compatibility changes need documentation in the
  same change.

## 2. Language and Naming

- TypeScript everywhere on the web surface. The current docs apps use Blume and
  MDX; `uwz-docs` also uses Astro, Svelte 5, and `@farben/ui`, while `vws-docs`
  uses local Astro components today. A future app may choose another
  framework; the rules in this document still apply.
- Use `type` rather than `interface` for object shapes and unions. Use
  `import type` for type-only imports.
- File names are kebab-case for TypeScript, CSS, Markdown, Svelte, and Astro.
  Component identifiers stay PascalCase in markup and imports, even when the file
  is kebab-case.
- Types and components use PascalCase. Functions and variables use camelCase.
  Function declarations, function expressions, and arrow functions assigned to
  a variable must use camelCase; exported HTTP method handlers such as `GET`
  are the only uppercase exception.
- Module constants use `SCREAMING_SNAKE_CASE` only when they are true process
  constants.
- Semicolons are mandatory. Trailing commas are mandatory in multiline
  literals, parameters, and imports. Strings use double quotes. Oxfmt owns
  these settings in `.oxfmtrc.json`.
- Do not use `any`. Parse unknown input at the boundary, narrow with type
  guards, and keep the trusted type inside the module.
- Prefer `as const` objects and discriminated unions over enums and namespaces.
- Exported functions declare their return type when inference is not obvious.
- Avoid default exports except where a framework requires one, such as Astro
  pages and Svelte components.

## 3. Functional Programming

- Model data with plain types. Transform it with pure functions that receive
  every input explicitly and return a new value.
- Keep I/O, clock, random, environment, logging, and storage at the edges:
  route handlers, `+page.server.ts`, Svelte lifecycle callbacks, build config,
  and scripts.
- Do not mutate shared module state. If state is required, keep it inside a
  component instance with runes or pass it explicitly.
- Prefer small composable functions, early returns, and guard clauses. Avoid
  nested control flow deeper than three levels.
- Prefer `map`, `filter`, `reduce`, and discriminated unions over imperative
  flag mutation when the transformation stays readable.
- Do not create a wrapper that only forwards arguments. One indirection layer
  is enough, and it must add a bound, an invariant, or a type guarantee.

## 4. Separation of Concerns

| Layer        | Owns                                            | Does not own                       |
| ------------ | ----------------------------------------------- | ---------------------------------- |
| Content      | MDX pages, frontmatter, navigation copy         | Layout behavior, runtime state     |
| Presentation | Svelte components, islands, slots               | Data fetching, build configuration |
| Styling      | Design tokens, Tailwind utilities, theme CSS    | Business logic, content            |
| Domain       | Pure TypeScript functions and types in `lib`    | DOM access, network calls          |
| Integration  | Astro pages, Blume config, adapters (docs apps) | Visual design, copy                |
| Tooling      | Vite+, Nix, CI, scripts                         | Product behavior                   |

Dependencies point downward through this table. A presentation component may
import a domain function; a domain module must not import a component, a page,
or a framework runtime. Keep shared code in `packages/ui` or a dedicated
package only when at least two apps use it. A standard shadcn-svelte registry
primitive is the exception: install it in `packages/ui` when no existing
primitive fits, because `packages/ui` is the only configured registry project.
Custom shared code still needs two consumers.

## 5. File Size and Structure

- Target 150 to 400 lines per source file. A file at 400 lines is a signal to
  split, not a target to fill.
- Split by responsibility: one module for parsing, one for formatting, one for
  rendering, one for orchestration. Name the extracted file after the
  responsibility, never after a sequence number.
- Keep imports at the top, types before behavior, exports close to the code
  they expose, and no dead code or unused imports.
- A component that needs data, formatting, and interaction logic in one file is
  three modules pretending to be one. Extract the pure parts first.
- Generated output under `dist/` and `.blume/` is never edited and never
  counted against the limit.

## 6. TypeScript

- Enable strict checking in every package. Do not silence errors with `any`,
  non-null assertions, or unchecked casts.
- Validate external data at the boundary. Internal functions receive typed
  values and do not repeat validation.
- Errors flow outward. Do not swallow an error with an empty `catch`; either
  handle it, translate it, or let it fail. A best-effort catch needs a one-line
  comment explaining why it is safe.
- Keep async code explicit. Do not mix promise chains and `async`/`await` in
  the same function.
- Avoid barrel files that create cycles. Export from the module that owns the
  symbol; use a package entry point only for a deliberate public surface.

## 7. Svelte and Astro

These rules cover the current documentation apps. A future app on another
framework follows the same ownership, accessibility, testing, and verification
rules with its own framework conventions.

- Use Svelte 5 runes only: `$props`, `$state`, `$derived`, `$effect`, and
  `$bindable`. Do not use legacy `export let`, reactive `$:`, or slot syntax.
- No `<style>` blocks. Use Tailwind utilities and the shared design tokens from
  `@farben/ui/theme.css`.
- Keep components focused on rendering and local interaction. Fetch data in
  Astro pages, server load functions, or Blume content, not inside a leaf
  component.
- Add `aria-*` attributes, labels, focus states, and keyboard behavior with the
  markup. Accessibility is part of the component contract.
- Use `{@html}` only for trusted, repository-owned content. Never pass user
  input or remote HTML through it.
- Use Astro islands only when interactivity is required. Static documentation
  content belongs in MDX or Astro markup.
- Blume owns documentation routing, search, `llms.txt`, and build output. Do
  not hand-roll replacements for features it already provides.

### Shared UI components

`@farben/ui` owns the shared shadcn-svelte source. Reach for it before writing a
new primitive.

- Check `packages/ui/src/lib/components/ui` and the `@farben/ui/components/*`
  exports before installing anything. Reuse or compose an existing component
  when it fits.
- Install only from inside `packages/ui` with the pinned local CLI:

  ```sh
  cd packages/ui
  pnpm exec shadcn-svelte add <component>
  ```

  Do not use `pnpm dlx ...@latest`; it can fetch a newer CLI than the one pinned
  by `packages/ui/package.json` and the lockfile, changing generated source and
  dependencies.

- Install only named components from the registry configured in
  `packages/ui/components.json`. Do not pass a URL, a custom registry, or a proxy
  without explicit approval and a security and dependency review.
- Never run `add` for a component that already exists. Do not pass
  `--overwrite`, `--skip-preflight`, or `--all`, and do not install a renamed
  duplicate. Do not run `update`, `update --all`, `apply`, or `init` in this
  repository; those commands replace local edits or rewrite the project. Port an
  upstream change into the existing source manually.
- Review the generated source, imports, and dependency changes before committing.
  Adapt it to the shared tokens, type the public props, keep accessibility, and
  run `pnpm exec vp run @farben/ui#check` plus every consuming app build.
- A standard registry primitive may be installed when no existing primitive fits,
  even if one app uses it first; `packages/ui` is the only configured registry
  project. A custom shared component still needs at least two consumers.
  App-specific composition stays in the app.

## 8. Documentation

- Every MDX page starts with `title` and `description` frontmatter.
- Write in second person, active voice, and present tense. Lead with the task,
  then the explanation, then the reference detail.
- Headings use sentence case. Code fences always declare a language. Commands
  are copy-pasteable and do not assume an unstated working directory.
- Do not use emojis, exclamation marks, marketing filler, or claims that the
  repository cannot verify.
- Internal links are root-relative and checked by the docs build. External
  links name the destination instead of using "click here".
- Agent-facing documents describe observable behavior, ownership, and
  verification. They do not duplicate the full codebase.

### Internationalization ownership

- x18n owns component UI copy only. Component strings live in
  `apps/<app>/locales/{locale}.json` and are checked with `pnpm i18n:check`.
- Blume owns documentation content. Every docs page is an MDX file at
  `docs/<slug>.mdx` with its translation at `docs/vi/<slug>.mdx`.
- Do not add MDX files, page prose, frontmatter, or docs routes to x18n
  resources, locale JSON, or an `x18n.config.ts` resource pattern.
- A future page such as `getting-started.mdx` or `api.mdx` follows the mirrored
  MDX layout and does not need x18n keys.
- A string belongs to x18n only when a component renders it. If it is part of a
  document body, it belongs in MDX.

## 9. Formatting, Linting, and Verification

- Oxfmt formats and Oxlint lints. Do not add a second formatter or linter.
  Oxfmt formats `.astro` and `.svelte` through the `astro` and `svelte`
  options in `.oxfmtrc.json`; Oxlint loads the framework ESLint plugins
  separately through `jsPlugins`.
- Formatter settings live in `.oxfmtrc.json`: semicolons on, double quotes, and
  trailing commas for all multiline constructs.
- Linter settings live in `.oxlintrc.json`: kebab-case filenames, camelCase
  functions, the 400-line limit, strict TypeScript rules, project rules, and the
  vendored anti-slop rules. It also loads `eslint-plugin-svelte` and the local
  Astro frontmatter adapter under `tools/oxlint/astro-plugin/`. Oxlint does not
  support custom parsers, so Svelte and Astro template rules stay out of scope.
- The anti-slop plugin is vendored under `tools/oxlint/anti-slop/`. Update it
  through the `install-anti-slop` skill, not by editing rule files in place.
- `lefthook` runs lint, format, size, typecheck, and tests before a commit. Do
  not bypass the hook with `--no-verify`.
- Run `pnpm lint --fix` and `pnpm format` for fixes, then `pnpm ready` for the
  full workspace gate. `pnpm check:size` enforces the 400-line source limit.
- Vitest tests live under `tests/<category>/<subject>.test.ts` and use
  `vite-plus/test`. The category groups related tests; the file names the
  behavior. See [tests/README.md](tests/README.md). Run them with
  `pnpm test` or `pnpm test:watch`.
- Use the project-local CLI through pnpm on every host: `pnpm exec vp ...`.
- A pull request reports the exact commands that ran and their outcomes. Never
  claim a check that was not executed.
- Documentation changes run `pnpm exec vp run uwz-docs#check`,
  `pnpm exec vp run vws-docs#check`, and the affected build.
- Component UI copy changes run `pnpm i18n:check`. Docs-only MDX changes do not
  require it because documentation content is not an x18n resource.
- UI changes run the shared UI type check and both docs builds when the shared
  package is touched.

## 10. Review Standard

Review in this order: correctness, ownership and separation, file size,
security and accessibility, tests and verification evidence, documentation,
and scope. A reviewer reports actionable findings with file and line
references. A preference is not a defect; a violated contract is.
