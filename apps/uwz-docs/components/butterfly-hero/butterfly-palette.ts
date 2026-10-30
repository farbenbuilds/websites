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
  readonly wings: readonly Rgb[];
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

function relativeLuminance(color: Rgb): number {
  return color.r * 0.2126 + color.g * 0.7152 + color.b * 0.0722;
}

function darkerOf(a: Rgb, b: Rgb): Rgb {
  return relativeLuminance(a) <= relativeLuminance(b) ? a : b;
}

function lighterOf(a: Rgb, b: Rgb): Rgb {
  return relativeLuminance(a) >= relativeLuminance(b) ? a : b;
}

function wingAt(palette: ButterflyPalette, index: number): Rgb {
  if (palette.wings.length === 0) return palette.accent;

  const wrapped =
    ((Math.round(index) % palette.wings.length) + palette.wings.length) % palette.wings.length;

  return palette.wings[wrapped] ?? palette.accent;
}

export function butterflyPatternColor(
  palette: ButterflyPalette,
  tone: number,
  shade: number,
  role: WingPatternRole,
): Rgb {
  const primary = wingAt(palette, tone);
  const secondary = wingAt(palette, tone + 1);
  const shadow = darkerOf(palette.paper, palette.ink);
  const light = lighterOf(palette.paper, palette.ink);
  const deep = mixRgb(primary, shadow, 0.52);
  const pale = mixRgb(secondary, light, 0.42);

  if (role === "hind") return mixRgb(secondary, deep, 0.18 + shade * 0.16);

  if (role === "highlight") return mixRgb(pale, light, 0.35);

  if (role === "band") return mixRgb(secondary, light, 0.16 + shade * 0.14);

  if (role === "eyespot") return mixRgb(deep, shadow, 0.18);

  return mixRgb(primary, palette.accent, 0.18 + shade * 0.22);
}

export function butterflyBodyColor(palette: ButterflyPalette): Rgb {
  return mixRgb(palette.accent, palette.paper, 0.16);
}

export function butterflyBreezeColor(palette: ButterflyPalette): Rgb {
  return mixRgb(palette.ink, palette.paper, 0.25);
}

export function inkFor(palette: ButterflyPalette, part: InkRole): string {
  const shadow = darkerOf(palette.paper, palette.ink);
  const light = lighterOf(palette.paper, palette.ink);

  if (part === "eyespot") return rgba(light, 0.96);

  if (part === "edge" || part === "vein" || part === "band") {
    return rgba(mixRgb(shadow, light, 0.12), 0.92);
  }

  if (part === "body") return rgba(shadow, 0.92);

  if (part === "antenna") return rgba(palette.accent, 0.92);

  return rgba(shadow, 0.8);
}

export function rgba(color: Rgb, alpha: number): string {
  const safe = alpha < 0 ? 0 : alpha > 1 ? 1 : alpha;

  return `rgba(${color.r}, ${color.g}, ${color.b}, ${safe.toFixed(3)})`;
}

export function rgb(color: Rgb): string {
  return `rgb(${color.r}, ${color.g}, ${color.b})`;
}
