export type WingPoint = {
  readonly x: number;
  readonly y: number;
};

export type WingSpec = {
  readonly points: readonly WingPoint[];
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
  readonly glyphBias: number;
};

export const SPECIMEN_MAX = 5;

export const WING_RAMP = ".:-=+*#%@";
export const BODY_RAMP = ":=+*#@";
export const EDGE_RAMP = ".'`,;:";

export const SPECIES: readonly SpeciesSpec[] = [
  {
    id: "amber-facet",
    fore: {
      points: [
        { x: 0.04, y: -0.08 },
        { x: 0.22, y: -0.52 },
        { x: 1.22, y: -0.82 },
        { x: 1.08, y: -0.34 },
        { x: 0.66, y: 0.02 },
        { x: 0.18, y: 0.08 },
      ],
    },
    hind: {
      points: [
        { x: 0.05, y: 0.02 },
        { x: 0.56, y: 0 },
        { x: 1.02, y: 0.3 },
        { x: 0.92, y: 0.58 },
        { x: 0.68, y: 0.72 },
        { x: 0.42, y: 0.56 },
        { x: 0.12, y: 0.3 },
      ],
    },
    bodyWidth: 0.075,
    abdomenLength: 0.62,
    antennaReach: 0.3,
    bandCount: 3,
    bandPhase: 0.4,
    veinCount: 6,
    eyespot: { x: 0.62, y: 0.36, radius: 0.08 },
    accentMix: 0.26,
    glyphBias: 0,
  },
  {
    id: "ochre-facet",
    fore: {
      points: [
        { x: 0.04, y: -0.06 },
        { x: 0.35, y: -0.62 },
        { x: 1.12, y: -0.9 },
        { x: 1.18, y: -0.38 },
        { x: 0.62, y: 0.04 },
        { x: 0.16, y: 0.1 },
      ],
    },
    hind: {
      points: [
        { x: 0.05, y: 0 },
        { x: 0.5, y: 0.02 },
        { x: 0.95, y: 0.26 },
        { x: 1, y: 0.5 },
        { x: 0.78, y: 0.68 },
        { x: 0.4, y: 0.62 },
        { x: 0.1, y: 0.28 },
      ],
    },
    bodyWidth: 0.07,
    abdomenLength: 0.58,
    antennaReach: 0.28,
    bandCount: 2,
    bandPhase: 1.1,
    veinCount: 7,
    eyespot: { x: 0.6, y: 0.38, radius: 0.09 },
    accentMix: 0.32,
    glyphBias: 1,
  },
  {
    id: "copper-facet",
    fore: {
      points: [
        { x: 0.04, y: -0.1 },
        { x: 0.18, y: -0.46 },
        { x: 0.98, y: -0.68 },
        { x: 1.25, y: -0.28 },
        { x: 0.7, y: 0.04 },
        { x: 0.18, y: 0.08 },
      ],
    },
    hind: {
      points: [
        { x: 0.05, y: 0.02 },
        { x: 0.62, y: 0 },
        { x: 1.12, y: 0.22 },
        { x: 1.02, y: 0.52 },
        { x: 0.72, y: 0.84 },
        { x: 0.36, y: 0.6 },
        { x: 0.1, y: 0.32 },
      ],
    },
    bodyWidth: 0.07,
    abdomenLength: 0.66,
    antennaReach: 0.32,
    bandCount: 4,
    bandPhase: 2,
    veinCount: 5,
    eyespot: { x: 0.64, y: 0.34, radius: 0.075 },
    accentMix: 0.22,
    glyphBias: 2,
  },
];

export function speciesAt(index: number): SpeciesSpec {
  return SPECIES[((index % SPECIES.length) + SPECIES.length) % SPECIES.length];
}
