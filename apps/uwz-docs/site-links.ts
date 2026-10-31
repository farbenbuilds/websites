import en from "./locales/en.json" with { type: "json" };
import vi from "./locales/vi.json" with { type: "json" };

export type SiteLocale = "en" | "vi";

export type SiteLink = {
  readonly label: Readonly<Record<SiteLocale, string>>;
  readonly href: string;
};

type SiteMessages = typeof en;

const MESSAGES: Record<SiteLocale, SiteMessages> = { en, vi };

export const PRODUCT_REPOSITORY_URL = "https://github.com/farbenbuilds/uWebZockets";

export const PRODUCT_LICENSE_URL = "https://github.com/farbenbuilds/uWebZockets/blob/main/LICENSE";

export const AUTHOR_URL = "https://github.com/Coder-Blue";

export const SITE_LINKS: readonly SiteLink[] = [
  {
    label: {
      en: en.siteLinks.author,
      vi: vi.siteLinks.author,
    },
    href: AUTHOR_URL,
  },
  {
    label: {
      en: en.siteLinks.source,
      vi: vi.siteLinks.source,
    },
    href: PRODUCT_REPOSITORY_URL,
  },
  {
    label: {
      en: en.siteLinks.license,
      vi: vi.siteLinks.license,
    },
    href: PRODUCT_LICENSE_URL,
  },
];

export function siteFooterNote(locale: SiteLocale): string {
  return MESSAGES[locale].siteLinks.footerNote;
}

export function siteColophonLabel(locale: SiteLocale): string {
  return MESSAGES[locale].siteLinks.colophonLabel;
}

export function resolveLocale(pathname: string): SiteLocale {
  return pathname === "/vi" || pathname.startsWith("/vi/") ? "vi" : "en";
}

export function localizeHref(href: string, locale: SiteLocale): string {
  if (href.startsWith("https://")) {
    return href;
  }

  if (href.startsWith("//") || !href.startsWith("/")) {
    return "/";
  }

  if (locale === "en") {
    return href;
  }

  return href === "/" ? "/vi" : `/vi${href}`;
}
