import { readFile } from "node:fs/promises";

import { describe, expect, it } from "vite-plus/test";

type ExpectedColor = readonly [name: string, hex: string];

const COLOR_DECLARATION = /(--[a-z0-9-]+):\s*oklch\(([\d.]+) ([\d.]+) ([\d.]+)\)/g;

const encodeChannel = (value: number): number => {
  const channel = value <= 0.0031308 ? 12.92 * value : 1.055 * value ** (1 / 2.4) - 0.055;

  return Math.round(Math.max(0, Math.min(1, channel)) * 255);
};

const oklchToHex = (lightness: number, chroma: number, hue: number): string => {
  const radians = (hue * Math.PI) / 180;
  const a = chroma * Math.cos(radians);
  const b = chroma * Math.sin(radians);
  const l = (lightness + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (lightness - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (lightness - 0.0894841775 * a - 1.291485548 * b) ** 3;

  return `#${[
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ]
    .map(encodeChannel)
    .map((channel) => channel.toString(16).padStart(2, "0"))
    .join("")}`;
};

const readColors = async (path: string): Promise<ExpectedColor[]> => {
  const source = await readFile(new URL(path, import.meta.url), "utf8");

  return [...source.matchAll(COLOR_DECLARATION)].map(([, name, lightness, chroma, hue]) => [
    name,
    oklchToHex(Number(lightness), Number(chroma), Number(hue)),
  ]);
};

const readOklchValues = async (path: string): Promise<string[]> => {
  const source = await readFile(new URL(path, import.meta.url), "utf8");

  return [...source.matchAll(/oklch\(([\d.]+) ([\d.]+) ([\d.]+)\)/g)].map(
    ([, lightness, chroma, hue]) => oklchToHex(Number(lightness), Number(chroma), Number(hue)),
  );
};

const THEME_COLORS: ExpectedColor[] = [
  ["--blume-background", "#f4f0e6"],
  ["--blume-foreground", "#171512"],
  ["--blume-muted", "#ebe5d8"],
  ["--blume-muted-foreground", "#5f5a52"],
  ["--blume-border", "#d3ccbe"],
  ["--blume-code-background", "#ffffff"],
  ["--docs-active-bar", "#d9480f"],
  ["--docs-active-text", "#8f3500"],
  ["--blume-accent", "#a64600"],
  ["--blume-accent-foreground", "#ffffff"],
  ["--farben-border-strong", "#8a8378"],
  ["--blume-background", "#161513"],
  ["--blume-foreground", "#ece6da"],
  ["--blume-muted", "#211f1b"],
  ["--blume-muted-foreground", "#a39c90"],
  ["--blume-border", "#2c2a25"],
  ["--blume-code-background", "#1b1916"],
  ["--blume-accent", "#ffb300"],
  ["--blume-accent-foreground", "#160f02"],
  ["--docs-active-bar", "#d4af37"],
  ["--docs-active-text", "#edcb7a"],
  ["--farben-border-strong", "#6b665c"],
];

const HERO_COLORS: ExpectedColor[] = [
  ["--hero-paper", "#f4f0e6"],
  ["--hero-ink", "#171512"],
  ["--hero-muted", "#5f5a52"],
  ["--hero-rule", "#8a8378"],
  ["--hero-accent", "#c2410c"],
  ["--hero-accent-bright", "#8f3500"],
  ["--hero-ink-on-accent", "#ffffff"],
  ["--hero-hover", "#ebe5d8"],
  ["--hero-eyebrow", "#8f3500"],
  ["--hero-still", "#d9480f"],
  ["--hero-wing-1", "#d9480f"],
  ["--hero-wing-2", "#e8752e"],
  ["--hero-wing-3", "#f08c4a"],
  ["--hero-paper", "#1a1917"],
  ["--hero-ink", "#fff7f0"],
  ["--hero-muted", "#d2c3ae"],
  ["--hero-rule", "#8f6d2a"],
  ["--hero-accent", "#ffb300"],
  ["--hero-accent-bright", "#ffcf66"],
  ["--hero-ink-on-accent", "#160f02"],
  ["--hero-hover", "#2a241b"],
  ["--hero-eyebrow", "#e2bf68"],
  ["--hero-still", "#e9c66b"],
  ["--hero-wing-1", "#ff7a1a"],
  ["--hero-wing-2", "#ffb300"],
  ["--hero-wing-3", "#ffe08a"],
];

describe("uwz docs color tokens", () => {
  it("keeps theme.css at the original 8-bit sRGB palette", async () => {
    expect(await readColors("../../apps/uwz-docs/theme.css")).toEqual(THEME_COLORS);
  });

  it("keeps the docs home hero at the original 8-bit sRGB palette", async () => {
    expect(await readColors("../../apps/uwz-docs/styles/docs-home.css")).toEqual(HERO_COLORS);
  });

  it("keeps the Blume theme config at the original 8-bit sRGB palette", async () => {
    expect(await readOklchValues("../../apps/uwz-docs/blume.config.ts")).toEqual([
      "#a64600",
      "#ffb300",
      "#f4f0e6",
      "#161513",
    ]);
  });
});
