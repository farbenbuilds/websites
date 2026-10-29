<script lang="ts">
  import { onMount } from "svelte";

  import { createButterflyLoop, type ButterflyLoop } from "./butterfly-loop";
  import { generateStill } from "./butterfly-still";

  type ButterflyHeroProps = {
    locale?: "en" | "vi";
    seed?: number;
    specimenCount?: number;
  };

  const COPY = {
    en: {
      pause: "Pause",
      resume: "Resume",
      pauseLabel: "Pause butterfly animation",
      resumeLabel: "Resume butterfly animation",
    },
    vi: {
      pause: "Tạm dừng",
      resume: "Tiếp tục",
      pauseLabel: "Tạm dừng hoạt ảnh bướm",
      resumeLabel: "Tiếp tục hoạt ảnh bướm",
    },
  } as const;

  const PAUSE_KEY = "farben-butterfly-paused";

  let { locale = "en", seed = 20261029, specimenCount = 5 }: ButterflyHeroProps = $props();
  let root: HTMLDivElement;
  let canvas: HTMLCanvasElement;
  let loop: ButterflyLoop | null = null;
  let ready = $state(false);
  let failed = $state(false);
  let paused = $state(false);
  let motionAllowed = $state(true);

  const copy = $derived(COPY[locale] ?? COPY.en);
  const still = $derived(generateStill(seed, specimenCount));

  function togglePause(): void {
    paused = !paused;
    loop?.setPaused(paused);

    try {
      sessionStorage.setItem(PAUSE_KEY, paused ? "1" : "0");
    } catch {
      // Private browsing can deny session storage; the control still works.
    }
  }

  onMount(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    motionAllowed = !motionQuery.matches;

    const onMotionChange = (): void => {
      motionAllowed = !motionQuery.matches;
    };

    motionQuery.addEventListener("change", onMotionChange);

    try {
      paused = sessionStorage.getItem(PAUSE_KEY) === "1";
    } catch {
      paused = false;
    }

    loop = createButterflyLoop({
      canvas,
      hero: root,
      seed,
      specimenCount: Math.max(1, Math.min(5, Math.round(specimenCount))),
      onReady: () => {
        ready = true;
        failed = false;
      },
      onFailure: () => {
        ready = false;
        failed = true;
      },
    });
    loop.setPaused(paused);

    return () => {
      motionQuery.removeEventListener("change", onMotionChange);
      loop?.destroy();
      loop = null;
    };
  });
</script>

<div class="butterfly-hero" bind:this={root}>
  <div class="butterfly-hero-art" aria-hidden="true">
    <pre class="butterfly-hero-still" class:is-hidden={ready && !failed}>{still}</pre>
    <canvas
      class="butterfly-hero-canvas pointer-events-none"
      class:is-ready={ready && !failed}
      aria-hidden="true"
      bind:this={canvas}
    ></canvas>
  </div>
  {#if ready && motionAllowed}
    <button
      type="button"
      class="editorial-square pointer-events-auto absolute bottom-3 end-3 z-10 gap-2 bg-background px-3 font-mono text-[0.62rem] uppercase tracking-[0.1em]"
      aria-label={paused ? copy.resumeLabel : copy.pauseLabel}
      aria-pressed={paused}
      onclick={togglePause}
    >
      {paused ? copy.resume : copy.pause}
    </button>
  {/if}
</div>
