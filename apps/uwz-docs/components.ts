import { defineComponents } from "blume";

export default defineComponents({
  layout: {
    Footer: "./components/colophon/site-footer.astro",
    Sidebar: "./components/nav/root-sidebar.astro",
  },
  mdx: {
    LandingShell: "./components/landing/landing-shell.astro",
    LandingHero: "./components/landing/landing-hero.astro",
    IndexCards: "./components/index-cards/index-cards.astro",
    SupportSection: "./components/support/support-section.astro",
    BenchmarkSection: "./components/benchmark/benchmark-section.astro",
    LandingServer: "./components/landing/landing-server.astro",
    LandingAuthor: "./components/landing/landing-author.astro",
    LandingSponsor: "./components/landing/landing-sponsor.astro",
    SiteColophon: "./components/colophon/site-colophon.astro",
  },
});
