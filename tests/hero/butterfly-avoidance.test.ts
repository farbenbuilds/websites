import { describe, expect, it } from "vite-plus/test";

import {
  avoidanceSteer,
  mergeAvoidRegions,
  type AvoidRegion,
} from "../../apps/uwz-docs/components/butterfly-hero/butterfly-avoidance.ts";

const REGION: AvoidRegion = { left: 10, top: 10, right: 20, bottom: 20 };

describe("butterfly content avoidance", () => {
  it("merges nearby protected regions", () => {
    const merged = mergeAvoidRegions([REGION, { left: 21, top: 12, right: 28, bottom: 18 }], 2);

    expect(merged).toEqual([{ left: 10, top: 10, right: 28, bottom: 20 }]);
  });

  it("steers outward on every side of a protected region", () => {
    expect(avoidanceSteer([REGION], 8, 15, 4).x).toBeLessThan(0);
    expect(avoidanceSteer([REGION], 22, 15, 4).x).toBeGreaterThan(0);
    expect(avoidanceSteer([REGION], 15, 8, 4).y).toBeLessThan(0);
    expect(avoidanceSteer([REGION], 15, 22, 4).y).toBeGreaterThan(0);
  });

  it("does not steer a distant specimen", () => {
    expect(avoidanceSteer([REGION], 40, 40, 4)).toEqual({ x: 0, y: 0 });
  });
});
