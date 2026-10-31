import { describe, expect, it } from "vite-plus/test";

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
