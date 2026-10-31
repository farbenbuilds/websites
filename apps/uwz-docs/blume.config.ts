import svelte from "@astrojs/svelte";
import { defineConfig, type ComponentMarkdown } from "blume";

import { renderBenchmarkMarkdown } from "./components/benchmark/benchmark-section-data.ts";
import { renderSiteColophonMarkdown } from "./components/colophon/site-colophon-markdown.ts";
import { renderIndexCardsMarkdown } from "./components/index-cards/index-cards-data.ts";
import {
  renderLandingAuthorMarkdown,
  renderLandingHeroMarkdown,
  renderLandingServerMarkdown,
  renderLandingSponsorMarkdown,
} from "./components/landing/landing-markdown.ts";
import { renderSupportMarkdown } from "./components/support/support-section-data.ts";
import { SITE_LINKS, siteFooterNote } from "./site-links.ts";

const markdownFor =
  (render: (locale: string | undefined) => string): ComponentMarkdown =>
  ({ props }) =>
    render(props.locale === "vi" ? "vi" : "en");

const landingShellMarkdown: ComponentMarkdown = ({ childBlocks }) =>
  childBlocks()
    .map(({ markdown }) => markdown)
    .join("\n\n");

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
  integrations: [svelte()],
  agents: {
    markdownComponents: {
      LandingShell: landingShellMarkdown,
      LandingHero: markdownFor(renderLandingHeroMarkdown),
      IndexCards: markdownFor(renderIndexCardsMarkdown),
      SupportSection: markdownFor(renderSupportMarkdown),
      BenchmarkSection: markdownFor(renderBenchmarkMarkdown),
      LandingServer: markdownFor(renderLandingServerMarkdown),
      LandingAuthor: markdownFor(renderLandingAuthorMarkdown),
      LandingSponsor: markdownFor(renderLandingSponsorMarkdown),
      SiteColophon: markdownFor(renderSiteColophonMarkdown),
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
    copyright: {
      en: siteFooterNote("en"),
      vi: siteFooterNote("vi"),
    },
    links: SITE_LINKS.map(({ label, href }) => ({ label, href })),
  },
});
