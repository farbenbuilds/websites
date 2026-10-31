import { defineConfig, type ComponentMarkdown } from "blume";

import {
  renderLandingExampleMarkdown,
  renderLandingHighlightsMarkdown,
  renderLandingIntroMarkdown,
  renderLandingNotesMarkdown,
} from "./components/landing/landing-markdown.ts";

const introMarkdown: ComponentMarkdown = ({ props }) =>
  renderLandingIntroMarkdown(props.locale === "vi" ? "vi" : "en");

const highlightsMarkdown: ComponentMarkdown = ({ props }) =>
  renderLandingHighlightsMarkdown(props.locale === "vi" ? "vi" : "en");

const exampleMarkdown: ComponentMarkdown = ({ props }) =>
  renderLandingExampleMarkdown(props.locale === "vi" ? "vi" : "en");

const notesMarkdown: ComponentMarkdown = ({ props }) =>
  renderLandingNotesMarkdown(props.locale === "vi" ? "vi" : "en");

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
  i18n: {
    defaultLocale: "en",
    locales: [
      { code: "en", label: "English" },
      { code: "vi", label: "Tiếng Việt" },
    ],
  },
  agents: {
    markdownComponents: {
      LandingIntro: introMarkdown,
      LandingHighlights: highlightsMarkdown,
      LandingExample: exampleMarkdown,
      LandingNotes: notesMarkdown,
    },
  },
  theme: {
    accent: "teal",
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
    links: [
      {
        label: { en: "ventiws on GitHub", vi: "ventiws trên GitHub" },
        href: "https://github.com/farbenbuilds/ventiws",
      },
    ],
  },
});
