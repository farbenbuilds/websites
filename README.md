# websites

Farben's official web presence — everything we publish on the web lives in this monorepo:

- **docs** — the documentation hub for Farben's projects, starting with [uWebZockets](https://github.com/farbenbuilds/uWebZockets) and [ventiws](https://github.com/farbenbuilds/ventiws)
- **landing** — Farben's landing and branding page
- **shop** — merchandise e-commerce shop

## Development

The flake provides the web toolchain — [Vite+](https://viteplus.dev) (`vp`), Node.js, and pnpm. `direnv` loads the glibc or musl shell automatically; otherwise run `nix develop` (or `nix develop .#musl`).
