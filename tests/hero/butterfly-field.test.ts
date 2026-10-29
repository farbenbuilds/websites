import { describe, expect, it } from "vite-plus/test";

import {
  createField,
  stepField,
} from "../../packages/ui/src/lib/components/butterfly-hero/butterfly-field.ts";
import { separationSteer } from "../../packages/ui/src/lib/components/butterfly-hero/butterfly-separation.ts";

function field() {
  return createField({
    width: 120,
    height: 60,
    specimenCount: 8,
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

  it("caps the field at three big, four medium, and one small specimen", () => {
    const capped = createField({
      width: 40,
      height: 24,
      specimenCount: 12,
      seed: 7,
    });

    expect(capped.specimens).toHaveLength(8);
    expect(capped.specimens[3]?.scale).toBeLessThan(capped.specimens[0]?.scale ?? 0);
    expect(capped.specimens[6]?.scale).toBeLessThan(capped.specimens[2]?.scale ?? 0);
    expect(capped.specimens[7]?.scale).toBeLessThan(capped.specimens[3]?.scale ?? 0);
  });

  it("steers a butterfly away from a close neighbour", () => {
    const state = field();
    const first = state.specimens[0];
    const second = state.specimens[1];

    if (!first || !second) return;
    second.x = first.x + 1;
    second.y = first.y;

    const steer = separationSteer(state, first);

    expect(steer.x).toBeLessThan(0);
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
      expect(specimen.x).toBeLessThanOrEqual(120);
      expect(specimen.y).toBeGreaterThanOrEqual(-specimen.scale * 1.2);
      expect(specimen.y).toBeLessThanOrEqual(60 + specimen.scale * 1.2);
      expect(Math.sin(specimen.heading)).toBeLessThanOrEqual(0);
    }

    for (let i = 0; i < state.specimens.length; i++) {
      for (let j = i + 1; j < state.specimens.length; j++) {
        const a = state.specimens[i];
        const b = state.specimens[j];

        if (!a || !b) continue;
        const distance = Math.hypot(a.x - b.x, a.y - b.y);
        expect(distance).toBeGreaterThan((a.scale + b.scale) * 1.25 + 2.4);
      }
    }
  });
});
