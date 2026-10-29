import { MIDGROUND_SPECIES, speciesAt } from "./butterfly-data";
import {
  steerFromBoxes,
  steerFromPointer,
  type AvoidBox,
  type Steering,
} from "./butterfly-avoidance";
import { specimenHalfSpan } from "./butterfly-shape";
import { clamp, createRng, hash3, nextRandom, randomBetween, wrap } from "./butterfly-math";

export { mergeAvoidBoxes } from "./butterfly-avoidance";

export type { AvoidBox } from "./butterfly-avoidance";

export type FieldPointer = {
  x: number;
  y: number;
  active: boolean;
};

export type Specimen = {
  id: number;
  species: number;
  x: number;
  y: number;
  homeX: number;
  homeY: number;
  heading: number;
  speed: number;
  phase: number;
  flapRate: number;
  scale: number;
  depth: number;
  yaw: number;
  yawTarget: number;
  yawTimer: number;
  state: "flap" | "glide";
  stateTimer: number;
  turn: number;
};

export type Midground = {
  id: number;
  species: number;
  x: number;
  y: number;
  heading: number;
  speed: number;
  phase: number;
  flapRate: number;
  scale: number;
  depth: number;
  frame: number;
  drift: number;
};

export type FieldState = {
  width: number;
  height: number;
  time: number;
  specimens: Specimen[];
  midground: Midground[];
  excluded: AvoidBox[];
  pointer: FieldPointer;
  boxSteer: Steering;
  breezeSteer: Steering;
  rng: ReturnType<typeof createRng>;
  seed: number;
};

export type FieldOptions = {
  readonly width: number;
  readonly height: number;
  readonly midgroundCount: number;
  readonly specimenCount: number;
  readonly seed: number;
};

export type Density = {
  readonly midground: number;
  readonly specimens: number;
};

const SPECIMEN_DEPTH_MIN = 0.72;
const SPECIMEN_DEPTH_MAX = 1;
const MIDGROUND_DEPTH_MIN = 0.28;
const MIDGROUND_DEPTH_MAX = 0.74;

export function densityFor(width: number, height: number): Density {
  const area = Math.max(1, width * height);
  const compact = width < 58 || height < 26;

  const midground = compact
    ? clamp(Math.round(area / 30), 18, 30)
    : clamp(Math.round(area / 54), 44, 64);

  const specimens = compact ? 1 : width > 100 ? 3 : 2;

  return { midground, specimens: Math.min(specimens, 4) };
}

const SPECIMEN_SPECIES_FOR_COUNT: readonly number[] = [0, 2, 1, 3];

const SPECIMEN_SLOTS: readonly { readonly x: number; readonly y: number }[] = [
  { x: 0.64, y: 0.3 },
  { x: 0.22, y: 0.68 },
  { x: 0.48, y: 0.52 },
  { x: 0.8, y: 0.76 },
];

const DEFAULT_SLOT = { x: 0.5, y: 0.42 };

