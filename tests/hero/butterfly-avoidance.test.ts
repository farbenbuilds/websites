import { describe, expect, it } from "vite-plus/test";

import {
  mergeAvoidBoxes,
  steerFromBoxes,
  steerFromPointer,
  type Steering,
} from "../../packages/ui/src/lib/components/butterfly-hero/butterfly-avoidance.ts";

function steering(): Steering {
  return { x: 0, y: 0 };
}

describe("butterfly avoidance", () => {
  it("pushes a point away from a merged content box", () => {
    const out = steering();
    steerFromBoxes([{ x: 10, y: 10, width: 6, height: 6 }], 8, 13, 4, out);

    expect(out.x).toBeLessThan(0);
    expect(out.y).toBe(0);
  });

  it("leaves a point outside the margin alone", () => {
    const out = steering();
    steerFromBoxes([{ x: 10, y: 10, width: 6, height: 6 }], 0, 0, 2, out);

    expect(out.x).toBe(0);
    expect(out.y).toBe(0);
  });

  it("pushes a point away from an active pointer breeze", () => {
    const out = steering();
    steerFromPointer({ x: 10, y: 10, active: true }, 14, 10, out);

    expect(out.x).toBeGreaterThan(0);
    expect(out.y).toBeLessThan(0);
  });

  it("merges touching boxes into one larger box", () => {
    const merged = mergeAvoidBoxes(
      [
        { x: 0, y: 0, width: 10, height: 10 },
        { x: 11, y: 2, width: 9, height: 8 },
      ],
      2,
    );

    expect(merged).toHaveLength(1);
    expect(merged[0]).toMatchObject({ x: 0, y: 0, width: 20, height: 10 });
  });
});
