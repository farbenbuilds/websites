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
    specimenCount: 5,
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

  it("keeps five specimens and reduces the compact background field", () => {
    const compact = densityFor(40, 24);
    const wide = densityFor(90, 40);

    const capped = createField({
      width: 40,
      height: 24,
      midgroundCount: 8,
      specimenCount: 9,
      seed: 7,
    });

    expect(compact.specimens).toBe(5);
    expect(compact.midground).toBeGreaterThanOrEqual(8);
    expect(compact.midground).toBeLessThanOrEqual(14);
    expect(wide.specimens).toBe(5);
    expect(wide.midground).toBeGreaterThanOrEqual(12);
    expect(wide.midground).toBeLessThanOrEqual(22);
    expect(capped.specimens).toHaveLength(5);
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

  it("keeps every position finite and inside the field after many steps", () => {
    const state = field();

    for (let index = 0; index < 600; index++) {
      stepField(state, 1 / 60);
    }

    expect(state.time).toBeCloseTo(10, 5);

    for (const specimen of state.specimens) {
      expect(Number.isFinite(specimen.x)).toBe(true);
      expect(Number.isFinite(specimen.y)).toBe(true);
      expect(specimen.x).toBeGreaterThanOrEqual(0);
      expect(specimen.x).toBeLessThanOrEqual(80);
      expect(specimen.y).toBeGreaterThanOrEqual(0);
      expect(specimen.y).toBeLessThanOrEqual(40);
      expect(Math.sin(specimen.heading)).toBeLessThanOrEqual(0.33);
    }

    for (let i = 0; i < state.specimens.length; i++) {
      for (let j = i + 1; j < state.specimens.length; j++) {
        const a = state.specimens[i];
        const b = state.specimens[j];

        if (!a || !b) continue;
        const distance = Math.hypot(a.x - b.x, a.y - b.y);
        expect(distance).toBeGreaterThan((a.scale + b.scale) * 1);
      }
    }

    for (const butterfly of state.midground) {
      expect(Number.isFinite(butterfly.phase)).toBe(true);
      expect(butterfly.frame).toBeGreaterThanOrEqual(0);
      expect(butterfly.frame).toBeLessThanOrEqual(2);
    }
  });
});
