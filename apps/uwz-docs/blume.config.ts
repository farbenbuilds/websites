import { defineConfig } from "blume";

import { SITE_LINKS, siteCopyright } from "./site-links.ts";

export default defineConfig({
  title: "µWebZockets",
  description:
    "Documentation for µWebZockets — a zero-allocation, shared-nothing server framework for Zig.",
  github: {
    owner: "farbenbuilds",
    repo: "websites",
    // Point edit links at this project inside the monorepo.
    dir: "apps/uwz-docs",
  },
  i18n: {
    defaultLocale: "en",
    locales: [
      { code: "en", label: "English" },
      { code: "vi", label: "Tiếng Việt" },
    ],
  },
  theme: {
    accent: "orange",
    radius: "none",
    background: {
      light: "#f4f0e6",
      dark: "#161513",
    },
    fonts: {
      display: {
        name: "Google Sans Flex",
        weights: ["500..700"],
        subsets: ["latin", "vietnamese"],
      },
      body: {
        name: "Be Vietnam Pro",
        weights: [400, 500, 600, 700],
        subsets: ["latin", "vietnamese"],
      },
      mono: "jetbrains-mono",
    },
  },
  footer: {
    copyright: siteCopyright(),
    links: SITE_LINKS.map(({ label, href }) => ({ label, href })),
  },
});
