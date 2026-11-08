import { readFile } from "node:fs/promises";
import { join } from "node:path";
import process from "node:process";

import { describe, expect, it } from "vite-plus/test";

const API_PAGE = "apps/uwz-docs/docs/reference/zig.mdx";
const VI_API_PAGE = "apps/uwz-docs/docs/vi/reference/zig.mdx";

// Refresh this fixture when a release changes src/root.zig, then run the suite
// with UWEBZOCKETS_ROOT=<checkout> to prove the fixture matches the source.
const EXPORT_FIXTURE = "tests/fixtures/uwz-public-exports.txt";

async function fixtureExports(): Promise<string[]> {
  const source = await readFile(EXPORT_FIXTURE, "utf8");

  return source
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .sort();
}

async function sourceExports(root: string): Promise<string[]> {
  const source = await readFile(join(root, "src", "root.zig"), "utf8");

  return [...source.matchAll(/^pub const ([A-Za-z0-9_]+)/gm)].map((match) => match[1]).sort();
}

describe("reference Zig API index", () => {
  it("anchors every export in the checked-in fixture", async () => {
    const exports = await fixtureExports();
    const page = await readFile(API_PAGE, "utf8");
    const missing = exports.filter((name) => !page.includes(`<a id="${name}"></a>`));

    expect(missing).toEqual([]);
  });

  it("keeps the same anchors in the Vietnamese index", async () => {
    const exports = await fixtureExports();
    const page = await readFile(VI_API_PAGE, "utf8");
    const missing = exports.filter((name) => !page.includes(`<a id="${name}"></a>`));

    expect(missing).toEqual([]);
  });

  it("keeps the fixture aligned with a framework checkout", async () => {
    const root = process.env.UWEBZOCKETS_ROOT;

    if (!root) return;

    expect(await sourceExports(root)).toEqual(await fixtureExports());
  });
});