function createSpecimen(field: FieldState, index: number): Specimen {
  const speciesIndex = SPECIMEN_SPECIES_FOR_COUNT[index % SPECIMEN_SPECIES_FOR_COUNT.length] ?? 0;
  const species = speciesAt(speciesIndex);
  const halfSpan = Math.max(specimenHalfSpan(species), 0.8);
  const compact = field.width < 58 || field.height < 26;
  const spanFraction = compact ? 0.42 : index === 0 ? 0.26 : index === 1 ? 0.22 : 0.16;
  const scaleX = (field.width * spanFraction) / halfSpan;
  const scaleY = (field.height * 0.82) / (species.antennaReach + species.abdomenLength + 0.2);
  const scale = clamp(Math.min(scaleX, scaleY), 4.5, 30);

  const slot = compact
    ? DEFAULT_SLOT
    : (SPECIMEN_SLOTS[index % SPECIMEN_SLOTS.length] ?? DEFAULT_SLOT);

  const jitterX = randomBetween(field.rng, -1.2, 1.2);
  const jitterY = randomBetween(field.rng, -1.2, 1.2);

  return {
    id: index + 1,
    species: speciesIndex,
    x: clamp(field.width * slot.x + jitterX, 2, field.width - 2),
    y: clamp(field.height * slot.y + jitterY, 2, field.height - 2),
    homeX: clamp(field.width * slot.x, 2, field.width - 2),
    homeY: clamp(field.height * slot.y, 2, field.height - 2),
    heading:
      index === 0 ? randomBetween(field.rng, -0.24, -0.06) : randomBetween(field.rng, 0.08, 0.3),
    speed: randomBetween(field.rng, 0.28, 0.65),
    phase: randomBetween(field.rng, 0, Math.PI * 2),
    flapRate: randomBetween(field.rng, 8, 13),
    scale,
    depth: randomBetween(field.rng, SPECIMEN_DEPTH_MIN, SPECIMEN_DEPTH_MAX),
    yaw: randomBetween(field.rng, -0.42, 0.42),
    yawTarget: randomBetween(field.rng, -0.42, 0.42),
    yawTimer: randomBetween(field.rng, 2, 6),
    state: "flap",
    stateTimer: randomBetween(field.rng, 0.8, 2.2),
    turn: 0,
  };
}

function createMidground(field: FieldState, index: number, x: number, y: number): Midground {
  const speciesIndex = MIDGROUND_SPECIES[index % MIDGROUND_SPECIES.length] ?? 0;
  const depth = randomBetween(field.rng, MIDGROUND_DEPTH_MIN, MIDGROUND_DEPTH_MAX);

  return {
    id: index + 100,
    species: speciesIndex,
    x,
    y,
    heading: randomBetween(field.rng, -Math.PI, Math.PI),
    speed: randomBetween(field.rng, 0.35, 1.1),
    phase: randomBetween(field.rng, 0, Math.PI * 2),
    flapRate: randomBetween(field.rng, 6, 15),
    scale: 0.55 + depth * 0.45,
    depth,
    frame: Math.floor(nextRandom(field.rng) * 3),
    drift: randomBetween(field.rng, 0.2, 1.1),
  };
}

export function createField(options: FieldOptions): FieldState {
  const rng = createRng(options.seed);

  const field: FieldState = {
    width: options.width,
    height: options.height,
    time: 0,
    specimens: [],
    midground: [],
    excluded: [],
    pointer: { x: 0, y: 0, active: false },
    boxSteer: { x: 0, y: 0 },
    breezeSteer: { x: 0, y: 0 },
    rng,
    seed: options.seed,
  };

  const count = Math.min(options.specimenCount, 4);

  for (let i = 0; i < count; i++) {
    field.specimens.push(createSpecimen(field, i));
  }

  const midgroundCount = Math.max(0, options.midgroundCount);
  const columns = Math.max(1, Math.round(Math.sqrt((midgroundCount * field.width) / field.height)));
  const rows = Math.max(1, Math.ceil(midgroundCount / columns));

  for (let i = 0; i < midgroundCount; i++) {
    const column = i % columns;
    const row = Math.floor(i / columns);
    const x = ((column + 0.15 + nextRandom(rng) * 0.7) / columns) * field.width;
    const y = ((row + 0.15 + nextRandom(rng) * 0.7) / rows) * field.height;
    field.midground.push(createMidground(field, i, x, y));
  }

  return field;
}

export function resizeField(field: FieldState, width: number, height: number): void {
  if (width <= 0 || height <= 0) return;
  const scaleX = width / Math.max(field.width, 1);
  const scaleY = height / Math.max(field.height, 1);
  field.width = width;
  field.height = height;

  for (const specimen of field.specimens) {
    specimen.x *= scaleX;
    specimen.y *= scaleY;
    specimen.homeX *= scaleX;
    specimen.homeY *= scaleY;
    specimen.scale *= Math.min(scaleX, scaleY);
  }

  for (const butterfly of field.midground) {
    butterfly.x *= scaleX;
    butterfly.y *= scaleY;
  }
}

