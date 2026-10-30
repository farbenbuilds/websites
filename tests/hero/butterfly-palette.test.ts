import { describe, expect, it } from "vite-plus/test";

import {
  butterflyPatternColor,
  type ButterflyPalette,
} from "../../packages/ui/src/lib/components/butterfly-hero/butterfly-palette.ts";

const PALETTE: ButterflyPalette = {
  paper: { r: 8, g: 6, b: 4 },
  ink: { r: 255, g: 246, b: 223 },
  muted: { r: 143, g: 109, b: 42 },
  accent: { r: 255, g: 179, b: 0 },
};

describe("butterfly wing palette", () => {
  it("derives distinct warm pattern roles from the host palette", () => {
    const roles = ["base", "hind", "highlight", "band", "eyespot"] as const;
    const colors = roles.map((role) => butterflyPatternColor(PALETTE, 0.3, 0.6, role));

    expect(new Set(colors.map(({ r, g, b }) => `${r}:${g}:${b}`)).size).toBe(roles.length);
  });
});
