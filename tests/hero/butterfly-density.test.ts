import { describe, expect, it } from "vite-plus/test";

import {
  fallbackSpecimenCount,
  resolveSpecimenCount,
} from "../../packages/ui/src/lib/components/butterfly-hero/butterfly-density.ts";

describe("butterfly density", () => {
  it("uses three specimens through the compact breakpoint", () => {
    expect(resolveSpecimenCount(639, 8)).toBe(3);
    expect(resolveSpecimenCount(640, 8)).toBe(3);
    expect(resolveSpecimenCount(641, 8)).toBe(8);
  });

  it("respects a lower requested count and caps oversized requests", () => {
    expect(resolveSpecimenCount(320, 2)).toBe(2);
    expect(resolveSpecimenCount(1200, 24)).toBe(8);
    expect(fallbackSpecimenCount(8)).toBe(3);
  });
});
