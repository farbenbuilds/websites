import type { SpeciesSpec, WingPoint, WingSpec } from "./butterfly-data";
import { clamp, hash2 } from "./butterfly-math";

export type AnatomyPart = "none" | "body" | "antenna" | "fore" | "hind";

export type AnatomySample = {
  hit: boolean;
  part: AnatomyPart;
  shade: number;
  edge: number;
  vein: number;
  band: number;
  eyespot: number;
  grain: number;
  bodyX: number;
  bodyY: number;
};

type WingSample = {
  inside: boolean;
  edge: number;
  shade: number;
  vein: number;
  band: number;
  bodyX: number;
  bodyY: number;
};

export type AnatomyScratch = {
  readonly sample: AnatomySample;
  readonly wing: WingSample;
};

export type SpecimenPose = {
  readonly foldRight: number;
  readonly foldLeft: number;
  readonly yShiftRight: number;
  readonly yShiftLeft: number;
};

export function createSpecimenPose(phase: number, yaw: number): SpecimenPose {
  const flapRight = 0.4 + 0.6 * Math.abs(Math.cos(phase));
  const flapLeft = 0.4 + 0.6 * Math.abs(Math.cos(phase + 0.35));
  const yawAmount = Math.abs(yaw);
  const nearSide = yaw >= 0 ? 1 : -1;

  return {
    foldRight: flapRight * (nearSide === 1 ? 1 + yawAmount * 0.2 : 1 - yawAmount * 0.24),
    foldLeft: flapLeft * (nearSide === -1 ? 1 + yawAmount * 0.2 : 1 - yawAmount * 0.24),
    yShiftRight: (nearSide === 1 ? -0.04 : 0.04) * yawAmount,
    yShiftLeft: (nearSide === -1 ? -0.04 : 0.04) * yawAmount,
  };
}

// Triangle waves approximate the wing harmonics without per-sample trig.
function triangleWave(value: number): number {
  const wrapped = value - Math.floor(value);

  return wrapped < 0.5 ? wrapped * 2 : 2 - wrapped * 2;
}

export function createAnatomyScratch(): AnatomyScratch {
  return {
    sample: {
      hit: false,
      part: "none",
      shade: 0,
      edge: 0,
      vein: 0,
      band: 0,
      eyespot: 0,
      grain: 0,
      bodyX: 0,
      bodyY: 0,
    },
    wing: { inside: false, edge: 0, shade: 0, vein: 0, band: 0, bodyX: 0, bodyY: 0 },
  };
}

function resetAnatomySample(sample: AnatomySample): void {
  sample.hit = false;
  sample.part = "none";
  sample.shade = 0;
  sample.edge = 0;
  sample.vein = 0;
  sample.band = 0;
  sample.eyespot = 0;
  sample.grain = 0;
  sample.bodyX = 0;
  sample.bodyY = 0;
}

function pointInPolygon(points: readonly WingPoint[], x: number, y: number): boolean {
  let inside = false;

  for (let index = 0, previous = points.length - 1; index < points.length; previous = index++) {
    const a = points[index];
    const b = points[previous];

    if (!a || !b) continue;
    const crosses = a.y > y !== b.y > y;
    const edgeX = ((b.x - a.x) * (y - a.y)) / (b.y - a.y || 0.0001) + a.x;

    if (crosses && x < edgeX) inside = !inside;
  }

  return inside;
}

function segmentDistance(x: number, y: number, a: WingPoint, b: WingPoint): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const length = dx * dx + dy * dy;
  const t = length < 0.0001 ? 0 : clamp(((x - a.x) * dx + (y - a.y) * dy) / length, 0, 1);

  return Math.hypot(x - (a.x + t * dx), y - (a.y + t * dy));
}

function wingEdgeDistance(points: readonly WingPoint[], x: number, y: number): number {
  let closest = Number.POSITIVE_INFINITY;

  for (let index = 0; index < points.length; index++) {
    const a = points[index];
    const b = points[(index + 1) % points.length];

    if (!a || !b) continue;
    closest = Math.min(closest, segmentDistance(x, y, a, b));
  }

  return closest;
}

function wingReach(wing: WingSpec): number {
  let reach = 0;

  for (const point of wing.points) {
    if (point.x > reach) reach = point.x;
  }

  return Math.max(reach, 0.1);
}

function sampleWing(
  wing: WingSpec,
  species: SpeciesSpec,
  side: number,
  x: number,
  y: number,
  pose: SpecimenPose,
  out: WingSample,
): boolean {
  const outward = x * side;

  if (outward <= 0.015) return false;

  const fold = side > 0 ? pose.foldRight : pose.foldLeft;
  const wx = outward / fold;
  const wy = y + (side > 0 ? pose.yShiftRight : pose.yShiftLeft);

  if (!pointInPolygon(wing.points, wx, wy)) return false;

  const distance = wingEdgeDistance(wing.points, wx, wy);
  const reach = wingReach(wing);
  const theta = Math.atan2(wy, wx);
  const veinWave = triangleWave((theta * species.veinCount) / (Math.PI * 2) + 0.1) * 2 - 1;
  const radius = Math.hypot(wx, wy * 0.8);

  const bandWave =
    triangleWave(radius * species.bandCount * 0.5 + species.bandPhase / (Math.PI * 2)) * 2 - 1;

  out.edge = clamp(1 - distance / 0.075, 0, 1);
  out.shade = clamp(0.55 + 0.45 * (wx / reach) + 0.05 * wy, 0, 1);
  out.vein = radius > 0.16 && Math.abs(veinWave) < 0.13 ? 1 : 0;
  out.band = radius > 0.18 && Math.abs(bandWave) < 0.16 ? 1 : 0;
  out.bodyX = wx;
  out.bodyY = wy;
  out.inside = true;

  return true;
}

