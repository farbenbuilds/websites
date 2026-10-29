export type WingSpec = {
  readonly cx: number;
  readonly cy: number;
  readonly rx: number;
  readonly ry: number;
  readonly lobes: number;
  readonly scallop: number;
  readonly tipAngle: number;
  readonly tipReach: number;
};

export type EyespotSpec = {
  readonly x: number;
  readonly y: number;
  readonly radius: number;
};

export type SpeciesSpec = {
  readonly id: string;
  readonly fore: WingSpec;
  readonly hind: WingSpec;
  readonly bodyWidth: number;
  readonly abdomenLength: number;
  readonly antennaReach: number;
  readonly bandCount: number;
  readonly bandPhase: number;
  readonly veinCount: number;
  readonly eyespot: EyespotSpec;
  readonly accentMix: number;
  readonly inkMix: number;
  readonly glyphBias: number;
};

export const PHASE_COUNT = 3;
export const SPECIMEN_MAX = 4;

export const WING_RAMP = ".:-=+*#%@";
export const BODY_RAMP = ":=+*#@";
export const EDGE_RAMP = ".'`,;:";
export const MOTES = ".,'`";

export const SPECIES: readonly SpeciesSpec[] = [
  {
    id: "amber-swallowtail",
    fore: {
      cx: 0.6,
      cy: -0.22,
      rx: 0.64,
      ry: 0.48,
      lobes: 3,
      scallop: 0.18,
      tipAngle: -0.72,
      tipReach: 0.2,
    },
    hind: {
      cx: 0.5,
      cy: 0.3,
      rx: 0.52,
      ry: 0.42,
      lobes: 4,
      scallop: 0.16,
      tipAngle: 1.1,
      tipReach: 0.14,
    },
    bodyWidth: 0.056,
    abdomenLength: 0.66,
    antennaReach: 0.36,
    bandCount: 3,
    bandPhase: 0.4,
    veinCount: 7,
    eyespot: { x: 0.74, y: 0.4, radius: 0.085 },
    accentMix: 0.2,
    inkMix: 0.62,
    glyphBias: 0,
  },
  {
    id: "ochre-ringlet",
    fore: {
      cx: 0.56,
      cy: -0.18,
      rx: 0.58,
      ry: 0.52,
      lobes: 4,
      scallop: 0.2,
      tipAngle: -0.5,
      tipReach: 0.13,
    },
    hind: {
      cx: 0.48,
      cy: 0.28,
      rx: 0.5,
      ry: 0.44,
      lobes: 5,
      scallop: 0.18,
      tipAngle: 1.3,
      tipReach: 0.1,
    },
    bodyWidth: 0.062,
    abdomenLength: 0.6,
    antennaReach: 0.32,
    bandCount: 4,
    bandPhase: 1.2,
    veinCount: 8,
    eyespot: { x: 0.7, y: 0.42, radius: 0.095 },
    accentMix: 0.28,
    inkMix: 0.54,
    glyphBias: 1,
  },
  {
    id: "copper-moon",
    fore: {
      cx: 0.62,
      cy: -0.26,
      rx: 0.6,
      ry: 0.44,
      lobes: 3,
      scallop: 0.17,
      tipAngle: -0.9,
      tipReach: 0.24,
    },
    hind: {
      cx: 0.46,
      cy: 0.32,
      rx: 0.48,
      ry: 0.4,
      lobes: 3,
      scallop: 0.19,
      tipAngle: 1.5,
      tipReach: 0.18,
    },
    bodyWidth: 0.05,
    abdomenLength: 0.72,
    antennaReach: 0.4,
    bandCount: 2,
    bandPhase: 2.1,
    veinCount: 6,
    eyespot: { x: 0.78, y: 0.38, radius: 0.07 },
    accentMix: 0.34,
    inkMix: 0.7,
    glyphBias: 2,
  },
  {
    id: "saffron-skipper",
    fore: {
      cx: 0.52,
      cy: -0.14,
      rx: 0.52,
      ry: 0.44,
      lobes: 5,
      scallop: 0.17,
      tipAngle: -0.4,
      tipReach: 0.1,
    },
    hind: {
      cx: 0.44,
      cy: 0.24,
      rx: 0.44,
      ry: 0.38,
      lobes: 5,
      scallop: 0.19,
      tipAngle: 1.2,
      tipReach: 0.08,
    },
    bodyWidth: 0.066,
    abdomenLength: 0.54,
    antennaReach: 0.28,
    bandCount: 5,
    bandPhase: 0.8,
    veinCount: 9,
    eyespot: { x: 0.64, y: 0.36, radius: 0.075 },
    accentMix: 0.16,
    inkMix: 0.48,
    glyphBias: 3,
  },
  {
    id: "ash-marbled",
    fore: {
      cx: 0.58,
      cy: -0.2,
      rx: 0.56,
      ry: 0.5,
      lobes: 4,
      scallop: 0.16,
      tipAngle: -0.6,
      tipReach: 0.16,
    },
    hind: {
      cx: 0.5,
      cy: 0.3,
      rx: 0.5,
      ry: 0.46,
      lobes: 4,
      scallop: 0.2,
      tipAngle: 1.35,
      tipReach: 0.12,
    },
    bodyWidth: 0.058,
    abdomenLength: 0.64,
    antennaReach: 0.34,
    bandCount: 3,
    bandPhase: 1.7,
    veinCount: 7,
    eyespot: { x: 0.72, y: 0.44, radius: 0.08 },
    accentMix: 0.12,
    inkMix: 0.58,
    glyphBias: 4,
  },
];

export const SPECIMEN_SPECIES: readonly number[] = [0, 1, 2, 3];
export const MIDGROUND_SPECIES: readonly number[] = [0, 1, 2, 3, 4];

export function speciesAt(index: number): SpeciesSpec {
  return SPECIES[((index % SPECIES.length) + SPECIES.length) % SPECIES.length];
}
