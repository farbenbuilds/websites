import type { InlinePart } from "./inline-text.ts";

export type InlineMarkdownOptions = {
  readonly linkClassName?: string;
  readonly resolveHref?: (href: string) => string;
};

const TOKEN_PATTERN = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
const LINK_PATTERN = /^\[([^\]]+)\]\(([^)]+)\)$/;

function tokenToPart(token: string, options: InlineMarkdownOptions): InlinePart {
  if (token.startsWith("**")) {
    return { kind: "strong", value: token.slice(2, -2) };
  }

  if (token.startsWith("`")) {
    return { kind: "code", value: token.slice(1, -1) };
  }

  const link = LINK_PATTERN.exec(token);
  const label = link?.[1];
  const href = link?.[2];

  if (label === undefined || href === undefined) {
    return { kind: "text", value: token };
  }

  const resolvedHref = options.resolveHref ? options.resolveHref(href) : href;

  if (options.linkClassName === undefined) {
    return { kind: "link", value: label, href: resolvedHref };
  }

  return { kind: "link", value: label, href: resolvedHref, className: options.linkClassName };
}

export function parseInlineMarkdown(
  markdown: string,
  options: InlineMarkdownOptions = {},
): readonly InlinePart[] {
  const parts: InlinePart[] = [];
  let cursor = 0;

  for (const match of markdown.matchAll(TOKEN_PATTERN)) {
    const index = match.index;

    if (index === undefined) continue;

    if (index > cursor) {
      parts.push({ kind: "text", value: markdown.slice(cursor, index) });
    }

    parts.push(tokenToPart(match[0], options));
    cursor = index + match[0].length;
  }

  if (cursor < markdown.length) {
    parts.push({ kind: "text", value: markdown.slice(cursor) });
  }

  return parts;
}
