import { SITE_LINKS, siteFooterNote, type SiteLocale } from "../../site-links.ts";

export function renderSiteColophonMarkdown(locale: string | undefined): string {
  const resolvedLocale: SiteLocale = locale === "vi" ? "vi" : "en";

  const links = SITE_LINKS.map(({ label, href }) => `- [${label[resolvedLocale]}](${href})`).join(
    "\n",
  );

  return `${links}\n\n${siteFooterNote()}`;
}
