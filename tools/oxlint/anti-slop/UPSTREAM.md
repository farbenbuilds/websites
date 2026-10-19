# Anti-slop plugin provenance

- Source repository: `dmmulroy/anti-slop`
- Source skill: `install-anti-slop`
- Source snapshot: skill lock hash `1b9b5d3c0d9e0ef8dd7631f4d637e66b62a73e34dceaf4ae07c0d3de376fd7d7`
- Installed path: `tools/oxlint/anti-slop`
- Installed with: `node .agents/skills/install-anti-slop/scripts/install.mjs`
- Local changes: imports rewritten from `@oxlint/plugins` to
  `vite-plus/lint/plugins` so the plugin matches Vite+'s bundled Oxlint
- Companion dependency: none; Vite+ supplies the plugin authoring API

The vendored `vendor/eslint-stylistic` license and upstream notice travel with the
plugin. Update this copy through the `install-anti-slop` skill; do not edit the
vendored rules in place.
