import type { FieldState } from "./butterfly-field";

export type SpecimenSurface = {
  readonly context: CanvasRenderingContext2D;
  readonly cellWidth: number;
  readonly cellHeight: number;
  readonly images: readonly HTMLImageElement[];
};

const SPECIMEN_WIDTH_CELLS = 2.6;

export function drawSpecimens(surface: SpecimenSurface, field: FieldState): void {
  const { context, cellWidth, cellHeight, images } = surface;
  context.imageSmoothingEnabled = false;

  // Smallest and farthest specimens first; the big ones fly over them.
  for (let index = field.specimens.length - 1; index >= 0; index -= 1) {
    const specimen = field.specimens[index];
    const image = images[specimen.species % images.length];

    if (!image || image.naturalWidth === 0) continue;
    const width = specimen.scale * cellWidth * SPECIMEN_WIDTH_CELLS;
    const height = width * (image.naturalHeight / image.naturalWidth);
    const flap = 0.84 + 0.16 * Math.abs(Math.cos(specimen.phase));

    context.save();
    context.translate(specimen.x * cellWidth, specimen.y * cellHeight);
    context.rotate(specimen.heading + Math.PI / 2 + specimen.yaw * 0.12);
    context.scale(flap, 1);
    context.globalAlpha = 0.68 + specimen.depth * 0.32;
    context.drawImage(image, -width / 2, -height / 2, width, height);
    context.restore();
  }

  context.imageSmoothingEnabled = true;
}
