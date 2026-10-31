import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vite-plus/test";

async function readText(file: string): Promise<string> {
  return readFile(new URL(`../../${file}`, import.meta.url), "utf8");
}

describe("framework formatter configuration", () => {
  it("enables Astro and Svelte formatting", async () => {
    const config = await readText(".oxfmtrc.json");

    expect(config).toContain('"astro": true');
    expect(config).toContain('"svelte": true');
  });

  it("keeps the formatter runtime packages at the root", async () => {
    const manifest = await readText("package.json");

    expect(manifest).toContain('"@astrojs/compiler-rs": "catalog:"');
    expect(manifest).toContain('"svelte": "catalog:"');
  });
});
