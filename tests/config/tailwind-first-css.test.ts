import { execFileSync } from "node:child_process";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vite-plus/test";

const repositoryRoot = fileURLToPath(new URL("../..", import.meta.url));
const checker = join(repositoryRoot, "scripts/check-tailwind-css.mjs");

const runChecker = (target?: string, directory = repositoryRoot): string =>
  execFileSync(process.execPath, target ? [checker, target] : [checker], {
    cwd: directory,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });

const runCheckerOnStylesheet = async (source: string): Promise<string> => {
  const directory = await mkdtemp(join(tmpdir(), "tailwind-css-"));

  try {
    await writeFile(join(directory, "synthetic.css"), source);

    return runChecker(directory);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
};

describe("Tailwind-first CSS", () => {
  it("accepts the Blume app stylesheets", () => {
    expect(runChecker()).toMatch(/Tailwind CSS check passed: [1-9]\d* file\(s\)\./);
  });

  it("checks app and package CSS by default", async () => {
    const directory = await mkdtemp(join(tmpdir(), "tailwind-css-"));

    try {
      await mkdir(join(directory, "apps"));
      await mkdir(join(directory, "packages"));
      await writeFile(
        join(directory, "apps/site.css"),
        ":root {\n  --brand: oklch(0.5 0.1 30);\n}\n",
      );
      await writeFile(join(directory, "packages/theme.css"), ":root {\n  --brand: #ffffff;\n}\n");

      expect(() => runChecker(undefined, directory)).toThrow(/hex color literal/);
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });

  it("rejects a hex color in a custom property", async () => {
    await expect(runCheckerOnStylesheet(":root {\n  --brand: #ffffff;\n}\n")).rejects.toThrow(
      /hex color literal/,
    );
  });

  it("rejects a hex color in a regular declaration", async () => {
    await expect(
      runCheckerOnStylesheet(
        "@keyframes fade {\n  from {\n    background-color: #ffffff;\n  }\n}\n",
      ),
    ).rejects.toThrow(/hex color literal/);
  });

  it("rejects a hex color in an @apply arbitrary value", async () => {
    await expect(runCheckerOnStylesheet(".x {\n  @apply text-[#ffffff];\n}\n")).rejects.toThrow(
      /hex color literal/,
    );
  });

  it("rejects a hex color in an at-rule prelude", async () => {
    await expect(
      runCheckerOnStylesheet("@supports (color: #ffffff) {\n  .x {\n    @apply block;\n  }\n}\n"),
    ).rejects.toThrow(/hex color literal/);
  });

  it("accepts oklch, comments, quoted strings, and selector fragments", async () => {
    const output = await runCheckerOnStylesheet(
      '/* #ffffff in a comment */\n:root {\n  --brand: oklch(0.5 0.1 30);\n  --label: "#ffffff";\n  --fade: url(#fade);\n  --mask: element(#fade);\n  --moz-mask: -moz-element(#fade);\n}\n\n@keyframes fade {\n  from {\n    background-image: url(#fade);\n    content: "#fff";\n  }\n}\n\n@supports selector(#fade) {\n  .x {\n    @apply bg-[oklch(0.5_0.1_30)];\n  }\n}\n\n@custom-selector :--heading #fade;\n\n@scope (#fade) {\n  .x {\n    @apply block;\n  }\n}\n\n@nest #fade & {\n  .x {\n    @apply block;\n  }\n}\n',
    );

    expect(output).toMatch(/Tailwind CSS check passed: 1 file\(s\)\./);
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
