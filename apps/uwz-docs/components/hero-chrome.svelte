<script lang="ts">
  import gsap from "gsap";
  import { onMount } from "svelte";

  onMount(() => {
    const root = document.documentElement;
    const header = document.querySelector<HTMLElement>("[data-blume-header]");
    const hero = document.querySelector<HTMLElement>(".docs-home-hero");

    if (!hero) return;

    let frame = 0;

    function apply(): void {
      frame = 0;
      const threshold = Math.max(96, hero.offsetHeight - 96);
      const active = window.scrollY < threshold;

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

    const motion = gsap.matchMedia();

    motion.add(
      "(prefers-reduced-motion: no-preference)",
      () => {
        const logo = hero.querySelector<HTMLElement>("[data-hero-float]");
        const dot = hero.querySelector<HTMLElement>(".docs-home-scroll-dot");
        const halo = hero.querySelector<HTMLElement>(".docs-home-scroll-halo");
        const tweens: ReturnType<typeof gsap.to>[] = [];

        if (logo) {
          tweens.push(
            gsap.to(logo, {
              y: -5,
              duration: 3.2,
              ease: "sine.inOut",
              repeat: -1,
              yoyo: true,
            }),
          );
        }

        if (dot) {
          tweens.push(
            gsap.to(dot, {
              y: 7,
              duration: 1.25,
              ease: "sine.inOut",
              repeat: -1,
              yoyo: true,
            }),
          );
        }

        if (halo) {
          tweens.push(
            gsap.fromTo(
              halo,
              { opacity: 0.35, scale: 0.88 },
              {
                opacity: 0,
                scale: 1.22,
                duration: 1.8,
                ease: "power1.out",
                repeat: -1,
              },
            ),
          );
        }

        return () => {
          for (const tween of tweens) tween.kill();
        };
      },
      hero,
    );

    return () => {
      cancelAnimationFrame(frame);
      motion.revert();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      root.removeAttribute("data-uwz-hero");
      header?.removeAttribute("inert");
    };
  });
</script>
