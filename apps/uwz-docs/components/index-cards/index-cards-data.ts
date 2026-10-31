import type { DocsLocale } from "../docs-locale.ts";

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

const INDEX_CARDS: Readonly<Record<DocsLocale, IndexCardsCopy>> = {
  en: {
    label: "01 / Index",
    heading: "Start here.",
    intro:
      "Six ways into the runtime: install it, learn the ownership rule, migrate a service, configure the server, understand the worker model, or explore type-safety.",
    items: [
      {
        title: "Getting Started",
        description: "Install the package and run your first server.",
        href: "/getting-started",
      },
      {
        title: "Share nothing rule",
        description: "One worker, one event loop, one slab set, no shared state.",
        href: "#",
      },
      {
        title: "Migrate existing projects",
        description: "Bring an existing Zig service onto the runtime.",
        href: "#",
      },
      {
        title: "Configure a uWZ server",
        description: "Set capacities, TLS, routes, and lifecycle explicitly.",
        href: "#",
      },
      {
        title: "Understand a Cluster/Worker",
        description: "Follow how workers share ports and own their state.",
        href: "#",
      },
      {
        title: "Explore Type-safety",
        description: "See how typed requests, responses, and routes stay checked at compile time.",
        href: "#",
      },
    ],
  },
  vi: {
    label: "01 / Mục lục",
    heading: "Bắt đầu tại đây.",
    intro:
      "Sáu lối vào runtime: cài đặt, nắm quy tắc sở hữu, chuyển dự án hiện có, cấu hình máy chủ, hiểu mô hình worker hoặc khám phá type-safety.",
    items: [
      {
        title: "Bắt đầu",
        description: "Cài đặt gói và chạy máy chủ đầu tiên.",
        href: "/vi/getting-started",
      },
      {
        title: "Quy tắc shared-nothing",
        description: "Mỗi worker một event loop, một bộ slab, không chia sẻ trạng thái.",
        href: "#",
      },
      {
        title: "Chuyển dự án hiện có",
        description: "Đưa dịch vụ Zig hiện tại lên runtime.",
        href: "#",
      },
      {
        title: "Cấu hình máy chủ uWZ",
        description: "Đặt dung lượng, TLS, route và vòng đời một cách tường minh.",
        href: "#",
      },
      {
        title: "Hiểu Cluster/Worker",
        description: "Theo dõi cách worker chia sẻ cổng và sở hữu trạng thái.",
        href: "#",
      },
      {
        title: "Khám phá Type-safety",
        description:
          "Xem cách request, response và route có kiểu được kiểm tra ngay khi biên dịch.",
        href: "#",
      },
    ],
  },
};

export function indexCardsCopy(locale: string | undefined): IndexCardsCopy {
  return locale === "vi" ? INDEX_CARDS.vi : INDEX_CARDS.en;
}

export function renderIndexCardsMarkdown(locale: string | undefined): string {
  const copy = indexCardsCopy(locale);

  const items = copy.items
    .map((item) => `- [${item.title}](${item.href}): ${item.description}`)
    .join("\n");

  return `## ${copy.heading}\n\n${copy.intro}\n\n${items}`;
}
