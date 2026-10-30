# Third-Party Notices

## Farben artwork

- Source: https://github.com/farbenbuilds/farben-artwork
- Source paths: `icons/farben-logo.svg`, `github/farben-logo-github.png`
- Author: Noah Trần
- License: CC-BY-SA-4.0
- License text: [LICENSES/CC-BY-SA-4.0.txt](LICENSES/CC-BY-SA-4.0.txt)
- Vendored paths: `apps/uwz-docs/public/`, `apps/vws-docs/public/`
- Local changes: the 1024px GitHub avatar was downscaled to 180px for the Apple
  touch icon. The SVG favicon crops the transparent margin around the mark and
  raises the outline weight from 16.63 to 24 for legibility at tab sizes.

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

## Author avatar

- Source: provided by Noah Trần
- Vendored path: `apps/uwz-docs/public/author/noah-tran.webp`
- Local changes: white background keyed out, resized to 512x512, encoded as WebP
- Use: author profile on the uWebZockets docs home, with the author's permission
