# Skills

This directory contains two kinds of skills.

## Installed Third-Party Skills

These are installed with the `skills` CLI and pinned by
[`skills-lock.json`](../../skills-lock.json). Do not edit their files directly.
Update them through the CLI, review the lockfile diff, and keep the upstream
provenance intact.

Upstream content may contain emoji or wording that does not match this
repository's style. It is vendored as-is and is exempt from the repository
no-emoji rule. Project-owned skills below follow the repository style.

## Project-Owned Skills

These are maintained in this repository and are not listed in
`skills-lock.json`:

| Skill | Purpose |
| --- | --- |
| `websites-conventions` | Engineering contract, FP, separation of concerns, file-size limit |
| `agent-team-orchestration` | Architect, Developer, Reviewer, Integrator handoffs |
| `docs-site-authoring` | Blume and MDX content workflow |
| `web-ui-styling` | Tokens, Tailwind, shadcn-svelte, accessibility |
| `verification-and-release` | Gates, CI parity, pull-request evidence |
| `web-security-review` | Trust boundaries, secrets, injection, dependency risk |

## Adding a Project Skill

1. Create `.agents/skills/<kebab-case-id>/SKILL.md`.
2. Add `name` and `description` frontmatter. The description is what the model
   sees when deciding whether to load the skill.
3. State when to use it, the owned surface, the workflow, the hard rules, and
   the verification.
4. Keep supporting references beside `SKILL.md` and use relative paths.
5. Do not duplicate the full coding convention. Link to it.
6. Keep the skill focused enough to load without flooding context.

## Loading

OpenCode discovers `.agents/skills` automatically. Codex agents read the
relevant `SKILL.md` path listed in their instructions. Load the narrowest skill
that matches the current phase.
