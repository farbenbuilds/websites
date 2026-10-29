import { depositDraft, emitTrace, type Atmosphere } from "./butterfly-atmosphere";
import type { FieldState } from "./butterfly-field";

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
  }
}
