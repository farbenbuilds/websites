import { describe, expect, it } from "vite-plus/test";

import {
  localizeLocalePath,
  resolveDocsLocale,
} from "../../packages/docs-components/src/docs-locale.ts";

describe("docs locale helpers", () => {
  it("falls back to English for unknown locale values", () => {
    expect(resolveDocsLocale("vi")).toBe("vi");
    expect(resolveDocsLocale("en")).toBe("en");
    expect(resolveDocsLocale(undefined)).toBe("en");
    expect(resolveDocsLocale("fr")).toBe("en");
  });

  it("prefixes internal paths without changing anchors or external links", () => {
    expect(localizeLocalePath("/getting-started", "vi")).toBe("/vi/getting-started");
    expect(localizeLocalePath("/", "vi")).toBe("/vi");
    expect(localizeLocalePath("#highlights", "vi")).toBe("#highlights");
    expect(localizeLocalePath("https://example.com", "vi")).toBe("https://example.com");
    expect(localizeLocalePath("/getting-started", "en")).toBe("/getting-started");
  });
});
