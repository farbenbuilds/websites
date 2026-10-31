import { describe, expect, it } from "vite-plus/test";

import { parseInlineMarkdown } from "../../packages/docs-components/src/inline-markdown.ts";
import { isExternalHref } from "../../packages/docs-components/src/inline-text.ts";

describe("inline text links", () => {
  it("treats absolute and protocol-relative links as external", () => {
    expect(isExternalHref("https://example.com")).toBe(true);
    expect(isExternalHref("http://example.com")).toBe(true);
    expect(isExternalHref("//example.com")).toBe(true);
    expect(isExternalHref("/getting-started")).toBe(false);
    expect(isExternalHref("#highlights")).toBe(false);
  });
});

describe("inline markdown", () => {
  it("parses text, strong, code, and links", () => {
    expect(parseInlineMarkdown("A **bold** `code` [link](https://example.com).")).toEqual([
      { kind: "text", value: "A " },
      { kind: "strong", value: "bold" },
      { kind: "text", value: " " },
      { kind: "code", value: "code" },
      { kind: "text", value: " " },
      { kind: "link", value: "link", href: "https://example.com" },
      { kind: "text", value: "." },
    ]);
  });

  it("applies a link class and resolves internal hrefs", () => {
    expect(
      parseInlineMarkdown("[Getting Started](/getting-started)", {
        linkClassName: "editorial-link",
        resolveHref: (href) => `/vi${href}`,
      }),
    ).toEqual([
      {
        kind: "link",
        value: "Getting Started",
        href: "/vi/getting-started",
        className: "editorial-link",
      },
    ]);
  });
});
