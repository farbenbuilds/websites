import { describe, expect, it } from "vite-plus/test";

import {
  butterflyPatternColor,
  type ButterflyPalette,
} from "../../apps/uwz-docs/components/butterfly-hero/butterfly-palette.ts";

const PALETTE: ButterflyPalette = {
  paper: { r: 8, g: 6, b: 4 },
  ink: { r: 255, g: 246, b: 223 },
  muted: { r: 143, g: 109, b: 42 },
  accent: { r: 255, g: 122, b: 0 },
  wings: [
    { r: 255, g: 107, b: 26 },
    { r: 255, g: 179, b: 0 },
    { r: 255, g: 224, b: 138 },
  ],
};

describe("butterfly wing palette", () => {
  it("derives distinct pattern roles from the host palette", () => {
    const roles = ["base", "hind", "highlight", "band", "eyespot"] as const;
    const colors = roles.map((role) => butterflyPatternColor(PALETTE, 1, 0.6, role));

    expect(new Set(colors.map(({ r, g, b }) => `${r}:${g}:${b}`)).size).toBe(roles.length);
  });

  it("gives each species a different wing tone", () => {
    const first = butterflyPatternColor(PALETTE, 0, 0.6, "base");
    const second = butterflyPatternColor(PALETTE, 1, 0.6, "base");
    const third = butterflyPatternColor(PALETTE, 2, 0.6, "base");

    expect(first).not.toEqual(second);
    expect(second).not.toEqual(third);
  });
});
