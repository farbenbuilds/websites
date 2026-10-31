import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vite-plus/test";

import { landingCopy } from "../../apps/vws-docs/components/landing/landing-copy.ts";
import {
  renderLandingExampleMarkdown,
  renderLandingHighlightsMarkdown,
  renderLandingIntroMarkdown,
  renderLandingNotesMarkdown,
} from "../../apps/vws-docs/components/landing/landing-markdown.ts";
import {
  indexCardsCopy,
  renderIndexCardsMarkdown,
} from "../../apps/vws-docs/components/index-cards/index-cards-data.ts";

describe("ventiws landing page", () => {
  it("keeps localized cards and highlights", () => {
    expect(indexCardsCopy("en").cards).toHaveLength(2);
    expect(indexCardsCopy("vi").cards[0]?.title).toBe("Bắt đầu");
    expect(indexCardsCopy("vi").cards[0]?.href).toBe("/vi/getting-started");
    expect(renderIndexCardsMarkdown("en")).toContain("[Getting Started](/getting-started)");

    for (const locale of ["en", "vi"] as const) {
      const copy = landingCopy(locale);

      expect(copy.highlights.items).toHaveLength(5);
      expect(copy.example.code).toContain("WebSocketServer");
      expect(copy.notes.warning.length).toBeGreaterThan(1);
    }

    expect(
      landingCopy("vi").notes.note.some(
        (part) => part.kind === "link" && part.href === "/vi/getting-started",
      ),
    ).toBe(true);
  });

  it("keeps the Vietnamese heading anchors stable", async () => {
    const content = await readFile(
      new URL("../../apps/vws-docs/docs/vi/index.mdx", import.meta.url),
      "utf8",
    );

    expect(content).toContain("[#highlights]");
    expect(content).toContain("[#echo-server-and-client]");
  });

  it("renders each section for agent-facing markdown", () => {
    expect(renderLandingIntroMarkdown("en")).toContain("[ws](https://github.com/websockets/ws)");
    expect(renderLandingHighlightsMarkdown("en")).toContain("- **The `ws` API**");
    expect(renderLandingExampleMarkdown("en")).toContain("```ts");
    expect(renderLandingNotesMarkdown("en")).toContain(":::warning");
    expect(renderLandingNotesMarkdown("en")).toContain(":::note");
  });
});
