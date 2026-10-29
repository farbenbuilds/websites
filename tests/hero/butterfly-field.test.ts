import { describe, expect, it } from "vite-plus/test";

import {
  createField,
  densityFor,
  mergeAvoidBoxes,
  stepField,
} from "../../packages/ui/src/lib/components/butterfly-hero/butterfly-field.ts";

function field() {
  return createField({
    width: 80,
    height: 40,
    midgroundCount: 24,
    specimenCount: 2,
    seed: 424242,
  });
}

describe("butterfly field", () => {
  it("spawns deterministic specimen and midground positions from a seed", () => {
    const first = field();
    const second = field();

    expect(first.specimens.map(({ x, y }) => [x, y])).toEqual(
      second.specimens.map(({ x, y }) => [x, y]),
    );
    expect(first.midground.map(({ x, y }) => [x, y])).toEqual(
      second.midground.map(({ x, y }) => [x, y]),
    );
  });

  it("caps specimens at four and uses the compact density on narrow fields", () => {
    const compact = densityFor(40, 24);
    const wide = densityFor(90, 40);

    const capped = createField({
      width: 40,
      height: 24,
      midgroundCount: 8,
      specimenCount: 9,
      seed: 7,
    });

    expect(compact.specimens).toBe(1);
    expect(compact.midground).toBeLessThanOrEqual(52);
    expect(wide.specimens).toBeGreaterThanOrEqual(2);
    expect(wide.midground).toBeLessThanOrEqual(140);
    expect(capped.specimens).toHaveLength(4);
  });

  it("merges avoidance boxes closer than the gap and keeps distant boxes apart", () => {
    const merged = mergeAvoidBoxes(
      [
        { x: 0, y: 0, width: 10, height: 10 },
        { x: 40, y: 0, width: 10, height: 10 },
        { x: 14, y: 0, width: 10, height: 10 },
      ],
      5,
    );

    expect(merged).toHaveLength(2);
    expect(merged[0]).toMatchObject({ x: 0, y: 0, width: 24, height: 10 });
  });

  it("keeps every position finite and inside the wrap margin after many steps", () => {
    const state = field();

    for (let index = 0; index < 600; index++) {
      stepField(state, 1 / 60);
    }

    expect(state.time).toBeCloseTo(10, 5);

    for (const specimen of state.specimens) {
      expect(Number.isFinite(specimen.x)).toBe(true);
      expect(Number.isFinite(specimen.y)).toBe(true);
      expect(specimen.x).toBeGreaterThanOrEqual(-8);
      expect(specimen.x).toBeLessThanOrEqual(88);
      expect(specimen.y).toBeGreaterThanOrEqual(-8);
      expect(specimen.y).toBeLessThanOrEqual(48);
    }

    for (const butterfly of state.midground) {
      expect(Number.isFinite(butterfly.phase)).toBe(true);
      expect(butterfly.frame).toBeGreaterThanOrEqual(0);
      expect(butterfly.frame).toBeLessThanOrEqual(2);
    }
  });
});
