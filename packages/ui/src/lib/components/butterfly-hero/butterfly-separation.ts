import type { FieldState, Midground, Specimen } from "./butterfly-field";
import { angleDelta, clamp, normalizeAngle } from "./butterfly-math";

const SPECIMEN_RADIUS = 1.25;
const SMALL_RADIUS = 2.2;

function specimenRadius(specimen: Specimen): number {
  return specimen.scale * SPECIMEN_RADIUS;
}

function smallRadius(butterfly: Midground): number {
  return SMALL_RADIUS + butterfly.scale * 2;
}

function pushSpecimen(specimen: Specimen, x: number, y: number): void {
  specimen.x += x;
  specimen.y += y;

  if (x !== 0 || y !== 0) {
    const away = Math.atan2(-y, -x);
    specimen.turn = clamp(specimen.turn + angleDelta(away, specimen.heading) * 0.08, -2.2, 2.2);
  }
}

function separateSpecimenPair(a: Specimen, b: Specimen): void {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const minimum = specimenRadius(a) + specimenRadius(b);

  if (distance >= minimum || distance < 0.0001) return;

  const push = Math.min(1.2, (minimum - distance) * 0.5);
  const nx = dx / distance;
  const ny = dy / distance;

  pushSpecimen(a, -nx * push, -ny * push);
  pushSpecimen(b, nx * push, ny * push);
}

function separateSpecimenFromMidground(specimen: Specimen, butterfly: Midground): void {
  const dx = butterfly.x - specimen.x;
  const dy = butterfly.y - specimen.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const minimum = specimenRadius(specimen) + smallRadius(butterfly);

  if (distance >= minimum || distance < 0.0001) return;

  const push = Math.min(1, (minimum - distance) * 0.6);
  const nx = dx / distance;
  const ny = dy / distance;

  butterfly.x += nx * push * 0.85;
  butterfly.y += ny * push * 0.85;
  specimen.x -= nx * push * 0.15;
  specimen.y -= ny * push * 0.15;

  butterfly.heading = normalizeAngle(
    butterfly.heading + angleDelta(Math.atan2(ny, nx), butterfly.heading) * 0.08,
  );
}

function separateMidgroundPair(a: Midground, b: Midground): void {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const minimum = smallRadius(a) + smallRadius(b);

  if (distance >= minimum || distance < 0.0001) return;

  const push = Math.min(0.45, (minimum - distance) * 0.5);
  const nx = dx / distance;
  const ny = dy / distance;

  a.x -= nx * push;
  a.y -= ny * push;
  b.x += nx * push;
  b.y += ny * push;
}

function clampToField(field: FieldState): void {
  for (const specimen of field.specimens) {
    const marginX = Math.min(specimen.scale * 1.5 + 2, field.width * 0.42);
    const marginY = Math.min(specimen.scale * 1.3 + 2, field.height * 0.42);
    specimen.x = clamp(specimen.x, marginX, field.width - marginX);
    specimen.y = clamp(specimen.y, marginY, field.height - marginY);
  }

  for (const butterfly of field.midground) {
    const margin = smallRadius(butterfly) + 0.5;
    butterfly.x = clamp(butterfly.x, margin, field.width - margin);
    butterfly.y = clamp(butterfly.y, margin, field.height - margin);
  }
}

export function separateField(field: FieldState): void {
  for (let pass = 0; pass < 2; pass++) {
    for (let i = 0; i < field.specimens.length; i++) {
      for (let j = i + 1; j < field.specimens.length; j++) {
        const a = field.specimens[i];
        const b = field.specimens[j];

        if (a && b) separateSpecimenPair(a, b);
      }
    }
  }

  for (const specimen of field.specimens) {
    for (const butterfly of field.midground) {
      separateSpecimenFromMidground(specimen, butterfly);
    }
  }

  for (let i = 0; i < field.midground.length; i++) {
    for (let j = i + 1; j < field.midground.length; j++) {
      const a = field.midground[i];
      const b = field.midground[j];

      if (a && b) separateMidgroundPair(a, b);
    }
  }

  clampToField(field);
}
