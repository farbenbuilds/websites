import { renderIndexCardsMarkdown } from "../index-cards/index-cards-data.ts";
import { inlinePartsToMarkdown } from "../inline-text/inline-text.ts";
import { landingCopy } from "./landing-copy.ts";

export function renderLandingIntroMarkdown(locale: string | undefined): string {
  const copy = landingCopy(locale);

  return [inlinePartsToMarkdown(copy.intro), renderIndexCardsMarkdown(locale)].join("\n\n");
}

export function renderLandingHighlightsMarkdown(locale: string | undefined): string {
  return landingCopy(locale)
    .highlights.items.map(
      (item) => `- **${inlinePartsToMarkdown(item.lead)}** — ${inlinePartsToMarkdown(item.text)}`,
    )
    .join("\n");
}

export function renderLandingExampleMarkdown(locale: string | undefined): string {
  const copy = landingCopy(locale).example;

  return `\`\`\`${copy.lang}\n${copy.code}\n\`\`\``;
}

export function renderLandingNotesMarkdown(locale: string | undefined): string {
  const copy = landingCopy(locale).notes;

  return [
    `:::warning\n${inlinePartsToMarkdown(copy.warning)}\n:::`,
    `:::note\n${inlinePartsToMarkdown(copy.note)}\n:::`,
  ].join("\n\n");
}
