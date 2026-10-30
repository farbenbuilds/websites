import { clamp, createRng, nextRandom, randomBetween, wrap, type Rng } from "./butterfly-math.ts";

export type Pollen = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  phase: number;
  frequency: number;
  size: number;
  alpha: number;
};

export type AirTrace = {
  x: number;
  y: number;
  heading: number;
  life: number;
  maxLife: number;
  length: number;
  glyph: string;
};

export type WingBreeze = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  glyph: string;
};

export type Atmosphere = {
  width: number;
  height: number;
  draft: Float32Array;
  draftTmp: Float32Array;
  pollen: Pollen[];
  traces: AirTrace[];
  breeze: WingBreeze[];
  rng: Rng;
  time: number;
};

export type AtmosphereOptions = {
  readonly width: number;
  readonly height: number;
  readonly pollenCount: number;
  readonly traceCount: number;
  readonly seed: number;
};

const TRACE_GLYPHS = [".", "'", "`", "-", ","];
const BREEZE_GLYPHS = [",", "'", "`"];
const BREEZE_POOL = 64;

export function createAtmosphere(options: AtmosphereOptions): Atmosphere {
  const width = Math.max(1, Math.round(options.width));
  const height = Math.max(1, Math.round(options.height));
  const rng = createRng(options.seed);
  const count = width * height;

  const atmosphere: Atmosphere = {
    width,
    height,
    draft: new Float32Array(count),
    draftTmp: new Float32Array(count),
    pollen: [],
    traces: [],
    breeze: Array.from({ length: BREEZE_POOL }, () => ({
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      life: 0,
      maxLife: 1,
      glyph: ",",
    })),
    rng,
    time: 0,
  };

  for (let i = 0; i < options.pollenCount; i++) {
    atmosphere.pollen.push({
      x: nextRandom(rng) * width,
      y: nextRandom(rng) * height,
      vx: randomBetween(rng, -0.25, 0.25),
      vy: randomBetween(rng, -0.12, 0.12),
      phase: nextRandom(rng) * Math.PI * 2,
      frequency: randomBetween(rng, 0.3, 1.2),
      size: nextRandom(rng) < 0.84 ? 1 : 2,
      alpha: randomBetween(rng, 0.12, 0.4),
    });
  }

  for (let i = 0; i < options.traceCount; i++) {
    atmosphere.traces.push(createTrace(atmosphere, true));
  }

  return atmosphere;
}

function createTrace(atmosphere: Atmosphere, initial: boolean): AirTrace {
  const life = initial
    ? randomBetween(atmosphere.rng, 0.4, 2)
    : randomBetween(atmosphere.rng, 0.8, 2.2);

  return {
    x: nextRandom(atmosphere.rng) * atmosphere.width,
    y: nextRandom(atmosphere.rng) * atmosphere.height,
    heading: randomBetween(atmosphere.rng, -Math.PI, Math.PI),
    life,
    maxLife: life,
    length: randomBetween(atmosphere.rng, 1.5, 4.5),
    glyph: TRACE_GLYPHS[Math.floor(nextRandom(atmosphere.rng) * TRACE_GLYPHS.length)] ?? ".",
  };
}

export function resizeAtmosphere(atmosphere: Atmosphere, width: number, height: number): void {
  const nextWidth = Math.max(1, Math.round(width));
  const nextHeight = Math.max(1, Math.round(height));

  if (nextWidth === atmosphere.width && nextHeight === atmosphere.height) return;

  const count = nextWidth * nextHeight;
  atmosphere.draft = new Float32Array(count);
  atmosphere.draftTmp = new Float32Array(count);
  atmosphere.width = nextWidth;
  atmosphere.height = nextHeight;

  for (const mote of atmosphere.pollen) {
    mote.x = wrap(mote.x, nextWidth);
    mote.y = wrap(mote.y, nextHeight);
  }

  for (const trace of atmosphere.traces) {
    trace.x = wrap(trace.x, nextWidth);
    trace.y = wrap(trace.y, nextHeight);
  }

  for (const breeze of atmosphere.breeze) {
    breeze.life = 0;
  }
}

export function depositDraft(
  atmosphere: Atmosphere,
  x: number,
  y: number,
  amount: number,
  radius: number,
): void {
  const centerX = Math.floor(x);
  const centerY = Math.floor(y);
  const reach = Math.ceil(radius);

  for (let row = centerY - reach; row <= centerY + reach; row++) {
    if (row < 0 || row >= atmosphere.height) continue;

    for (let column = centerX - reach; column <= centerX + reach; column++) {
      if (column < 0 || column >= atmosphere.width) continue;
      const distance = Math.hypot(column - centerX, row - centerY);

      if (distance > radius) continue;
      const index = row * atmosphere.width + column;
      const value = atmosphere.draft[index] ?? 0;
      atmosphere.draft[index] = Math.min(1.8, value + amount * (1 - distance / (radius + 1)));
    }
  }
}

