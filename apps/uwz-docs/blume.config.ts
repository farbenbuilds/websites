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
  navigation: {
    sidebar: {
      display: "group",
    },
  },
  redirects: [
    { from: "/getting-started", to: "/docs/getting-started", status: 301 },
    { from: "/getting-started/:slug*", to: "/docs/getting-started/:slug*", status: 301 },
    { from: "/vi/getting-started", to: "/vi/docs/getting-started", status: 301 },
    { from: "/vi/getting-started/:slug*", to: "/vi/docs/getting-started/:slug*", status: 301 },
    {
      from: "/docs/getting-started/first-http-server",
      to: "/docs/examples/first-http-server",
      status: 301,
    },
    {
      from: "/docs/getting-started/first-websocket",
      to: "/docs/examples/first-websocket",
      status: 301,
    },
    {
      from: "/docs/getting-started/first-json-rpc-service",
      to: "/docs/examples/first-json-rpc-service",
      status: 301,
    },
    {
      from: "/docs/getting-started/first-tls-server",
      to: "/docs/examples/first-tls-server",
      status: 301,
    },
    {
      from: "/docs/getting-started/first-cluster",
      to: "/docs/examples/first-cluster",
      status: 301,
    },
    {
      from: "/docs/getting-started/first-http3-server",
      to: "/docs/examples/first-http3-server",
      status: 301,
    },
    {
      from: "/vi/docs/getting-started/first-http-server",
      to: "/vi/docs/examples/first-http-server",
      status: 301,
    },
    {
      from: "/vi/docs/getting-started/first-websocket",
      to: "/vi/docs/examples/first-websocket",
      status: 301,
    },
    {
      from: "/vi/docs/getting-started/first-json-rpc-service",
      to: "/vi/docs/examples/first-json-rpc-service",
      status: 301,
    },
    {
      from: "/vi/docs/getting-started/first-tls-server",
      to: "/vi/docs/examples/first-tls-server",
      status: 301,
    },
    {
      from: "/vi/docs/getting-started/first-cluster",
      to: "/vi/docs/examples/first-cluster",
      status: 301,
    },
    {
      from: "/vi/docs/getting-started/first-http3-server",
      to: "/vi/docs/examples/first-http3-server",
      status: 301,
    },
  ],
  deployment: {
    site: "https://uwz.farben.dev",
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
