import { defineComponents } from "blume";

export default defineComponents({
  mdx: {
    LandingIntro: "./components/landing/landing-intro.astro",
    LandingHighlights: "./components/landing/landing-highlights.astro",
    LandingExample: "./components/landing/landing-example.astro",
    LandingNotes: "./components/landing/landing-notes.astro",
  },
});
