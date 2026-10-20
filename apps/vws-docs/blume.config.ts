import { defineConfig } from "blume";

export default defineConfig({
  title: "ventiws",
  description:
    "Documentation for ventiws — a WebSocket implementation for Node.js with the API of ws, powered by a Zig framing engine.",
  github: {
    owner: "farbenbuilds",
    repo: "websites",
    // Point edit links at this project inside the monorepo.
    dir: "apps/vws-docs",
  },
  theme: {
    accent: "teal",
    fonts: {
      display: { name: "Outfit", weights: [500, 600, 700] },
      body: {
        name: "Be Vietnam Pro",
        weights: [400, 500, 600, 700],
        subsets: ["latin", "vietnamese"],
      },
      mono: "geist-mono",
    },
  },
  footer: {
    links: [{ label: "ventiws on GitHub", href: "https://github.com/farbenbuilds/ventiws" }],
  },
});
