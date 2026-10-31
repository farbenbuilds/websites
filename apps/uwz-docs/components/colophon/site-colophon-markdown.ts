import { resolveDocsLocale } from "@farben/docs-components/docs-locale.ts";

import { SITE_LINKS, siteFooterNote } from "../../site-links.ts";

export function renderSiteColophonMarkdown(locale: string | undefined): string {
  const resolvedLocale = resolveDocsLocale(locale);

  const links = SITE_LINKS.map(({ label, href }) => `- [${label[resolvedLocale]}](${href})`).join(
    "\n",
  );

  return `${links}\n\n${siteFooterNote(resolvedLocale)}`;
}
