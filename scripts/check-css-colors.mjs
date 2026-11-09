const HEX_COLOR =
  /(?<![0-9a-zA-Z_-])#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{4}|[0-9a-fA-F]{3})(?![0-9a-zA-Z_-])/g;

const DECLARATION_PROPERTY = /^(?:--[a-zA-Z0-9_-]+|[a-zA-Z-]+)$/;
const IDENTIFIER_CHARACTER = /[0-9a-zA-Z_-]/;
const SELECTOR_AT_RULES = new Set(["@custom-selector", "@nest", "@scope"]);
const OPAQUE_FUNCTIONS = ["selector(", "element(", "-moz-element(", "url("];

const maskCharacters = (source, start, end) => {
  const characters = [];

  for (let index = start; index < end; index += 1) {
    characters.push(source[index] === "\n" ? "\n" : " ");
  }

  return characters.join("");
};

const opaqueFunctionAt = (source, index) => {
  const previous = source[index - 1] ?? "";

  if (IDENTIFIER_CHARACTER.test(previous)) {
    return "";
  }

  return (
    OPAQUE_FUNCTIONS.find(
      (name) => source.slice(index, index + name.length).toLowerCase() === name,
    ) ?? ""
  );
};

const maskStringsAndOpaqueFunctions = (source) => {
  let masked = "";
  let index = 0;

  while (index < source.length) {
    const character = source[index];
    const next = source[index + 1];

    if (character === "/" && next === "*") {
      let end = index + 2;

      while (end < source.length && !(source[end] === "*" && source[end + 1] === "/")) {
        end += 1;
      }

      const stop = Math.min(source.length, end + 2);
      masked += maskCharacters(source, index, stop);
      index = stop;
      continue;
    }

    if (character === '"' || character === "'") {
      let end = index + 1;

      while (end < source.length) {
        if (source[end] === "\\") {
          end += 2;
          continue;
        }

        if (source[end] === character) {
          end += 1;
          break;
        }

        end += 1;
      }

      masked += maskCharacters(source, index, end);
      index = end;
      continue;
    }

    const opaqueFunction = opaqueFunctionAt(source, index);

    if (opaqueFunction) {
      let end = index + opaqueFunction.length;
      let depth = 1;
      let quote = "";

      while (end < source.length && depth > 0) {
        const inner = source[end];

        if (quote) {
          if (inner === "\\") {
            end += 2;
            continue;
          }

          if (inner === quote) {
            quote = "";
          }
        } else if (inner === '"' || inner === "'") {
          quote = inner;
        } else if (inner === "(") {
          depth += 1;
        } else if (inner === ")") {
          depth -= 1;
        }

        end += 1;
      }

      const stop = Math.min(source.length, end);
      masked += maskCharacters(source, index, stop);
      index = stop;
      continue;
    }

    masked += character;
    index += 1;
  }

  return masked;
};

const lineAt = (source, index) => {
  let line = 1;

  for (let cursor = 0; cursor < index; cursor += 1) {
    if (source[cursor] === "\n") {
      line += 1;
    }
  }

  return line;
};

const nextDelimiter = (source, start) => {
  let index = start;
  let parentheses = 0;
  let brackets = 0;

  while (index < source.length) {
    const character = source[index];

    if (character === "(") {
      parentheses += 1;
    } else if (character === ")") {
      parentheses = Math.max(0, parentheses - 1);
    } else if (character === "[") {
      brackets += 1;
    } else if (character === "]") {
      brackets = Math.max(0, brackets - 1);
    } else if (
      parentheses === 0 &&
      brackets === 0 &&
      (character === "{" || character === "}" || character === ";")
    ) {
      return character;
    }

    index += 1;
  }

  return "";
};

const statementStart = (source, index) =>
  Math.max(
    source.lastIndexOf("{", index - 1),
    source.lastIndexOf("}", index - 1),
    source.lastIndexOf(";", index - 1),
  ) + 1;

const declarationValueStart = (statement) => {
  const leading = statement.length - statement.trimStart().length;
  const trimmed = statement.slice(leading);

  if (/^@apply\b/i.test(trimmed)) {
    return leading + "@apply".length;
  }

  const atRule = trimmed.match(/^@[a-z-]+/i)?.[0].toLowerCase();

  if (atRule && SELECTOR_AT_RULES.has(atRule)) {
    return null;
  }

  if (atRule) {
    return leading;
  }

  const colon = statement.indexOf(":");

  if (colon === -1) {
    return null;
  }

  return DECLARATION_PROPERTY.test(statement.slice(0, colon).trim()) ? colon + 1 : null;
};

const propertyAt = (statement) => {
  const trimmed = statement.trimStart();
  const atRule = trimmed.match(/^@[a-z-]+/i)?.[0];

  if (atRule) {
    return atRule;
  }

  const colon = statement.indexOf(":");

  return colon === -1 ? statement.trim() : statement.slice(0, colon).trim();
};

const findHexColorViolations = (source) => {
  const masked = maskStringsAndOpaqueFunctions(source);
  const violations = [];

  for (const match of masked.matchAll(HEX_COLOR)) {
    if (match.index === undefined) {
      continue;
    }

    const start = statementStart(masked, match.index);
    const statement = masked.slice(start, match.index);
    const trimmed = statement.trimStart();
    const beforeRule = nextDelimiter(masked, match.index + match[0].length) === "{";

    if (beforeRule && !trimmed.startsWith("@")) {
      continue;
    }

    if (declarationValueStart(statement) === null) {
      continue;
    }

    violations.push({
      line: lineAt(masked, match.index),
      literal: match[0],
      property: propertyAt(statement),
    });
  }

  return violations;
};

export { findHexColorViolations };
