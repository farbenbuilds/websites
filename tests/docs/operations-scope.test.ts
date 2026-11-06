import { readFile } from "node:fs/promises";

import { describe, expect, it } from "vite-plus/test";

const EN_ROOT = "apps/uwz-docs/docs/docs/operations";
const VI_ROOT = "apps/uwz-docs/docs/vi/docs/operations";

const CONTRIBUTOR_PAGES = [
  "build",
  "nix",
  "testing",
  "sanitizers",
  "fuzzing",
  "cross-compilation",
  "releases",
  "dependencies",
  "platforms",
];

const APPLICATION_PAGES = ["wasm", "ebpf", "ktls", "af-xdp"];

describe("operations documentation scope", () => {
  it("marks every framework-contributor page in both locales", async () => {
    for (const slug of CONTRIBUTOR_PAGES) {
      const en = await readFile(`${EN_ROOT}/${slug}.mdx`, "utf8");
      const vi = await readFile(`${VI_ROOT}/${slug}.mdx`, "utf8");

      expect(en, slug).toContain(":::note[Contributing to µWebZockets]");
      expect(en, slug).toContain("CONTRIBUTE.md");
      expect(vi, slug).toContain(":::note[Đóng góp cho µWebZockets]");
    }
  });

  it("shows the consumer path on advanced application pages", async () => {
    for (const slug of APPLICATION_PAGES) {
      const en = await readFile(`${EN_ROOT}/${slug}.mdx`, "utf8");

      expect(en, slug).toContain("zig fetch --save");
      expect(en, slug).toContain("build.zig");
    }
  });
});
