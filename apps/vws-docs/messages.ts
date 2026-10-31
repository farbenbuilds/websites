import type { DocsLocale } from "@farben/docs-components/docs-locale.ts";
import { resolveDocsLocale } from "@farben/docs-components/docs-locale.ts";

import en from "./locales/en.json" with { type: "json" };
import vi from "./locales/vi.json" with { type: "json" };

export type SiteMessages = typeof en;

const MESSAGES: Record<DocsLocale, SiteMessages> = { en, vi };

export function siteMessages(locale: string | undefined): SiteMessages {
  return MESSAGES[resolveDocsLocale(locale)];
}
