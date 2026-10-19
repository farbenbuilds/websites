import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vite-plus/test";

type Manifest = {
  readonly scripts: Record<string, string>;
};

function isManifest(value: unknown): value is Manifest {
  if (value === null || typeof value !== "object") return false;

  if (!("scripts" in value)) return false;

  return value.scripts !== null && typeof value.scripts === "object";
}

async function readManifest(): Promise<Manifest> {
  const content = await readFile(new URL("../package.json", import.meta.url), "utf8");
  const parsed: unknown = JSON.parse(content);

  if (!isManifest(parsed)) throw new Error("package.json does not expose a scripts object");

  return parsed;
}

describe("workspace manifest", () => {
  it("exposes the lint, format, test, and ready scripts", async () => {
    const manifest = await readManifest();

    expect(manifest.scripts).toMatchObject({
      lint: expect.any(String),
      "lint:fix": expect.any(String),
      "format:check": expect.any(String),
      test: expect.any(String),
      ready: expect.any(String),
    });
  });
});
