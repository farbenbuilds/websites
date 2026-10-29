import { SPECIES } from "./butterfly-data";
import { glyphFor, showsGlyph } from "./butterfly-glyphs";
import {
  createAnatomyScratch,
  createSpecimenPose,
  sampleAnatomy,
  type AnatomyScratch,
} from "./butterfly-shape";
import { mixRgb, rgba, type ButterflyPalette, type Rgb } from "./butterfly-palette";

export type SpriteFrame = {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
};

export type SpriteAtlas = {
  readonly canvas: HTMLCanvasElement;
  readonly frames: readonly (readonly SpriteFrame[])[];
  readonly dpr: number;
  readonly fontFamily: string;
  readonly paletteKey: string;
};

const SPRITE_COLS = 11;
const SPRITE_ROWS = 9;
const BASE_CELL_WIDTH = 7;
const BASE_CELL_HEIGHT = 8;
const SPRITE_PHASES = 3;
const BODY_UNITS_X = 2.7;
const BODY_UNITS_Y = 2.0;

export const SPRITE_CELL_WIDTH = BASE_CELL_WIDTH;
export const SPRITE_CELL_HEIGHT = BASE_CELL_HEIGHT;

export function paletteKey(palette: ButterflyPalette): string {
  return [
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
  ].join(":");
}

function createCanvas(width: number, height: number): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width));
  canvas.height = Math.max(1, Math.round(height));

  return canvas;
}

function contextFor(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("A 2D canvas context is required for the butterfly field.");
  }

  return context;
}

export function inkFor(
  palette: ButterflyPalette,
  part: "edge" | "vein" | "band" | "eyespot" | "body" | "wing" | "antenna",
): string {
  if (part === "eyespot") return rgba(palette.accent, 0.95);

  if (part === "edge") return rgba(palette.ink, 0.58);

  if (part === "vein") return rgba(palette.ink, 0.62);

  if (part === "band") return rgba(palette.accent, 0.6);

  if (part === "body") return rgba(palette.ink, 0.86);

  if (part === "antenna") return rgba(palette.ink, 0.5);

  return rgba(palette.ink, 0.58);
}

export function washColor(palette: ButterflyPalette, speciesAccent: number, shade: number): Rgb {
  const base = mixRgb(palette.paper, palette.accent, 0.18 + speciesAccent * 0.42);

  return mixRgb(base, palette.ink, (1 - shade) * 0.26);
}

export function washFor(palette: ButterflyPalette, speciesAccent: number, shade: number): string {
  return rgba(washColor(palette, speciesAccent, shade), 0.78);
}

export function buildSpriteAtlas(
  palette: ButterflyPalette,
  dpr: number,
  fontFamily: string,
): SpriteAtlas {
  const cellWidth = Math.max(4, Math.round(BASE_CELL_WIDTH * dpr));
  const cellHeight = Math.max(5, Math.round(BASE_CELL_HEIGHT * dpr));
  const frameWidth = SPRITE_COLS * cellWidth;
  const frameHeight = SPRITE_ROWS * cellHeight;
  const canvas = createCanvas(frameWidth * SPRITE_PHASES, frameHeight * SPECIES.length);
  const context = contextFor(canvas);
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = `${Math.round(cellHeight * 0.86)}px ${fontFamily}`;

  const frames: SpriteFrame[][] = SPECIES.map(() => []);

  for (let speciesIndex = 0; speciesIndex < SPECIES.length; speciesIndex++) {
    const species = SPECIES[speciesIndex];

    if (!species) continue;
    const scratch = createAnatomyScratch();

    for (let phaseIndex = 0; phaseIndex < SPRITE_PHASES; phaseIndex++) {
      const originX = phaseIndex * frameWidth;
      const originY = speciesIndex * frameHeight;
      const phase = (phaseIndex / SPRITE_PHASES) * Math.PI * 2 + 0.35;
      drawSpriteFrame(
        context,
        scratch,
        palette,
        speciesIndex,
        phase,
        originX,
        originY,
        cellWidth,
        cellHeight,
      );
      const frameList = frames[speciesIndex];

      if (frameList) {
        frameList.push({
          x: originX,
          y: originY,
          width: frameWidth,
          height: frameHeight,
        });
      }
    }
  }

  return {
    canvas,
    frames,
    dpr,
    fontFamily,
    paletteKey: paletteKey(palette),
  };
}

function drawSpriteFrame(
  context: CanvasRenderingContext2D,
  scratch: AnatomyScratch,
  palette: ButterflyPalette,
  speciesIndex: number,
  phase: number,
  originX: number,
  originY: number,
  cellWidth: number,
  cellHeight: number,
): void {
  const species = SPECIES[speciesIndex];

  if (!species) return;

  const pose = createSpecimenPose(phase, 0.18);
  const scaleX = SPRITE_COLS / BODY_UNITS_X;
  const scaleY = SPRITE_ROWS / BODY_UNITS_Y;

  for (let row = 0; row < SPRITE_ROWS; row++) {
    for (let column = 0; column < SPRITE_COLS; column++) {
      const bodyX = (column + 0.5) / scaleX - BODY_UNITS_X / 2;
      const bodyY = (row + 0.5) / scaleY - BODY_UNITS_Y / 2;

      const sample = sampleAnatomy(species, bodyX, bodyY, pose, speciesIndex * 31 + 7, scratch);

      if (!sample.hit) continue;

      const x = originX + column * cellWidth;
      const y = originY + row * cellHeight;
      const base = washColor(palette, species.accentMix, sample.shade);
      const wing = sample.part === "hind" ? mixRgb(base, palette.ink, 0.12) : base;
      const tile = sample.edge > 0.6 ? mixRgb(wing, palette.ink, 0.42) : wing;
      context.fillStyle = sample.part === "body" ? rgba(palette.ink, 0.55) : rgba(tile, 0.82);
      context.fillRect(x, y, cellWidth, cellHeight);

      const glyph = glyphFor(sample, species.glyphBias + speciesIndex);
      const strong = showsGlyph(sample, 0.55);

      if (!strong) {
        context.globalAlpha = 0.22;
        context.fillStyle = rgba(palette.ink, 0.8);
        context.fillText(glyph, x + cellWidth / 2, y + cellHeight / 2 + cellHeight * 0.04);
        context.globalAlpha = 1;
        continue;
      }

      const role =
        sample.eyespot > 0
          ? "eyespot"
          : sample.part === "body"
            ? "body"
            : sample.edge > 0.45
              ? "edge"
              : sample.vein > 0
                ? "vein"
                : sample.band > 0
                  ? "band"
                  : "wing";

      context.fillStyle = inkFor(palette, role);
      context.fillText(glyph, x + cellWidth / 2, y + cellHeight / 2 + cellHeight * 0.04);
    }
  }
}

export function drawSprite(
  context: CanvasRenderingContext2D,
  atlas: SpriteAtlas,
  speciesIndex: number,
  phaseIndex: number,
  centerX: number,
  centerY: number,
  scale: number,
  alpha: number,
): void {
  const frame = atlas.frames[speciesIndex]?.[phaseIndex % SPRITE_PHASES];

  if (!frame) return;

  const width = SPRITE_COLS * SPRITE_CELL_WIDTH * scale;
  const height = SPRITE_ROWS * SPRITE_CELL_HEIGHT * scale;
  const previousAlpha = context.globalAlpha;
  context.globalAlpha = alpha;
  context.drawImage(
    atlas.canvas,
    frame.x,
    frame.y,
    frame.width,
    frame.height,
    centerX - width / 2,
    centerY - height / 2,
    width,
    height,
  );
  context.globalAlpha = previousAlpha;
}
