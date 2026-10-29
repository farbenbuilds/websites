import { EDGE_RAMP, speciesAt, type SpeciesSpec } from "./butterfly-data";
import type { FieldState } from "./butterfly-field";
import { glyphFor, roleFor, showsGlyph, type InkRole } from "./butterfly-glyphs";
import {
  createSpecimenPose,
  isInside,
  sampleAnatomy,
  specimenHalfSpan,
  type AnatomyScratch,
} from "./butterfly-shape";
import { inkFor, washColor } from "./butterfly-sprites";
import { mixRgb, rgb, type ButterflyPalette } from "./butterfly-palette";

export type SpecimenSurface = {
  readonly context: CanvasRenderingContext2D;
  readonly detail: AnatomyScratch;
  readonly coverage: AnatomyScratch;
  readonly cellWidth: number;
  readonly cellHeight: number;
  readonly cols: number;
  readonly rows: number;
  readonly palette: ButterflyPalette;
  readonly fontFamily: string;
};

const SHADE_LEVELS = 8;

type SpecimenColors = {
  readonly fore: readonly string[];
  readonly hind: readonly string[];
  readonly edgeFore: readonly string[];
  readonly edgeHind: readonly string[];
  readonly partial: string;
  readonly ink: string;
  readonly accent: string;
  readonly mutedGlyph: string;
  readonly glyphs: Readonly<Record<InkRole, string>>;
};

function shadeLevel(shade: number): number {
  return Math.max(0, Math.min(SHADE_LEVELS - 1, Math.floor(shade * SHADE_LEVELS)));
}

function createSpecimenColors(palette: ButterflyPalette, species: SpeciesSpec): SpecimenColors {
  const fore: string[] = [];
  const hind: string[] = [];
  const edgeFore: string[] = [];
  const edgeHind: string[] = [];

  for (let level = 0; level < SHADE_LEVELS; level++) {
    const shade = (level + 0.5) / SHADE_LEVELS;
    const base = washColor(palette, species.accentMix, shade);
    const foreColor = mixRgb(base, palette.accent, 0.15);
    const hindColor = mixRgb(base, palette.ink, 0.12);
    fore.push(rgb(foreColor));
    hind.push(rgb(hindColor));
    edgeFore.push(rgb(mixRgb(foreColor, palette.ink, 0.42)));
    edgeHind.push(rgb(mixRgb(hindColor, palette.ink, 0.42)));
  }

  return {
    fore,
    hind,
    edgeFore,
    edgeHind,
    partial: rgb(palette.muted),
    ink: rgb(palette.ink),
    accent: rgb(palette.accent),
    mutedGlyph: rgb(palette.muted),
    glyphs: {
      wing: inkFor(palette, "wing"),
      edge: inkFor(palette, "edge"),
      vein: inkFor(palette, "vein"),
      band: inkFor(palette, "band"),
      eyespot: inkFor(palette, "eyespot"),
      body: inkFor(palette, "body"),
      antenna: inkFor(palette, "antenna"),
    },
  };
}

