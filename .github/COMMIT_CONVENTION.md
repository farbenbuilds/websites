# Git Commit Message Convention

Adapted from the [Angular commit convention](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-angular).

## Format

A commit message has a header, an optional body, and an optional footer:

```text
<type>(<scope>): <subject>

<body>

<footer>
```

The header is mandatory. The scope is optional.

## Type

Use one of:

- `feat`: a user-facing capability
- `fix`: a defect repair
- `docs`: documentation or agent instructions
- `style`: formatting or visual polish with no behavior change
- `refactor`: a behavior-preserving restructure
- `perf`: a measured performance improvement
- `test`: test coverage or fixtures
- `build`: dependencies, packaging, or build output
- `ci`: workflows and automation
- `chore`: maintenance that does not fit another type
- `revert`: revert a previous commit

`feat`, `fix`, and `perf` appear in release notes. A breaking change always
appears.

## Scope

Use the affected surface, for example `uwz-docs`, `vws-docs`, `ui`, `agents`,
`skills`, `tooling`, or `ci`.

## Subject

- Use the imperative present tense: "add", not "added" or "adds".
- Do not capitalize the first letter.
- Do not end with a period.
- Keep it short enough to read in a commit list.

## Body

Explain the motivation and contrast with previous behavior. Use the imperative
present tense. Wrap prose at a readable width. Keep one logical change per
commit.

## Footer

Reference issues and breaking changes:

```text
Closes #28
BREAKING CHANGE: describe the old behavior and the migration path.
```

A revert starts with `revert: ` followed by the reverted header, and the body
contains `This reverts commit <hash>.`

## Examples

```text
docs(uwz-docs): add websocket compression guide
```

```text
feat(ui): add an accessible copy command component

Move clipboard feedback into a shared island so both docs sites use the same
keyboard and focus behavior.
```

```text
fix(vws-docs): correct the installation command

Closes #31
```
