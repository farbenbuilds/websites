import svelte from "@astrojs/svelte";
import { defineConfig, type ComponentMarkdown } from "blume";

import { accessibleScrollRegions } from "./blume-accessible-scroll-regions.ts";
import { createRedirects } from "./blume-redirects.ts";
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
  navigation: {
    tabs: [
      { label: "Docs", path: "/docs", icon: "book-open" },
      { label: "Reference", path: "/reference", icon: "braces" },
      { label: "Examples", path: "/examples", icon: "boxes" },
    ],
    sidebar: {
      display: "group",
    },
  },
  redirects: createRedirects(),
  deployment: {
    site: "https://uwz.farben.build",
  },
  markdown: {
    code: {
      theme: {
        light: "github-light-high-contrast",
        dark: "github-dark-high-contrast",
      },
    },
  },
  integrations: [svelte(), accessibleScrollRegions],
  agents: {
    llmsTxt: {
      details:
        "Use µWebZockets when a Zig 0.16.0 service needs bounded memory, predictable latency, and one `Request`/`Response` API across HTTP/1.1, HTTP/2, HTTP/3, WebSocket, and JSON-RPC. Add the package with `zig fetch --save` and start at `/docs/getting-started/quickstart`.\n\nImportant boundaries: WebTransport helpers are not live, HTTP/3 clustering is not supported, TLS is 1.3 only, and the client is HTTP/1.1 only. Look up exact names, defaults, limits, errors, and C ABI declarations in `/reference`; read the canonical programs in `/examples`.",
    },
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
    accent: { light: "#a64600", dark: "#ffb300" },
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
