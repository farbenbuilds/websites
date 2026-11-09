import { execFileSync } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vite-plus/test";

const repositoryRoot = fileURLToPath(new URL("../..", import.meta.url));
const checker = join(repositoryRoot, "scripts/check-tailwind-css.mjs");

const runChecker = (target?: string): string =>
  execFileSync(process.execPath, target ? [checker, target] : [checker], {
    cwd: repositoryRoot,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });

describe("Tailwind-first CSS", () => {
  it("accepts the Blume app stylesheets", () => {
    expect(runChecker()).toMatch(/Tailwind CSS check passed: [1-9]\d* file\(s\)\./);
  });

  it("accepts custom properties, keyframes, font faces, and property registrations", async () => {
    const directory = await mkdtemp(join(tmpdir(), "tailwind-css-"));

    try {
      await writeFile(
        join(directory, "allowed.css"),
        ':root {\n  --brand: red;\n}\n\n/* A comment with a colon: and a semicolon; */\n@keyframes fade {\n  from {\n    opacity: 0;\n  }\n}\n\n@font-face {\n  font-family: Brand;\n  src: url(/brand.woff2);\n}\n\n@property --brand-angle {\n  syntax: "<angle>";\n  inherits: false;\n  initial-value: 0deg;\n}\n\n@media (min-width: 40rem) {\n  .x {\n    @apply opacity-100 [--brand-angle:45deg];\n  }\n}\n',
      );
      expect(runChecker(directory)).toMatch(/Tailwind CSS check passed: 1 file\(s\)\./);
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });

  it("rejects a raw declaration", async () => {
    const directory = await mkdtemp(join(tmpdir(), "tailwind-css-"));

    try {
      await writeFile(join(directory, "bad.css"), ".x {\n  color: red;\n}\n");
      expect(() => runChecker(directory)).toThrow();
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });

  it("rejects an empty target", async () => {
    const directory = await mkdtemp(join(tmpdir(), "tailwind-css-"));

    try {
      expect(() => runChecker(directory)).toThrow();
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });
});
