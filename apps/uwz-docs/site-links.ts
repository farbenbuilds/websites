import {
  localizeLocalePath,
  resolveDocsLocale,
  type DocsLocale,
} from "@farben/docs-components/docs-locale.ts";
import { isExternalHref } from "@farben/docs-components/inline-text.ts";

import { siteMessages } from "./messages.ts";
import { AUTHOR_URL, PRODUCT_LICENSE_URL, PRODUCT_REPOSITORY_URL } from "./site-urls.ts";

export type SiteLocale = DocsLocale;

export type SiteLink = {
  readonly label: Readonly<Record<SiteLocale, string>>;
  readonly href: string;
};

type SiteLinkKey = "author" | "source" | "license";

const SITE_LINK_DEFINITIONS = [
  { key: "author", href: AUTHOR_URL },
  { key: "source", href: PRODUCT_REPOSITORY_URL },
  { key: "license", href: PRODUCT_LICENSE_URL },
] as const satisfies readonly { readonly key: SiteLinkKey; readonly href: string }[];

const EN_SITE_LINKS = siteMessages("en").siteLinks;
const VI_SITE_LINKS = siteMessages("vi").siteLinks;

export const SITE_LINKS: readonly SiteLink[] = SITE_LINK_DEFINITIONS.map(({ key, href }) => ({
  label: {
    en: EN_SITE_LINKS[key],
    vi: VI_SITE_LINKS[key],
  },
  href,
}));

export function siteFooterNote(locale: SiteLocale): string {
  return siteMessages(locale).siteLinks.footerNote;
}

export function siteColophonLabel(locale: SiteLocale): string {
  return siteMessages(locale).siteLinks.colophonLabel;
}

export function resolveLocale(pathname: string): SiteLocale {
  return resolveDocsLocale(pathname === "/vi" || pathname.startsWith("/vi/") ? "vi" : "en");
}

export function localizeHref(href: string, locale: SiteLocale): string {
  if (href.startsWith("#")) {
    return href;
  }

  // Browsers treat a backslash after the leading slash as an authority separator.
  if (href.startsWith("/\\")) {
    return "/";
  }

  if (isExternalHref(href)) {
    return href.startsWith("https://") ? href : "/";
  }

  if (!href.startsWith("/")) {
    return "/";
  }

  return localizeLocalePath(href, locale);
}
