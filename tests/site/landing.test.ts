import { describe, expect, it } from "vite-plus/test";

import { landingCopy } from "../../apps/uwz-docs/components/landing/landing-copy.ts";
import { renderLandingMarkdown } from "../../apps/uwz-docs/components/landing/landing-markdown.ts";

describe("uwz landing page", () => {
  it("keeps localized hero and section copy", () => {
    for (const locale of ["en", "vi"] as const) {
      const copy = landingCopy(locale);

      expect(copy.hero.title).toBe("µWebZockets");
      expect(copy.hero.dictionary.lines).toHaveLength(4);
      expect(copy.server.steps).toHaveLength(3);
      expect(copy.author.socials).toHaveLength(2);
      expect(copy.hero.primaryAction.href).toBe(
        locale === "vi" ? "/vi/getting-started" : "/getting-started",
      );
    }
  });

  it("renders the composed agent markdown in page order", () => {
    const markdown = renderLandingMarkdown("en");

    expect(markdown).toContain("# µWebZockets");
    expect(markdown).toContain("## Start here.");
    expect(markdown).toContain("## What µWZ supports");
    expect(markdown).toContain("## Benchmarks.");
    expect(markdown).toContain("## Use µWZ as your server");
    expect(markdown).toContain("## Noah Trần");
    expect(markdown).toContain("## Sponsor the maintainers.");
    expect(markdown).not.toContain("Semi-production ready.");
  });
});
