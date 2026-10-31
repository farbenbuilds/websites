import type { DocsLocale } from "@farben/docs-components/docs-locale.ts";
import { localizeLocalePath, resolveDocsLocale } from "@farben/docs-components/docs-locale.ts";

import { siteMessages, type SiteMessages } from "../../messages.ts";

export type IndexCardsLocale = DocsLocale;

export type IndexCard = {
  readonly title: string;
  readonly description: string;
  readonly href: string;
  readonly icon: string;
};

export type IndexCardsCopy = {
  readonly cards: readonly IndexCard[];
};

type IndexCardKey = keyof SiteMessages["indexCards"]["cards"];

const CARD_DEFINITIONS = [
  { key: "gettingStarted", href: "/getting-started", icon: "rocket" },
  { key: "github", href: "https://github.com/farbenbuilds/ventiws", icon: "github" },
] as const satisfies readonly {
  readonly key: IndexCardKey;
  readonly href: string;
  readonly icon: string;
}[];

export function indexCardsCopy(locale: string | undefined): IndexCardsCopy {
  const resolvedLocale = resolveDocsLocale(locale);
  const messages = siteMessages(resolvedLocale).indexCards;

  return {
    cards: CARD_DEFINITIONS.map(({ key, href, icon }) => ({
      ...messages.cards[key],
      href: localizeLocalePath(href, resolvedLocale),
      icon,
    })),
  };
}

export function renderIndexCardsMarkdown(locale: string | undefined): string {
  return indexCardsCopy(locale)
    .cards.map((card) => `- [${card.title}](${card.href}): ${card.description}`)
    .join("\n");
}
