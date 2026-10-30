import { defineConfig, type ComponentMarkdown } from "blume";

import { renderHomeIndexMarkdown } from "./components/home-index-data.ts";
import { renderBenchmarkMarkdown } from "./components/benchmark-section-data.ts";
import { renderSupportMarkdown } from "./components/support-section-data.ts";
import { SITE_LINKS, siteFooterNote } from "./site-links.ts";

const omitDecorative: ComponentMarkdown = () => "";

const homeIndexMarkdown: ComponentMarkdown = ({ props }) =>
  renderHomeIndexMarkdown(props.locale === "vi" ? "vi" : "en");

const supportMarkdown: ComponentMarkdown = ({ props }) =>
  renderSupportMarkdown(props.locale === "vi" ? "vi" : "en");

const benchmarkMarkdown: ComponentMarkdown = ({ props }) =>
  renderBenchmarkMarkdown(props.locale === "vi" ? "vi" : "en");

export default defineConfig({
  title: "µWebZockets",
  description:
    "Documentation for µWebZockets — a zero-allocation, shared-nothing server framework for Zig.",
  logo: {
    image: "/logo.svg",
  },
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
  agents: {
    markdownComponents: {
      ButterflyHero: omitDecorative,
      HeroChrome: omitDecorative,
      HomeIndex: homeIndexMarkdown,
      SupportSection: supportMarkdown,
      BenchmarkSection: benchmarkMarkdown,
    },
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
    copyright: siteFooterNote(),
    links: SITE_LINKS.map(({ label, href }) => ({ label, href })),
  },
});
