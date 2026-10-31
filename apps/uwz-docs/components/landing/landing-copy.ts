import { resolveDocsLocale } from "@farben/docs-components/docs-locale.ts";
import { parseInlineMarkdown } from "@farben/docs-components/inline-markdown.ts";
import type { InlinePart } from "@farben/docs-components/inline-text.ts";

import { siteMessages } from "../../messages.ts";
import { localizeHref, type SiteLocale } from "../../site-links.ts";

export type LandingLocale = SiteLocale;

export type LandingLink = {
  readonly label: string;
  readonly href: string;
};

export type LandingAction = LandingLink;

export type LandingStep = {
  readonly title: string;
  readonly text: string;
};

export type LandingSocial = {
  readonly label: string;
  readonly value: string;
  readonly href: string;
  readonly ariaLabel: string;
};

export type LandingCopy = {
  readonly butterfly: {
    readonly pauseLabel: string;
    readonly resumeLabel: string;
    readonly scrollLabel: string;
  };
  readonly hero: {
    readonly eyebrow: string;
    readonly title: string;
    readonly markSrc: string;
    readonly summary: readonly InlinePart[];
    readonly primaryAction: LandingAction;
    readonly secondaryAction: LandingAction;
    readonly dictionary: {
      readonly label: string;
      readonly lines: readonly string[];
      readonly status: string;
    };
    readonly butterflySeed?: number;
  };
  readonly server: {
    readonly label: string;
    readonly heading: string;
    readonly intro: string;
    readonly steps: readonly LandingStep[];
    readonly ctaText: string;
    readonly cta: LandingLink;
  };
  readonly author: {
    readonly label: string;
    readonly name: string;
    readonly avatarAlt: string;
    readonly bio: readonly InlinePart[];
    readonly socials: readonly LandingSocial[];
  };
  readonly sponsor: {
    readonly label: string;
    readonly heading: string;
    readonly logoAlt: string;
    readonly body: string;
    readonly action: LandingAction;
  };
};

const DICTIONARY_LINES = [
  "速い",
  "/はやい/ · 形容詞",
  "1. 動きや動作の速度が大きい。",
  "2. Zig で HTTP、WebSocket、RPC をゼロアロケーションで処理する。",
] as const;

const SOCIAL_KEYS = ["facebook", "x"] as const;

const SOCIAL_HREFS: Record<(typeof SOCIAL_KEYS)[number], string> = {
  facebook: "https://www.facebook.com/noah.tran1109",
  x: "https://x.com/sh1ro_code",
};

export function landingCopy(locale: string | undefined): LandingCopy {
  const resolvedLocale: LandingLocale = resolveDocsLocale(locale);
  const messages = siteMessages(resolvedLocale);
  const landing = messages.landing;

  const hero: LandingCopy["hero"] = {
    eyebrow: landing.hero.eyebrow,
    title: landing.hero.title,
    markSrc: "/icon.svg",
    summary: parseInlineMarkdown(landing.hero.summary),
    primaryAction: {
      label: landing.hero.primaryAction,
      href: localizeHref("/docs/getting-started", resolvedLocale),
    },
    secondaryAction: {
      label: landing.hero.secondaryAction,
      href: "https://github.com/farbenbuilds/uWebZockets",
    },
    dictionary: {
      label: landing.hero.dictionary.label,
      lines: DICTIONARY_LINES,
      status: landing.hero.dictionary.status,
    },
  };

  return {
    butterfly: messages.butterfly,
    hero: resolvedLocale === "vi" ? { ...hero, butterflySeed: 20261030 } : hero,
    server: {
      label: landing.server.label,
      heading: landing.server.heading,
      intro: landing.server.intro,
      steps: Object.values(landing.server.steps),
      ctaText: landing.server.ctaText,
      cta: {
        label: landing.server.cta,
        href: localizeHref("/docs/getting-started", resolvedLocale),
      },
    },
    author: {
      label: landing.author.label,
      name: landing.author.name,
      avatarAlt: landing.author.avatarAlt,
      bio: parseInlineMarkdown(landing.author.bio, { linkClassName: "editorial-link" }),
      socials: SOCIAL_KEYS.map((key) => ({
        ...landing.author.socials[key],
        href: SOCIAL_HREFS[key],
      })),
    },
    sponsor: {
      label: landing.sponsor.label,
      heading: landing.sponsor.heading,
      logoAlt: landing.sponsor.logoAlt,
      body: landing.sponsor.body,
      action: {
        label: landing.sponsor.action,
        href: "https://github.com/sponsors/farbenbuilds",
      },
    },
  };
}
