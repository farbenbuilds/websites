---
name: Verification and Release
description: Run and report Farben's websites quality gates, CI parity, regression checks, file-size checks, and pull-request readiness without weakening the bar.
---

# Verification and Release

Use this skill when implementing a change, reviewing evidence, triaging a
failing gate, or preparing a pull request.

## Default Gate

`pnpm ready` is the repository contract. It runs:

```text
pnpm lint
pnpm format:check
pnpm typecheck
pnpm check:size
pnpm test
vp run -r test
vp run -r build
```

Run the narrowest check while iterating, then the full gate before review.

## Commands

```sh
pnpm install
pnpm lint
pnpm lint:fix
pnpm format
pnpm format:check
pnpm typecheck
pnpm check:size
pnpm test
pnpm test:watch
pnpm exec vp run -r test
pnpm exec vp run -r build
pnpm exec vp run uwz-docs#check
pnpm exec vp run vws-docs#check
pnpm exec vp run uwz-docs#build
pnpm exec vp run vws-docs#build
pnpm exec vp run @farben/ui#check
pnpm ready
```

Use `pnpm exec vp ...` on every host. The global `vp` cannot load musl native
bindings on musl systems. Run `pnpm exec vp env doctor` when the toolchain
behavior is unexpected.

`lefthook` runs the same lint, format, size, typecheck, and test commands on
pre-commit. The GitHub workflows split the gate into `lint.yml`, `test.yml`, and
the aggregate `ci.yml`.

## Evidence Format

Report:

```text
Command:
Working directory:
Result:
Notes:
```

A passing report names the command that actually ran. A failing report includes
the first actionable error and the owning surface. A skipped command says why it
was skipped and what remains unverified. Never write "should pass".

## File-Size Audit

A source file over 400 lines blocks review. Run:

```sh
pnpm check:size
```

Split by responsibility. Do not create a `part-2` file or move code without
changing the design that made the file too large.

## Regression Coverage

- A behavior change needs a test, a content fixture, or a build-level check that
  fails before the fix.
- A visual change needs viewport screenshots and a keyboard check.
- A documentation change needs a link and command review plus the docs build.
- A dependency change needs a lockfile review and the full gate.
- A security-sensitive change needs explicit validation and a security review.

## Gate Integrity

Never:

- Delete or skip a test to make the suite pass.
- Lower a lint rule, type strictness, or coverage threshold.
- Mark a failing build as optional.
- Replace a real command with a proxy such as "it compiles".
- Commit generated output to avoid running the build.

If a gate is wrong, fix the gate with an explanation of why the previous
expectation was incorrect and keep the bar at least as strong.

## CI

`.github/workflows/ci.yml` runs the same `pnpm ready` gate on Node.js 24 with
pnpm 12.4.2. A local failure is a CI failure. A CI-only failure needs its exact
runner, command, and log excerpt in the report.

## Pull Request Readiness

- The branch is rebased on the current `main`.
- The diff contains no generated files, secrets, or unrelated formatting.
- Documentation matches the behavior.
- The exact verification commands and outcomes are in the description.
- Screenshots are included for visual changes.
- Remaining risk and follow-ups are explicit.
- The requested assignee and labels are set.

## Failure Routing

| Failure | Owner |
| --- | --- |
| Type or lint error | Developer for the slice |
| Docs build or broken link | astro-blume or docs-writer |
| Visual or accessibility defect | ui-stylist or svelte-engineer |
| Shared component type error | svelte-engineer |
| Dependency or lockfile | Developer with security-reviewer |
| CI configuration | verification |

The verifier reports the defect. The owning agent fixes it. The verifier does not
tune the gate to hide it.
