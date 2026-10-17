# websites

Farben's monorepo for all official web presences:

- **docs** — documentation for [uWebZockets](https://github.com/farbenbuilds/uWebZockets) and [ventiws](https://github.com/farbenbuilds/ventiws)
- **landing** — Farben's landing and branding page
- **shop** — merchandise e-commerce shop

## Development

The flake provides the web toolchain — [Vite+](https://viteplus.dev) (`vp`), Node.js, and pnpm. `direnv` loads the glibc or musl shell automatically; otherwise run `nix develop` (or `nix develop .#musl`).
