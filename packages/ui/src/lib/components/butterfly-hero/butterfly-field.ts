import { MIDGROUND_SPECIES, SPECIMEN_MAX, speciesAt } from "./butterfly-data";
import {
  steerFromBoxes,
  steerFromPointer,
  type AvoidBox,
  type Steering,
} from "./butterfly-avoidance";
import { separateField } from "./butterfly-separation";
import { specimenHalfSpan } from "./butterfly-shape";
import {
  angleDelta,
  clamp,
  createRng,
  nextRandom,
  normalizeAngle,
  randomBetween,
} from "./butterfly-math";

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
  wander: number;
  wanderTarget: number;
  wanderTimer: number;
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

const SPECIMEN_DEPTH_MIN = 0.82;
const SPECIMEN_DEPTH_MAX = 1;
const MIDGROUND_DEPTH_MIN = 0.28;
const MIDGROUND_DEPTH_MAX = 0.72;
const MAX_DIVE = 0.32;
const MIDGROUND_MAX_DIVE = 0.45;

export function densityFor(width: number, height: number): Density {
  const area = Math.max(1, width * height);
  const compact = width < 58 || height < 32;

  const midground = compact
    ? clamp(Math.round(area / 180), 8, 14)
    : clamp(Math.round(area / 360), 12, 22);

  return { midground, specimens: SPECIMEN_MAX };
}

const SPECIMEN_SPECIES_FOR_COUNT: readonly number[] = [0, 2, 1, 3, 4];

const SPECIMEN_SLOTS: readonly { readonly x: number; readonly y: number }[] = [
  { x: 0.25, y: 0.24 },
  { x: 0.75, y: 0.24 },
  { x: 0.16, y: 0.55 },
  { x: 0.84, y: 0.55 },
  { x: 0.16, y: 0.82 },
];

const COMPACT_SPECIMEN_SLOTS: readonly {
  readonly x: number;
  readonly y: number;
}[] = [
  { x: 0.2, y: 0.66 },
  { x: 0.5, y: 0.66 },
  { x: 0.8, y: 0.66 },
  { x: 0.3, y: 0.88 },
  { x: 0.7, y: 0.88 },
];

function createSpecimen(field: FieldState, index: number): Specimen {
  const speciesIndex = SPECIMEN_SPECIES_FOR_COUNT[index % SPECIMEN_SPECIES_FOR_COUNT.length] ?? 0;
  const species = speciesAt(speciesIndex);
  const halfSpan = Math.max(specimenHalfSpan(species), 0.8);
  const compact = field.width < 58 || field.height < 32;
  const spanFraction = compact ? 0.14 : 0.12;
  const scaleX = (field.width * spanFraction) / halfSpan;
  const scaleY = (field.height * 0.82) / (species.antennaReach + species.abdomenLength + 0.2);
  const scale = clamp(Math.min(scaleX, scaleY), 4.5, 30);
  const slots = compact ? COMPACT_SPECIMEN_SLOTS : SPECIMEN_SLOTS;
  const slot = slots[index % slots.length] ?? { x: 0.5, y: 0.5 };

  return {
    id: index + 1,
    species: speciesIndex,
    x: clamp(field.width * slot.x, 2, field.width - 2),
    y: clamp(field.height * slot.y, 2, field.height - 2),
    heading: randomBetween(field.rng, -Math.PI, 0.2),
    speed: randomBetween(field.rng, 0.45, 0.9),
    phase: randomBetween(field.rng, 0, Math.PI * 2),
    flapRate: randomBetween(field.rng, 6, 11),
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
    speed: randomBetween(field.rng, 0.25, 0.7),
    phase: randomBetween(field.rng, 0, Math.PI * 2),
    flapRate: randomBetween(field.rng, 4, 11),
    scale: field.width < 58 ? 0.42 + depth * 0.3 : 0.6 + depth * 0.45,
    depth,
    frame: Math.floor(nextRandom(field.rng) * 3),
    drift: randomBetween(field.rng, 0.15, 0.8),
    wander: randomBetween(field.rng, -0.8, 0.8),
    wanderTarget: randomBetween(field.rng, -2, 2),
    wanderTimer: randomBetween(field.rng, 1.2, 4.5),
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

  const count = Math.min(options.specimenCount, SPECIMEN_MAX);

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
    specimen.scale *= Math.min(scaleX, scaleY);
  }

  for (const butterfly of field.midground) {
    butterfly.x *= scaleX;
    butterfly.y *= scaleY;
  }
}

