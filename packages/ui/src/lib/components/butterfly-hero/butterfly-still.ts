import { speciesAt, WING_RAMP } from "./butterfly-data";
import { createRng, nextRandom, randomBetween } from "./butterfly-math";
import { glyphFor } from "./butterfly-glyphs";
import {
  createAnatomyScratch,
  createSpecimenPose,
  sampleAnatomy,
  specimenHalfSpan,
} from "./butterfly-shape";

const STILL_COLS = 66;
const STILL_ROWS = 28;
const POLLEN = ".,'`";

type StillCell = {
  glyph: string;
  rank: number;
};

export function generateStill(seed: number): string {
  const grid: StillCell[][] = Array.from({ length: STILL_ROWS }, () =>
    Array.from({ length: STILL_COLS }, () => ({ glyph: " ", rank: 0 })),
  );

  const rng = createRng(seed);
  const scratch = createAnatomyScratch();

  drawSpecimen(grid, scratch, seed, 0, STILL_COLS * 0.72, STILL_ROWS * 0.3, 9.2, rng);
  drawSpecimen(grid, scratch, seed, 2, STILL_COLS * 0.25, STILL_ROWS * 0.7, 8.4, rng);
  drawSpecimen(grid, scratch, seed, 1, STILL_COLS * 0.2, STILL_ROWS * 0.22, 6.6, rng);
  drawSpecimen(grid, scratch, seed, 3, STILL_COLS * 0.8, STILL_ROWS * 0.72, 6.6, rng);
  drawSpecimen(grid, scratch, seed, 4, STILL_COLS * 0.5, STILL_ROWS * 0.48, 6, rng);

  for (let index = 0; index < 10; index++) {
    drawSpecimen(
      grid,
      scratch,
      seed + index * 13,
      index % 5,
      randomBetween(rng, 4, STILL_COLS - 4),
      randomBetween(rng, 3, STILL_ROWS - 3),
      randomBetween(rng, 1.9, 2.8),
      rng,
    );
  }

  for (let index = 0; index < 30; index++) {
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
  const reach = (halfSpan + species.antennaReach + 0.2) * scale;
  const heading = randomBetween(rng, -0.45, 0.45);
  const phase = randomBetween(rng, 0, Math.PI * 2);
  const yaw = randomBetween(rng, -0.5, 0.5);
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
