import type { FieldState, Specimen } from "./butterfly-field";
import { angleDelta, clamp } from "./butterfly-math";

const SPECIMEN_RADIUS = 1.25;

function specimenRadius(specimen: Specimen): number {
  return specimen.scale * SPECIMEN_RADIUS;
}

function pushSpecimen(specimen: Specimen, x: number, y: number): void {
  specimen.x += x;
  specimen.y += y;

  if (x === 0 && y === 0) return;

  const away = Math.atan2(-y, -x);
  specimen.turn = clamp(specimen.turn + angleDelta(away, specimen.heading) * 0.08, -2.2, 2.2);
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

function clampToField(field: FieldState): void {
  for (const specimen of field.specimens) {
    const marginX = Math.min(specimen.scale * 1.2 + 1, field.width * 0.4);
    const marginY = Math.min(specimen.scale * 1.2 + 1, field.height * 0.4);
    specimen.x = clamp(specimen.x, marginX, field.width - marginX);
    specimen.y = clamp(specimen.y, marginY, field.height - marginY);
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

  clampToField(field);
}
