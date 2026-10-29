export type Rgb = {
  readonly r: number;
  readonly g: number;
  readonly b: number;
};

export type ButterflyPalette = {
  readonly paper: Rgb;
  readonly ink: Rgb;
  readonly muted: Rgb;
  readonly accent: Rgb;
};

export type InkRole = "wing" | "edge" | "vein" | "band" | "eyespot" | "body" | "antenna";

export function mixRgb(a: Rgb, b: Rgb, t: number): Rgb {
  const amount = t < 0 ? 0 : t > 1 ? 1 : t;

  return {
    r: Math.round(a.r + (b.r - a.r) * amount),
    g: Math.round(a.g + (b.g - a.g) * amount),
    b: Math.round(a.b + (b.b - a.b) * amount),
  };
}

export function butterflyWingColor(
  palette: ButterflyPalette,
  speciesAccent: number,
  shade: number,
): Rgb {
  const warm = mixRgb(palette.paper, palette.accent, 0.82 + speciesAccent * 0.12);
  const highlight = mixRgb(palette.accent, palette.ink, 0.38);

  return mixRgb(warm, highlight, 0.55 + shade * 0.3);
}

export function butterflyBodyColor(palette: ButterflyPalette): Rgb {
  return mixRgb(palette.accent, palette.paper, 0.16);
}

export function inkFor(palette: ButterflyPalette, part: InkRole): string {
  if (part === "eyespot") return rgba(palette.accent, 0.95);

  if (part === "edge") return rgba(palette.ink, 0.48);

  if (part === "vein") return rgba(palette.ink, 0.58);

  if (part === "band") return rgba(palette.accent, 0.7);

  if (part === "body") return rgba(palette.paper, 0.9);

  if (part === "antenna") return rgba(palette.accent, 0.85);

  return rgba(palette.ink, 0.7);
}

export function rgba(color: Rgb, alpha: number): string {
  const safe = alpha < 0 ? 0 : alpha > 1 ? 1 : alpha;

  return `rgba(${color.r}, ${color.g}, ${color.b}, ${safe.toFixed(3)})`;
}

export function rgb(color: Rgb): string {
  return `rgb(${color.r}, ${color.g}, ${color.b})`;
}
