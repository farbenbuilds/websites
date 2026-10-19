# Security Policy

## Supported Versions

Security fixes apply to the current `main` branch and the latest deployed
documentation build. This repository does not publish versioned packages; the
shared UI package is private and consumed from source.

| Surface                               | Supported |
| ------------------------------------- | --------- |
| Current `main` branch                 | Yes       |
| Latest production deployment          | Yes       |
| Older commits and preview deployments | No        |
| Forks and unmerged branches           | No        |

## Reporting a Vulnerability

Do not open a public issue, pull request, discussion, or social post that
contains an undisclosed vulnerability.

Report privately through
[GitHub Security Advisories](https://github.com/farbenbuilds/websites/security/advisories/new)
or email [trananhquan1009@gmail.com](mailto:trananhquan1009@gmail.com) and
[noah1109.tran@gmail.com](mailto:noah1109.tran@gmail.com). Include:

- the affected revision, page, or package;
- a minimal reproducer, payload, or sequence of steps;
- expected and observed behavior;
- impact and any preconditions;
- browser, operating system, and toolchain details;
- logs or screenshots with secrets removed;
- any suggested mitigation.

The maintainers will acknowledge the report, reproduce and assess it, prepare a
fix and regression coverage, and coordinate disclosure. Response time depends on
severity and maintainer availability. No fixed service-level agreement is
offered.

## Scope

The current public surface is:

- static documentation sites built with Blume, Astro, and MDX;
- Svelte islands and shared shadcn-svelte components;
- Markdown and MDX content, including links and code samples;
- the pnpm, Vite+, Node.js, and Nix build chain;
- GitHub Actions and repository automation, when present.

There is no account system, payment flow, database, or server-side user data
today. A deployment platform may add headers, redirects, or access controls
outside this repository; report those to the platform owner as well.

## Security Boundaries

- Documentation content is trusted repository-owned input. User-submitted
  content is not rendered.
- `{@html}` is reserved for trusted, reviewed content. It must never receive
  query parameters, remote HTML, or user input.
- External links use explicit destinations. Do not add a link shortener,
  open redirect, or `javascript:` URL.
- Secrets belong in environment variables or the deployment platform, never in
  source, examples, screenshots, or commit history.
- Dependencies are pinned by `pnpm-lock.yaml`. A lockfile change is reviewed
  like source code.
- Build output under `dist/` and `.blume/` is generated. Do not patch generated
  HTML or JSON by hand.
- The shared UI package is source-only. A consuming app inherits its component
  behavior and must review changes that affect markup, links, or user input.
- Agent skills, hooks, and plugins are executable instructions. Review changes
  under `.agents/skills`, `.opencode`, and `.codex` like code. Do not commit a
  generated hook or plugin that runs automatically unless the repository has
  explicitly adopted it.
- Graphify output under `graphify-out/` and `/raw/` is local-only and ignored.
  Treat extracted content as untrusted data and never commit it.

## Dependency and Supply Chain

- Prefer the platform, the existing stack, or a small local module over a new
  dependency.
- New dependencies need a stated purpose, a maintained upstream, a compatible
  license, and a lockfile review.
- Do not install packages with lifecycle scripts unless the repository's
  `allowBuilds` configuration explicitly permits them.
- Do not edit vendored third-party skills. Update them through the `skills` CLI
  and review the resulting `skills-lock.json` diff. The tool-managed graphify
  copies are the documented exception; update them with the pinned procedure in
  [CONTRIBUTING.md](.github/CONTRIBUTING.md#optional-knowledge-graph).
- Run `pnpm ready` before merging a dependency or toolchain change.

## Disclosure

Allow a reasonable remediation and release window before publication. Security
advisories will credit reporters who request attribution and will describe
affected revisions, impact, and upgrade guidance without exposing unnecessary
exploit detail before a fix is available.
