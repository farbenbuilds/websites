import { depositDraft, emitBreeze, emitTrace, type Atmosphere } from "./butterfly-atmosphere";
import { speciesAt } from "./butterfly-data";
import type { FieldState, Specimen } from "./butterfly-field";

function emitWingBreeze(atmosphere: Atmosphere, specimen: Specimen): void {
  const species = speciesAt(specimen.species);

  const apex = species.fore.points.reduce(
    (best, point) => (point.x > best.x ? point : best),
    species.fore.points[0] ?? { x: 0.8, y: -0.4 },
  );

  const angle = specimen.heading + Math.PI / 2;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  for (const side of [-1, 1]) {
    const localX = side * apex.x * 0.98;
    const localY = apex.y;
    const dx = cos * localX - sin * localY;
    const dy = sin * localX + cos * localY;
    const length = Math.hypot(dx, dy) || 1;
    const x = specimen.x + dx * specimen.scale + (dx / length) * 0.25;
    const y = specimen.y + dy * specimen.scale + (dy / length) * 0.25;

    emitBreeze(atmosphere, x, y, (dx / length) * 1.8, (dy / length) * 1.8 - 0.12);
  }
}

export function depositDrafts(field: FieldState, atmosphere: Atmosphere): void {
  for (const specimen of field.specimens) {
    depositDraft(
      atmosphere,
      specimen.x,
      specimen.y,
      0.05 + (specimen.state === "flap" ? 0.04 : 0),
      2,
    );

    if (Math.floor(field.time * 3 + specimen.id) % 7 === 0) {
      emitTrace(atmosphere, specimen.x, specimen.y, specimen.heading);
    }

    if (specimen.breezePulse > 0) {
      emitWingBreeze(atmosphere, specimen);
      specimen.breezePulse = 0;
    }
  }
}
