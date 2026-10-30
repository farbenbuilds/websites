import { describe, expect, it } from "vite-plus/test";

import {
  homeIndexCopy,
  renderHomeIndexMarkdown,
} from "../../apps/uwz-docs/components/home-index-data.ts";

describe("docs home index", () => {
  it("keeps six localized entries and the semi-production status", () => {
    const english = homeIndexCopy("en");
    const vietnamese = homeIndexCopy("vi");

    expect(english.items).toHaveLength(6);
    expect(vietnamese.items).toHaveLength(6);
    expect(english.items[0]?.href).toBe("/getting-started");
    expect(english.items.slice(1).every(({ href }) => href === "#")).toBe(true);
    expect(english.status).toBe("Semi-production ready.");
    expect(vietnamese.status).toBe("Sẵn sàng ở mức bán production.");
  });

  it("renders the same entries for agent-facing markdown", () => {
    const markdown = renderHomeIndexMarkdown("en");

    expect(markdown).toContain("## Start here.");
    expect(markdown).toContain("[Share nothing rule](#)");
    expect(markdown).toContain("**Status:** Semi-production ready.");
  });
});
