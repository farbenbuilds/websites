import { mergeAvoidRegions, type AvoidRegion } from "./butterfly-avoidance";

type ContentMeasurementOptions = {
  readonly contentRoot: HTMLElement;
  readonly canvas: HTMLCanvasElement;
  readonly cellWidth: number;
  readonly cellHeight: number;
  readonly paddingCells: number;
  readonly mergeGapPixels: number;
};

const AVOID_SELECTOR = "[data-butterfly-avoid]";

export function measureAvoidRegions({
  contentRoot,
  canvas,
  cellWidth,
  cellHeight,
  paddingCells,
  mergeGapPixels,
}: ContentMeasurementOptions): readonly AvoidRegion[] {
  const canvasRect = canvas.getBoundingClientRect();

  if (canvasRect.width < 1 || canvasRect.height < 1) return [];

  const paddingX = paddingCells * cellWidth;
  const paddingY = paddingCells * cellHeight;

  const regions = Array.from(contentRoot.querySelectorAll<HTMLElement>(AVOID_SELECTOR))
    .map((element) => element.getBoundingClientRect())
    .filter((rect) => rect.width > 0 && rect.height > 0)
    .map((rect) => ({
      left: Math.max(0, (rect.left - canvasRect.left - paddingX) / cellWidth),
      top: Math.max(0, (rect.top - canvasRect.top - paddingY) / cellHeight),
      right: Math.min(
        canvasRect.width / cellWidth,
        (rect.right - canvasRect.left + paddingX) / cellWidth,
      ),
      bottom: Math.min(
        canvasRect.height / cellHeight,
        (rect.bottom - canvasRect.top + paddingY) / cellHeight,
      ),
    }))
    .filter((region) => region.right > region.left && region.bottom > region.top);

  return mergeAvoidRegions(regions, mergeGapPixels / Math.max(cellWidth, cellHeight));
}
