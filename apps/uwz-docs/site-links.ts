export type SiteLocale = "en" | "vi";

export type SiteLink = {
  readonly label: Readonly<Record<SiteLocale, string>>;
  readonly href: string;
};

export const PRODUCT_REPOSITORY_URL = "https://github.com/farbenbuilds/uWebZockets";

export const PRODUCT_LICENSE_URL = "https://github.com/farbenbuilds/uWebZockets/blob/main/LICENSE";

export const AUTHOR_URL = "https://github.com/Coder-Blue";

export const SITE_LINKS: readonly SiteLink[] = [
  {
    label: {
      en: "Author",
      vi: "Tác giả",
    },
    href: AUTHOR_URL,
  },
  {
    label: {
      en: "Source",
      vi: "Mã nguồn",
    },
    href: PRODUCT_REPOSITORY_URL,
  },
  {
    label: {
      en: "License",
      vi: "Giấy phép",
    },
    href: PRODUCT_LICENSE_URL,
  },
];

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

export function siteFooterNote(): string {
  return "MIT License 2026";
}
