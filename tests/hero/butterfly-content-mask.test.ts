import { describe, expect, it } from "vite-plus/test";

import { contentMaskAlpha } from "../../apps/uwz-docs/components/butterfly-hero/butterfly-content-mask.ts";

const REGION = {
  left: 10,
  top: 10,
  right: 20,
  bottom: 20,
};

describe("butterfly content mask", () => {
  it("clears the artwork at the center of a protected region", () => {
    expect(contentMaskAlpha(REGION, 14, 14)).toBe(1);
  });

  it("eases from the region edge to clear over eight cells", () => {
    const nearEdge = contentMaskAlpha(REGION, 6, 14);
    const middle = contentMaskAlpha(REGION, 4, 14);
    const outside = contentMaskAlpha(REGION, 0, 14);

    expect(nearEdge).toBeLessThan(1);
    expect(nearEdge).toBeGreaterThan(middle);
    expect(middle).toBeGreaterThan(outside);
    expect(outside).toBe(0);
  });
});
