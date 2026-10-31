import type { DocsLocale } from "@farben/docs-components/docs-locale.ts";

import en from "./locales/en.json" with { type: "json" };
import vi from "./locales/vi.json" with { type: "json" };

type SiteMessages = typeof en;

const MESSAGES: Record<DocsLocale, SiteMessages> = { en, vi };

export function siteLinkLabels(locale: DocsLocale): SiteMessages["siteLinks"] {
  return MESSAGES[locale].siteLinks;
}

export function localizeHref(href: string, locale: DocsLocale): string {
  if (locale === "en" || !href.startsWith("/")) {
    return href;
  }

  return href === "/" ? "/vi" : `/vi${href}`;
}
