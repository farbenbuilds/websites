import { defineConfig } from "blume";

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
    fonts: {
      display: { name: "Outfit", weights: [500, 600, 700], subsets: ["latin"] },
      body: {
        name: "Be Vietnam Pro",
        weights: [400, 500, 600, 700],
        subsets: ["latin", "vietnamese"],
      },
      mono: "geist-mono",
    },
  },
  footer: {
    links: [
      {
        label: { en: "µWebZockets on GitHub", vi: "µWebZockets trên GitHub" },
        href: "https://github.com/farbenbuilds/uWebZockets",
      },
    ],
  },
});
