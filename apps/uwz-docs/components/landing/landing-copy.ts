import { parseInlineMarkdown } from "@farben/docs-components/inline-markdown.ts";
import type { InlinePart } from "@farben/docs-components/inline-text.ts";

import en from "../../locales/en.json" with { type: "json" };
import vi from "../../locales/vi.json" with { type: "json" };
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
    readonly avatarSrc: string;
    readonly avatarAlt: string;
    readonly bio: readonly InlinePart[];
    readonly socials: readonly LandingSocial[];
  };
  readonly sponsor: {
    readonly label: string;
    readonly heading: string;
    readonly logoSrc: string;
    readonly logoAlt: string;
    readonly body: string;
    readonly action: LandingAction;
  };
};

type LandingMessages = typeof en;

const MESSAGES: Record<LandingLocale, LandingMessages> = { en, vi };

const DICTIONARY_LINES = [
  "速い",
  "/はやい/ · 形容詞",
  "1. 動きや動作の速度が大きい。",
  "2. Zig で HTTP、WebSocket、RPC をゼロアロケーションで処理する。",
] as const;

const SERVER_STEP_KEYS = ["addPackage", "mountHandlers", "runWhereYouDeploy"] as const;
const SOCIAL_KEYS = ["facebook", "x"] as const;

const SOCIAL_HREFS: Record<(typeof SOCIAL_KEYS)[number], string> = {
  facebook: "https://www.facebook.com/noah.tran1109",
  x: "https://x.com/sh1ro_code",
};

export function landingCopy(locale: string | undefined): LandingCopy {
  const resolvedLocale: LandingLocale = locale === "vi" ? "vi" : "en";
  const messages = MESSAGES[resolvedLocale].landing;

  const hero: LandingCopy["hero"] = {
    eyebrow: messages.hero.eyebrow,
    title: messages.hero.title,
    markSrc: "/icon.svg",
    summary: parseInlineMarkdown(messages.hero.summary),
    primaryAction: {
      label: messages.hero.primaryAction,
      href: localizeHref("/getting-started", resolvedLocale),
    },
    secondaryAction: {
      label: messages.hero.secondaryAction,
      href: "https://github.com/farbenbuilds/uWebZockets",
    },
    dictionary: {
      label: messages.hero.dictionary.label,
      lines: DICTIONARY_LINES,
      status: messages.hero.dictionary.status,
    },
  };

  return {
    hero: resolvedLocale === "vi" ? { ...hero, butterflySeed: 20261030 } : hero,
    server: {
      label: messages.server.label,
      heading: messages.server.heading,
      intro: messages.server.intro,
      steps: SERVER_STEP_KEYS.map((key) => messages.server.steps[key]),
      ctaText: messages.server.ctaText,
      cta: {
        label: messages.server.cta,
        href: localizeHref("/getting-started", resolvedLocale),
      },
    },
    author: {
      label: messages.author.label,
      name: messages.author.name,
      avatarSrc: "/author/noah-tran.webp",
      avatarAlt: messages.author.avatarAlt,
      bio: parseInlineMarkdown(messages.author.bio, { linkClassName: "editorial-link" }),
      socials: SOCIAL_KEYS.map((key) => ({
        ...messages.author.socials[key],
        href: SOCIAL_HREFS[key],
      })),
    },
    sponsor: {
      label: messages.sponsor.label,
      heading: messages.sponsor.heading,
      logoSrc: "/sponsor/farben-logo.png",
      logoAlt: messages.sponsor.logoAlt,
      body: messages.sponsor.body,
      action: {
        label: messages.sponsor.action,
        href: "https://github.com/sponsors/farbenbuilds",
      },
    },
  };
}
