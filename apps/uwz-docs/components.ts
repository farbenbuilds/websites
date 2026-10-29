import { ButterflyHero } from "@farben/ui/components/butterfly-hero";
import { defineComponents } from "blume";

import CopyCommand from "./components/copy-command.svelte";

export default defineComponents({
  mdx: {
    ButterflyHero: { component: ButterflyHero, client: "visible" },
    CopyCommand: { component: CopyCommand, client: "visible" },
    SiteColophon: "./components/site-colophon.astro",
  },
});
