# Third-Party Notices

## Graphify

- Source: https://github.com/Graphify-Labs/graphify
- Version: 0.9.76
- License: Apache-2.0
- License text: [LICENSES/Apache-2.0.txt](LICENSES/Apache-2.0.txt)
- Retained MIT terms: [LICENSES/graphify-LICENSE-MIT.txt](LICENSES/graphify-LICENSE-MIT.txt)
- Notice: [LICENSES/graphify-NOTICE.txt](LICENSES/graphify-NOTICE.txt) (its
  `LICENSE` and `LICENSE-MIT` references map to the two files above)
- Vendored paths: `.opencode/skills/graphify/` and
  `.agents/skills/graphify-codex/`
- Local changes: the Codex copy is renamed to `graphify-codex` and carries
  `opencode/autoinvoke: "false"` metadata so each agent loads one copy. Both
  skill bodies pin install commands to `graphifyy==0.9.76` and fail instead of
  falling back to `pip`. The bodies are otherwise upstream content.

The anti-slop plugin carries its own upstream license under
`tools/oxlint/anti-slop/`.
