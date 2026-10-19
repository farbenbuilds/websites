# Tests

The root Vitest suite is grouped by category. Each child directory is a test
category, and the `.test.ts` files inside it are the tests for that category.

```text
tests/
├── config/
│   └── workspace-manifest.test.ts
└── <category>/
    └── <subject>.test.ts
```

`vitest.config.ts` discovers `tests/**/*.test.ts`, so a category needs only a
directory and at least one test file. Add a category-specific config only when
those tests need different Vitest environment or setup behavior.

## For Developers

- Put a test in the category that owns the behavior. Use an existing category
  before adding one.
- Add a new kebab-case category only when no existing category fits. Keep test
  files and small fixtures directly inside that category; do not create nested
  category folders.
- Name test files after the subject and behavior, for example
  `tests/config/workspace-manifest.test.ts`. Only test files use the
  `.test.ts` suffix that Vitest discovers.
- Keep the `tests/` root limited to this file and category directories. Do not
  put test files at the root.
- Import from `vite-plus/test`, not `vitest`.
- Run `pnpm test` for the suite, `pnpm test:watch` while iterating, or
  `pnpm exec vp test tests/<category>/<subject>.test.ts` for one file.
- Follow the same TypeScript, formatting, and file-size rules as application
  code.

## For Agents

- Read this file before adding, moving, or reviewing a test.
- Choose the existing category first. Add `tests/<category>/` only when no
  existing category fits.
- Keep test files directly inside their category directory. Do not add a
  nested category or put shared helpers at the `tests/` root.
- Update this file and the test references in `AGENTS.md` and
  `CODING_CONVENTION.md` together if the convention changes.
