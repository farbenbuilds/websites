import { describe, expect, it } from "vite-plus/test";

import {
  benchmarkCopy,
  renderBenchmarkMarkdown,
} from "../../apps/uwz-docs/components/benchmark-section-data.ts";

describe("docs home benchmark section", () => {
  it("keeps both throughput and HTTP Arena data", () => {
    for (const locale of ["en", "vi"] as const) {
      const copy = benchmarkCopy(locale);

      expect(copy.bars).toHaveLength(7);
      expect(copy.bars[0]?.name).toBe("µWebZockets");
      expect(copy.bars[0]?.value).toBe("148,237");
      expect(copy.bars[0]?.share).toBe(100);
      expect(copy.bars.every(({ share }) => share > 0 && share <= 100)).toBe(true);
      expect(copy.arenaMetrics).toHaveLength(5);
      expect(copy.arenaMetrics[0]?.value).toBe("3,736,192");
    }
  });

  it("renders both benchmark sources for agent-facing markdown", () => {
    const markdown = renderBenchmarkMarkdown("en");

    expect(markdown).toContain("### bench.zig.bd · Plaintext throughput");
    expect(markdown).toContain("- µWebZockets: 148,237");
    expect(markdown).toContain("### HTTP Arena · Cross-protocol results");
    expect(markdown).toContain("- HTTP/1.1: 3,736,192 req/s");
  });
});
