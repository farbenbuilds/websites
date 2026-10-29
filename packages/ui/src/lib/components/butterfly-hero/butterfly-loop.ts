import {
  createAtmosphere,
  resizeAtmosphere,
  stepAtmosphere,
  type Atmosphere,
} from "./butterfly-atmosphere";
import {
  createField,
  densityFor,
  resizeField,
  setPointer,
  stepField,
  type AvoidBox,
  type FieldState,
} from "./butterfly-field";
import {
  createRenderer,
  drawField,
  ensureAtlas,
  readHostPalette,
  resizeRenderer,
  type FieldRenderer,
} from "./butterfly-renderer";
import { clamp } from "./butterfly-math";
import { depositDrafts, measureAvoidBoxes } from "./butterfly-loop-support";

export type ButterflyLoopOptions = {
  readonly canvas: HTMLCanvasElement;
  readonly hero: HTMLElement;
  readonly seed: number;
  readonly onReady: () => void;
  readonly onFailure: () => void;
};

export type ButterflyLoop = {
  setPaused: (paused: boolean) => void;
  destroy: () => void;
};

const STEP = 1 / 60;
const MAX_STEPS = 4;
const MAX_DELTA = 0.1;
const AVOID_REFRESH_FRAMES = 30;
const FONT_TIMEOUT_MS = 2000;

