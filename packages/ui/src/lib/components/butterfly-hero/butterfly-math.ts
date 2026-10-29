export type Rng = {
  state: number;
};

export function clamp(value: number, min: number, max: number): number {
  return value < min ? min : value > max ? max : value;
}

export function mix(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function smoothstep(edge0: number, edge1: number, value: number): number {
  const t = clamp((value - edge0) / (edge1 - edge0), 0, 1);

  return t * t * (3 - 2 * t);
}

export function hash2(a: number, b: number, seed: number): number {
  let h = (a | 0) * 374761393 + (b | 0) * 668265263 + (seed | 0) * 2147483647;
  h = (h ^ (h >>> 13)) * 1274126177;
  h = h ^ (h >>> 16);

  return (h >>> 0) / 4294967295;
}

export function hash3(a: number, b: number, c: number): number {
  return hash2(a, b, c);
}

export function createRng(seed: number): Rng {
  return { state: seed >>> 0 };
}

export function nextRandom(rng: Rng): number {
  let t = (rng.state = (rng.state + 0x6d2b79f5) >>> 0);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);

  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

export function randomBetween(rng: Rng, min: number, max: number): number {
  return min + nextRandom(rng) * (max - min);
}

export function angleDelta(a: number, b: number): number {
  let delta = a - b;

  while (delta > Math.PI) delta -= Math.PI * 2;

  while (delta < -Math.PI) delta += Math.PI * 2;

  return delta;
}

export function wrap(value: number, limit: number): number {
  if (limit <= 0) return 0;
  const wrapped = value % limit;

  return wrapped < 0 ? wrapped + limit : wrapped;
}

export function softLimit(value: number, limit: number, margin: number): number {
  if (value < margin) return (margin - value) / margin;

  if (value > limit - margin) return (value - (limit - margin)) / margin;

  return 0;
}
