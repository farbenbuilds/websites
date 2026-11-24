import type { defineConfig } from "blume";

type AstroIntegration = NonNullable<Parameters<typeof defineConfig>[0]["integrations"]>[number];

// Blume's generated .blume runtime does not list svelte, so Astro dev SSR
// bundles a second Svelte server runtime for components while the externalized
// Svelte renderer keeps the Node copy. Each copy owns its SSR context, which
// breaks push_element in dev.
// https://github.com/sveltejs/svelte/issues/16914
export const svelteSsrExternal: AstroIntegration = {
  name: "uwz-svelte-ssr-external",
  hooks: {
    "astro:config:setup": ({ command, updateConfig }) => {
      if (command !== "dev") return;

      updateConfig({ vite: { ssr: { external: ["svelte"] } } });
    },
  },
};
