import { speciesAt, WING_RAMP } from "./butterfly-data";
import { createRng, nextRandom, randomBetween } from "./butterfly-math";
import { glyphFor } from "./butterfly-glyphs";
import {
  createAnatomyScratch,
  createSpecimenPose,
  sampleAnatomy,
  specimenHalfHeight,
  specimenHalfSpan,
} from "./butterfly-shape";

const STILL_COLS = 64;
const STILL_ROWS = 30;
const POLLEN = ".,'`";

type StillCell = {
  glyph: string;
  rank: number;
};

export function generateStill(seed: number, specimenCount = 8): string {
  const grid: StillCell[][] = Array.from({ length: STILL_ROWS }, () =>
    Array.from({ length: STILL_COLS }, () => ({ glyph: " ", rank: 0 })),
  );

  const rng = createRng(seed);
  const scratch = createAnatomyScratch();
  const count = Math.max(1, Math.min(8, Math.round(specimenCount)));

  const placements = [
    { x: 0.7, y: 0.38, scale: 7.4 },
    { x: 0.28, y: 0.58, scale: 6.4 },
    { x: 0.5, y: 0.82, scale: 5.6 },
    { x: 0.18, y: 0.26, scale: 5.2 },
    { x: 0.82, y: 0.72, scale: 4.9 },
    { x: 0.82, y: 0.24, scale: 4.6 },
    { x: 0.12, y: 0.66, scale: 4.4 },
    { x: 0.5, y: 0.48, scale: 3.2 },
  ] as const;

  for (let index = 0; index < count; index++) {
    const placement = placements[index] ?? placements[0];

    drawSpecimen(
      grid,
      scratch,
      seed,
      index,
      STILL_COLS * placement.x,
      STILL_ROWS * placement.y,
      placement.scale,
      rng,
    );
  }

  for (let index = 0; index < 22; index++) {
    const column = Math.floor(nextRandom(rng) * STILL_COLS);
    const row = Math.floor(nextRandom(rng) * STILL_ROWS);

    if (grid[row]?.[column]?.glyph !== " ") continue;
    const glyph = POLLEN[Math.floor(nextRandom(rng) * POLLEN.length)] ?? ".";
    grid[row][column] = { glyph, rank: 0 };
  }

  const lines = grid.map((row) =>
    row
      .map((cell) => cell.glyph)
      .join("")
      .replace(/\s+$/, ""),
  );

  while (lines.length > 0 && lines[0] === "") lines.shift();

  while (lines.length > 0 && lines[lines.length - 1] === "") lines.pop();

  return lines.join("\n");
}

function drawSpecimen(
  grid: StillCell[][],
  scratch: ReturnType<typeof createAnatomyScratch>,
  seed: number,
  speciesIndex: number,
  centerX: number,
  centerY: number,
  scale: number,
  rng: ReturnType<typeof createRng>,
): void {
  const species = speciesAt(speciesIndex);
  const halfSpan = specimenHalfSpan(species);
  const reach = (Math.max(halfSpan, specimenHalfHeight(species)) + 0.2) * scale;
  const heading = randomBetween(rng, -0.3, 0.3) + Math.PI / 2;
  const phase = randomBetween(rng, 0, Math.PI * 2);
  const yaw = randomBetween(rng, -0.35, 0.35);
  const cos = Math.cos(heading);
  const sin = Math.sin(heading);
  const pose = createSpecimenPose(phase, yaw);
  const grainSeed = seed + speciesIndex * 41;

  const startColumn = Math.max(0, Math.floor(centerX - reach));
  const endColumn = Math.min(STILL_COLS - 1, Math.ceil(centerX + reach));
  const startRow = Math.max(0, Math.floor(centerY - reach));
  const endRow = Math.min(STILL_ROWS - 1, Math.ceil(centerY + reach));

  for (let row = startRow; row <= endRow; row++) {
    for (let column = startColumn; column <= endColumn; column++) {
      const dx = column + 0.5 - centerX;
      const dy = row + 0.5 - centerY;
      const localX = (cos * dx + sin * dy) / scale;
      const localY = (-sin * dx + cos * dy) / scale;

      const sample = sampleAnatomy(species, localX, localY, pose, grainSeed, scratch);

      if (!sample.hit) continue;

      const glyph = glyphFor(sample, species.glyphBias + speciesIndex);
      const rank = sample.part === "body" ? 4 : sample.eyespot > 0 ? 5 : 3;
      const current = grid[row]?.[column];

      if (!current) continue;

      if (current.rank > rank) continue;

      const textured =
        sample.part === "fore" || sample.part === "hind"
          ? (WING_RAMP[
              Math.min(
                WING_RAMP.length - 1,
                Math.floor(sample.grain * WING_RAMP.length + sample.shade * 2),
              )
            ] ?? glyph)
          : glyph;

      grid[row][column] = { glyph: textured, rank };
    }
  }
}
