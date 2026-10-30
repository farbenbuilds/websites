import { describe, expect, it } from "vite-plus/test";

import {
  createAtmosphere,
  depositDraft,
  draftAt,
  emitBreeze,
  emitTrace,
  stepAtmosphere,
} from "../../apps/uwz-docs/components/butterfly-hero/butterfly-atmosphere.ts";

function atmosphere() {
  return createAtmosphere({
    width: 40,
    height: 24,
    pollenCount: 18,
    traceCount: 6,
    seed: 913,
  });
}

describe("butterfly atmosphere", () => {
  it("allocates typed draft buffers for the cell grid", () => {
    const state = atmosphere();

    expect(state.draft).toHaveLength(40 * 24);
    expect(state.draftTmp).toHaveLength(40 * 24);
    expect(state.pollen).toHaveLength(18);
    expect(state.traces).toHaveLength(6);
    expect(state.breeze).toHaveLength(64);
  });

  it("deposits wingbeat energy that diffuses and decays", () => {
    const state = atmosphere();
    depositDraft(state, 12, 8, 1, 2);
    const peak = draftAt(state, 12, 8);
    expect(peak).toBeGreaterThan(0.5);

    for (let index = 0; index < 120; index++) {
      stepAtmosphere(state, 1 / 60);
    }

    expect(draftAt(state, 12, 8)).toBeLessThan(peak);
    expect(draftAt(state, 12, 8)).toBeGreaterThanOrEqual(0);
  });

  it("gives each wingbeat a short gray breeze puff that decays", () => {
    const state = atmosphere();
    emitBreeze(state, 20, 12, 1, -0.2);

    const active = state.breeze.find((puff) => puff.life > 0);
    expect(active).toBeDefined();
    expect(active?.life).toBeGreaterThan(0);

    for (let index = 0; index < 120; index++) {
      stepAtmosphere(state, 1 / 60);
    }

    expect(state.breeze.filter((puff) => puff.life > 0)).toHaveLength(0);
  });

  it("keeps pollen and traces inside the field and recycles expired traces", () => {
    const state = atmosphere();
    emitTrace(state, 20, 12, 0.4);

    for (let index = 0; index < 600; index++) {
      stepAtmosphere(state, 1 / 60);
    }

    for (const mote of state.pollen) {
      expect(mote.x).toBeGreaterThanOrEqual(0);
      expect(mote.x).toBeLessThan(40);
      expect(mote.y).toBeGreaterThanOrEqual(0);
      expect(mote.y).toBeLessThan(24);
      expect(Number.isFinite(mote.phase)).toBe(true);
    }

    for (const trace of state.traces) {
      expect(trace.life).toBeLessThanOrEqual(trace.maxLife);
      expect(Number.isFinite(trace.heading)).toBe(true);
    }
  });
});