function inBody(species: SpeciesSpec, x: number, y: number): boolean {
  const headY = -0.38;
  const headRadius = species.bodyWidth * 1.4;

  if (x * x + (y - headY) ** 2 <= headRadius * headRadius) return true;

  const start = -0.32;
  const end = species.abdomenLength;

  if (y < start || y > end) return false;

  const t = (y - start) / (end - start);
  const width = species.bodyWidth * (1.24 - 1.08 * t);

  return Math.abs(x) <= width;
}

function inAntenna(species: SpeciesSpec, x: number, y: number): boolean {
  const headY = -0.4;

  if (y > headY || Math.abs(x) > species.antennaReach * 1.15) return false;

  const side = x < 0 ? -1 : 1;
  const rootX = side * species.bodyWidth * 0.6;
  const tipX = side * species.antennaReach * 0.62;
  const tipY = headY - species.antennaReach;
  const controlX = side * species.antennaReach * 1.08;
  const controlY = headY - species.antennaReach * 0.28;

  let closest = Number.POSITIVE_INFINITY;

  for (let i = 0; i <= 8; i++) {
    const t = i / 8;
    const inv = 1 - t;
    const px = inv * inv * rootX + 2 * inv * t * controlX + t * t * tipX;
    const py = inv * inv * headY + 2 * inv * t * controlY + t * t * tipY;
    const distance = Math.hypot(x - px, y - py);

    if (distance < closest) closest = distance;
  }

  return closest < 0.022;
}

export function sampleAnatomy(
  species: SpeciesSpec,
  x: number,
  y: number,
  pose: SpecimenPose,
  grainSeed: number,
  scratch: AnatomyScratch,
): AnatomySample {
  const out = scratch.sample;
  resetAnatomySample(out);

  if (inBody(species, x, y)) {
    const start = -0.32;
    const end = species.abdomenLength;
    const t = clamp((y - start) / (end - start), 0, 1);
    out.hit = true;
    out.part = "body";
    out.shade = 0.9 - t * 0.42;
    out.bodyX = x;
    out.bodyY = y;
    out.grain = hash2(Math.round(x * 32), Math.round(y * 32), grainSeed + species.glyphBias * 17);

    return out;
  }

  const side = x < 0 ? -1 : 1;

  if (sampleWing(species.fore, species, side, x, y, pose, scratch.wing)) {
    out.hit = true;
    out.part = "fore";
    out.shade = scratch.wing.shade;
    out.edge = scratch.wing.edge;
    out.vein = scratch.wing.vein;
    out.band = scratch.wing.band;
    out.bodyX = scratch.wing.bodyX;
    out.bodyY = scratch.wing.bodyY;
    out.grain = hash2(
      Math.round(out.bodyX * 30),
      Math.round(out.bodyY * 30),
      grainSeed + species.glyphBias * 31,
    );

    return out;
  }

  if (sampleWing(species.hind, species, side, x, y, pose, scratch.wing)) {
    out.hit = true;
    out.part = "hind";
    out.shade = scratch.wing.shade;
    out.edge = scratch.wing.edge;
    out.vein = scratch.wing.vein;
    out.band = scratch.wing.band;
    out.bodyX = scratch.wing.bodyX;
    out.bodyY = scratch.wing.bodyY;

    const eyeDistance = Math.hypot(
      Math.abs(out.bodyX) - species.eyespot.x,
      out.bodyY - species.eyespot.y,
    );

    out.eyespot = eyeDistance < species.eyespot.radius ? 1 : 0;
    out.grain = hash2(
      Math.round(out.bodyX * 30),
      Math.round(out.bodyY * 30),
      grainSeed + species.glyphBias * 47,
    );

    return out;
  }

  if (inAntenna(species, x, y)) {
    out.hit = true;
    out.part = "antenna";
    out.shade = 0.55;
    out.edge = 1;
    out.bodyX = x;
    out.bodyY = y;
    out.grain = hash2(Math.round(x * 32), Math.round(y * 32), grainSeed);

    return out;
  }

  return out;
}

export function specimenHalfSpan(species: SpeciesSpec): number {
  return Math.max(wingReach(species.fore), wingReach(species.hind));
}

export function specimenHalfHeight(species: SpeciesSpec): number {
  let reach = Math.max(species.antennaReach, species.abdomenLength);

  for (const wing of [species.fore, species.hind]) {
    for (const point of wing.points) {
      if (Math.abs(point.y) > reach) reach = Math.abs(point.y);
    }
  }

  return reach;
}
