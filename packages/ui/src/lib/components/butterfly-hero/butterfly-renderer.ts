import { PHASE_COUNT } from "./butterfly-data";
import { draftAt, type Atmosphere } from "./butterfly-atmosphere";
import type { AvoidBox, FieldState } from "./butterfly-field";
import { midgroundAlpha } from "./butterfly-glyphs";
import { createAnatomyScratch, type AnatomyScratch } from "./butterfly-shape";
import { buildSpriteAtlas, drawSprite, paletteKey, type SpriteAtlas } from "./butterfly-sprites";
import { rgba, type ButterflyPalette, type Rgb } from "./butterfly-palette";
import { drawSpecimens } from "./butterfly-specimen";

export type FieldRenderer = {
  readonly canvas: HTMLCanvasElement;
  readonly context: CanvasRenderingContext2D;
  readonly detail: AnatomyScratch;
  readonly coverage: AnatomyScratch;
  width: number;
  height: number;
  dpr: number;
  cellWidth: number;
  cellHeight: number;
  cols: number;
  rows: number;
  fontFamily: string;
  palette: ButterflyPalette;
  atlas: SpriteAtlas | null;
  atlasKey: string;
};

export type DrawOptions = {
  readonly dimBoxes: readonly AvoidBox[];
};

const FALLBACK_PALETTE: ButterflyPalette = {
  paper: { r: 244, g: 240, b: 230 },
  ink: { r: 23, g: 21, b: 18 },
  muted: { r: 95, g: 90, b: 82 },
  accent: { r: 180, g: 83, b: 9 },
};

export function createRenderer(canvas: HTMLCanvasElement): FieldRenderer | null {
  const context = canvas.getContext("2d", { alpha: true });

  if (!context) return null;

  return {
    canvas,
    context,
    detail: createAnatomyScratch(),
    coverage: createAnatomyScratch(),
    width: 0,
    height: 0,
    dpr: 1,
    cellWidth: 10,
    cellHeight: 12,
    cols: 0,
    rows: 0,
    fontFamily: "ui-monospace, monospace",
    palette: FALLBACK_PALETTE,
    atlas: null,
    atlasKey: "",
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

export function readHostPalette(element: HTMLElement): ButterflyPalette {
  const style = getComputedStyle(element);
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  const context = canvas.getContext("2d", { willReadFrequently: true });

  if (!context) return FALLBACK_PALETTE;

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
    accent: readColor(
      context,
      style.getPropertyValue("--farben-field-accent"),
      FALLBACK_PALETTE.accent,
    ),
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
  const safeDpr = Math.min(Math.max(dpr, 1), 2);
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

export function ensureAtlas(renderer: FieldRenderer): SpriteAtlas {
  const key = `${paletteKey(renderer.palette)}|${renderer.dpr}|${renderer.fontFamily}`;

  if (renderer.atlas && renderer.atlasKey === key) {
    return renderer.atlas;
  }

  renderer.atlas = buildSpriteAtlas(renderer.palette, renderer.dpr, renderer.fontFamily);
  renderer.atlasKey = key;

  return renderer.atlas;
}

export function drawField(
  renderer: FieldRenderer,
  field: FieldState,
  atmosphere: Atmosphere,
  options: DrawOptions,
): void {
  const { context } = renderer;

  if (renderer.cols === 0 || renderer.rows === 0) return;

  context.setTransform(renderer.dpr, 0, 0, renderer.dpr, 0, 0);
  context.clearRect(0, 0, renderer.width, renderer.height);
  context.textAlign = "center";
  context.textBaseline = "middle";

  drawAir(renderer, atmosphere);
  drawMidground(renderer, field, true, atmosphere);
  drawMidground(renderer, field, false, atmosphere);
  drawTraces(renderer, atmosphere);
  drawSpecimens(renderer, field, "tile");
  drawSpecimens(renderer, field, "glyph");
  drawPollen(renderer, atmosphere);
  drawDimming(renderer, options.dimBoxes);
}

function drawAir(renderer: FieldRenderer, atmosphere: Atmosphere): void {
  const { context, cols, rows, cellWidth, cellHeight, palette } = renderer;
  context.font = `500 ${Math.round(cellHeight * 0.58)}px ${renderer.fontFamily}`;

  for (let level = 0; level < 3; level++) {
    const min = 0.1 + level * 0.16;
    const max = min + 0.16;
    context.fillStyle = rgba(palette.muted, 0.06 + level * 0.045);

    for (let row = 0; row < rows; row++) {
      for (let column = 0; column < cols; column++) {
        const value = draftAt(atmosphere, column, row);

        if (value < min || value >= max) continue;
        const glyph = level === 0 ? "." : level === 1 ? "'" : ":";
        context.fillText(
          glyph,
          column * cellWidth + cellWidth / 2,
          row * cellHeight + cellHeight / 2,
        );
      }
    }
  }
}

function drawMidground(
  renderer: FieldRenderer,
  field: FieldState,
  far: boolean,
  atmosphere: Atmosphere,
): void {
  const atlas = ensureAtlas(renderer);
  const { context, cellWidth, cellHeight } = renderer;

  for (const butterfly of field.midground) {
    if (butterfly.depth < 0.45 !== far) continue;
    const phaseIndex = butterfly.frame % PHASE_COUNT;

    const alpha =
      midgroundAlpha(butterfly.depth) *
      (far ? 0.72 : 1) *
      (0.92 + draftAt(atmosphere, butterfly.x, butterfly.y) * 0.08);

    drawSprite(
      context,
      atlas,
      butterfly.species,
      phaseIndex,
      butterfly.x * cellWidth,
      butterfly.y * cellHeight,
      butterfly.scale * (cellWidth / 8),
      alpha,
    );
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

function drawDimming(renderer: FieldRenderer, boxes: readonly AvoidBox[]): void {
  if (boxes.length === 0) return;
  const { context, cellWidth, cellHeight, palette } = renderer;

  for (const box of boxes) {
    for (let ring = 3; ring >= 0; ring--) {
      context.fillStyle = rgba(palette.paper, ring === 0 ? 0.82 : 0.08);
      context.fillRect(
        (box.x - ring) * cellWidth,
        (box.y - ring) * cellHeight,
        (box.width + ring * 2) * cellWidth,
        (box.height + ring * 2) * cellHeight,
      );
    }
  }
}
