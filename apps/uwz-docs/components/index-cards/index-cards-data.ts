import type { DocsLocale } from "@farben/docs-components/docs-locale.ts";

import en from "../../locales/en.json" with { type: "json" };
import vi from "../../locales/vi.json" with { type: "json" };
import { localizeHref } from "../../site-links.ts";

export type IndexCardsItem = {
  readonly title: string;
  readonly description: string;
  readonly href: string;
};

export type IndexCardsCopy = {
  readonly label: string;
  readonly heading: string;
  readonly intro: string;
  readonly items: readonly IndexCardsItem[];
};

type IndexCardsMessages = typeof en;

type IndexCardKey = keyof IndexCardsMessages["indexCards"]["items"];

const MESSAGES: Record<DocsLocale, IndexCardsMessages> = { en, vi };

const INDEX_CARD_KEYS = [
  "gettingStarted",
  "shareNothing",
  "migrate",
  "configure",
  "clusterWorker",
  "typeSafety",
] as const satisfies readonly IndexCardKey[];

const INDEX_CARD_HREFS: Record<IndexCardKey, string> = {
  gettingStarted: "/getting-started",
  shareNothing: "#",
  migrate: "#",
  configure: "#",
  clusterWorker: "#",
  typeSafety: "#",
};

function resolveHref(href: string, locale: DocsLocale): string {
  return href.startsWith("/") ? localizeHref(href, locale) : href;
}

export function indexCardsCopy(locale: string | undefined): IndexCardsCopy {
  const resolvedLocale: DocsLocale = locale === "vi" ? "vi" : "en";
  const messages = MESSAGES[resolvedLocale].indexCards;

  return {
    label: messages.label,
    heading: messages.heading,
    intro: messages.intro,
    items: INDEX_CARD_KEYS.map((key) => ({
      ...messages.items[key],
      href: resolveHref(INDEX_CARD_HREFS[key], resolvedLocale),
    })),
  };
}

export function renderIndexCardsMarkdown(locale: string | undefined): string {
  const copy = indexCardsCopy(locale);

  const items = copy.items
    .map((item) => `- [${item.title}](${item.href}): ${item.description}`)
    .join("\n");

  return `## ${copy.heading}\n\n${copy.intro}\n\n${items}`;
}
