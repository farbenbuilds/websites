import { describe, expect, it } from "vite-plus/test";

import { contentMaskAlpha } from "../../packages/ui/src/lib/components/butterfly-hero/butterfly-content-mask.ts";

const REGION = {
  left: 10,
  top: 10,
  right: 20,
  bottom: 20,
};

describe("butterfly content mask", () => {
  it("leaves fifteen percent of the artwork visible at the center", () => {
    expect(contentMaskAlpha(REGION, 14, 14)).toBeCloseTo(0.85, 5);
  });

  it("eases from the region edge to clear over four cells", () => {
    const nearEdge = contentMaskAlpha(REGION, 8, 14);
    const middle = contentMaskAlpha(REGION, 7, 14);
    const outside = contentMaskAlpha(REGION, 5, 14);

    expect(nearEdge).toBeLessThan(0.85);
    expect(nearEdge).toBeGreaterThan(middle);
    expect(middle).toBeGreaterThan(outside);
    expect(outside).toBe(0);
  });
});
