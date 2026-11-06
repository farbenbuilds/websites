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

const EXAMPLE_MOVES: readonly RouteMove[] = MOVED_EXAMPLE_SLUGS.map((slug) => ({
  from: `/docs/getting-started/${slug}`,
  to: `/docs/examples/${slug}`,
}));

const MOVE_GROUPS: readonly LocalizedMoveGroup[] = [
  { locale: "en", moves: GETTING_STARTED_MOVES },
  { locale: "vi", moves: GETTING_STARTED_MOVES },
  { locale: "en", moves: EXAMPLE_MOVES },
  { locale: "vi", moves: EXAMPLE_MOVES },
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
