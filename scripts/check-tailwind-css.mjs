import { access, readdir, readFile } from "node:fs/promises";
import { join, relative, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const IGNORED_DIRECTORIES = new Set([".astro", ".blume", ".blume-verify", "dist", "node_modules"]);

const ALLOWED_AT_RULES = new Set(["@keyframes", "@font-face", "@property"]);

async function listCssFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (!IGNORED_DIRECTORIES.has(entry.name)) {
        files.push(...(await listCssFiles(join(directory, entry.name))));
      }

      continue;
    }

    if (entry.isFile() && entry.name.endsWith(".css")) {
      files.push(join(directory, entry.name));
    }
  }

  return files.sort((left, right) => left.localeCompare(right));
}

async function listBlumeApps() {
  const entries = await readdir("apps", { withFileTypes: true });
  const apps = [];

  for (const entry of entries) {
    if (!entry.isDirectory() || IGNORED_DIRECTORIES.has(entry.name)) {
      continue;
    }

    const directory = join("apps", entry.name);

    const config = await access(join(directory, "blume.config.ts")).then(
      () => true,
      () => false,
    );

    if (config) {
      apps.push(directory);
    }
  }

  return apps.sort((left, right) => left.localeCompare(right));
}

function stripComments(source) {
  let result = "";
  let index = 0;
  let quote = "";

  while (index < source.length) {
    const character = source[index];
    const next = source[index + 1];

    if (quote) {
      result += character;

      if (character === "\\") {
        result += next ?? "";
        index += 2;
        continue;
      }

      if (character === quote) {
        quote = "";
      }

      index += 1;
      continue;
    }

    if (character === '"' || character === "'") {
      quote = character;
      result += character;
      index += 1;
      continue;
    }

    if (character === "/" && next === "*") {
      index += 2;

      while (index < source.length && !(source[index] === "*" && source[index + 1] === "/")) {
        result += source[index] === "\n" ? "\n" : " ";
        index += 1;
      }

      result += "  ";
      index += 2;
      continue;
    }

    result += character;
    index += 1;
  }

  return result;
}

function lineAt(source, index) {
  let line = 1;

  for (let cursor = 0; cursor < index; cursor += 1) {
    if (source[cursor] === "\n") {
      line += 1;
    }
  }

  return line;
}

function findViolations(source) {
  const css = stripComments(source);
  const violations = [];
  const stack = [];
  let statementStart = 0;
  let index = 0;
  let quote = "";
  let parentheses = 0;
  let brackets = 0;

  const checkDeclaration = (start, end) => {
    const statement = css.slice(start, end).trim();

    if (!statement || statement.startsWith("@")) {
      return;
    }

    const colon = statement.indexOf(":");

    if (colon === -1) {
      return;
    }

    const property = statement.slice(0, colon).trim();

    if (!/^[a-zA-Z-]+$/.test(property) || property.startsWith("--")) {
      return;
    }

    const insideAllowedRule = stack.some((context) => ALLOWED_AT_RULES.has(context.atRule));

    if (insideAllowedRule) {
      return;
    }

    violations.push({
      line: lineAt(css, start + css.slice(start, end).indexOf(statement)),
      property,
      statement: statement.slice(0, 120),
    });
  };

  while (index < css.length) {
    const character = css[index];

    if (quote) {
      if (character === "\\") {
        index += 2;
        continue;
      }

      if (character === quote) {
        quote = "";
      }

      index += 1;
      continue;
    }

    if (character === '"' || character === "'") {
      quote = character;
      index += 1;
      continue;
    }

    if (character === "(") {
      parentheses += 1;
      index += 1;
      continue;
    }

    if (character === ")") {
      parentheses = Math.max(0, parentheses - 1);
      index += 1;
      continue;
    }

    if (character === "[") {
      brackets += 1;
      index += 1;
      continue;
    }

    if (character === "]") {
      brackets = Math.max(0, brackets - 1);
      index += 1;
      continue;
    }

    if (parentheses > 0 || brackets > 0) {
      index += 1;
      continue;
    }

    if (character === "{") {
      const prelude = css.slice(statementStart, index).trim();
      const atRule = prelude.match(/^@[a-z-]+/i)?.[0].toLowerCase() ?? "";
      stack.push({ atRule, start: statementStart });
      statementStart = index + 1;
      index += 1;
      continue;
    }

    if (character === "}") {
      checkDeclaration(statementStart, index);
      stack.pop();
      statementStart = index + 1;
      index += 1;
      continue;
    }

    if (character === ";") {
      checkDeclaration(statementStart, index);
      statementStart = index + 1;
      index += 1;
      continue;
    }

    index += 1;
  }

  return violations;
}

async function main() {
  const roots = process.argv.slice(2).filter((argument) => !argument.startsWith("--"));
  const targets = roots.length > 0 ? roots : await listBlumeApps();
  const files = [];

  for (const target of targets) {
    files.push(...(await listCssFiles(target)));
  }

  if (files.length === 0) {
    console.error("Tailwind CSS check failed: no Blume app stylesheets found.");
    process.exitCode = 1;

    return;
  }

  const failures = [];

  for (const file of files) {
    const source = await readFile(file, "utf8");

    for (const violation of findViolations(source)) {
      failures.push({ file, ...violation });
    }
  }

  if (failures.length > 0) {
    for (const failure of failures) {
      console.error(
        `${relative(process.cwd(), failure.file)}:${failure.line} raw declaration "${failure.statement}" — use @apply, @theme, @utility, or a custom property`,
      );
    }

    console.error(
      `Tailwind CSS check failed: ${failures.length} raw declaration(s) in ${files.length} file(s).`,
    );
    process.exitCode = 1;

    return;
  }

  console.log(`Tailwind CSS check passed: ${files.length} file(s).`);
}

const entry = process.argv[1] ? pathToFileURL(resolve(process.argv[1])).href : "";

if (entry === import.meta.url) {
  await main();
}

export { findViolations, listCssFiles };
