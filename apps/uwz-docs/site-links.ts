export type SiteLocale = "en" | "vi";

export type SiteLink = {
  readonly label: Readonly<Record<SiteLocale, string>>;
  readonly href: string;
};

export const PRODUCT_REPOSITORY_URL = "https://github.com/farbenbuilds/uWebZockets";

export const DOCUMENTATION_SOURCE_URL =
  "https://github.com/farbenbuilds/websites/tree/main/apps/uwz-docs";

export const PRODUCT_LICENSE_URL = "https://github.com/farbenbuilds/uWebZockets/blob/main/LICENSE";

export const SITE_LINKS: readonly SiteLink[] = [
  {
    label: {
      en: "µWebZockets on GitHub",
      vi: "µWebZockets trên GitHub",
    },
    href: PRODUCT_REPOSITORY_URL,
  },
  {
    label: {
      en: "Documentation source",
      vi: "Mã nguồn tài liệu",
    },
    href: DOCUMENTATION_SOURCE_URL,
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

export function siteCopyright(): string {
  return `\u00A9 ${new Date().getFullYear()} Farben`;
}
