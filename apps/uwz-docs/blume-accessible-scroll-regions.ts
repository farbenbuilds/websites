import type { defineConfig } from "blume";

type AstroIntegration = NonNullable<Parameters<typeof defineConfig>[0]["integrations"]>[number];

// Wide tables and diagrams become horizontal scroll regions; they need a tab
// stop so keyboard users can reach the overflow. Mermaid renders after load, so
// a mutation observer rechecks the wrappers when the SVG arrives.
export const accessibleScrollRegions: AstroIntegration = {
  name: "uwz-accessible-scroll-regions",
  hooks: {
    "astro:config:setup": ({ injectScript }) => {
      injectScript(
        "head-inline",
        `{
          let queued = false;
          const update = () => {
            queued = false;
            for (const region of document.querySelectorAll(".prose table, .prose blume-mermaid")) {
              if (region.scrollWidth > region.clientWidth + 1) {
                region.setAttribute("tabindex", "0");
              } else {
                region.removeAttribute("tabindex");
              }
            }
          };
          const schedule = () => {
            if (queued) return;
            queued = true;
            requestAnimationFrame(update);
          };
          const start = () => {
            update();
            const main = document.querySelector("main");
            if (main) {
              if ("ResizeObserver" in window) {
                new ResizeObserver(schedule).observe(main);
              }
              if ("MutationObserver" in window) {
                new MutationObserver(schedule).observe(main, {
                  childList: true,
                  subtree: true,
                });
              }
            }
            window.addEventListener("resize", schedule, { passive: true });
            document.fonts?.ready.then(schedule);
          };
          if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", start, { once: true });
          } else {
            start();
          }
        }`,
      );
    },
  },
};
