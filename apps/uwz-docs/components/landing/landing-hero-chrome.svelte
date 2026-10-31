<script lang="ts">
  import { onMount } from "svelte";
  import { on } from "svelte/events";

  onMount(() => {
    const root = document.documentElement;
    const header = document.querySelector<HTMLElement>("[data-blume-header]");
    const hero = document.querySelector<HTMLElement>(".docs-home-hero");
    const dialog = document.querySelector<HTMLDialogElement>("[data-blume-search-dialog]");

    if (!hero) return;

    let heroVisible = true;
    let dialogOpen = false;

    function apply(active: boolean): void {
      const hidden = active && !dialogOpen;

      root.dataset.uwzHero = hidden ? "active" : "scrolled";

      if (hidden) header?.setAttribute("inert", "");
      else header?.removeAttribute("inert");
    }

    function revealForSearch(event: KeyboardEvent): void {
      if (!heroVisible) return;

      const target = event.target;

      const isField =
        target instanceof HTMLElement &&
        (target.isContentEditable || target.tagName === "INPUT" || target.tagName === "TEXTAREA");

      const isSearch =
        ((event.key === "k" || event.key === "K") &&
          (event.metaKey || event.ctrlKey) &&
          !event.shiftKey &&
          !event.altKey) ||
        (event.key === "/" && !isField);

      if (isSearch) apply(false);
    }

    function onDialogToggle(): void {
      if (!dialog) return;
      dialogOpen = dialog.open;
      apply(heroVisible);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        heroVisible = entries[0]?.isIntersecting ?? false;
        apply(heroVisible);
      },
      { threshold: 0 },
    );

    observer.observe(hero);
    const removeKeydown = on(document, "keydown", revealForSearch, { capture: true });
    const removeDialogToggle = dialog ? on(dialog, "toggle", onDialogToggle) : undefined;

    const rect = hero.getBoundingClientRect();
    apply(rect.bottom > 0 && rect.top < window.innerHeight);

    return () => {
      observer.disconnect();
      removeKeydown();
      removeDialogToggle?.();
      root.removeAttribute("data-uwz-hero");
      header?.removeAttribute("inert");
    };
  });
</script>
