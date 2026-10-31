import { renderBenchmarkMarkdown } from "../benchmark/benchmark-section-data.ts";
import { inlinePartsToMarkdown } from "../inline-text/inline-text.ts";
import { renderIndexCardsMarkdown } from "../index-cards/index-cards-data.ts";
import { renderSupportMarkdown } from "../support/support-section-data.ts";
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

export function renderLandingMarkdown(locale: string | undefined): string {
  return [
    renderLandingHeroMarkdown(locale),
    renderIndexCardsMarkdown(locale),
    renderSupportMarkdown(locale),
    renderBenchmarkMarkdown(locale),
    renderLandingServerMarkdown(locale),
    renderLandingAuthorMarkdown(locale),
    renderLandingSponsorMarkdown(locale),
  ].join("\n\n");
}
