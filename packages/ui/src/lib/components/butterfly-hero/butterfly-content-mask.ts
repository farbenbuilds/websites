import type { AvoidRegion } from "./butterfly-avoidance";
import { smoothstep } from "./butterfly-math";
import { rgba, type ButterflyPalette } from "./butterfly-palette";

type ContentMaskSurface = {
  readonly context: CanvasRenderingContext2D;
  readonly cellWidth: number;
  readonly cellHeight: number;
  readonly palette: ButterflyPalette;
};

const FALLOFF_CELLS = 4;
const CENTER_ALPHA = 0.85;

export function contentMaskAlpha(region: AvoidRegion, column: number, row: number): number {
  const centerX = column + 0.5;
  const centerY = row + 0.5;
  const outsideX = Math.max(region.left - centerX, 0, centerX - region.right);
  const outsideY = Math.max(region.top - centerY, 0, centerY - region.bottom);
  const outsideDistance = Math.hypot(outsideX, outsideY);
  const falloff = smoothstep(0, 1, 1 - outsideDistance / FALLOFF_CELLS);

  return CENTER_ALPHA * falloff;
}

export function drawContentMask(
  surface: ContentMaskSurface,
  regions: readonly AvoidRegion[],
): void {
  const { context, cellWidth, cellHeight, palette } = surface;

  if (regions.length === 0) return;

  let startColumn = Number.POSITIVE_INFINITY;
  let endColumn = Number.NEGATIVE_INFINITY;
  let startRow = Number.POSITIVE_INFINITY;
  let endRow = Number.NEGATIVE_INFINITY;

  for (const region of regions) {
    startColumn = Math.min(startColumn, Math.floor(region.left - FALLOFF_CELLS));
    endColumn = Math.max(endColumn, Math.ceil(region.right + FALLOFF_CELLS));
    startRow = Math.min(startRow, Math.floor(region.top - FALLOFF_CELLS));
    endRow = Math.max(endRow, Math.ceil(region.bottom + FALLOFF_CELLS));
  }

  for (let row = startRow; row < endRow; row++) {
    for (let column = startColumn; column < endColumn; column++) {
      let alpha = 0;

      for (const region of regions) {
        alpha = Math.max(alpha, contentMaskAlpha(region, column, row));
      }

      if (alpha === 0) continue;
      context.fillStyle = rgba(palette.paper, alpha);
      context.fillRect(column * cellWidth, row * cellHeight, cellWidth, cellHeight);
    }
  }
}
