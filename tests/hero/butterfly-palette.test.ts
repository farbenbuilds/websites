import { describe, expect, it } from "vite-plus/test";

import {
  butterflyPatternColor,
  inkFor,
  type ButterflyPalette,
} from "../../apps/uwz-docs/components/butterfly-hero/butterfly-palette.ts";

const PALETTE: ButterflyPalette = {
  paper: { r: 26, g: 25, b: 23 },
  ink: { r: 255, g: 247, b: 240 },
  muted: { r: 210, g: 195, b: 174 },
  accent: { r: 255, g: 122, b: 0 },
  wings: [
    { r: 255, g: 107, b: 26 },
    { r: 255, g: 179, b: 0 },
    { r: 255, g: 224, b: 138 },
  ],
};

const LIGHT_PALETTE: ButterflyPalette = {
  paper: { r: 244, g: 240, b: 230 },
  ink: { r: 23, g: 21, b: 18 },
  muted: { r: 95, g: 90, b: 82 },
  accent: { r: 166, g: 70, b: 0 },
  wings: [
    { r: 194, g: 65, b: 12 },
    { r: 161, g: 98, b: 7 },
    { r: 217, g: 119, b: 6 },
  ],
};

const linear = (value: number): number => {
  const channel = value / 255;

  return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
};

const relativeLuminance = (color: {
  readonly r: number;
  readonly g: number;
  readonly b: number;
}): number => linear(color.r) * 0.2126 + linear(color.g) * 0.7152 + linear(color.b) * 0.0722;

describe("butterfly wing palette", () => {
  it("derives distinct pattern roles from the host palette", () => {
    const roles = ["base", "hind", "highlight", "band", "eyespot"] as const;
    const colors = roles.map((role) => butterflyPatternColor(PALETTE, 1, 0.6, role));

    expect(new Set(colors.map(({ r, g, b }) => `${r}:${g}:${b}`)).size).toBe(roles.length);
  });

  it("keeps pattern contrast when the hero paper is light", () => {
    const roles = ["base", "hind", "highlight", "band", "eyespot"] as const;
    const colors = roles.map((role) => butterflyPatternColor(LIGHT_PALETTE, 1, 0.6, role));
    const eyespot = butterflyPatternColor(LIGHT_PALETTE, 1, 0.6, "eyespot");
    const highlight = butterflyPatternColor(LIGHT_PALETTE, 1, 0.6, "highlight");

    expect(new Set(colors.map(({ r, g, b }) => `${r}:${g}:${b}`)).size).toBe(roles.length);
    expect(relativeLuminance(eyespot)).toBeLessThan(relativeLuminance(highlight));
  });

  it("keeps glyph roles readable in both themes", () => {
    expect(inkFor(PALETTE, "body")).toMatch(/^rgba\(26, 25, 23/);
    expect(inkFor(PALETTE, "eyespot")).toMatch(/^rgba\(255, 247, 240/);
    expect(inkFor(LIGHT_PALETTE, "body")).toMatch(/^rgba\(23, 21, 18/);
    expect(inkFor(LIGHT_PALETTE, "eyespot")).toMatch(/^rgba\(244, 240, 230/);
  });

  it("gives each species a different wing tone", () => {
    const first = butterflyPatternColor(PALETTE, 0, 0.6, "base");
    const second = butterflyPatternColor(PALETTE, 1, 0.6, "base");
    const third = butterflyPatternColor(PALETTE, 2, 0.6, "base");

    expect(first).not.toEqual(second);
    expect(second).not.toEqual(third);
  });
});
