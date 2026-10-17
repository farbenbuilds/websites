import { defineConfig } from "blume";

export default defineConfig({
  title: "µWebZockets",
  description:
    "Documentation for µWebZockets — a zero-allocation, shared-nothing server framework for Zig.",
  github: {
    owner: "farbenbuilds",
    repo: "websites",
    // Point edit links at this project inside the monorepo.
    dir: "apps/uWebZockets-docs",
  },
  theme: {
    accent: "orange",
  },
  footer: {
    links: [
      { label: "µWebZockets on GitHub", href: "https://github.com/farbenbuilds/uWebZockets" },
    ],
  },
});
