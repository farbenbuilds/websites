import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";

import { describe, expect, it } from "vite-plus/test";

const DOCS_ROOT = "apps/uwz-docs/docs";
const VI_ROOT = "apps/uwz-docs/docs/vi";

async function collectPages(root: string, skipVi = false): Promise<string[]> {
  const entries = await readdir(root, { withFileTypes: true });

  const pages = await Promise.all(
    entries.map(async (entry) => {
      if (skipVi && entry.name === "vi") return [];

      const path = join(root, entry.name);

      if (entry.isDirectory()) return collectPages(path);

      return entry.isFile() && entry.name.endsWith(".mdx") ? [path] : [];
    }),
  );

  return pages.flat().sort();
}

function frontmatter(source: string): string {
  const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(source);

  return match?.[1] ?? "";
}

describe("uWebZockets documentation tree", () => {
  it("mirrors every English page in the Vietnamese tree", async () => {
    const pages = await collectPages(DOCS_ROOT, true);

    const missing = await Promise.all(
      pages.map(async (page) => {
        const mirror = join(VI_ROOT, relative(DOCS_ROOT, page));

        try {
          await readFile(mirror, "utf8");

          return null;
        } catch {
          return mirror;
        }
      }),
    );

    expect(missing.filter((page) => page !== null)).toEqual([]);
  });

  it("gives every page a title and a description", async () => {
    const pages = await collectPages(DOCS_ROOT, true);

    const invalid = await Promise.all(
      pages.map(async (page) => {
        const block = frontmatter(await readFile(page, "utf8"));

        return block.includes("title:") && block.includes("description:") ? null : page;
      }),
    );

    expect(invalid.filter((page) => page !== null)).toEqual([]);
  });

  it("does not use plain-text code fences", async () => {
    const pages = await collectPages(DOCS_ROOT);

    const invalid = await Promise.all(
      pages.map(async (page) => {
        const source = await readFile(page, "utf8");

        return source.includes("```text") ? page : null;
      }),
    );

    expect(invalid.filter((page) => page !== null)).toEqual([]);
  });
});
