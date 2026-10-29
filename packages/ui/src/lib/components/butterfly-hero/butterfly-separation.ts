import type { FieldState, Specimen } from "./butterfly-field";
import { clamp } from "./butterfly-math";

const SPECIMEN_RADIUS = 1.25;
const MIN_GAP = 1.2;

export type SeparationSteer = {
  x: number;
  y: number;
};

function specimenRadius(specimen: Specimen): number {
  return specimen.scale * SPECIMEN_RADIUS + MIN_GAP;
}

export function separationSteer(field: FieldState, specimen: Specimen): SeparationSteer {
  let x = 0;
  let y = 0;

  for (const other of field.specimens) {
    if (other === specimen) continue;

    const dx = specimen.x - other.x;
    const dy = specimen.y - other.y;
    const distance = Math.hypot(dx, dy);
    const minimum = specimenRadius(specimen) + specimenRadius(other);
    const influence = minimum * 1.8;

    if (distance >= influence) continue;

    if (distance < 0.0001) {
      x += 1;
      continue;
    }

    const weight = (1 - distance / influence) ** 2;

    x += (dx / distance) * weight;
    y += (dy / distance) * weight;
  }

  return { x, y };
}

function pushSpecimen(specimen: Specimen, x: number, y: number): void {
  specimen.x += x;
  specimen.y += y;
}

function separateSpecimenPair(a: Specimen, b: Specimen): void {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const minimum = specimenRadius(a) + specimenRadius(b);

  if (distance >= minimum || distance < 0.0001) return;

  const push = Math.min(1.6, (minimum - distance) * 0.55);
  const nx = dx / distance;
  const ny = dy / distance;

  pushSpecimen(a, -nx * push, -ny * push);
  pushSpecimen(b, nx * push, ny * push);
}

function clampToField(field: FieldState): void {
  for (const specimen of field.specimens) {
    const marginX = Math.min(specimen.scale * 1.2 + 1, field.width * 0.4);
    specimen.x = clamp(specimen.x, marginX, field.width - marginX);

    const top = -specimen.scale * 1.2;
    const bottom = field.height + specimen.scale * 1.2;

    if (specimen.y < top) specimen.y = bottom;
    else if (specimen.y > bottom) specimen.y = top;
  }
}

export function separateField(field: FieldState): void {
  clampToField(field);

  for (let pass = 0; pass < 6; pass++) {
    for (let i = 0; i < field.specimens.length; i++) {
      for (let j = i + 1; j < field.specimens.length; j++) {
        const a = field.specimens[i];
        const b = field.specimens[j];

        if (a && b) separateSpecimenPair(a, b);
      }
    }
  }

  clampToField(field);
}
