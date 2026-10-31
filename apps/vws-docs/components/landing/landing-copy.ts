import type { DocsLocale } from "@farben/docs-components/docs-locale.ts";
import { localizeLocalePath, resolveDocsLocale } from "@farben/docs-components/docs-locale.ts";
import { parseInlineMarkdown } from "@farben/docs-components/inline-markdown.ts";
import type { InlinePart } from "@farben/docs-components/inline-text.ts";

import { siteMessages } from "../../messages.ts";

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

export function landingCopy(locale: string | undefined): LandingCopy {
  const resolvedLocale = resolveDocsLocale(locale);
  const messages = siteMessages(resolvedLocale).landing;
  const resolveHref = (href: string): string => localizeLocalePath(href, resolvedLocale);

  return {
    intro: parseInlineMarkdown(messages.intro, { resolveHref }),
    highlights: {
      items: Object.values(messages.highlights.items).map((item) => ({
        lead: parseInlineMarkdown(item.lead, { resolveHref }),
        text: parseInlineMarkdown(item.text, { resolveHref }),
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