export function createButterflyLoop(options: ButterflyLoopOptions): ButterflyLoop {
  const created = createRenderer(options.canvas);

  if (!created) {
    options.onFailure();

    return {
      setPaused: () => undefined,
      destroy: () => undefined,
    };
  }

  const renderer: FieldRenderer = created;

  let field: FieldState | null = null;
  let atmosphere: Atmosphere | null = null;
  let dimBoxes: readonly AvoidBox[] = [];
  let frameHandle = 0;
  let lastTime = 0;
  let accumulator = 0;
  let frameCount = 0;
  let visible = true;
  let paused = false;
  let ready = false;
  let destroyed = false;
  let stillSimulated = false;
  let fontTimer = 0;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const resizeObserver = new ResizeObserver(() => {
    measure();

    if (reducedMotion.matches) drawStill();
    else if (paused) drawFrame();
    else schedule();
  });

  const intersectionObserver = new IntersectionObserver((entries) => {
    const entry = entries[0];
    visible = entry ? entry.isIntersecting : true;

    if (visible) schedule();
    else cancel();
  });

  const themeObserver = new MutationObserver(() => {
    renderer.palette = readHostPalette(options.hero);
    ensureAtlas(renderer);

    drawFrame();
  });

  function measure(): void {
    if (destroyed) return;
    const rect = options.canvas.getBoundingClientRect();

    if (rect.width < 1 || rect.height < 1) return;

    const dpr = window.devicePixelRatio || 1;

    const fontFamily = getComputedStyle(options.canvas).fontFamily || "ui-monospace, monospace";

    renderer.palette = readHostPalette(options.hero);
    resizeRenderer(renderer, rect.width, rect.height, dpr, fontFamily);

    const density = densityFor(renderer.cols, renderer.rows);

    if (
      !field ||
      field.specimens.length < density.specimens ||
      field.midground.length < density.midground
    ) {
      const previous = field;
      field = createField({
        width: renderer.cols,
        height: renderer.rows,
        midgroundCount: density.midground,
        specimenCount: density.specimens,
        seed: options.seed,
      });
      stillSimulated = previous !== null && reducedMotion.matches;
    } else {
      resizeField(field, renderer.cols, renderer.rows);
      field.specimens.length = Math.min(field.specimens.length, density.specimens);
      field.midground.length = Math.min(field.midground.length, density.midground);
    }

    if (!atmosphere) {
      atmosphere = createAtmosphere({
        width: renderer.cols,
        height: renderer.rows,
        pollenCount: Math.round(density.midground * 0.45),
        traceCount: 18,
        seed: options.seed + 17,
      });
    } else {
      resizeAtmosphere(atmosphere, renderer.cols, renderer.rows);
    }

    dimBoxes = measureAvoidBoxes(renderer);

    if (field) field.excluded = dimBoxes.slice();
  }

  function drawStill(): void {
    if (!field || !atmosphere || destroyed) return;

    if (!stillSimulated) {
      for (let index = 0; index < 240; index++) {
        stepField(field, STEP);
        stepAtmosphere(atmosphere, STEP);
      }

      stillSimulated = true;
    }

    drawFrame();
  }

  function drawFrame(): void {
    if (!field || !atmosphere || destroyed) return;
    ensureAtlas(renderer);
    drawField(renderer, field, atmosphere, { dimBoxes });

    if (!ready) {
      ready = true;
      options.onReady();
    }
  }

  function schedule(): void {
    if (destroyed || paused || !visible || document.hidden || reducedMotion.matches) {
      return;
    }

    cancel();
    lastTime = performance.now();
    accumulator = 0;
    frameHandle = requestAnimationFrame(frame);
  }

  function cancel(): void {
    if (frameHandle) {
      cancelAnimationFrame(frameHandle);
      frameHandle = 0;
    }
  }

  function frame(now: number): void {
    if (destroyed || paused || !visible || document.hidden || reducedMotion.matches) {
      return;
    }

    const delta = clamp((now - lastTime) / 1000, 0, MAX_DELTA);
    lastTime = now;
    accumulator += delta;

    let steps = 0;

    while (accumulator >= STEP && steps < MAX_STEPS) {
      if (field) stepField(field, STEP);

      if (atmosphere) stepAtmosphere(atmosphere, STEP);
      accumulator -= STEP;
      steps++;
    }

    if (steps === MAX_STEPS) accumulator = 0;

    if (field && atmosphere) {
      depositDrafts(field, atmosphere);

      if (frameCount % AVOID_REFRESH_FRAMES === 0) {
        dimBoxes = measureAvoidBoxes(renderer);
        field.excluded = dimBoxes.slice();
      }
    }

    drawFrame();
    frameCount++;
    frameHandle = requestAnimationFrame(frame);
  }

  function onMotionPreference(): void {
    if (reducedMotion.matches) {
      cancel();

      if (field && field.time > 0) stillSimulated = true;
      drawStill();
    } else if (!paused && visible && !document.hidden) {
      stillSimulated = false;
      schedule();
    }
  }

  function onVisibilityChange(): void {
    if (document.hidden) cancel();
    else if (visible) schedule();
  }

  function onPointerMove(event: PointerEvent): void {
    if (event.pointerType === "touch" || !field) return;
    const rect = options.canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) / renderer.cellWidth;
    const y = (event.clientY - rect.top) / renderer.cellHeight;
    setPointer(field, x, y, true);
  }

  function onPointerLeave(): void {
    if (field) setPointer(field, 0, 0, false);
  }

  function onContextLost(): void {
    cancel();
    options.onFailure();
  }

  function onContextRestored(): void {
    ready = false;
    measure();

    if (reducedMotion.matches) drawStill();
    else {
      drawFrame();
      schedule();
    }
  }

  function applyFont(): void {
    if (destroyed) return;
    renderer.atlas = null;
    renderer.atlasKey = "";
    measure();

    if (reducedMotion.matches) drawStill();
    else drawFrame();
  }

  function loadFont(): void {
    const family = getComputedStyle(options.canvas).fontFamily;

    if (!document.fonts || !family) return;
    const load = document.fonts.load(`600 16px ${family}`);

    load
      .then(() => {
        if (fontTimer) {
          window.clearTimeout(fontTimer);
          fontTimer = 0;
        }

        applyFont();
      })
      .catch(() => undefined);

    const timeout = new Promise<void>((resolve) => {
      fontTimer = window.setTimeout(resolve, FONT_TIMEOUT_MS);
    });

    void timeout.then(() => {
      if (!fontTimer) return;
      fontTimer = 0;
      applyFont();
    });
  }

  resizeObserver.observe(options.canvas);
  intersectionObserver.observe(options.hero);
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme", "class", "style"],
  });
  reducedMotion.addEventListener("change", onMotionPreference);
  document.addEventListener("visibilitychange", onVisibilityChange);
  options.hero.addEventListener("pointermove", onPointerMove, { passive: true });
  options.hero.addEventListener("pointerleave", onPointerLeave);
  options.canvas.addEventListener("contextlost", onContextLost);
  options.canvas.addEventListener("contextrestored", onContextRestored);

  measure();
  loadFont();

  if (reducedMotion.matches) drawStill();
  else {
    drawFrame();
    schedule();
  }

  return {
    setPaused: (value: boolean) => {
      paused = value;

      if (paused) {
        cancel();
        drawFrame();
      } else if (visible && !document.hidden && !reducedMotion.matches) {
        schedule();
      }
    },
    destroy: () => {
      destroyed = true;
      cancel();

      if (fontTimer) window.clearTimeout(fontTimer);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      themeObserver.disconnect();
      reducedMotion.removeEventListener("change", onMotionPreference);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      options.hero.removeEventListener("pointermove", onPointerMove);
      options.hero.removeEventListener("pointerleave", onPointerLeave);
      options.canvas.removeEventListener("contextlost", onContextLost);
      options.canvas.removeEventListener("contextrestored", onContextRestored);
    },
  };
}
