import type { SpeciesSpec, WingSpec } from "./butterfly-data";
import { angleDelta, clamp, hash2, smoothstep } from "./butterfly-math";

export type AnatomyPart = "none" | "body" | "antenna" | "fore" | "hind";

export type AnatomySample = {
  hit: boolean;
  part: AnatomyPart;
  coverage: number;
  shade: number;
  edge: number;
  vein: number;
  band: number;
  eyespot: number;
  grain: number;
};

type WingSample = {
  inside: boolean;
  edge: number;
  shade: number;
  vein: number;
  band: number;
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
  const flapRight = 0.22 + 0.78 * Math.abs(Math.cos(phase));
  const flapLeft = 0.22 + 0.78 * Math.abs(Math.cos(phase + 0.35));
  const yawAmount = Math.abs(yaw);
  const nearSide = yaw >= 0 ? 1 : -1;

  return {
    foldRight: flapRight * (nearSide === 1 ? 1 + yawAmount * 0.3 : 1 - yawAmount * 0.36),
    foldLeft: flapLeft * (nearSide === -1 ? 1 + yawAmount * 0.3 : 1 - yawAmount * 0.36),
    yShiftRight: (nearSide === 1 ? -0.06 : 0.06) * yawAmount,
    yShiftLeft: (nearSide === -1 ? -0.06 : 0.06) * yawAmount,
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
      coverage: 0,
      shade: 0,
      edge: 0,
      vein: 0,
      band: 0,
      eyespot: 0,
      grain: 0,
    },
    wing: { inside: false, edge: 0, shade: 0, vein: 0, band: 0 },
  };
}

function resetAnatomySample(sample: AnatomySample): void {
  sample.hit = false;
  sample.part = "none";
  sample.coverage = 0;
  sample.shade = 0;
  sample.edge = 0;
  sample.vein = 0;
  sample.band = 0;
  sample.eyespot = 0;
  sample.grain = 0;
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
  const wy = y - wing.cy + (side > 0 ? pose.yShiftRight : pose.yShiftLeft);

  const nx = (wx - wing.cx) / wing.rx;
  const ny = wy / wing.ry;
  const radius = Math.sqrt(nx * nx + ny * ny);

  if (radius < 0.0001) return false;

  const theta = Math.atan2(ny, nx);
  const tipDelta = angleDelta(theta, wing.tipAngle);
  const tip = wing.tipReach / (1 + tipDelta * tipDelta * 9);
  const scallop = triangleWave((wing.lobes * theta) / (Math.PI * 2)) * 2 - 1;
  const edgeRadius = 1 + wing.scallop * scallop + tip;
  const ratio = radius / edgeRadius;
  const veinWave = triangleWave((theta * species.veinCount) / (Math.PI * 2) + 0.1) * 2 - 1;

  const bandWave =
    triangleWave(radius * species.bandCount * 0.5 + species.bandPhase / (Math.PI * 2)) * 2 - 1;

  out.edge = smoothstep(0.86, 1, ratio);
  out.shade = clamp(0.64 + 0.36 * (1 - ratio) + 0.08 * (ny / radius), 0, 1);
  out.vein = radius > 0.16 && Math.abs(veinWave) < 0.13 ? 1 : 0;
  out.band = radius > 0.18 && Math.abs(bandWave) < 0.16 ? 1 : 0;
  out.inside = ratio <= 1;

  return out.inside;
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

export function isInside(
  species: SpeciesSpec,
  x: number,
  y: number,
  pose: SpecimenPose,
  scratch: AnatomyScratch,
): boolean {
  if (inBody(species, x, y)) return true;

  const side = x < 0 ? -1 : 1;

  if (x * side > 0.55 && Math.abs(y - 0.02) < 0.065) return false;

  if (sampleWing(species.fore, species, side, x, y, pose, scratch.wing)) {
    return true;
  }

  if (sampleWing(species.hind, species, side, x, y, pose, scratch.wing)) {
    return true;
  }

  return inAntenna(species, x, y);
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
    out.coverage = 1;
    out.shade = 0.9 - t * 0.42;
    out.edge = 0;
    out.grain = hash2(Math.round(x * 32), Math.round(y * 32), grainSeed + species.glyphBias * 17);

    return out;
  }

  const side = x < 0 ? -1 : 1;
  const outward = x * side;

  if (outward > 0.55 && Math.abs(y - 0.02) < 0.065) return out;

  if (sampleWing(species.fore, species, side, x, y, pose, scratch.wing)) {
    out.hit = true;
    out.part = "fore";
    out.coverage = 1;
    out.shade = scratch.wing.shade;
    out.edge = scratch.wing.edge;
    out.vein = scratch.wing.vein;
    out.band = scratch.wing.band;
    out.grain = hash2(
      Math.round(outward * 30),
      Math.round(y * 30),
      grainSeed + species.glyphBias * 31,
    );

    return out;
  }

  if (sampleWing(species.hind, species, side, x, y, pose, scratch.wing)) {
    out.hit = true;
    out.part = "hind";
    out.coverage = 1;
    out.shade = scratch.wing.shade;
    out.edge = scratch.wing.edge;
    out.vein = scratch.wing.vein;
    out.band = scratch.wing.band;

    const eyeDistance = Math.hypot(outward - species.eyespot.x, y - species.eyespot.y);

    out.eyespot = eyeDistance < species.eyespot.radius ? 1 : 0;
    out.grain = hash2(
      Math.round(outward * 30),
      Math.round(y * 30),
      grainSeed + species.glyphBias * 47,
    );

    return out;
  }

  if (inAntenna(species, x, y)) {
    out.hit = true;
    out.part = "antenna";
    out.coverage = 1;
    out.shade = 0.55;
    out.edge = 1;
    out.grain = hash2(Math.round(x * 32), Math.round(y * 32), grainSeed);

    return out;
  }

  return out;
}

export function specimenHalfSpan(species: SpeciesSpec): number {
  return Math.max(species.fore.cx + species.fore.rx, species.hind.cx + species.hind.rx);
}
