import type { DocsLocale } from "@farben/docs-components/docs-locale.ts";
import { parseInlineMarkdown } from "@farben/docs-components/inline-markdown.ts";
import type { InlinePart } from "@farben/docs-components/inline-text.ts";

import en from "../../locales/en.json" with { type: "json" };
import vi from "../../locales/vi.json" with { type: "json" };
import { localizeHref } from "../../site-links.ts";

export type LandingLocale = DocsLocale;

export type LandingHighlight = {
  readonly lead: readonly InlinePart[];
  readonly text: readonly InlinePart[];
};

export type LandingCopy = {
  readonly intro: readonly InlinePart[];
  readonly highlights: {
    readonly items: readonly LandingHighlight[];
  };
  readonly example: {
    readonly lang: string;
    readonly code: string;
  };
  readonly notes: {
    readonly warning: readonly InlinePart[];
    readonly note: readonly InlinePart[];
  };
};

type LandingMessages = typeof en;

type HighlightKey = keyof LandingMessages["landing"]["highlights"]["items"];

const ECHO_EXAMPLE = `import { WebSocket, WebSocketServer } from "ventiws";

const server = new WebSocketServer({ port: 8080 });

server.on("connection", (socket) => {
  socket.on("message", (data, isBinary) => {
    socket.send(isBinary ? data : \`echo: \${data.toString()}\`);
  });
});

const client = new WebSocket("ws://127.0.0.1:8080/");
client.on("open", () => client.send("hello"));
client.on("message", (data) => console.log("client saw", data.toString()));`;

const MESSAGES: Record<LandingLocale, LandingMessages> = { en, vi };

const HIGHLIGHT_KEYS = [
  "wsApi",
  "nativeAddon",
  "noCompiler",
  "compatibility",
  "devLogger",
] as const satisfies readonly HighlightKey[];

export function landingCopy(locale: string | undefined): LandingCopy {
  const resolvedLocale: LandingLocale = locale === "vi" ? "vi" : "en";
  const messages = MESSAGES[resolvedLocale].landing;
  const resolveHref = (href: string): string => localizeHref(href, resolvedLocale);

  return {
    intro: parseInlineMarkdown(messages.intro, { resolveHref }),
    highlights: {
      items: HIGHLIGHT_KEYS.map((key) => ({
        lead: parseInlineMarkdown(messages.highlights.items[key].lead, { resolveHref }),
        text: parseInlineMarkdown(messages.highlights.items[key].text, { resolveHref }),
      })),
    },
    example: {
      lang: "ts",
      code: ECHO_EXAMPLE,
    },
    notes: {
      warning: parseInlineMarkdown(messages.notes.warning, { resolveHref }),
      note: parseInlineMarkdown(messages.notes.note, { resolveHref }),
    },
  };
}
