<script lang="ts">
  import { onMount } from "svelte";

  onMount(() => {
    const root = document.documentElement;
    const header = document.querySelector<HTMLElement>("[data-blume-header]");
    const hero = document.querySelector<HTMLElement>(".docs-home-hero");

    if (!hero) return;

    let frame = 0;

    function apply(): void {
      frame = 0;
      const active = window.scrollY < 32;

      root.dataset.uwzHero = active ? "active" : "scrolled";

      if (active) header?.setAttribute("inert", "");
      else header?.removeAttribute("inert");
    }

    function schedule(): void {
      if (!frame) frame = requestAnimationFrame(apply);
    }

    apply();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      root.removeAttribute("data-uwz-hero");
      header?.removeAttribute("inert");
    };
  });
</script>
