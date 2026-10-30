import { draftAt, type Atmosphere } from "./butterfly-atmosphere.ts";
import { drawContentMask } from "./butterfly-content-mask.ts";
import type { FieldState } from "./butterfly-field.ts";
import {
  butterflyBreezeColor,
  mixRgb,
  rgba,
  type ButterflyPalette,
  type Rgb,
} from "./butterfly-palette.ts";
import { createAnatomyScratch, type AnatomyScratch } from "./butterfly-shape.ts";
import { drawSpecimens, type SpecimenColors } from "./butterfly-specimen.ts";

export type FieldRenderer = {
  readonly canvas: HTMLCanvasElement;
  readonly context: CanvasRenderingContext2D;
  readonly detail: AnatomyScratch;
  readonly colors: Map<number, SpecimenColors>;
  width: number;
  height: number;
  dpr: number;
  cellWidth: number;
  cellHeight: number;
  cols: number;
  rows: number;
  fontFamily: string;
  palette: ButterflyPalette;
  matrix: HTMLCanvasElement | null;
  matrixKey: string;
};

// Hosts own the field palette; this neutral fallback only covers missing tokens.
const FALLBACK_PALETTE: ButterflyPalette = {
  paper: { r: 255, g: 255, b: 255 },
  ink: { r: 17, g: 17, b: 17 },
  muted: { r: 102, g: 102, b: 102 },
  accent: { r: 128, g: 128, b: 128 },
  wings: [
    { r: 128, g: 128, b: 128 },
    { r: 160, g: 160, b: 160 },
    { r: 96, g: 96, b: 96 },
  ],
};

export function createRenderer(canvas: HTMLCanvasElement): FieldRenderer | null {
  const context = canvas.getContext("2d", { alpha: true });

  if (!context) return null;

  return {
    canvas,
    context,
    detail: createAnatomyScratch(),
    colors: new Map(),
    width: 0,
    height: 0,
    dpr: 1,
    cellWidth: 10,
    cellHeight: 12,
    cols: 0,
    rows: 0,
    fontFamily: "ui-monospace, monospace",
    palette: FALLBACK_PALETTE,
    matrix: null,
    matrixKey: "",
  };
}

function readColor(context: CanvasRenderingContext2D, value: string, fallback: Rgb): Rgb {
  if (!value) return fallback;
  context.fillStyle = value;
  context.fillRect(0, 0, 1, 1);
  const pixel = context.getImageData(0, 0, 1, 1).data;

  return {
    r: pixel[0] ?? fallback.r,
    g: pixel[1] ?? fallback.g,
    b: pixel[2] ?? fallback.b,
  };
}

function readWings(
  context: CanvasRenderingContext2D,
  style: CSSStyleDeclaration,
  accent: Rgb,
): readonly Rgb[] {
  return [
    readColor(context, style.getPropertyValue("--farben-field-wing-1"), accent),
    readColor(
      context,
      style.getPropertyValue("--farben-field-wing-2"),
      mixRgb(accent, { r: 255, g: 255, b: 255 }, 0.28),
    ),
    readColor(
      context,
      style.getPropertyValue("--farben-field-wing-3"),
      mixRgb(accent, { r: 0, g: 0, b: 0 }, 0.28),
    ),
  ];
}

export function readHostPalette(element: HTMLElement): ButterflyPalette {
  const style = getComputedStyle(element);
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  const context = canvas.getContext("2d", { willReadFrequently: true });

  if (!context) return FALLBACK_PALETTE;

  const accent = readColor(
    context,
    style.getPropertyValue("--farben-field-accent"),
    FALLBACK_PALETTE.accent,
  );

  return {
    paper: readColor(
      context,
      style.getPropertyValue("--farben-field-paper"),
      FALLBACK_PALETTE.paper,
    ),
    ink: readColor(context, style.getPropertyValue("--farben-field-ink"), FALLBACK_PALETTE.ink),
    muted: readColor(
      context,
      style.getPropertyValue("--farben-field-muted"),
      FALLBACK_PALETTE.muted,
    ),
    accent,
    wings: readWings(context, style, accent),
  };
}

export function resizeRenderer(
  renderer: FieldRenderer,
  cssWidth: number,
  cssHeight: number,
  dpr: number,
  fontFamily: string,
): void {
  if (cssWidth < 1 || cssHeight < 1) return;
  const safeDpr = Math.min(Math.max(dpr, 1), 1.5);
  renderer.width = cssWidth;
  renderer.height = cssHeight;
  renderer.dpr = safeDpr;
  renderer.fontFamily = fontFamily;

  renderer.canvas.width = Math.round(cssWidth * safeDpr);
  renderer.canvas.height = Math.round(cssHeight * safeDpr);
  renderer.cellWidth = Math.max(8, Math.min(12, Math.round(cssWidth / 88)));
  renderer.cellHeight = renderer.cellWidth + 2;
  renderer.cols = Math.ceil(cssWidth / renderer.cellWidth);
  renderer.rows = Math.ceil(cssHeight / renderer.cellHeight);
  renderer.context.setTransform(safeDpr, 0, 0, safeDpr, 0, 0);
}

