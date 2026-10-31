import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vite-plus/test";

async function readConfigText(): Promise<string> {
  return readFile(new URL("../../.oxlintrc.json", import.meta.url), "utf8");
}

describe("oxlint plugin configuration", () => {
  it("loads the Astro adapter and the Svelte plugin", async () => {
    const config = await readConfigText();

    expect(config).toContain(
      '{ "name": "astro", "specifier": "./tools/oxlint/astro-plugin/index.mjs" }',
    );
    expect(config).toContain('{ "name": "svelte", "specifier": "eslint-plugin-svelte" }');
  });

  it("declares the ESLint peer used by the plugins", async () => {
    const manifest = await readFile(new URL("../../package.json", import.meta.url), "utf8");

    expect(manifest).toContain('"eslint": "catalog:"');
  });

  it("scopes Astro and Svelte rules to their file types", async () => {
    const config = await readConfigText();

    expect(config).toContain('"files": ["**/*.astro"]');
    expect(config).toContain('"astro/no-exports-from-components": "error"');
    expect(config).toContain('"astro/no-prerender-export-outside-pages": "error"');
    expect(config).toContain('"files": ["**/*.svelte"]');
    expect(config).toContain('"svelte/no-add-event-listener": "error"');
    expect(config).toContain('"svelte/prefer-derived-over-derived-by": "error"');
  });
});
