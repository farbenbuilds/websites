import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vite-plus/test";

const LANDING_COMPONENTS = new URL("../../apps/uwz-docs/components/landing/", import.meta.url);

async function componentSource(component: string): Promise<string> {
  return readFile(new URL(component, LANDING_COMPONENTS), "utf8");
}

function tags(source: string, name: string): readonly string[] {
  return [...source.matchAll(new RegExp(`<${name}\\b[^>]*>`, "g"))].map(([tag]) => tag);
}

describe("uwz landing image loading", () => {
  it("keeps the hero mark eager", async () => {
    const [tag] = tags(await componentSource("landing-hero.astro"), "img");

    expect(tag).toBeDefined();
    expect(tag).toContain('loading="eager"');
    expect(tag).not.toContain('loading="lazy"');
  });

  it("optimizes and defers below-fold raster images", async () => {
    for (const component of ["landing-author.astro", "landing-sponsor.astro"]) {
      const source = await componentSource(component);
      const [tag] = tags(source, "Image");

      expect(source).toContain('import { Image } from "astro:assets";');
      expect(source).toContain('from "./assets/');
      expect(source).not.toContain("<img");
      expect(tag).toBeDefined();
      expect(tag).toContain('loading="lazy"');
      expect(tag).toContain('decoding="async"');
      expect(tag).toContain("width={256}");
      expect(tag).toContain("height={256}");
    }
  });
});
