<script lang="ts" module>
  import type { HTMLAnchorAttributes } from "svelte/elements";

  export type ScrollCueProps = Omit<HTMLAnchorAttributes, "class"> & {
    label: string;
    class?: string;
    avoid?: boolean;
  };
</script>

<script lang="ts">
  import { cn } from "@farben/ui/utils.js";

  let { label, class: className, avoid = false, href = "#", ...rest }: ScrollCueProps = $props();
</script>

<a
  {href}
  aria-label={label}
  data-butterfly-avoid={avoid ? "" : undefined}
  class={cn(
    "group absolute bottom-6 left-1/2 z-20 inline-flex size-11 -translate-x-1/2 cursor-pointer items-center justify-center text-[var(--farben-field-accent,currentColor)] outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current max-sm:bottom-4 max-sm:left-auto max-sm:right-4 max-sm:translate-x-0",
    className,
  )}
  {...rest}
>
  <span
    class="flex h-8 w-[1.125rem] items-start justify-center overflow-hidden border border-current p-1 transition-colors group-hover:bg-[color-mix(in_srgb,currentColor_8%,transparent)]"
    aria-hidden="true"
  >
    <span class="farben-scroll-cue-dot size-1.5 shrink-0 bg-current"></span>
  </span>
</a>
