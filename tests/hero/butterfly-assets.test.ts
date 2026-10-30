import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vite-plus/test";

const publicRoot = fileURLToPath(new URL("../../apps/uwz-docs/public", import.meta.url));
const assets = ["monarch", "painted-lady", "sulphur"] as const;

describe("butterfly image assets", () => {
  it("ships three 96px public-domain specimens and the provenance note", () => {
    for (const asset of assets) {
      const bytes = readFileSync(`${publicRoot}/butterflies/${asset}.png`);

      expect(bytes.subarray(1, 4).toString("ascii")).toBe("PNG");
      expect(bytes.readUInt32BE(16)).toBe(96);
    }

    expect(() => readFileSync(`${publicRoot}/butterflies/README.md`)).not.toThrow();
  });
});
