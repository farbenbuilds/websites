import { localizeLocalePath } from "@farben/docs-components/docs-locale.ts";

import { siteMessages } from "./messages.ts";

export type SiteLocale = "en" | "vi";

export type SiteLink = {
  readonly label: Readonly<Record<SiteLocale, string>>;
  readonly href: string;
};

type SiteLinkKey = "author" | "source" | "license";

export const PRODUCT_REPOSITORY_URL = "https://github.com/farbenbuilds/uWebZockets";

export const PRODUCT_LICENSE_URL = "https://github.com/farbenbuilds/uWebZockets/blob/main/LICENSE";

export const AUTHOR_URL = "https://github.com/Coder-Blue";

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
  return pathname === "/vi" || pathname.startsWith("/vi/") ? "vi" : "en";
}

export function localizeHref(href: string, locale: SiteLocale): string {
  if (href.startsWith("#")) {
    return href;
  }

  if (href.startsWith("https://")) {
    return href;
  }

  if (href.startsWith("//") || !href.startsWith("/")) {
    return "/";
  }

  return localizeLocalePath(href, locale);
}
