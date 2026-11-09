import { localizeLocalePath, type DocsLocale } from "@farben/docs-components/docs-locale.ts";

type Redirect = {
  readonly from: string;
  readonly to: string;
  readonly status: 301;
};

type RouteMove = {
  readonly from: string;
  readonly to: string;
};

type LocalizedMoveGroup = {
  readonly locale: DocsLocale;
  readonly moves: readonly RouteMove[];
};

const GETTING_STARTED_MOVES: readonly RouteMove[] = [
  { from: "/getting-started", to: "/docs/getting-started" },
  { from: "/getting-started/:slug*", to: "/docs/getting-started/:slug*" },
];

const MOVED_EXAMPLE_SLUGS = [
  "first-http-server",
  "first-websocket",
  "first-json-rpc-service",
  "first-tls-server",
  "first-cluster",
  "first-http3-server",
] as const;

const EXAMPLE_TARGETS = new Map<string, string>([
  ["first-http-server", "/examples/hello-world"],
  ["first-websocket", "/docs/websocket/quickstart"],
  ["first-json-rpc-service", "/examples/rpc-server"],
  ["first-tls-server", "/examples/https-server"],
  ["first-cluster", "/examples/shared-nothing-cluster"],
  ["first-http3-server", "/examples/http3-server"],
]);

function exampleTarget(slug: string): string {
  return EXAMPLE_TARGETS.get(slug) ?? `/examples/${slug}`;
}

const ROOT_EXAMPLE_MOVES: readonly RouteMove[] = MOVED_EXAMPLE_SLUGS.map((slug) => ({
  from: `/getting-started/${slug}`,
  to: exampleTarget(slug),
}));

const EXAMPLE_MOVES: readonly RouteMove[] = MOVED_EXAMPLE_SLUGS.map((slug) => ({
  from: `/docs/getting-started/${slug}`,
  to: exampleTarget(slug),
}));

const SECTION_MOVES: readonly RouteMove[] = [
  { from: "/docs/examples", to: "/examples" },
  ...MOVED_EXAMPLE_SLUGS.map((slug) => ({
    from: `/docs/examples/${slug}`,
    to: exampleTarget(slug),
  })),
];

const DIRECT_EXAMPLE_MOVES: readonly RouteMove[] = MOVED_EXAMPLE_SLUGS.map((slug) => ({
  from: `/examples/${slug}`,
  to: exampleTarget(slug),
}));

const CROSS_SECTION_MOVES: readonly RouteMove[] = [
  {
    from: "/docs/architecture/shared-nothing",
    to: "/docs/concepts/shared-nothing",
  },
  {
    from: "/docs/architecture/memory-model",
    to: "/docs/concepts/capacity-model",
  },
  { from: "/docs/guides/openapi", to: "/docs/http/openapi" },
  { from: "/docs/guides/sse", to: "/docs/http/server-sent-events" },
  { from: "/docs/guides/file-server", to: "/docs/http/static-files" },
  { from: "/docs/guides/rate-limiting", to: "/docs/http/rate-limiting" },
  { from: "/docs/http3/query-method", to: "/docs/http/query-method" },
  { from: "/docs/type-safety/json", to: "/docs/http/json" },
  { from: "/docs/getting-started/glossary", to: "/reference/glossary" },
  {
    from: "/docs/websocket/security",
    to: "/docs/security/websocket-security",
  },
  { from: "/docs/guides/chat", to: "/examples/chat-server" },
  { from: "/docs/guides/cluster", to: "/examples/shared-nothing-cluster" },
  { from: "/docs/guides/https", to: "/examples/https-server" },
  { from: "/docs/guides/http3", to: "/examples/http3-server" },
  { from: "/docs/guides/rpc-service", to: "/examples/rpc-server" },
];

const ROOT_GLOSSARY_MOVES: readonly RouteMove[] = [
  { from: "/getting-started/glossary", to: "/reference/glossary" },
];

const MOVE_GROUPS: readonly LocalizedMoveGroup[] = [
  { locale: "en", moves: ROOT_EXAMPLE_MOVES },
  { locale: "vi", moves: ROOT_EXAMPLE_MOVES },
  { locale: "en", moves: ROOT_GLOSSARY_MOVES },
  { locale: "vi", moves: ROOT_GLOSSARY_MOVES },
  { locale: "en", moves: GETTING_STARTED_MOVES },
  { locale: "vi", moves: GETTING_STARTED_MOVES },
  { locale: "en", moves: EXAMPLE_MOVES },
  { locale: "vi", moves: EXAMPLE_MOVES },
  { locale: "en", moves: SECTION_MOVES },
  { locale: "vi", moves: SECTION_MOVES },
  { locale: "en", moves: DIRECT_EXAMPLE_MOVES },
  { locale: "vi", moves: DIRECT_EXAMPLE_MOVES },
  { locale: "en", moves: CROSS_SECTION_MOVES },
  { locale: "vi", moves: CROSS_SECTION_MOVES },
];

function toRedirects({ locale, moves }: LocalizedMoveGroup): Redirect[] {
  return moves.map(({ from, to }) => ({
    from: localizeLocalePath(from, locale),
    to: localizeLocalePath(to, locale),
    status: 301,
  }));
}

export function createRedirects(): Redirect[] {
  return MOVE_GROUPS.flatMap(toRedirects);
}
