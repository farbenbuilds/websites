import { describe, expect, it } from "vite-plus/test";

import { isExternalHref as isUwzExternalHref } from "../../apps/uwz-docs/components/inline-text/inline-text.ts";
import { isExternalHref as isVwsExternalHref } from "../../apps/vws-docs/components/inline-text/inline-text.ts";

describe("inline text links", () => {
  it("treats absolute and protocol-relative links as external", () => {
    for (const isExternalHref of [isUwzExternalHref, isVwsExternalHref]) {
      expect(isExternalHref("https://example.com")).toBe(true);
      expect(isExternalHref("http://example.com")).toBe(true);
      expect(isExternalHref("//example.com")).toBe(true);
      expect(isExternalHref("/getting-started")).toBe(false);
      expect(isExternalHref("#highlights")).toBe(false);
    }
  });
});
