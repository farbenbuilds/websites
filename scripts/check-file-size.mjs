import { readdir, readFile } from "node:fs/promises";
import { extname, join } from "node:path";

const roots = ["apps", "packages", "scripts", "tools"];
const extensions = new Set([".ts", ".tsx", ".js", ".mjs", ".svelte", ".astro", ".css"]);
const ignored = new Set(["node_modules", "dist", ".blume", ".git", ".direnv"]);
const limit = 200;

async function collect(directory) {
  let entries;
  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch {
    // Optional workspace roots such as tools may not exist yet.
    return [];
  }

  const files = await Promise.all(
    entries.map(async (entry) => {
      if (ignored.has(entry.name)) return [];
      const path = join(directory, entry.name);
      if (entry.isDirectory()) return collect(path);
      if (entry.isFile() && extensions.has(extname(entry.name))) return [path];
      return [];
    }),
  );

  return files.flat();
}

async function measure(file) {
  const content = await readFile(file, "utf8");
  return { file, lines: content.split("\n").length };
}

const files = (await Promise.all(roots.map(collect))).flat();
const measurements = await Promise.all(files.map(measure));
const violations = measurements.filter(({ lines }) => lines > limit);
const largest = measurements.toSorted((a, b) => b.lines - a.lines)[0];

if (violations.length > 0) {
  for (const { file, lines } of violations) {
    console.error(`${file}: ${lines} lines exceeds the ${limit}-line limit`);
  }
  process.exitCode = 1;
} else {
  const summary = largest ? `${largest.file} (${largest.lines} lines)` : "no source files";
  console.log(`File-size check passed: ${measurements.length} files, largest ${summary}`);
}
