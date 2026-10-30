import { speciesAt, type SpeciesSpec } from "./butterfly-data.ts";
import type { FieldState } from "./butterfly-field.ts";
import { glyphFor, roleFor, showsGlyph } from "./butterfly-glyphs.ts";
import {
  createSpecimenPose,
  sampleAnatomy,
  specimenHalfHeight,
  specimenHalfSpan,
  type AnatomySample,
  type AnatomyScratch,
} from "./butterfly-shape.ts";
import {
  butterflyBodyColor,
  butterflyPatternColor,
  inkFor,
  rgb,
  type ButterflyPalette,
  type InkRole,
  type WingPatternRole,
} from "./butterfly-palette.ts";

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
  readonly base: readonly string[];
  readonly hind: readonly string[];
  readonly highlight: readonly string[];
  readonly band: readonly string[];
  readonly eyespot: readonly string[];
  readonly body: string;
  readonly ink: string;
  readonly glyphs: Readonly<Record<InkRole, string>>;
};

function shadeLevel(shade: number): number {
  return Math.max(0, Math.min(SHADE_LEVELS - 1, Math.floor(shade * SHADE_LEVELS)));
}

function shadeColors(
  palette: ButterflyPalette,
  speciesIndex: number,
  role: WingPatternRole,
): readonly string[] {
  return Array.from({ length: SHADE_LEVELS }, (_value, level) => {
    const shade = (level + 0.5) / SHADE_LEVELS;

    return rgb(butterflyPatternColor(palette, speciesIndex, shade, role));
  });
}

function createSpecimenColors(
  palette: ButterflyPalette,
  species: SpeciesSpec,
  speciesIndex: number,
): SpecimenColors {
  return {
    base: shadeColors(palette, speciesIndex, "base"),
    hind: shadeColors(palette, speciesIndex, "hind"),
    highlight: shadeColors(palette, speciesIndex, "highlight"),
    band: shadeColors(palette, speciesIndex, "band"),
    eyespot: shadeColors(palette, speciesIndex, "eyespot"),
    body: rgb(butterflyBodyColor(palette)),
    ink: rgb(palette.ink),
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

function tileFor(sample: AnatomySample, colors: SpecimenColors): string {
  if (sample.part === "body" || sample.part === "antenna") return colors.body;

  const level = shadeLevel(sample.shade);

  if (sample.eyespot > 0) return colors.eyespot[level] ?? colors.body;

  if (sample.band > 0) return colors.band[level] ?? colors.body;

  if (sample.edge > 0.62) return colors.highlight[level] ?? colors.body;

  if (sample.part === "hind") return colors.hind[level] ?? colors.body;

  return colors.base[level] ?? colors.body;
}

export function drawSpecimens(
  surface: SpecimenSurface,
  field: FieldState,
  cache: Map<number, SpecimenColors>,
): void {
  const { context, cellWidth, cellHeight, palette } = surface;
  context.font = `600 ${Math.round(cellHeight * 0.76)}px ${surface.fontFamily}`;

  // Smallest and farthest specimens first; the big ones fly over them.
  for (let index = field.specimens.length - 1; index >= 0; index -= 1) {
    const specimen = field.specimens[index];

    if (!specimen) continue;

    const species = speciesAt(specimen.species);

    const colors =
      cache.get(specimen.species) ?? createSpecimenColors(palette, species, specimen.species);

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
    const fade = specimen.scale * 1.2;

    const edgeAlpha = Math.min(
      1,
      Math.max(0, (specimen.y + fade) / fade),
      Math.max(
        0,
        (surface.rows * cellHeight + fade - specimen.y * cellHeight) / (fade * cellHeight),
      ),
    );

    if (edgeAlpha <= 0.01) continue;

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

        context.globalAlpha = (body ? 1 : 0.9 + specimen.depth * 0.08) * edgeAlpha;
        context.fillStyle = tileFor(sample, colors);
        context.fillRect(x, y, cellWidth, cellHeight);
        context.globalAlpha = 1;

        const glyph = glyphFor(sample, species.glyphBias + specimen.id);
        const strong = showsGlyph(sample, 0.55);

        if (!strong && sample.grain < 0.5) continue;

        context.globalAlpha =
          (body ? 0.95 : strong ? 0.78 + specimen.depth * 0.16 : 0.24) * edgeAlpha;
        context.fillStyle = strong ? colors.glyphs[roleFor(sample)] : colors.ink;
        context.fillText(glyph, x + cellWidth / 2, y + cellHeight / 2);
        context.globalAlpha = 1;
      }
    }
  }
}
