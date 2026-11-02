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
    expect(english.items[0]?.href).toBe("/docs/getting-started");
    expect(english.items.every(({ href }) => href.startsWith("/docs/"))).toBe(true);
    expect(english.items[5]?.title).toBe("Explore type safety");
    expect(vietnamese.items[5]?.title).toBe("Tìm hiểu type safety");
  });

  it("renders the same entries for agent-facing markdown", () => {
    const markdown = renderIndexCardsMarkdown("en");

    expect(markdown).toContain("## Start here.");
    expect(markdown).toContain("[Share nothing rule](/docs/concepts/shared-nothing)");
    expect(markdown).toContain("[Explore type safety](/docs/concepts/type-safety)");
    expect(markdown).not.toContain("Semi-production ready.");
  });
});