function stepSpecimen(field: FieldState, specimen: Specimen, dt: number): void {
  specimen.stateTimer -= dt;

  if (specimen.stateTimer <= 0) {
    if (specimen.state === "flap") {
      specimen.state = "glide";
      specimen.stateTimer = randomBetween(field.rng, 1.2, 3.4);
    } else {
      specimen.state = "flap";
      specimen.stateTimer = randomBetween(field.rng, 0.5, 1.5);
    }
  }

  const flapping = specimen.state === "flap";
  specimen.phase += specimen.flapRate * dt * (flapping ? 1 : 0.12);

  specimen.yawTimer -= dt;

  if (specimen.yawTimer <= 0) {
    specimen.yawTimer = randomBetween(field.rng, 2.5, 7);
    specimen.yawTarget = randomBetween(field.rng, -0.48, 0.48);
  }

  specimen.yaw += (specimen.yawTarget - specimen.yaw) * Math.min(1, dt * 1.4);

  const breeze = field.breezeSteer;
  const boxes = field.boxSteer;

  if (field.pointer.active) {
    steerFromPointer(field.pointer, specimen.x, specimen.y, breeze);
  } else {
    breeze.x = 0;
    breeze.y = 0;
  }

  steerFromBoxes(field.excluded, specimen.x, specimen.y, 4, boxes);

  const edge =
    specimen.x < 5
      ? 1
      : specimen.x > field.width - 5
        ? -1
        : specimen.y < 5
          ? 1
          : specimen.y > field.height - 5
            ? -1
            : 0;

  const steer =
    Math.sin(field.time * 0.34 + specimen.id * 1.7) * 0.22 +
    boxes.x * 1.4 +
    breeze.x * 1.8 +
    edge * 0.5;

  specimen.turn += (steer - specimen.turn) * Math.min(1, dt * 2.2);
  specimen.heading += specimen.turn * dt;

  const pace = specimen.speed * (flapping ? 1.16 : 0.72);
  specimen.x += Math.cos(specimen.heading) * pace * dt;
  specimen.y += Math.sin(specimen.heading) * pace * dt + boxes.y * dt * 0.6;

  const margin = 8;
  specimen.x = wrap(specimen.x + margin, field.width + margin * 2) - margin;
  specimen.y = wrap(specimen.y + margin, field.height + margin * 2) - margin;
}

function stepMidground(field: FieldState, butterfly: Midground, dt: number): void {
  butterfly.phase += butterfly.flapRate * dt;

  const breeze = field.breezeSteer;
  const boxes = field.boxSteer;

  if (field.pointer.active) {
    steerFromPointer(field.pointer, butterfly.x, butterfly.y, breeze);
  } else {
    breeze.x = 0;
    breeze.y = 0;
  }

  steerFromBoxes(field.excluded, butterfly.x, butterfly.y, 3, boxes);
  butterfly.heading +=
    Math.sin(field.time * 0.22 + butterfly.id * 0.7) * butterfly.drift * 0.35 * dt +
    boxes.x * dt * 1.2 +
    breeze.x * dt * 2.2;
  butterfly.x += Math.cos(butterfly.heading) * butterfly.speed * dt;
  butterfly.y += Math.sin(butterfly.heading) * butterfly.speed * dt + boxes.y * dt * 0.5;

  const margin = 4;
  butterfly.x = wrap(butterfly.x + margin, field.width + margin * 2) - margin;
  butterfly.y = wrap(butterfly.y + margin, field.height + margin * 2) - margin;
}

export function stepField(field: FieldState, dt: number): void {
  field.time += dt;

  for (const specimen of field.specimens) {
    stepSpecimen(field, specimen, dt);
  }

  for (const butterfly of field.midground) {
    butterfly.frame = Math.floor(field.time * 6 + butterfly.id) % 3;
    stepMidground(field, butterfly, dt);
  }
}

export function setPointer(field: FieldState, x: number, y: number, active: boolean): void {
  field.pointer.x = x;
  field.pointer.y = y;
  field.pointer.active = active;
}

export function seedFor(width: number, height: number, seed: number): number {
  return (hash3(Math.round(width), Math.round(height), seed) * 4294967295) >>> 0;
}
