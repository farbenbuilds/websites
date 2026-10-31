import { resolveDocsLocale } from "@farben/docs-components/docs-locale.ts";

import { siteMessages, type SiteMessages } from "../../messages.ts";
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

type IndexCardKey = keyof SiteMessages["indexCards"]["items"];

const INDEX_CARD_DEFINITIONS = [
  { key: "gettingStarted", href: "/getting-started" },
  { key: "shareNothing", href: "#" },
  { key: "migrate", href: "#" },
  { key: "configure", href: "#" },
  { key: "clusterWorker", href: "#" },
  { key: "typeSafety", href: "#" },
] as const satisfies readonly { readonly key: IndexCardKey; readonly href: string }[];

export function indexCardsCopy(locale: string | undefined): IndexCardsCopy {
  const resolvedLocale = resolveDocsLocale(locale);
  const messages = siteMessages(resolvedLocale).indexCards;

  return {
    label: messages.label,
    heading: messages.heading,
    intro: messages.intro,
    items: INDEX_CARD_DEFINITIONS.map(({ key, href }) => ({
      ...messages.items[key],
      href: localizeHref(href, resolvedLocale),
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
