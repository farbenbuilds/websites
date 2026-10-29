import { describe, expect, it } from "vite-plus/test";

import {
  createField,
  stepField,
} from "../../packages/ui/src/lib/components/butterfly-hero/butterfly-field.ts";

function field() {
  return createField({
    width: 80,
    height: 40,
    specimenCount: 5,
    seed: 424242,
  });
}

describe("butterfly field", () => {
  it("spawns deterministic specimen positions from a seed", () => {
    const first = field();
    const second = field();

    expect(first.specimens.map(({ x, y }) => [x, y])).toEqual(
      second.specimens.map(({ x, y }) => [x, y]),
    );
  });

  it("caps the field at three big and two medium specimens", () => {
    const capped = createField({
      width: 40,
      height: 24,
      specimenCount: 9,
      seed: 7,
    });

    expect(capped.specimens).toHaveLength(5);
    expect(capped.specimens[3]?.scale).toBeLessThan(capped.specimens[0]?.scale ?? 0);
    expect(capped.specimens[4]?.scale).toBeLessThan(capped.specimens[1]?.scale ?? 0);
  });

  it("keeps every position finite, inside the field, and clear of its neighbour", () => {
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
      expect(Math.sin(specimen.heading)).toBeLessThanOrEqual(0.31);
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
  });
});
