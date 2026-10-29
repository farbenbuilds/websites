import { speciesAt, type SpeciesSpec } from "./butterfly-data";
import type { FieldState } from "./butterfly-field";
import { glyphFor, roleFor, showsGlyph } from "./butterfly-glyphs";
import {
  createSpecimenPose,
  sampleAnatomy,
  specimenHalfHeight,
  specimenHalfSpan,
  type AnatomyScratch,
} from "./butterfly-shape";
import {
  butterflyBodyColor,
  butterflyWingColor,
  inkFor,
  mixRgb,
  rgb,
  type ButterflyPalette,
  type InkRole,
} from "./butterfly-palette";

export type SpecimenSurface = {
  readonly context: CanvasRenderingContext2D;
  readonly detail: AnatomyScratch;
  readonly cellWidth: number;
  readonly cellHeight: number;
  readonly cols: number;
  readonly rows: number;
  readonly palette: ButterflyPalette;
  readonly fontFamily: string;
};

const SHADE_LEVELS = 8;

export type SpecimenColors = {
  readonly wing: readonly string[];
  readonly edge: readonly string[];
  readonly body: string;
  readonly ink: string;
  readonly accent: string;
  readonly glyphs: Readonly<Record<InkRole, string>>;
};

function shadeLevel(shade: number): number {
  return Math.max(0, Math.min(SHADE_LEVELS - 1, Math.floor(shade * SHADE_LEVELS)));
}

function createSpecimenColors(palette: ButterflyPalette, species: SpeciesSpec): SpecimenColors {
  const wing: string[] = [];
  const edge: string[] = [];

  for (let level = 0; level < SHADE_LEVELS; level++) {
    const shade = (level + 0.5) / SHADE_LEVELS;
    const wingColor = butterflyWingColor(palette, species.accentMix, shade);
    wing.push(rgb(wingColor));
    edge.push(rgb(mixRgb(wingColor, palette.paper, 0.38)));
  }

  return {
    wing,
    edge,
    body: rgb(butterflyBodyColor(palette)),
    ink: rgb(palette.ink),
    accent: rgb(palette.accent),
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
  cache: Map<number, SpecimenColors>,
): void {
  const { context, cellWidth, cellHeight, palette } = surface;
  context.font = `600 ${Math.round(cellHeight * 0.76)}px ${surface.fontFamily}`;

  for (const specimen of field.specimens) {
    const species = speciesAt(specimen.species);
    const colors = cache.get(specimen.species) ?? createSpecimenColors(palette, species);
    cache.set(specimen.species, colors);
    const scalePx = specimen.scale * cellWidth;
    const angle = specimen.heading + Math.PI / 2;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const horizontal = (specimenHalfSpan(species) + 0.12) * scalePx;
    const vertical = (specimenHalfHeight(species) + 0.18) * scalePx;
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

    for (let row = rowStart; row <= rowEnd; row++) {
      for (let column = colStart; column <= colEnd; column++) {
        const worldX = (column + 0.5) * cellWidth - centerX;
        const worldY = (row + 0.5) * cellHeight - centerY;
        const localX = (cos * worldX + sin * worldY) / scalePx;
        const localY = (-sin * worldX + cos * worldY) / scalePx;

        if (localX > 1.35 || localX < -1.35 || localY > 0.95 || localY < -0.95) {
          continue;
        }

        const sample = sampleAnatomy(species, localX, localY, pose, grainSeed, surface.detail);

        if (!sample.hit) continue;

        const x = column * cellWidth;
        const y = row * cellHeight;
        const body = sample.part === "body" || sample.part === "antenna";
        const level = shadeLevel(sample.shade);

        const tile = body
          ? colors.body
          : sample.eyespot > 0
            ? colors.accent
            : sample.edge > 0.6
              ? colors.edge[level]
              : colors.wing[level];

        context.globalAlpha = body ? 1 : 0.9 + specimen.depth * 0.08;
        context.fillStyle = tile ?? colors.body;
        context.fillRect(x, y, cellWidth, cellHeight);
        context.globalAlpha = 1;

        const glyph = glyphFor(sample, species.glyphBias + specimen.id);
        const strong = showsGlyph(sample, 0.55);

        if (!strong && sample.grain < 0.5) continue;

        const role = roleFor(sample);

        context.globalAlpha = body ? 0.95 : strong ? 0.78 + specimen.depth * 0.16 : 0.24;
        context.fillStyle = strong ? colors.glyphs[role] : colors.ink;
        context.fillText(glyph, x + cellWidth / 2, y + cellHeight / 2);
        context.globalAlpha = 1;
      }
    }
  }
}
