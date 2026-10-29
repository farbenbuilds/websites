import { BODY_RAMP, EDGE_RAMP, WING_RAMP } from "./butterfly-data";
import type { AnatomySample } from "./butterfly-shape";

export type InkRole = "wing" | "edge" | "vein" | "band" | "eyespot" | "body" | "antenna";

export function glyphFor(sample: AnatomySample, glyphBias: number): string {
  if (!sample.hit) return " ";

  if (sample.part === "antenna") return "'";

  if (sample.part === "body") {
    const index = Math.min(
      BODY_RAMP.length - 1,
      Math.max(0, Math.floor(sample.shade * BODY_RAMP.length)),
    );

    return BODY_RAMP[(index + glyphBias) % BODY_RAMP.length] ?? "#";
  }

  if (sample.eyespot > 0) return "@";

  if (sample.edge > 0.55) {
    const index = Math.min(
      EDGE_RAMP.length - 1,
      Math.max(0, Math.floor(sample.edge * EDGE_RAMP.length)),
    );

    return EDGE_RAMP[(index + glyphBias) % EDGE_RAMP.length] ?? ".";
  }

  if (sample.vein > 0) return ":";

  if (sample.band > 0) return "=";

  const index = Math.min(
    WING_RAMP.length - 1,
    Math.max(0, Math.floor(sample.shade * WING_RAMP.length)),
  );

  return WING_RAMP[(index + glyphBias) % WING_RAMP.length] ?? "+";
}

export function roleFor(sample: AnatomySample): InkRole {
  if (sample.part === "antenna") return "antenna";

  if (sample.part === "body") return "body";

  if (sample.eyespot > 0) return "eyespot";

  if (sample.edge > 0.55) return "edge";

  if (sample.vein > 0) return "vein";

  if (sample.band > 0) return "band";

  return "wing";
}

export function midgroundAlpha(depth: number): number {
  return 0.86 + depth * 0.12;
}

export function showsGlyph(sample: AnatomySample, grainThreshold: number): boolean {
  if (!sample.hit) return false;

  if (sample.part === "body" || sample.part === "antenna") return true;

  if (sample.eyespot > 0) return true;

  if (sample.edge > 0.45) return true;

  if (sample.vein > 0) return true;

  if (sample.band > 0) return true;

  return sample.grain > grainThreshold;
}
