<script lang="ts">
  import { onMount } from "svelte";

  import { DEFAULT_SPECIMEN_COUNT } from "./butterfly-density";
  import { loadButterflyImages } from "./butterfly-images";
  import { createButterflyLoop, type ButterflyLoop } from "./butterfly-loop";

  type ButterflyHeroProps = {
    locale?: "en" | "vi";
    seed?: number;
    specimenCount?: number;
    spriteUrls?: readonly string[];
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
  const CONTENT_ROOT_SELECTOR = "[data-butterfly-content-root]";

  let {
    locale = "en",
    seed = 20261029,
    specimenCount = DEFAULT_SPECIMEN_COUNT,
    spriteUrls = [],
  }: ButterflyHeroProps = $props();

  let root: HTMLDivElement;
  let canvas: HTMLCanvasElement;
  let loop: ButterflyLoop | null = null;
  let ready = $state(false);
  let failed = $state(false);
  let paused = $state(false);
  let motionAllowed = $state(true);

  const copy = $derived(COPY[locale] ?? COPY.en);

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

    let active = true;
    const contentRoot = root.closest<HTMLElement>(CONTENT_ROOT_SELECTOR) ?? root;

    void loadButterflyImages(spriteUrls)
      .then((images) => {
        if (!active) return;
        loop = createButterflyLoop({
          canvas,
          hero: root,
          contentRoot,
          images,
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
      })
      .catch(() => {
        if (active) failed = true;
      });

    return () => {
      active = false;
      motionQuery.removeEventListener("change", onMotionChange);
      loop?.destroy();
      loop = null;
    };
  });
</script>

<div class="butterfly-hero" bind:this={root}>
  <div class="butterfly-hero-art" aria-hidden="true">
    <div class="butterfly-hero-still" class:is-hidden={ready && !failed}>
      {#if spriteUrls[0]}
        <img src={spriteUrls[0]} alt="" width="96" height="65" decoding="async" />
      {/if}
    </div>
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
      data-butterfly-avoid
      onclick={togglePause}
    >
      {paused ? copy.resume : copy.pause}
    </button>
  {/if}
</div>
