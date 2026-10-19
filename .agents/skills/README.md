# Skills

This directory contains three kinds of skills.

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

## Tool-Managed Skills

Graphify is installed by its own CLI, not the `skills` CLI, so it is not listed
in `skills-lock.json`. Its generated copies are vendored and excluded from lint,
formatting, and the size check:

- `.opencode/skills/graphify/` for OpenCode.
- `.agents/skills/graphify-codex/` for Codex. Codex reads `.agents/skills`. The
  distinct name prevents a duplicate skill ID, and `opencode/autoinvoke: "false"`
  hides the Codex copy from OpenCode's model-facing list.

Both copies are graphify 0.9.76 (Apache-2.0). Their bodies are upstream content
except for the pinned install fallback. The other local adaptations are the
Codex copy's name and its OpenCode visibility metadata. License texts and notices
are in [THIRD_PARTY_NOTICES.md](../../THIRD_PARTY_NOTICES.md). The update and
cleanup procedure is in
[CONTRIBUTING.md](../../.github/CONTRIBUTING.md#optional-knowledge-graph).

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

OpenCode and Codex discover `.agents/skills` automatically. OpenCode also
discovers `.opencode/skills`. Load the narrowest skill that matches the current
phase.
