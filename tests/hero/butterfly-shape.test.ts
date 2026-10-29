import { describe, expect, it } from "vite-plus/test";

import {
  createAnatomyScratch,
  createSpecimenPose,
  isInside,
  sampleAnatomy,
  specimenHalfSpan,
} from "../../packages/ui/src/lib/components/butterfly-hero/butterfly-shape.ts";
import { SPECIES } from "../../packages/ui/src/lib/components/butterfly-hero/butterfly-data.ts";

describe("butterfly anatomy", () => {
  it("defines three to five species with both wing pairs and an eyespot", () => {
    expect(SPECIES.length).toBeGreaterThanOrEqual(3);
    expect(SPECIES.length).toBeLessThanOrEqual(5);

    for (const species of SPECIES) {
      expect(species.fore.rx).toBeGreaterThan(0);
      expect(species.hind.ry).toBeGreaterThan(0);
      expect(species.eyespot.radius).toBeGreaterThan(0);
      expect(specimenHalfSpan(species)).toBeGreaterThan(0.8);
    }
  });

  it("hits the body center and a wing area for every species", () => {
    const scratch = createAnatomyScratch();

    for (const species of SPECIES) {
      const body = sampleAnatomy(species, 0, 0, createSpecimenPose(0, 0), 11, scratch);
      expect(body.hit).toBe(true);
      expect(body.part).toBe("body");

      const wingX = specimenHalfSpan(species) * 0.62;
      expect(isInside(species, wingX, -0.1, createSpecimenPose(0, 0), scratch)).toBe(true);
    }
  });

  it("keeps the outline symmetric when the flap phase is balanced", () => {
    const species = SPECIES[0];
    const scratch = createAnatomyScratch();
    const pose = createSpecimenPose(-0.175, 0);

    for (const [x, y] of [
      [0.3, -0.2],
      [0.6, 0.1],
      [0.45, 0.4],
      [0.2, 0.55],
    ] as const) {
      expect(isInside(species, x, y, pose, scratch)).toBe(isInside(species, -x, y, pose, scratch));
    }
  });

  it("gives each wing cell a body-locked grain value", () => {
    const species = SPECIES[1];
    const first = createAnatomyScratch();
    const second = createAnatomyScratch();

    const pose = createSpecimenPose(0.4, 0.2);
    const a = sampleAnatomy(species, 0.7, -0.1, pose, 99, first);
    const b = sampleAnatomy(species, 0.7, -0.1, pose, 99, second);

    expect(a.grain).toBe(b.grain);
    expect(a.part).toBe(b.part);
  });
});
