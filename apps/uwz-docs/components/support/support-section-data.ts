import type { DocsLocale } from "@farben/docs-components/docs-locale.ts";
import { resolveDocsLocale } from "@farben/docs-components/docs-locale.ts";

import { siteMessages, type SiteMessages } from "../../messages.ts";

export type SupportLocale = DocsLocale;

export type SupportItem = {
  readonly title: string;
  readonly text: string;
};

export type PlatformRow = {
  readonly platform: string;
  readonly architecture: string;
  readonly status: string;
};

export type SupportCopy = {
  readonly label: string;
  readonly heading: string;
  readonly intro: string;
  readonly items: readonly SupportItem[];
  readonly platformsLabel: string;
  readonly platformNote: string;
  readonly platformHeader: string;
  readonly architectureHeader: string;
  readonly statusHeader: string;
  readonly platforms: readonly PlatformRow[];
};

type PlatformKey = keyof SiteMessages["support"]["platforms"];

const PLATFORM_ROWS: readonly {
  readonly key: PlatformKey;
  readonly platform: string;
  readonly architecture: string;
}[] = [
  { key: "linuxX86", platform: "Linux", architecture: "x86_64" },
  { key: "linuxArm64", platform: "Linux", architecture: "aarch64" },
  { key: "macosX86", platform: "macOS", architecture: "x86_64" },
  { key: "macosArm64", platform: "macOS", architecture: "aarch64" },
  { key: "windowsX86", platform: "Windows", architecture: "x86_64" },
];

export function supportCopy(locale: string | undefined): SupportCopy {
  const resolvedLocale = resolveDocsLocale(locale);
  const messages = siteMessages(resolvedLocale).support;

  return {
    label: messages.label,
    heading: messages.heading,
    intro: messages.intro,
    items: Object.values(messages.items),
    platformsLabel: messages.platformsLabel,
    platformNote: messages.platformNote,
    platformHeader: messages.platformHeader,
    architectureHeader: messages.architectureHeader,
    statusHeader: messages.statusHeader,
    platforms: PLATFORM_ROWS.map(({ key, platform, architecture }) => ({
      platform,
      architecture,
      status: messages.platforms[key],
    })),
  };
}

export function renderSupportMarkdown(locale: string | undefined): string {
  const copy = supportCopy(locale);
  const items = copy.items.map((item) => `- **${item.title}:** ${item.text}`).join("\n");

  const platforms = [
    `| ${copy.platformHeader} | ${copy.architectureHeader} | ${copy.statusHeader} |`,
    "| --- | --- | --- |",
    ...copy.platforms.map(
      (platform) => `| ${platform.platform} | ${platform.architecture} | ${platform.status} |`,
    ),
  ].join("\n");

  return [
    `## ${copy.heading}`,
    copy.intro,
    items,
    `### ${copy.platformsLabel}`,
    copy.platformNote,
    platforms,
  ].join("\n\n");
}
