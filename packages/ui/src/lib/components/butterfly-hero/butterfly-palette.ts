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

export type WingPatternRole = "base" | "hind" | "highlight" | "band" | "eyespot";

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

export function butterflyPatternColor(
  palette: ButterflyPalette,
  speciesAccent: number,
  shade: number,
  role: WingPatternRole,
): Rgb {
  const base = butterflyWingColor(palette, speciesAccent, shade);

  if (role === "hind") return mixRgb(base, palette.muted, 0.14);

  if (role === "highlight") return mixRgb(base, palette.ink, 0.42);

  if (role === "band") {
    const copper = mixRgb(palette.accent, palette.paper, 0.24 + speciesAccent * 0.18);

    return mixRgb(copper, palette.accent, 0.12 + shade * 0.18);
  }

  if (role === "eyespot") return mixRgb(palette.accent, palette.ink, 0.22);

  return base;
}

export function butterflyBodyColor(palette: ButterflyPalette): Rgb {
  return mixRgb(palette.accent, palette.paper, 0.16);
}

export function butterflyBreezeColor(palette: ButterflyPalette): Rgb {
  return mixRgb(palette.ink, palette.paper, 0.25);
}

export function inkFor(palette: ButterflyPalette, part: InkRole): string {
  if (part === "eyespot") return rgba(palette.accent, 0.95);

  if (part === "edge") return rgba(mixRgb(palette.paper, palette.ink, 0.08), 0.88);

  if (part === "vein") return rgba(mixRgb(palette.paper, palette.ink, 0.12), 0.9);

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
