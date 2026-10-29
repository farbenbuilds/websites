import { describe, expect, it } from "vite-plus/test";

import {
  steerFromPointer,
  type Steering,
} from "../../packages/ui/src/lib/components/butterfly-hero/butterfly-breeze.ts";

function steering(): Steering {
  return { x: 0 };
}

describe("butterfly breeze", () => {
  it("pushes a point away from an active pointer breeze", () => {
    const out = steering();
    steerFromPointer({ x: 10, y: 10, active: true }, 14, 10, out);

    expect(out.x).toBeGreaterThan(0);
  });

  it("leaves a point outside the breeze radius alone", () => {
    const out = steering();
    steerFromPointer({ x: 0, y: 0, active: true }, 40, 40, out);

    expect(out.x).toBe(0);
  });
});
