import { describe, expect, it } from "vite-plus/test";

import {
  renderSupportMarkdown,
  supportCopy,
} from "../../apps/uwz-docs/components/support-section-data.ts";

describe("docs home support section", () => {
  it("keeps localized capabilities and platform rows", () => {
    for (const locale of ["en", "vi"] as const) {
      const copy = supportCopy(locale);

      expect(copy.items).toHaveLength(8);
      expect(copy.platforms).toHaveLength(5);
      expect(copy.platforms[0]).toEqual({
        platform: "Linux",
        architecture: "x86_64",
        status: locale === "en" ? "Tested" : "Đã kiểm thử",
      });
    }
  });

  it("renders a contiguous three-column platform table for agents", () => {
    const markdown = renderSupportMarkdown("en");

    expect(markdown).toContain("### Platforms");
    expect(markdown).toContain(
      "| Platform | Architecture | Status |\n| --- | --- | --- |\n| Linux | x86_64 | Tested |",
    );
    expect(markdown).not.toContain("| Platform | Architecture | Status |\n\n| --- |");
    expect(markdown).not.toContain("Plaintext throughput");
  });
});
