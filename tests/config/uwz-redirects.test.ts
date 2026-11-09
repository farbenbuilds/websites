import { describe, expect, it } from "vite-plus/test";

import config from "../../apps/uwz-docs/blume.config.ts";
import { createRedirects } from "../../apps/uwz-docs/blume-redirects.ts";

const EXPECTED_REDIRECTS = [
  { from: "/getting-started/first-http-server", to: "/examples/hello-world", status: 301 },
  { from: "/getting-started/first-websocket", to: "/docs/websocket/quickstart", status: 301 },
  { from: "/getting-started/first-json-rpc-service", to: "/examples/rpc-server", status: 301 },
  { from: "/getting-started/first-tls-server", to: "/examples/https-server", status: 301 },
  { from: "/getting-started/first-cluster", to: "/examples/shared-nothing-cluster", status: 301 },
  { from: "/getting-started/first-http3-server", to: "/examples/http3-server", status: 301 },
  { from: "/vi/getting-started/first-http-server", to: "/vi/examples/hello-world", status: 301 },
  { from: "/vi/getting-started/first-websocket", to: "/vi/docs/websocket/quickstart", status: 301 },
  {
    from: "/vi/getting-started/first-json-rpc-service",
    to: "/vi/examples/rpc-server",
    status: 301,
  },
  { from: "/vi/getting-started/first-tls-server", to: "/vi/examples/https-server", status: 301 },
  {
    from: "/vi/getting-started/first-cluster",
    to: "/vi/examples/shared-nothing-cluster",
    status: 301,
  },
  { from: "/vi/getting-started/first-http3-server", to: "/vi/examples/http3-server", status: 301 },
  { from: "/getting-started/glossary", to: "/reference/glossary", status: 301 },
  { from: "/vi/getting-started/glossary", to: "/vi/reference/glossary", status: 301 },
  { from: "/getting-started", to: "/docs/getting-started", status: 301 },
  { from: "/getting-started/:slug*", to: "/docs/getting-started/:slug*", status: 301 },
  { from: "/vi/getting-started", to: "/vi/docs/getting-started", status: 301 },
  { from: "/vi/getting-started/:slug*", to: "/vi/docs/getting-started/:slug*", status: 301 },
  { from: "/docs/getting-started/first-http-server", to: "/examples/hello-world", status: 301 },
  { from: "/docs/getting-started/first-websocket", to: "/docs/websocket/quickstart", status: 301 },
  { from: "/docs/getting-started/first-json-rpc-service", to: "/examples/rpc-server", status: 301 },
  { from: "/docs/getting-started/first-tls-server", to: "/examples/https-server", status: 301 },
  {
    from: "/docs/getting-started/first-cluster",
    to: "/examples/shared-nothing-cluster",
    status: 301,
  },
  { from: "/docs/getting-started/first-http3-server", to: "/examples/http3-server", status: 301 },
  {
    from: "/vi/docs/getting-started/first-http-server",
    to: "/vi/examples/hello-world",
    status: 301,
  },
  {
    from: "/vi/docs/getting-started/first-websocket",
    to: "/vi/docs/websocket/quickstart",
    status: 301,
  },
  {
    from: "/vi/docs/getting-started/first-json-rpc-service",
    to: "/vi/examples/rpc-server",
    status: 301,
  },
  {
    from: "/vi/docs/getting-started/first-tls-server",
    to: "/vi/examples/https-server",
    status: 301,
  },
  {
    from: "/vi/docs/getting-started/first-cluster",
    to: "/vi/examples/shared-nothing-cluster",
    status: 301,
  },
  {
    from: "/vi/docs/getting-started/first-http3-server",
    to: "/vi/examples/http3-server",
    status: 301,
  },
  { from: "/docs/examples", to: "/examples", status: 301 },
  { from: "/docs/examples/first-http-server", to: "/examples/hello-world", status: 301 },
  { from: "/docs/examples/first-websocket", to: "/docs/websocket/quickstart", status: 301 },
  { from: "/docs/examples/first-json-rpc-service", to: "/examples/rpc-server", status: 301 },
  { from: "/docs/examples/first-tls-server", to: "/examples/https-server", status: 301 },
  { from: "/docs/examples/first-cluster", to: "/examples/shared-nothing-cluster", status: 301 },
  { from: "/docs/examples/first-http3-server", to: "/examples/http3-server", status: 301 },
  { from: "/vi/docs/examples", to: "/vi/examples", status: 301 },
  { from: "/vi/docs/examples/first-http-server", to: "/vi/examples/hello-world", status: 301 },
  { from: "/vi/docs/examples/first-websocket", to: "/vi/docs/websocket/quickstart", status: 301 },
  { from: "/vi/docs/examples/first-json-rpc-service", to: "/vi/examples/rpc-server", status: 301 },
  { from: "/vi/docs/examples/first-tls-server", to: "/vi/examples/https-server", status: 301 },
  {
    from: "/vi/docs/examples/first-cluster",
    to: "/vi/examples/shared-nothing-cluster",
    status: 301,
  },
  { from: "/vi/docs/examples/first-http3-server", to: "/vi/examples/http3-server", status: 301 },
  { from: "/examples/first-http-server", to: "/examples/hello-world", status: 301 },
  { from: "/examples/first-websocket", to: "/docs/websocket/quickstart", status: 301 },
  { from: "/examples/first-json-rpc-service", to: "/examples/rpc-server", status: 301 },
  { from: "/examples/first-tls-server", to: "/examples/https-server", status: 301 },
  { from: "/examples/first-cluster", to: "/examples/shared-nothing-cluster", status: 301 },
  { from: "/examples/first-http3-server", to: "/examples/http3-server", status: 301 },
  { from: "/vi/examples/first-http-server", to: "/vi/examples/hello-world", status: 301 },
  { from: "/vi/examples/first-websocket", to: "/vi/docs/websocket/quickstart", status: 301 },
  { from: "/vi/examples/first-json-rpc-service", to: "/vi/examples/rpc-server", status: 301 },
  { from: "/vi/examples/first-tls-server", to: "/vi/examples/https-server", status: 301 },
  { from: "/vi/examples/first-cluster", to: "/vi/examples/shared-nothing-cluster", status: 301 },
  { from: "/vi/examples/first-http3-server", to: "/vi/examples/http3-server", status: 301 },
  { from: "/docs/architecture/shared-nothing", to: "/docs/concepts/shared-nothing", status: 301 },
  { from: "/docs/architecture/memory-model", to: "/docs/concepts/capacity-model", status: 301 },
  { from: "/docs/guides/openapi", to: "/docs/http/openapi", status: 301 },
  { from: "/docs/guides/sse", to: "/docs/http/server-sent-events", status: 301 },
  { from: "/docs/guides/file-server", to: "/docs/http/static-files", status: 301 },
  { from: "/docs/guides/rate-limiting", to: "/docs/http/rate-limiting", status: 301 },
  { from: "/docs/http3/query-method", to: "/docs/http/query-method", status: 301 },
  { from: "/docs/type-safety/json", to: "/docs/http/json", status: 301 },
  { from: "/docs/getting-started/glossary", to: "/reference/glossary", status: 301 },
  { from: "/docs/websocket/security", to: "/docs/security/websocket-security", status: 301 },
  { from: "/docs/guides/chat", to: "/examples/chat-server", status: 301 },
  { from: "/docs/guides/cluster", to: "/examples/shared-nothing-cluster", status: 301 },
  { from: "/docs/guides/https", to: "/examples/https-server", status: 301 },
  { from: "/docs/guides/http3", to: "/examples/http3-server", status: 301 },
  { from: "/docs/guides/rpc-service", to: "/examples/rpc-server", status: 301 },
  {
    from: "/vi/docs/architecture/shared-nothing",
    to: "/vi/docs/concepts/shared-nothing",
    status: 301,
  },
  {
    from: "/vi/docs/architecture/memory-model",
    to: "/vi/docs/concepts/capacity-model",
    status: 301,
  },
  { from: "/vi/docs/guides/openapi", to: "/vi/docs/http/openapi", status: 301 },
  { from: "/vi/docs/guides/sse", to: "/vi/docs/http/server-sent-events", status: 301 },
  { from: "/vi/docs/guides/file-server", to: "/vi/docs/http/static-files", status: 301 },
  { from: "/vi/docs/guides/rate-limiting", to: "/vi/docs/http/rate-limiting", status: 301 },
  { from: "/vi/docs/http3/query-method", to: "/vi/docs/http/query-method", status: 301 },
  { from: "/vi/docs/type-safety/json", to: "/vi/docs/http/json", status: 301 },
  { from: "/vi/docs/getting-started/glossary", to: "/vi/reference/glossary", status: 301 },
  { from: "/vi/docs/websocket/security", to: "/vi/docs/security/websocket-security", status: 301 },
  { from: "/vi/docs/guides/chat", to: "/vi/examples/chat-server", status: 301 },
  { from: "/vi/docs/guides/cluster", to: "/vi/examples/shared-nothing-cluster", status: 301 },
  { from: "/vi/docs/guides/https", to: "/vi/examples/https-server", status: 301 },
  { from: "/vi/docs/guides/http3", to: "/vi/examples/http3-server", status: 301 },
  { from: "/vi/docs/guides/rpc-service", to: "/vi/examples/rpc-server", status: 301 },
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

  it("redirects to a page, never to another redirect source", () => {
    const redirects = createRedirects();
    const sources = new Set(redirects.map(({ from }) => from));

    for (const redirect of redirects) {
      expect(sources.has(redirect.to), `${redirect.from} -> ${redirect.to}`).toBe(false);
    }
  });
});
