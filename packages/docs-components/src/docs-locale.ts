export type DocsLocale = "en" | "vi";

export function resolveDocsLocale(locale: string | undefined): DocsLocale {
  return locale === "vi" ? "vi" : "en";
}

export function localizeLocalePath(path: string, locale: DocsLocale): string {
  if (locale === "en" || !path.startsWith("/")) {
    return path;
  }

  return path === "/" ? "/vi" : `/vi${path}`;
}
