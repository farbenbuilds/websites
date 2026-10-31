import type { DocsLocale } from "@farben/docs-components/docs-locale.ts";

import en from "../../locales/en.json" with { type: "json" };
import vi from "../../locales/vi.json" with { type: "json" };
import { localizeHref } from "../../site-links.ts";

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

type IndexCardsMessages = typeof en;

type IndexCardKey = keyof IndexCardsMessages["indexCards"]["cards"];

const MESSAGES: Record<IndexCardsLocale, IndexCardsMessages> = { en, vi };

const CARD_LINKS: readonly {
  readonly key: IndexCardKey;
  readonly href: string;
  readonly icon: string;
}[] = [
  { key: "gettingStarted", href: "/getting-started", icon: "rocket" },
  { key: "github", href: "https://github.com/farbenbuilds/ventiws", icon: "github" },
];

export function indexCardsCopy(locale: string | undefined): IndexCardsCopy {
  const resolvedLocale: IndexCardsLocale = locale === "vi" ? "vi" : "en";
  const messages = MESSAGES[resolvedLocale].indexCards;

  return {
    cards: CARD_LINKS.map(({ key, href, icon }) => ({
      ...messages.cards[key],
      href: localizeHref(href, resolvedLocale),
      icon,
    })),
  };
}

export function renderIndexCardsMarkdown(locale: string | undefined): string {
  return indexCardsCopy(locale)
    .cards.map((card) => `- [${card.title}](${card.href}): ${card.description}`)
    .join("\n");
}
