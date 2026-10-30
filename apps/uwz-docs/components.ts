import { ButterflyHero } from "./components/butterfly-hero/index.ts";
import { defineComponents } from "blume";

import CopyCommand from "./components/copy-command.svelte";
import HeroChrome from "./components/hero-chrome.svelte";

export default defineComponents({
  mdx: {
    ButterflyHero: { component: ButterflyHero, client: "visible" },
    HeroChrome: { component: HeroChrome, client: "only" },
    HomeIndex: "./components/home-index.astro",
    SupportSection: "./components/support-section.astro",
    BenchmarkSection: "./components/benchmark-section.astro",
    CopyCommand: { component: CopyCommand, client: "visible" },
    SiteColophon: "./components/site-colophon.astro",
  },
});
