import { readFile } from "node:fs/promises";

import { describe, expect, it } from "vite-plus/test";

const HEADER_CHROME = new URL("../../apps/uwz-docs/styles/blume-chrome.css", import.meta.url);
const READING_SHELL = new URL("../../apps/uwz-docs/styles/blume-navigation.css", import.meta.url);

const FRAME_RULE =
  /@media \(min-width: 80rem\) \{\s*html \[data-blume-header\] \{\s*@apply px-\[max\(1\.5rem,calc\(\(100%_-_var\(--uwz-docs-frame-width\)\)_\/_2\)\)\];/;

describe("shared header frame", () => {
  it("applies the reading frame to the header on every route", async () => {
    const chrome = await readFile(HEADER_CHROME, "utf8");

    expect(chrome).toMatch(FRAME_RULE);
  });

  it("does not scope the header frame to reading pages", async () => {
    const readingShell = await readFile(READING_SHELL, "utf8");

    expect(readingShell).not.toMatch(/\[data-blume-header\]/);
  });
});
