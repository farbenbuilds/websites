<script lang="ts">
  import { onMount } from "svelte";
  import { on } from "svelte/events";
  import { PlayPauseButton } from "@farben/ui/components/ui/play-pause-button";
  import { ScrollCue } from "@farben/ui/components/ui/scroll-cue";

  import { DEFAULT_SPECIMEN_COUNT, fallbackSpecimenCount } from "./butterfly-density";
  import { createButterflyLoop, type ButterflyLoop } from "./butterfly-loop";
  import { generateStill } from "./butterfly-still";

  type ButterflyHeroProps = {
    labels: {
      readonly pauseLabel: string;
      readonly resumeLabel: string;
      readonly scrollLabel: string;
    };
    seed?: number;
    specimenCount?: number;
    scrollHref?: string;
    scrollLabel?: string;
  };

  const PAUSE_KEY = "farben-butterfly-paused";
  const CONTENT_ROOT_SELECTOR = "[data-butterfly-content-root]";

  let {
    labels,
    seed = 20261029,
    specimenCount = DEFAULT_SPECIMEN_COUNT,
    scrollHref = "#docs-home-main",
    scrollLabel,
  }: ButterflyHeroProps = $props();

  let root: HTMLDivElement;
  let canvas: HTMLCanvasElement;
  let loop: ButterflyLoop | null = null;
  let ready = $state(false);
  let failed = $state(false);
  let paused = $state(false);
  let motionAllowed = $state(true);

  const still = $derived(generateStill(seed, fallbackSpecimenCount(specimenCount)));

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

    const removeMotionChange = on(motionQuery, "change", onMotionChange);

    try {
      paused = sessionStorage.getItem(PAUSE_KEY) === "1";
    } catch {
      paused = false;
    }

    const contentRoot = root.closest<HTMLElement>(CONTENT_ROOT_SELECTOR) ?? root;

    loop = createButterflyLoop({
      canvas,
      hero: root,
      contentRoot,
      seed,
      specimenCount,
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
      removeMotionChange();
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
  <ScrollCue href={scrollHref} label={scrollLabel ?? labels.scrollLabel} avoid />
  {#if ready && motionAllowed}
    <PlayPauseButton
      {paused}
      labels={{ pause: labels.pauseLabel, resume: labels.resumeLabel }}
      onToggle={togglePause}
      avoid
    />
  {/if}
</div>
