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

export function mixRgb(a: Rgb, b: Rgb, t: number): Rgb {
  const amount = t < 0 ? 0 : t > 1 ? 1 : t;

  return {
    r: Math.round(a.r + (b.r - a.r) * amount),
    g: Math.round(a.g + (b.g - a.g) * amount),
    b: Math.round(a.b + (b.b - a.b) * amount),
  };
}

export function rgba(color: Rgb, alpha: number): string {
  const safe = alpha < 0 ? 0 : alpha > 1 ? 1 : alpha;

  return `rgba(${color.r}, ${color.g}, ${color.b}, ${safe.toFixed(3)})`;
}

export function rgb(color: Rgb): string {
  return `rgb(${color.r}, ${color.g}, ${color.b})`;
}

export function relativeLuminance(color: Rgb): number {
  const channel = (value: number): number => {
    const scaled = value / 255;

    return scaled <= 0.04045 ? scaled / 12.92 : ((scaled + 0.055) / 1.055) ** 2.4;
  };

  return 0.2126 * channel(color.r) + 0.7152 * channel(color.g) + 0.0722 * channel(color.b);
}

export function contrastRatio(a: Rgb, b: Rgb): number {
  const first = relativeLuminance(a);
  const second = relativeLuminance(b);
  const lighter = Math.max(first, second);
  const darker = Math.min(first, second);

  return (lighter + 0.05) / (darker + 0.05);
}