export function drawSpecimens(
  surface: SpecimenSurface,
  field: FieldState,
  pass: "tile" | "glyph",
): void {
  const { context, cellWidth, cellHeight, palette } = surface;
  context.font = `600 ${Math.round(cellHeight * 0.76)}px ${surface.fontFamily}`;

  for (const specimen of field.specimens) {
    const species = speciesAt(specimen.species);
    const colors = createSpecimenColors(palette, species);
    const scalePx = specimen.scale * cellWidth;
    const cos = Math.cos(specimen.heading);
    const sin = Math.sin(specimen.heading);
    const horizontal = (specimenHalfSpan(species) + 0.12) * scalePx;
    const vertical = (Math.max(species.antennaReach, species.abdomenLength) + 0.18) * scalePx;
    const extentX = Math.abs(cos) * horizontal + Math.abs(sin) * vertical;
    const extentY = Math.abs(sin) * horizontal + Math.abs(cos) * vertical;
    const centerX = specimen.x * cellWidth;
    const centerY = specimen.y * cellHeight;
    const colStart = Math.max(0, Math.floor((centerX - extentX) / cellWidth));
    const colEnd = Math.min(surface.cols - 1, Math.ceil((centerX + extentX) / cellWidth));
    const rowStart = Math.max(0, Math.floor((centerY - extentY) / cellHeight));
    const rowEnd = Math.min(surface.rows - 1, Math.ceil((centerY + extentY) / cellHeight));
    const pose = createSpecimenPose(specimen.phase, specimen.yaw);
    const grainSeed = specimen.id * 131 + specimen.species * 17;
    const subX = (cellWidth * 0.32) / scalePx;
    const subY = (cellHeight * 0.32) / scalePx;

    for (let row = rowStart; row <= rowEnd; row++) {
      for (let column = colStart; column <= colEnd; column++) {
        const worldX = (column + 0.5) * cellWidth - centerX;
        const worldY = (row + 0.5) * cellHeight - centerY;
        const localX = (cos * worldX + sin * worldY) / scalePx;
        const localY = (-sin * worldX + cos * worldY) / scalePx;

        if (localX > 1.4 || localX < -1.4 || localY > 0.9 || localY < -0.95) {
          continue;
        }

        const sample = sampleAnatomy(species, localX, localY, pose, grainSeed, surface.detail);

        let coverage: number;

        if (sample.hit && sample.edge < 0.2) {
          coverage = 1;
        } else {
          let hits = sample.hit ? 1 : 0;

          if (isInside(species, localX - subX, localY - subY, pose, surface.coverage)) {
            hits++;
          }

          if (isInside(species, localX + subX, localY - subY, pose, surface.coverage)) {
            hits++;
          }

          if (isInside(species, localX - subX, localY + subY, pose, surface.coverage)) {
            hits++;
          }

          if (isInside(species, localX + subX, localY + subY, pose, surface.coverage)) {
            hits++;
          }

          coverage = hits / 5;
        }

        if (!sample.hit && coverage < 0.34) continue;

        const x = column * cellWidth;
        const y = row * cellHeight;

        if (pass === "tile") {
          const level = shadeLevel(sample.hit ? sample.shade : 0.48);

          const tile = !sample.hit
            ? colors.partial
            : sample.part === "body" || sample.part === "antenna"
              ? colors.ink
              : sample.eyespot > 0
                ? colors.accent
                : sample.edge > 0.6
                  ? sample.part === "hind"
                    ? (colors.edgeHind[level] ?? colors.hind[level])
                    : (colors.edgeFore[level] ?? colors.fore[level])
                  : sample.part === "hind"
                    ? colors.hind[level]
                    : colors.fore[level];

          const alpha = !sample.hit
            ? 0.08 + coverage * 0.1
            : sample.part === "body" || sample.part === "antenna"
              ? 0.22 + coverage * 0.12
              : sample.eyespot > 0
                ? 0.52
                : 0.42 + coverage * 0.2 + specimen.depth * 0.15;

          context.globalAlpha = alpha;
          context.fillStyle = tile ?? colors.ink;
          context.fillRect(x, y, cellWidth, cellHeight);
          context.globalAlpha = 1;
          continue;
        }

        if (!sample.hit) {
          context.globalAlpha = 0.28 + coverage * 0.22;
          context.fillStyle = colors.mutedGlyph;
          context.fillText(
            EDGE_RAMP[Math.min(EDGE_RAMP.length - 1, Math.floor(coverage * 5))] ?? ".",
            x + cellWidth / 2,
            y + cellHeight / 2,
          );
          context.globalAlpha = 1;
          continue;
        }

        const glyph = glyphFor(sample, species.glyphBias + specimen.id);
        const strong = showsGlyph(sample, 0.55);

        if (!strong) {
          if (sample.grain < 0.5) continue;
          context.globalAlpha = 0.16 + sample.grain * 0.12;
          context.fillStyle = colors.ink;
          context.fillText(glyph, x + cellWidth / 2, y + cellHeight / 2);
          context.globalAlpha = 1;
          continue;
        }

        const role = roleFor(sample);
        context.globalAlpha = (0.72 + specimen.depth * 0.28) * (sample.edge > 0.55 ? 0.78 : 1);
        context.fillStyle = colors.glyphs[role];
        context.fillText(glyph, x + cellWidth / 2, y + cellHeight / 2);
        context.globalAlpha = 1;
      }
    }
  }
}
