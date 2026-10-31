import { describe, expect, it } from "vite-plus/test";

import { renderSiteColophonMarkdown } from "../../apps/uwz-docs/components/colophon/site-colophon-markdown.ts";

describe("docs home colophon", () => {
  it("renders localized footer links and the license note", () => {
    const english = renderSiteColophonMarkdown("en");
    const vietnamese = renderSiteColophonMarkdown("vi");

    expect(english).toContain("[Author](https://github.com/Coder-Blue)");
    expect(vietnamese).toContain("[Tác giả](https://github.com/Coder-Blue)");
    expect(english).toContain("MIT License 2026");
    expect(english).not.toContain("<SiteColophon");
  });
});
