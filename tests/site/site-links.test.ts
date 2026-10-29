import { describe, expect, it } from "vite-plus/test";

import { localizeHref, resolveLocale } from "../../apps/uwz-docs/site-links.ts";

describe("site links", () => {
  it("localizes internal links and leaves HTTPS destinations absolute", () => {
    expect(localizeHref("/getting-started", "vi")).toBe("/vi/getting-started");
    expect(localizeHref("/", "vi")).toBe("/vi");
    expect(localizeHref("/getting-started", "en")).toBe("/getting-started");
    expect(localizeHref("https://github.com/farbenbuilds/uWebZockets", "vi")).toBe(
      "https://github.com/farbenbuilds/uWebZockets",
    );
  });

  it("rejects non-HTTPS and protocol-relative destinations", () => {
    expect(localizeHref("javascript:alert(1)", "en")).toBe("/");
    expect(localizeHref("//example.com", "en")).toBe("/");
    expect(localizeHref("http://example.com", "en")).toBe("/");
  });

  it("reads the Vietnamese route prefix", () => {
    expect(resolveLocale("/vi")).toBe("vi");
    expect(resolveLocale("/vi/")).toBe("vi");
    expect(resolveLocale("/vi/getting-started")).toBe("vi");
    expect(resolveLocale("/getting-started")).toBe("en");
  });
});
