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
- A source file targets 150 to 200 lines and must not exceed 200 lines. Split
  before the limit by extracting a named responsibility into a sibling module;
  do not create a `part-2` dumping ground.
- Never weaken a lint rule, type check, test, build step, accessibility
  requirement, or quality gate to make a change pass.
- Public behavior, limits, and compatibility changes need documentation in the
  same change.

## 2. Language and Naming

- TypeScript everywhere on the web surface. Apps use Astro and Svelte 5;
  documentation uses Blume and MDX.
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

| Layer        | Owns                                         | Does not own                       |
| ------------ | -------------------------------------------- | ---------------------------------- |
| Content      | MDX pages, frontmatter, navigation copy      | Layout behavior, runtime state     |
| Presentation | Svelte components, islands, slots            | Data fetching, build configuration |
| Styling      | Design tokens, Tailwind utilities, theme CSS | Business logic, content            |
| Domain       | Pure TypeScript functions and types in `lib` | DOM access, network calls          |
| Integration  | Astro pages, Blume config, adapters          | Visual design, copy                |
| Tooling      | Vite+, Nix, CI, scripts                      | Product behavior                   |

Dependencies point downward through this table. A presentation component may
import a domain function; a domain module must not import a component, a page,
or a framework runtime. Keep shared code in `packages/ui` or a dedicated
package only when at least two apps use it.

## 5. File Size and Structure

- Target 150 to 200 lines per source file. A file at 200 lines is a signal to
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

## 9. Formatting, Linting, and Verification

- Oxfmt formats and Oxlint lints. Do not add a second formatter or linter.
- Formatter settings live in `.oxfmtrc.json`: semicolons on, double quotes, and
  trailing commas for all multiline constructs.
- Linter settings live in `.oxlintrc.json`: kebab-case filenames, camelCase
  functions, the 200-line limit, strict TypeScript rules, project rules, and the
  vendored anti-slop rules.
- The anti-slop plugin is vendored under `tools/oxlint/anti-slop/`. Update it
  through the `install-anti-slop` skill, not by editing rule files in place.
- `lefthook` runs lint, format, size, typecheck, and tests before a commit. Do
  not bypass the hook with `--no-verify`.
- Run `pnpm lint --fix` and `pnpm format` for fixes, then `pnpm ready` for the
  full workspace gate. `pnpm check:size` enforces the 200-line source limit.
- Vitest tests live in the root `tests/` directory and use `vite-plus/test`.
  Run them with `pnpm test` or `pnpm test:watch`.
- Use the project-local CLI through pnpm on every host: `pnpm exec vp ...`.
- A pull request reports the exact commands that ran and their outcomes. Never
  claim a check that was not executed.
- Documentation changes run `pnpm exec vp run uwz-docs#check`,
  `pnpm exec vp run vws-docs#check`, and the affected build.
- UI changes run the shared UI type check and both docs builds when the shared
  package is touched.

## 10. Review Standard

Review in this order: correctness, ownership and separation, file size,
security and accessibility, tests and verification evidence, documentation,
and scope. A reviewer reports actionable findings with file and line
references. A preference is not a defect; a violated contract is.
