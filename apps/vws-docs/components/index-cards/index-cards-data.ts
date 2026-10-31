import type { DocsLocale } from "@farben/docs-components/docs-locale.ts";

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

const INDEX_CARDS: Readonly<Record<IndexCardsLocale, IndexCardsCopy>> = {
  en: {
    cards: [
      {
        title: "Getting Started",
        description: "Install ventiws and run an echo server and client.",
        href: "/getting-started",
        icon: "rocket",
      },
      {
        title: "ventiws on GitHub",
        description: "Source, releases, and the issue tracker.",
        href: "https://github.com/farbenbuilds/ventiws",
        icon: "github",
      },
    ],
  },
  vi: {
    cards: [
      {
        title: "Bắt đầu",
        description: "Cài ventiws và chạy một echo server cùng client.",
        href: "/vi/getting-started",
        icon: "rocket",
      },
      {
        title: "ventiws trên GitHub",
        description: "Mã nguồn, bản phát hành và nơi theo dõi issue.",
        href: "https://github.com/farbenbuilds/ventiws",
        icon: "github",
      },
    ],
  },
};

export function indexCardsCopy(locale: string | undefined): IndexCardsCopy {
  return locale === "vi" ? INDEX_CARDS.vi : INDEX_CARDS.en;
}

export function renderIndexCardsMarkdown(locale: string | undefined): string {
  return indexCardsCopy(locale)
    .cards.map((card) => `- [${card.title}](${card.href}): ${card.description}`)
    .join("\n");
}
