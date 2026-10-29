import { SPECIES, SPECIMEN_MAX, speciesAt } from "./butterfly-data";
import { steerFromPointer, type Steering } from "./butterfly-breeze";
import { separateField } from "./butterfly-separation";
import { specimenHalfHeight, specimenHalfSpan } from "./butterfly-shape";
import { angleDelta, clamp, createRng, normalizeAngle, randomBetween } from "./butterfly-math";

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

export type FieldState = {
  width: number;
  height: number;
  time: number;
  specimens: Specimen[];
  pointer: FieldPointer;
  breezeSteer: Steering;
  rng: ReturnType<typeof createRng>;
};

export type FieldOptions = {
  readonly width: number;
  readonly height: number;
  readonly specimenCount?: number;
  readonly seed: number;
};

const SPECIMEN_DEPTH_MIN = 0.86;
const SPECIMEN_DEPTH_MAX = 1;
const MAX_DIVE = 0.3;
const BIG_COUNT = 3;
const MEDIUM_SCALE = 0.7;

const WIDE_SLOTS: readonly { readonly x: number; readonly y: number }[] = [
  { x: 0.18, y: 0.24 },
  { x: 0.72, y: 0.28 },
  { x: 0.46, y: 0.66 },
  { x: 0.2, y: 0.72 },
  { x: 0.82, y: 0.7 },
];

const COMPACT_SLOTS: readonly { readonly x: number; readonly y: number }[] = [
  { x: 0.22, y: 0.55 },
  { x: 0.78, y: 0.58 },
  { x: 0.5, y: 0.8 },
  { x: 0.25, y: 0.86 },
  { x: 0.75, y: 0.88 },
];

function createSpecimen(field: FieldState, index: number): Specimen {
  const speciesIndex = index % SPECIES.length;
  const species = speciesAt(speciesIndex);
  const halfSpan = Math.max(specimenHalfSpan(species), 0.8);
  const compact = field.width < 58 || field.height < 32;
  const spanFraction = compact ? 0.12 : 0.095;
  const scaleX = (field.width * spanFraction) / halfSpan;
  const scaleY = (field.height * 0.7) / (specimenHalfHeight(species) * 2);
  const baseScale = clamp(Math.min(scaleX, scaleY), 3.2, 22);
  const scale = index < BIG_COUNT ? baseScale : baseScale * MEDIUM_SCALE;
  const slots = compact ? COMPACT_SLOTS : WIDE_SLOTS;
  const slot = slots[index % slots.length] ?? { x: 0.5, y: 0.5 };

  return {
    id: index + 1,
    species: speciesIndex,
    x: clamp(field.width * slot.x, 2, field.width - 2),
    y: clamp(field.height * slot.y, 2, field.height - 2),
    heading: randomBetween(field.rng, -Math.PI, 0.2),
    speed: randomBetween(field.rng, 0.55, 0.95),
    phase: randomBetween(field.rng, 0, Math.PI * 2),
    flapRate: randomBetween(field.rng, 5, 9),
    scale,
    depth: randomBetween(field.rng, SPECIMEN_DEPTH_MIN, SPECIMEN_DEPTH_MAX),
    yaw: randomBetween(field.rng, -0.35, 0.35),
    yawTarget: randomBetween(field.rng, -0.35, 0.35),
    yawTimer: randomBetween(field.rng, 2, 6),
    state: "flap",
    stateTimer: randomBetween(field.rng, 0.8, 2.2),
    turn: 0,
  };
}

export function createField(options: FieldOptions): FieldState {
  const rng = createRng(options.seed);

  const field: FieldState = {
    width: options.width,
    height: options.height,
    time: 0,
    specimens: [],
    pointer: { x: 0, y: 0, active: false },
    breezeSteer: { x: 0 },
    rng,
  };

  const requested = options.specimenCount ?? SPECIMEN_MAX;
  const count = clamp(Math.round(requested), 1, SPECIMEN_MAX);

  for (let index = 0; index < count; index++) {
    field.specimens.push(createSpecimen(field, index));
  }

  return field;
}

export function resizeField(field: FieldState, width: number, height: number): void {
  if (width <= 0 || height <= 0) return;
  const scaleX = width / Math.max(field.width, 1);
  const scaleY = height / Math.max(field.height, 1);
  const scale = Math.min(scaleX, scaleY);
  field.width = width;
  field.height = height;

  for (const specimen of field.specimens) {
    specimen.x *= scaleX;
    specimen.y *= scaleY;
    specimen.scale = clamp(specimen.scale * scale, 2.2, 22);
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
    specimen.yawTarget = randomBetween(field.rng, -0.42, 0.42);
  }

  specimen.yaw += (specimen.yawTarget - specimen.yaw) * Math.min(1, dt * 1.4);

  const breeze = field.breezeSteer;

  if (field.pointer.active) {
    steerFromPointer(field.pointer, specimen.x, specimen.y, breeze);
  } else {
    breeze.x = 0;
  }

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
    breeze.x * 1.4;

  specimen.turn = clamp(specimen.turn + (steer - specimen.turn) * Math.min(1, dt * 1.6), -2.2, 2.2);
  specimen.heading = limitDive(specimen.heading + specimen.turn * dt, MAX_DIVE);

  const pace = specimen.speed * (flapping ? 1.12 : 0.74);
  specimen.x += Math.cos(specimen.heading) * pace * dt;
  specimen.y += Math.sin(specimen.heading) * pace * dt;
}

export function stepField(field: FieldState, dt: number): void {
  field.time += dt;

  for (const specimen of field.specimens) {
    stepSpecimen(field, specimen, dt);
  }

  separateField(field);
}

export function setPointer(field: FieldState, x: number, y: number, active: boolean): void {
  field.pointer.x = x;
  field.pointer.y = y;
  field.pointer.active = active;
}