function edgeWeight(value: number, size: number, margin: number): number {
  if (value < margin) return (margin - value) / Math.max(margin, 1);

  if (value > size - margin) return (value - (size - margin)) / Math.max(margin, 1);

  return 0;
}

function limitDive(heading: number, maxDown: number): number {
  const normal = normalizeAngle(heading);
  const down = Math.sin(normal);

  if (down <= maxDown) return normal;

  const horizontal = Math.cos(normal) >= 0 ? 1 : -1;

  return horizontal > 0 ? Math.asin(maxDown) : Math.PI - Math.asin(maxDown);
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

  const marginX = Math.min(specimen.scale * 1.3 + 2, field.width * 0.35);
  const marginY = Math.min(specimen.scale * 1.05 + 2, field.height * 0.35);

  const edge = Math.max(
    edgeWeight(specimen.x, field.width, marginX),
    edgeWeight(specimen.y, field.height, marginY),
  );

  const centerTurn = angleDelta(
    Math.atan2(field.height / 2 - specimen.y, field.width / 2 - specimen.x),
    specimen.heading,
  );

  const steer =
    Math.sin(field.time * 0.28 + specimen.id * 1.7) * 0.16 +
    centerTurn * edge * 1.8 +
    boxes.x * 1.1 +
    breeze.x * 1.4;

  specimen.turn = clamp(specimen.turn + (steer - specimen.turn) * Math.min(1, dt * 1.6), -2.2, 2.2);
  specimen.heading = limitDive(specimen.heading + specimen.turn * dt, MAX_DIVE);

  const pace = specimen.speed * (flapping ? 1.12 : 0.74);
  specimen.x += Math.cos(specimen.heading) * pace * dt;
  specimen.y += Math.sin(specimen.heading) * pace * dt + boxes.y * dt * 0.2;
}

function stepMidground(field: FieldState, butterfly: Midground, dt: number): void {
  butterfly.phase += butterfly.flapRate * dt;
  butterfly.wanderTimer -= dt;

  if (butterfly.wanderTimer <= 0) {
    butterfly.wanderTimer = randomBetween(field.rng, 1.2, 4.5);
    butterfly.wanderTarget = randomBetween(field.rng, -2.2, 2.2);
  }

  butterfly.wander += (butterfly.wanderTarget - butterfly.wander) * Math.min(1, dt * 0.7);

  const breeze = field.breezeSteer;
  const boxes = field.boxSteer;

  if (field.pointer.active) {
    steerFromPointer(field.pointer, butterfly.x, butterfly.y, breeze);
  } else {
    breeze.x = 0;
    breeze.y = 0;
  }

  steerFromBoxes(field.excluded, butterfly.x, butterfly.y, 3, boxes);

  const edge = Math.max(
    edgeWeight(butterfly.x, field.width, 3),
    edgeWeight(butterfly.y, field.height, 3),
  );

  const centerTurn = angleDelta(
    Math.atan2(field.height / 2 - butterfly.y, field.width / 2 - butterfly.x),
    butterfly.heading,
  );

  const turn =
    butterfly.wander * butterfly.drift +
    Math.sin(field.time * 0.18 + butterfly.id * 0.7) * 0.18 +
    centerTurn * edge * 2.2 +
    boxes.x * 0.9 +
    breeze.x * 1.6;

  butterfly.heading = limitDive(butterfly.heading + turn * dt, MIDGROUND_MAX_DIVE);
  butterfly.x += Math.cos(butterfly.heading) * butterfly.speed * dt;
  butterfly.y += Math.sin(butterfly.heading) * butterfly.speed * dt + boxes.y * dt * 0.2;
}

export function stepField(field: FieldState, dt: number): void {
  field.time += dt;

  for (const specimen of field.specimens) {
    stepSpecimen(field, specimen, dt);
  }

  for (const butterfly of field.midground) {
    butterfly.frame = Math.floor(field.time * 5 + butterfly.id) % 3;
    stepMidground(field, butterfly, dt);
  }

  separateField(field);
}

export function setPointer(field: FieldState, x: number, y: number, active: boolean): void {
  field.pointer.x = x;
  field.pointer.y = y;
  field.pointer.active = active;
}
