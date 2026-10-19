## Description

Describe the change and why it should be merged.

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Documentation or agent instructions
- [ ] Refactor with no behavior change
- [ ] Build, dependency, or CI change
- [ ] Breaking change

## Checklist

- [ ] I read [CONTRIBUTING.md](CONTRIBUTING.md) and [CODING_CONVENTION.md](../CODING_CONVENTION.md).
- [ ] The change respects separation of concerns and the 200-line source limit.
- [ ] No emoji, dead code, commented-out code, or unexplained marker was added.
- [ ] Svelte changes use runes only and contain no `<style>` block.
- [ ] I ran `pnpm ready`, or the narrowest relevant subset, and recorded the exact commands.
- [ ] Documentation was updated for changed behavior.
- [ ] Visual changes include a screenshot or recording and an accessibility check.
- [ ] Dependency changes include a lockfile review and license check.
- [ ] No secret, generated output, or unrelated formatting is included.

## Verification

List the exact commands and their outcomes:

```sh
pnpm exec vp check
pnpm exec vp run -r check
pnpm exec vp run -r test
pnpm exec vp run -r build
```

## Screenshots

Add before and after images or a recording for user-visible changes.

## Remaining Risk

Describe anything not verified, intentionally deferred, or dependent on a
follow-up.
