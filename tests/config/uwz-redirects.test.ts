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
    to: "/examples/hello-world",
    status: 301,
  },
  {
    from: "/docs/getting-started/first-websocket",
    to: "/examples/first-websocket",
    status: 301,
  },
  {
    from: "/docs/getting-started/first-json-rpc-service",
    to: "/examples/first-json-rpc-service",
    status: 301,
  },
  {
    from: "/docs/getting-started/first-tls-server",
    to: "/examples/first-tls-server",
    status: 301,
  },
  {
    from: "/docs/getting-started/first-cluster",
    to: "/examples/first-cluster",
    status: 301,
  },
  {
    from: "/docs/getting-started/first-http3-server",
    to: "/examples/first-http3-server",
    status: 301,
  },
  {
    from: "/vi/docs/getting-started/first-http-server",
    to: "/vi/examples/hello-world",
    status: 301,
  },
  {
    from: "/vi/docs/getting-started/first-websocket",
    to: "/vi/examples/first-websocket",
    status: 301,
  },
  {
    from: "/vi/docs/getting-started/first-json-rpc-service",
    to: "/vi/examples/first-json-rpc-service",
    status: 301,
  },
  {
    from: "/vi/docs/getting-started/first-tls-server",
    to: "/vi/examples/first-tls-server",
    status: 301,
  },
  {
    from: "/vi/docs/getting-started/first-cluster",
    to: "/vi/examples/first-cluster",
    status: 301,
  },
  {
    from: "/vi/docs/getting-started/first-http3-server",
    to: "/vi/examples/first-http3-server",
    status: 301,
  },
  { from: "/docs/examples", to: "/examples", status: 301 },
  { from: "/docs/examples/first-http-server", to: "/examples/hello-world", status: 301 },
  { from: "/docs/examples/first-websocket", to: "/examples/first-websocket", status: 301 },
  {
    from: "/docs/examples/first-json-rpc-service",
    to: "/examples/first-json-rpc-service",
    status: 301,
  },
  { from: "/docs/examples/first-tls-server", to: "/examples/first-tls-server", status: 301 },
  { from: "/docs/examples/first-cluster", to: "/examples/first-cluster", status: 301 },
  { from: "/docs/examples/first-http3-server", to: "/examples/first-http3-server", status: 301 },
  { from: "/vi/docs/examples", to: "/vi/examples", status: 301 },
  {
    from: "/vi/docs/examples/first-http-server",
    to: "/vi/examples/hello-world",
    status: 301,
  },
  { from: "/vi/docs/examples/first-websocket", to: "/vi/examples/first-websocket", status: 301 },
  {
    from: "/vi/docs/examples/first-json-rpc-service",
    to: "/vi/examples/first-json-rpc-service",
    status: 301,
  },
  { from: "/vi/docs/examples/first-tls-server", to: "/vi/examples/first-tls-server", status: 301 },
  { from: "/vi/docs/examples/first-cluster", to: "/vi/examples/first-cluster", status: 301 },
  {
    from: "/vi/docs/examples/first-http3-server",
    to: "/vi/examples/first-http3-server",
    status: 301,
  },
  { from: "/examples/first-http-server", to: "/examples/hello-world", status: 301 },
  {
    from: "/vi/examples/first-http-server",
    to: "/vi/examples/hello-world",
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
