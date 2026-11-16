# Claude Code Instructions

[AGENTS.md](AGENTS.md) is the canonical repository guide. Claude Code loads it
through the import below, so edit `AGENTS.md` for shared rules and keep this file
limited to Claude Code loading details.

@AGENTS.md

## Claude Code Loading

- Project skills are maintained once under `.agents/skills`. The
  `.claude/skills/herdr` link points at the canonical Herdr skill so Claude Code
  discovers it; OpenCode and Codex read `.agents/skills` directly.
- If the link is missing after checkout, read `.agents/skills/herdr/SKILL.md`
  directly instead of installing a second copy.
- Herdr orchestration is optional and follows "Optional Herdr Orchestration" in
  `AGENTS.md`. Load the `herdr` skill only for an explicit Herdr request or an
  active Herdr session that the user asked to orchestrate.
- Project roles live in `TEAM_WORKFLOW.md` and are mirrored in
  `.opencode/agents` and `.codex/agents`. Keep the role names when delegating
  through Herdr and do not invent a second hierarchy.
- Run the narrowest relevant gate from `CODING_CONVENTION.md` and report actual
  results. Never claim an unrun check passed.
