import {
  createAtmosphere,
  resizeAtmosphere,
  stepAtmosphere,
  type Atmosphere,
} from "./butterfly-atmosphere";
import { measureAvoidRegions } from "./butterfly-content-measurement";
import { fallbackSpecimenCount, resolveSpecimenCount } from "./butterfly-density";
import {
  createField,
  resizeField,
  setSpecimenCount,
  setPointer,
  stepField,
  type FieldState,
} from "./butterfly-field";
import {
  createRenderer,
  drawField,
  readHostPalette,
  resizeRenderer,
  type FieldRenderer,
} from "./butterfly-renderer";
import { clamp } from "./butterfly-math";
import { depositDrafts } from "./butterfly-drafts";

export type ButterflyLoopOptions = {
  readonly canvas: HTMLCanvasElement;
  readonly hero: HTMLElement;
  readonly contentRoot: HTMLElement;
  readonly images: readonly HTMLImageElement[];
  readonly seed: number;
  readonly specimenCount: number;
  readonly onReady: () => void;
  readonly onFailure: () => void;
};

export type ButterflyLoop = {
  setPaused: (paused: boolean) => void;
  destroy: () => void;
};

const STEP = 1 / 60;
const FRAME_INTERVAL = 1000 / 30;
const MAX_STEPS = 4;
const MAX_DELTA = 0.1;
const FONT_TIMEOUT_MS = 2000;
const POLLEN_COUNT = 8;
const TRACE_COUNT = 8;
const CONTENT_MEASURE_INTERVAL = 30;
const CONTENT_PADDING_CELLS = 2;
const CONTENT_MERGE_GAP_PIXELS = 160;

export function createButterflyLoop(options: ButterflyLoopOptions): ButterflyLoop {
  const created = createRenderer(options.canvas, options.images);

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
  let frameHandle = 0;
  let populationHandle = 0;
  let lastTime = 0;
  let lastDraw = 0;
  let accumulator = 0;
  let visible = true;
  let paused = false;
  let ready = false;
  let destroyed = false;
  let stillSimulated = false;
  let fontTimer = 0;
  let drawCount = 0;
  let targetSpecimenCount = fallbackSpecimenCount(options.specimenCount);

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
    targetSpecimenCount = resolveSpecimenCount(rect.width, options.specimenCount);

    if (!field) {
      field = createField({
        width: renderer.cols,
        height: renderer.rows,
        specimenCount: fallbackSpecimenCount(options.specimenCount),
        seed: options.seed,
      });
      stillSimulated = false;
    } else {
      resizeField(field, renderer.cols, renderer.rows);

      if (ready) updatePopulation();
    }

    if (!atmosphere) {
      atmosphere = createAtmosphere({
        width: renderer.cols,
        height: renderer.rows,
        pollenCount: POLLEN_COUNT,
        traceCount: TRACE_COUNT,
        seed: options.seed + 17,
      });
    } else {
      resizeAtmosphere(atmosphere, renderer.cols, renderer.rows);
    }

    refreshContentRegions();
  }

  function updatePopulation(): void {
    if (!field) return;
    setSpecimenCount(field, targetSpecimenCount, targetSpecimenCount > field.specimens.length);
  }

  function promotePopulation(): void {
    if (destroyed || populationHandle || !field) return;

    if (field.specimens.length === targetSpecimenCount) return;
    populationHandle = requestAnimationFrame(() => {
      populationHandle = 0;

      if (!destroyed) updatePopulation();
    });
  }

  function refreshContentRegions(): void {
    if (!field) return;
    field.avoidRegions = measureAvoidRegions({
      contentRoot: options.contentRoot,
      canvas: options.canvas,
      cellWidth: renderer.cellWidth,
      cellHeight: renderer.cellHeight,
      paddingCells: CONTENT_PADDING_CELLS,
      mergeGapPixels: CONTENT_MERGE_GAP_PIXELS,
    });
  }

  function drawStill(): void {
    if (!field || !atmosphere || destroyed) return;

    if (!stillSimulated) {
      for (let index = 0; index < 180; index++) {
        stepField(field, STEP);
        stepAtmosphere(atmosphere, STEP);
      }

      stillSimulated = true;
    }

    drawFrame();
  }

  function drawFrame(): void {
    if (!field || !atmosphere || destroyed) return;

    if (drawCount % CONTENT_MEASURE_INTERVAL === 0) refreshContentRegions();
    drawCount++;
    drawField(renderer, field, atmosphere);

    if (!ready) {
      ready = true;
      options.onReady();
      promotePopulation();
    }
  }

  function schedule(): void {
    if (destroyed || paused || !visible || document.hidden || reducedMotion.matches) {
      return;
    }

    cancel();
    lastTime = performance.now();
    lastDraw = 0;
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

    if (now - lastDraw < FRAME_INTERVAL) {
      frameHandle = requestAnimationFrame(frame);

      return;
    }

    const delta = clamp((now - lastTime) / 1000, 0, MAX_DELTA);
    lastTime = now;
    lastDraw = now;
    accumulator += delta;

    let steps = 0;

    while (accumulator >= STEP && steps < MAX_STEPS) {
      if (field) stepField(field, STEP);

      if (atmosphere) stepAtmosphere(atmosphere, STEP);
      accumulator -= STEP;
      steps++;
    }

    if (steps === MAX_STEPS) accumulator = 0;

    if (field && atmosphere) depositDrafts(field, atmosphere);

    drawFrame();
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

      if (populationHandle) cancelAnimationFrame(populationHandle);

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
