import { describe, expect, it } from "vite-plus/test";

import {
  renderSupportMarkdown,
  supportCopy,
} from "../../apps/uwz-docs/components/support-section-data.ts";

describe("docs home support section", () => {
  it("keeps localized capabilities, platforms, and benchmark bars", () => {
    for (const locale of ["en", "vi"] as const) {
      const copy = supportCopy(locale);

      expect(copy.items).toHaveLength(8);
      expect(copy.platforms).toHaveLength(5);
      expect(copy.bars).toHaveLength(7);
      expect(copy.bars[0]?.name).toBe("µWebZockets");
      expect(copy.bars[0]?.value).toBe("148,237");
      expect(copy.bars[0]?.share).toBe(100);
      expect(copy.bars[0]?.leader).toBe(true);
      expect(copy.bars.every(({ share }) => share > 0 && share <= 100)).toBe(true);
    }
  });

  it("renders the platform matrix and benchmark for agent-facing markdown", () => {
    const markdown = renderSupportMarkdown("en");

    expect(markdown).toContain("### Platforms");
    expect(markdown).toContain("| Target | Status |\n| --- | --- |\n| Linux x86_64 | Tested |");
    expect(markdown).not.toContain("| Target | Status |\n\n| --- | --- |");
    expect(markdown).toContain("### Plaintext throughput");
    expect(markdown).toContain("- µWebZockets: 148,237");
  });
});
