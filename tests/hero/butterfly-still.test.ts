import { describe, expect, it } from "vite-plus/test";

import { generateStill } from "../../packages/ui/src/lib/components/butterfly-hero/butterfly-still.ts";

describe("server-rendered butterfly still", () => {
  it("is deterministic for a seed and stays under the 32KB fallback cap", () => {
    const first = generateStill(20261029);
    const second = generateStill(20261029);
    const size = new TextEncoder().encode(first).length;

    expect(first).toBe(second);
    expect(size).toBeLessThanOrEqual(32 * 1024);
  });

  it("is pure ASCII without readable words and has no blank first or last line", () => {
    const still = generateStill(77);

    expect(still).not.toMatch(/[A-Za-z]/);
    expect(still.startsWith("\n")).toBe(false);
    expect(still.endsWith("\n")).toBe(false);

    for (const line of still.split("\n")) {
      expect(line.length).toBeLessThanOrEqual(66);
    }
  });

  it("changes composition when the seed changes", () => {
    expect(generateStill(11)).not.toBe(generateStill(12));
  });
});
