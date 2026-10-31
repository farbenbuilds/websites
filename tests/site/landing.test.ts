import { describe, expect, it } from "vite-plus/test";

import { renderBenchmarkMarkdown } from "../../apps/uwz-docs/components/benchmark/benchmark-section-data.ts";
import { renderIndexCardsMarkdown } from "../../apps/uwz-docs/components/index-cards/index-cards-data.ts";
import { landingCopy } from "../../apps/uwz-docs/components/landing/landing-copy.ts";
import {
  renderLandingAuthorMarkdown,
  renderLandingHeroMarkdown,
  renderLandingServerMarkdown,
  renderLandingSponsorMarkdown,
} from "../../apps/uwz-docs/components/landing/landing-markdown.ts";
import { renderSupportMarkdown } from "../../apps/uwz-docs/components/support/support-section-data.ts";

describe("uwz landing page", () => {
  it("keeps localized hero and section copy", () => {
    for (const locale of ["en", "vi"] as const) {
      const copy = landingCopy(locale);
      const authorLinks = copy.author.bio.filter((part) => part.kind === "link");

      expect(copy.hero.title).toBe("µWebZockets");
      expect(copy.hero.dictionary.lines).toHaveLength(4);
      expect(copy.server.steps).toHaveLength(3);
      expect(copy.author.socials).toHaveLength(2);
      expect(authorLinks.every((part) => part.className === "editorial-link")).toBe(true);
      expect(copy.hero.primaryAction.href).toBe(
        locale === "vi" ? "/vi/docs/getting-started" : "/docs/getting-started",
      );
    }
  });

  it("renders each section for agent-facing markdown", () => {
    expect(renderLandingHeroMarkdown("en")).toContain("# µWebZockets");
    expect(renderIndexCardsMarkdown("en")).toContain("## Start here.");
    expect(renderSupportMarkdown("en")).toContain("## What µWZ supports");
    expect(renderBenchmarkMarkdown("en")).toContain("## Benchmarks.");
    expect(renderLandingServerMarkdown("en")).toContain("## Use µWZ as your server");
    expect(renderLandingAuthorMarkdown("en")).toContain("## Noah Trần");
    expect(renderLandingSponsorMarkdown("en")).toContain("## Sponsor the maintainers.");
    expect(renderLandingHeroMarkdown("en")).not.toContain("Semi-production ready.");
  });
});
