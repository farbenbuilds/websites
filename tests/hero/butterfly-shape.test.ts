import { describe, expect, it } from "vite-plus/test";

import {
  createAnatomyScratch,
  createSpecimenPose,
  sampleAnatomy,
  specimenHalfSpan,
} from "../../packages/ui/src/lib/components/butterfly-hero/butterfly-shape.ts";
import { SPECIES } from "../../packages/ui/src/lib/components/butterfly-hero/butterfly-data.ts";

describe("butterfly anatomy", () => {
  it("defines three faceted species with both wing outlines and an eyespot", () => {
    expect(SPECIES).toHaveLength(3);

    for (const species of SPECIES) {
      expect(species.fore.points.length).toBeGreaterThanOrEqual(4);
      expect(species.hind.points.length).toBeGreaterThanOrEqual(4);
      expect(species.eyespot.radius).toBeGreaterThan(0);
      expect(specimenHalfSpan(species)).toBeGreaterThan(0.8);
    }
  });

  it("hits the body center and a wing area for every species", () => {
    const scratch = createAnatomyScratch();

    for (const species of SPECIES) {
      const pose = createSpecimenPose(0, 0);
      const body = sampleAnatomy(species, 0, 0, pose, 11, scratch);
      expect(body.hit).toBe(true);
      expect(body.part).toBe("body");

      const wingX = specimenHalfSpan(species) * 0.62;
      expect(sampleAnatomy(species, wingX, -0.1, pose, 11, scratch).hit).toBe(true);
    }
  });

  it("keeps the wing outline connected across the old fore/hind seam", () => {
    const species = SPECIES[0];
    const scratch = createAnatomyScratch();
    const pose = createSpecimenPose(0, 0);

    for (const y of [-0.1, -0.02, 0.04, 0.12, 0.2]) {
      expect(sampleAnatomy(species, 0.62, y, pose, 5, scratch).hit).toBe(true);
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
      const right = sampleAnatomy(species, x, y, pose, 7, scratch).hit;
      const left = sampleAnatomy(species, -x, y, pose, 7, scratch).hit;
      expect(right).toBe(left);
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