function ensureMatrix(renderer: FieldRenderer): HTMLCanvasElement {
  const { palette } = renderer;

  const key = [
    palette.paper.r,
    palette.paper.g,
    palette.paper.b,
    palette.ink.r,
    palette.ink.g,
    palette.ink.b,
    palette.muted.r,
    palette.muted.g,
    palette.muted.b,
    palette.accent.r,
    palette.accent.g,
    palette.accent.b,
    renderer.cols,
    renderer.rows,
    renderer.cellWidth,
    renderer.cellHeight,
    renderer.dpr,
  ].join(":");

  if (renderer.matrix && renderer.matrixKey === key) return renderer.matrix;

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(renderer.width * renderer.dpr);
  canvas.height = Math.round(renderer.height * renderer.dpr);
  const context = canvas.getContext("2d");

  if (context) {
    context.setTransform(renderer.dpr, 0, 0, renderer.dpr, 0, 0);
    context.fillStyle = rgba(renderer.palette.muted, 0.22);

    for (let row = 0; row < renderer.rows; row++) {
      for (let column = 0; column < renderer.cols; column++) {
        context.fillRect(
          Math.round((column + 0.5) * renderer.cellWidth),
          Math.round((row + 0.5) * renderer.cellHeight),
          1,
          1,
        );
      }
    }
  }

  renderer.matrix = canvas;
  renderer.matrixKey = key;

  return canvas;
}

function drawMatrix(renderer: FieldRenderer): void {
  const matrix = ensureMatrix(renderer);
  renderer.context.drawImage(
    matrix,
    0,
    0,
    matrix.width,
    matrix.height,
    0,
    0,
    renderer.width,
    renderer.height,
  );
}

export function drawField(
  renderer: FieldRenderer,
  field: FieldState,
  atmosphere: Atmosphere,
): void {
  const { context } = renderer;

  if (renderer.cols === 0 || renderer.rows === 0) return;

  context.setTransform(renderer.dpr, 0, 0, renderer.dpr, 0, 0);
  context.clearRect(0, 0, renderer.width, renderer.height);
  context.textAlign = "center";
  context.textBaseline = "middle";

  drawMatrix(renderer);
  drawAir(renderer, atmosphere);
  drawTraces(renderer, atmosphere);
  drawSpecimens(renderer, field, renderer.colors);
  drawBreeze(renderer, atmosphere);
  drawPollen(renderer, atmosphere);
  drawContentMask(renderer, field.avoidRegions);
}

function drawAir(renderer: FieldRenderer, atmosphere: Atmosphere): void {
  const { context, cols, rows, cellWidth, cellHeight, palette } = renderer;
  context.font = `500 ${Math.round(cellHeight * 0.58)}px ${renderer.fontFamily}`;

  const faint = rgba(palette.muted, 0.06);
  const light = rgba(palette.muted, 0.1);
  const strong = rgba(palette.muted, 0.14);

  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < cols; column++) {
      const value = draftAt(atmosphere, column, row);

      if (value < 0.1) continue;
      const glyph = value < 0.26 ? "." : value < 0.42 ? "'" : ":";
      context.fillStyle = value < 0.26 ? faint : value < 0.42 ? light : strong;
      context.fillText(
        glyph,
        column * cellWidth + cellWidth / 2,
        row * cellHeight + cellHeight / 2,
      );
    }
  }
}

function drawBreeze(renderer: FieldRenderer, atmosphere: Atmosphere): void {
  const { context, cellWidth, cellHeight, palette } = renderer;
  context.font = `500 ${Math.round(cellHeight * 0.75)}px ${renderer.fontFamily}`;
  const color = butterflyBreezeColor(palette);

  for (const breeze of atmosphere.breeze) {
    if (breeze.life <= 0) continue;
    const progress = breeze.life / Math.max(breeze.maxLife, 0.001);
    const speed = Math.hypot(breeze.vx, breeze.vy) || 1;
    const nx = breeze.vx / speed;
    const ny = breeze.vy / speed;

    for (let step = 0; step < 3; step++) {
      context.fillStyle = rgba(color, 0.62 * progress * (1 - step * 0.3));
      context.fillText(
        breeze.glyph,
        (breeze.x - nx * step * 0.3) * cellWidth + cellWidth / 2,
        (breeze.y - ny * step * 0.3) * cellHeight + cellHeight / 2,
      );
    }
  }
}

function drawTraces(renderer: FieldRenderer, atmosphere: Atmosphere): void {
  const { context, cellWidth, cellHeight, palette } = renderer;
  context.font = `500 ${Math.round(cellHeight * 0.62)}px ${renderer.fontFamily}`;

  for (const trace of atmosphere.traces) {
    const life = Math.max(0, trace.life / Math.max(trace.maxLife, 0.001));
    const steps = Math.max(1, Math.round(trace.length));

    for (let step = 0; step < steps; step++) {
      const alpha = life * 0.16 * (1 - step / steps);

      if (alpha < 0.015) continue;
      context.fillStyle = rgba(palette.muted, alpha);
      context.fillText(
        trace.glyph,
        (trace.x - Math.cos(trace.heading) * step) * cellWidth + cellWidth / 2,
        (trace.y - Math.sin(trace.heading) * step) * cellHeight + cellHeight / 2,
      );
    }
  }
}

function drawPollen(renderer: FieldRenderer, atmosphere: Atmosphere): void {
  const { context, cellWidth, cellHeight, palette } = renderer;
  context.font = `500 ${Math.round(cellHeight * 0.68)}px ${renderer.fontFamily}`;

  for (const mote of atmosphere.pollen) {
    const pulse = 0.55 + 0.45 * Math.sin(mote.phase);
    const alpha = mote.alpha * pulse;

    if (alpha < 0.02) continue;
    context.fillStyle = rgba(mote.size > 1 ? palette.accent : palette.muted, alpha);
    context.fillText(
      mote.size > 1 ? "'" : ".",
      mote.x * cellWidth + cellWidth / 2,
      mote.y * cellHeight + cellHeight / 2,
    );
  }
}
