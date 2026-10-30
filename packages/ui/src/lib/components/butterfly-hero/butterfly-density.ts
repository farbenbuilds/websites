import { SPECIMEN_MAX } from "./butterfly-data";
import { clamp } from "./butterfly-math";

export const COMPACT_FIELD_MAX_WIDTH = 640;
export const COMPACT_SPECIMEN_COUNT = 3;
export const DEFAULT_SPECIMEN_COUNT = SPECIMEN_MAX;

export function clampSpecimenCount(requestedCount: number): number {
  return clamp(Math.round(requestedCount), 1, SPECIMEN_MAX);
}

export function resolveSpecimenCount(cssWidth: number, requestedCount: number): number {
  const requested = clampSpecimenCount(requestedCount);

  return cssWidth <= COMPACT_FIELD_MAX_WIDTH
    ? Math.min(requested, COMPACT_SPECIMEN_COUNT)
    : requested;
}

export function fallbackSpecimenCount(requestedCount: number): number {
  return Math.min(clampSpecimenCount(requestedCount), COMPACT_SPECIMEN_COUNT);
}
