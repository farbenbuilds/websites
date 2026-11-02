<script lang="ts" module>
  import type { HTMLButtonAttributes } from "svelte/elements";

  export type PlayPauseLabels = {
    readonly pause: string;
    readonly resume: string;
  };

  export type PlayPauseButtonProps = Omit<HTMLButtonAttributes, "class" | "onclick"> & {
    paused: boolean;
    labels: PlayPauseLabels;
    onToggle: () => void;
    class?: string;
    avoid?: boolean;
  };
</script>

<script lang="ts">
  import { cn } from "@farben/ui/utils.js";

  let {
    paused,
    labels,
    onToggle,
    class: className,
    avoid = false,
    ...rest
  }: PlayPauseButtonProps = $props();
</script>

<button
  type="button"
  aria-label={paused ? labels.resume : labels.pause}
  aria-pressed={paused}
  data-butterfly-avoid={avoid ? "" : undefined}
  class={cn(
    "absolute end-4 top-4 z-20 inline-flex size-9 cursor-pointer items-center justify-center border border-[var(--farben-field-muted,currentColor)] bg-[var(--farben-field-paper,transparent)] text-[var(--farben-field-accent,currentColor)] transition-colors hover:border-current hover:bg-[color-mix(in_srgb,currentColor_8%,transparent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current active:translate-y-px",
    className,
  )}
  onclick={onToggle}
  {...rest}
>
  {#if paused}
    <svg aria-hidden="true" viewBox="0 0 16 16" class="size-4 fill-current">
      <path d="M4 2.5 13.25 8 4 13.5Z"></path>
    </svg>
  {:else}
    <svg aria-hidden="true" viewBox="0 0 16 16" class="size-4 fill-current">
      <rect x="3" y="2" width="3.25" height="12"></rect>
      <rect x="9.75" y="2" width="3.25" height="12"></rect>
    </svg>
  {/if}
</button>