export function emitBreeze(
  atmosphere: Atmosphere,
  x: number,
  y: number,
  vx: number,
  vy: number,
): void {
  const slot = atmosphere.breeze.find((breeze) => breeze.life <= 0);

  if (!slot) return;
  slot.x = x;
  slot.y = y;
  slot.vx = vx;
  slot.vy = vy;
  slot.maxLife = randomBetween(atmosphere.rng, 0.45, 0.85);
  slot.life = slot.maxLife;
  slot.glyph = BREEZE_GLYPHS[Math.floor(nextRandom(atmosphere.rng) * BREEZE_GLYPHS.length)] ?? ",";
}

export function emitTrace(atmosphere: Atmosphere, x: number, y: number, heading: number): void {
  const trace = atmosphere.traces.pop();

  if (!trace) return;
  trace.x = x;
  trace.y = y;
  trace.heading = heading;
  trace.life = randomBetween(atmosphere.rng, 0.6, 1.7);
  trace.maxLife = trace.life;
  trace.length = randomBetween(atmosphere.rng, 1.5, 4);
  trace.glyph = TRACE_GLYPHS[Math.floor(nextRandom(atmosphere.rng) * TRACE_GLYPHS.length)] ?? ".";
  atmosphere.traces.unshift(trace);
}

export function stepAtmosphere(atmosphere: Atmosphere, dt: number): void {
  atmosphere.time += dt;
  diffuseDraft(atmosphere, dt);

  const windX = Math.sin(atmosphere.time * 0.11) * 0.09;
  const windY = Math.cos(atmosphere.time * 0.08) * 0.05;

  for (const mote of atmosphere.pollen) {
    mote.phase += mote.frequency * dt;
    mote.x += (mote.vx + windX) * dt;
    mote.y += (mote.vy + windY + Math.sin(mote.phase) * 0.05) * dt;
    mote.x = wrap(mote.x, atmosphere.width);
    mote.y = wrap(mote.y, atmosphere.height);
  }

  for (const breeze of atmosphere.breeze) {
    if (breeze.life <= 0) continue;
    breeze.life -= dt;
    breeze.x += breeze.vx * dt;
    breeze.y += breeze.vy * dt;
    const drag = Math.exp(-dt * 2.4);
    breeze.vx *= drag;
    breeze.vy *= drag;
  }

  for (const trace of atmosphere.traces) {
    trace.life -= dt;
    trace.x += Math.cos(trace.heading) * dt * 1.8;
    trace.y += Math.sin(trace.heading) * dt * 1.8;

    if (trace.life <= 0) {
      trace.life = randomBetween(atmosphere.rng, 0.8, 2.4);
      trace.maxLife = trace.life;
      trace.x = nextRandom(atmosphere.rng) * atmosphere.width;
      trace.y = nextRandom(atmosphere.rng) * atmosphere.height;
      trace.heading = randomBetween(atmosphere.rng, -Math.PI, Math.PI);
    }
  }
}

function diffuseDraft(atmosphere: Atmosphere, dt: number): void {
  const { width, height, draft, draftTmp } = atmosphere;
  const decay = Math.exp(-dt * 1.7);

  for (let row = 0; row < height; row++) {
    for (let column = 0; column < width; column++) {
      const index = row * width + column;
      const left = column > 0 ? (draft[index - 1] ?? 0) : (draft[index] ?? 0);

      const right = column < width - 1 ? (draft[index + 1] ?? 0) : (draft[index] ?? 0);

      const up = row > 0 ? (draft[index - width] ?? 0) : (draft[index] ?? 0);

      const down = row < height - 1 ? (draft[index + width] ?? 0) : (draft[index] ?? 0);

      draftTmp[index] = ((draft[index] ?? 0) * 4 + left + right + up + down) * 0.125 * decay;
    }
  }

  atmosphere.draft = draftTmp;
  atmosphere.draftTmp = draft;
}

export function draftAt(atmosphere: Atmosphere, x: number, y: number): number {
  const column = Math.floor(x);
  const row = Math.floor(y);

  if (column < 0 || row < 0 || column >= atmosphere.width || row >= atmosphere.height) {
    return 0;
  }

  return clamp(atmosphere.draft[row * atmosphere.width + column] ?? 0, 0, 1);
}
