import { describe, expect, it } from "vite-plus/test";

import {
  indexCardsCopy,
  renderIndexCardsMarkdown,
} from "../../apps/uwz-docs/components/index-cards/index-cards-data.ts";

describe("docs home index", () => {
  it("keeps six localized entries", () => {
    const english = indexCardsCopy("en");
    const vietnamese = indexCardsCopy("vi");

    expect(english.items).toHaveLength(6);
    expect(vietnamese.items).toHaveLength(6);
    expect(english.items[0]?.href).toBe("/getting-started");
    expect(english.items.slice(1).every(({ href }) => href === "#")).toBe(true);
    expect(english.items[5]?.title).toBe("Explore Type-safety");
    expect(vietnamese.items[5]?.title).toBe("Khám phá Type-safety");
  });

  it("renders the same entries for agent-facing markdown", () => {
    const markdown = renderIndexCardsMarkdown("en");

    expect(markdown).toContain("## Start here.");
    expect(markdown).toContain("[Share nothing rule](#)");
    expect(markdown).toContain("[Explore Type-safety](#)");
    expect(markdown).not.toContain("Semi-production ready.");
  });
});
