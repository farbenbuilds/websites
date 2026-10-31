import { inlinePartsToMarkdown } from "@farben/docs-components/inline-text.ts";

import { landingCopy } from "./landing-copy.ts";

export function renderLandingHeroMarkdown(locale: string | undefined): string {
  const { hero } = landingCopy(locale);

  return [
    `# ${hero.title}`,
    inlinePartsToMarkdown(hero.summary),
    `[${hero.primaryAction.label}](${hero.primaryAction.href}) · [${hero.secondaryAction.label}](${hero.secondaryAction.href})`,
  ].join("\n\n");
}

export function renderLandingServerMarkdown(locale: string | undefined): string {
  const { server } = landingCopy(locale);

  const steps = server.steps
    .map((step, index) => `${index + 1}. **${step.title}** — ${step.text}`)
    .join("\n");

  return `## ${server.heading}\n\n${server.intro}\n\n${steps}\n\n${server.ctaText} [${server.cta.label}](${server.cta.href})`;
}

export function renderLandingAuthorMarkdown(locale: string | undefined): string {
  const { author } = landingCopy(locale);

  const socials = author.socials.map((social) => `- [${social.value}](${social.href})`).join("\n");

  return `## ${author.name}\n\n${inlinePartsToMarkdown(author.bio)}\n\n${socials}`;
}

export function renderLandingSponsorMarkdown(locale: string | undefined): string {
  const { sponsor } = landingCopy(locale);

  return `## ${sponsor.heading}\n\n${sponsor.body} [${sponsor.action.label}](${sponsor.action.href})`;
}
