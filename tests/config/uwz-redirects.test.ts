import { describe, expect, it } from "vite-plus/test";

import config from "../../apps/uwz-docs/blume.config.ts";
import { createRedirects } from "../../apps/uwz-docs/blume-redirects.ts";

const EXPECTED_REDIRECTS = [
  { from: "/getting-started", to: "/docs/getting-started", status: 301 },
  { from: "/getting-started/:slug*", to: "/docs/getting-started/:slug*", status: 301 },
  { from: "/vi/getting-started", to: "/vi/docs/getting-started", status: 301 },
  { from: "/vi/getting-started/:slug*", to: "/vi/docs/getting-started/:slug*", status: 301 },
  {
    from: "/docs/getting-started/first-http-server",
    to: "/docs/examples/first-http-server",
    status: 301,
  },
  {
    from: "/docs/getting-started/first-websocket",
    to: "/docs/examples/first-websocket",
    status: 301,
  },
  {
    from: "/docs/getting-started/first-json-rpc-service",
    to: "/docs/examples/first-json-rpc-service",
    status: 301,
  },
  {
    from: "/docs/getting-started/first-tls-server",
    to: "/docs/examples/first-tls-server",
    status: 301,
  },
  {
    from: "/docs/getting-started/first-cluster",
    to: "/docs/examples/first-cluster",
    status: 301,
  },
  {
    from: "/docs/getting-started/first-http3-server",
    to: "/docs/examples/first-http3-server",
    status: 301,
  },
  {
    from: "/vi/docs/getting-started/first-http-server",
    to: "/vi/docs/examples/first-http-server",
    status: 301,
  },
  {
    from: "/vi/docs/getting-started/first-websocket",
    to: "/vi/docs/examples/first-websocket",
    status: 301,
  },
  {
    from: "/vi/docs/getting-started/first-json-rpc-service",
    to: "/vi/docs/examples/first-json-rpc-service",
    status: 301,
  },
  {
    from: "/vi/docs/getting-started/first-tls-server",
    to: "/vi/docs/examples/first-tls-server",
    status: 301,
  },
  {
    from: "/vi/docs/getting-started/first-cluster",
    to: "/vi/docs/examples/first-cluster",
    status: 301,
  },
  {
    from: "/vi/docs/getting-started/first-http3-server",
    to: "/vi/docs/examples/first-http3-server",
    status: 301,
  },
] as const;

describe("uwz docs redirects", () => {
  it("keeps the public redirect contract in order", () => {
    expect(createRedirects()).toEqual(EXPECTED_REDIRECTS);
  });

  it("wires the redirect factory into the Blume config", () => {
    expect(config.redirects).toEqual(createRedirects());
  });

  it("wires the accessible scroll integration into the Blume config", () => {
    const names = config.integrations?.map((integration) => integration?.name) ?? [];

    expect(names).toContain("uwz-accessible-scroll-regions");
  });

  it("mirrors every English move under the Vietnamese prefix", () => {
    const redirects = createRedirects();
    const bySource = new Map(redirects.map((redirect) => [redirect.from, redirect]));

    for (const redirect of redirects.filter(({ from }) => from.startsWith("/vi/"))) {
      const english = bySource.get(redirect.from.slice(3));

      if (!english) throw new Error(`Missing English redirect for ${redirect.from}`);

      expect(redirect.to).toBe(`/vi${english.to}`);
    }
  });

  it("keeps every source unique", () => {
    const sources = createRedirects().map(({ from }) => from);

    expect(new Set(sources).size).toBe(sources.length);
  });
});
