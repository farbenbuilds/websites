import { clamp } from "./butterfly-math";

export type AvoidRegion = {
  readonly left: number;
  readonly top: number;
  readonly right: number;
  readonly bottom: number;
};

export type AvoidanceSteer = {
  readonly x: number;
  readonly y: number;
};

function axisGap(startA: number, endA: number, startB: number, endB: number): number {
  if (endA < startB) return startB - endA;

  if (endB < startA) return startA - endB;

  return 0;
}

function regionsAreNear(a: AvoidRegion, b: AvoidRegion, gap: number): boolean {
  return (
    axisGap(a.left, a.right, b.left, b.right) <= gap &&
    axisGap(a.top, a.bottom, b.top, b.bottom) <= gap
  );
}

function combineRegions(a: AvoidRegion, b: AvoidRegion): AvoidRegion {
  return {
    left: Math.min(a.left, b.left),
    top: Math.min(a.top, b.top),
    right: Math.max(a.right, b.right),
    bottom: Math.max(a.bottom, b.bottom),
  };
}

export function mergeAvoidRegions(
  regions: readonly AvoidRegion[],
  gap: number,
): readonly AvoidRegion[] {
  const merged: AvoidRegion[] = [];

  for (const region of regions) {
    let next = region;
    let match = merged.findIndex((candidate) => regionsAreNear(candidate, next, gap));

    while (match >= 0) {
      const candidate = merged[match];

      if (!candidate) break;
      next = combineRegions(candidate, next);
      merged.splice(match, 1);
      match = merged.findIndex((item) => regionsAreNear(item, next, gap));
    }

    merged.push(next);
  }

  return merged;
}

function steerFromRegion(
  region: AvoidRegion,
  x: number,
  y: number,
  padding: number,
): AvoidanceSteer {
  const left = region.left - padding;
  const right = region.right + padding;
  const top = region.top - padding;
  const bottom = region.bottom + padding;

  if (x < left || x > right || y < top || y > bottom) return { x: 0, y: 0 };

  const distances = [
    { x: -1, y: 0, distance: x - left },
    { x: 1, y: 0, distance: right - x },
    { x: 0, y: -1, distance: y - top },
    { x: 0, y: 1, distance: bottom - y },
  ];

  const nearest = distances.reduce((best, candidate) =>
    candidate.distance < best.distance ? candidate : best,
  );

  const strength = 1 - clamp(nearest.distance / Math.max(padding, 1), 0, 0.88);

  return { x: nearest.x * strength, y: nearest.y * strength };
}

export function avoidanceSteer(
  regions: readonly AvoidRegion[],
  x: number,
  y: number,
  padding: number,
): AvoidanceSteer {
  let steerX = 0;
  let steerY = 0;

  for (const region of regions) {
    const steer = steerFromRegion(region, x, y, padding);
    steerX += steer.x;
    steerY += steer.y;
  }

  return { x: clamp(steerX, -1, 1), y: clamp(steerY, -1, 1) };
}
