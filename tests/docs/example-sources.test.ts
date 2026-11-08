import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import process from "node:process";

import { describe, expect, it } from "vite-plus/test";

const FIXTURE = "tests/fixtures/uwz-example-fences.json";

// Refresh the hashes when an example fence changes, then run the suite with
// UWEBZOCKETS_ROOT=<checkout> to compare the fences with the framework source.
type ExampleFixture = {
  readonly page: string;
  readonly source: string;
  readonly sha256: string;
};

const EXPECTED_OUTPUT = new Map<string, readonly string[]>([
  ["hello-world.mdx", ["Hello from µWebZockets! Zero allocation achieved."]],
  ["https-server.mdx", ["hello from ephemeral TLS"]],
  ["shared-nothing-cluster.mdx", ["hello from a pinned shared-nothing worker"]],
  ["tls-cluster.mdx", ["hello from a TLS worker group"]],
  [
    "basic-microservice.mdx",
    ['{"status":"ok","preset":"microservice"}', '{"query":"zig","page":2,"raw":"2"}'],
  ],
  ["custom-builder.mdx", ['{"received_bytes":17}', "payload_too_large"]],
  ["chat-server.mdx", ["system: a new user just joined"]],
  ["rpc-server.mdx", ['{"jsonrpc":"2.0","result":{"sum":5},"id":1}']],
  ["http3-server.mdx", ["Hello from bounded HTTP/3"]],
  ["delay-server.mdx", ["delayed response", "400"]],
]);

function fenceOf(source: string): string {
  const match = /```zig src\/main\.zig\n([\s\S]*?)\n```/.exec(source);

  if (!match) throw new Error("missing zig src/main.zig fence");

  return match[1].trimEnd();
}

function digest(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function verifySection(source: string): string {
  const start = source.indexOf("## Verify");

  if (start === -1) throw new Error("missing Verify section");

  const rest = source.slice(start);
  const end = rest.indexOf("\n## ", 5);

  return end === -1 ? rest : rest.slice(0, end);
}

async function loadFixtures(): Promise<ExampleFixture[]> {
  const source = await readFile(FIXTURE, "utf8");

  // SAFETY: FIXTURE is repository-owned JSON with the declared ExampleFixture shape.
  return JSON.parse(source) as ExampleFixture[];
}

describe("canonical example pages", () => {
  it("keeps every source fence aligned with the checked-in fixture", async () => {
    const fixtures = await loadFixtures();

    for (const fixture of fixtures) {
      const page = await readFile(fixture.page, "utf8");

      expect(digest(fenceOf(page)), fixture.source).toBe(fixture.sha256);
    }
  });

  it("links the full source at the documented release tag", async () => {
    const fixtures = await loadFixtures();

    for (const fixture of fixtures) {
      const page = await readFile(fixture.page, "utf8");

      expect(page, fixture.source).toContain(
        `https://github.com/farbenbuilds/uWebZockets/blob/v2.1.6/examples/${fixture.source}`,
      );
    }
  });

  it("shows the expected output for every example", async () => {
    const fixtures = await loadFixtures();

    for (const fixture of fixtures) {
      const page = await readFile(fixture.page, "utf8");
      const name = fixture.page.split("/").at(-1) ?? fixture.page;

      for (const output of EXPECTED_OUTPUT.get(name) ?? []) {
        expect(verifySection(page), name).toContain(output);
      }
    }
  });

  it("keeps the hello-world content-length equal to the body bytes", async () => {
    for (const page of [
      "apps/uwz-docs/docs/examples/hello-world.mdx",
      "apps/uwz-docs/docs/vi/examples/hello-world.mdx",
    ]) {
      const source = await readFile(page, "utf8");
      const body = /res\.text\("([^"]+)"\)/.exec(source)?.[1];

      if (!body) throw new Error("missing hello-world response body");

      const bytes = Buffer.byteLength(body);
      const note = page.includes("/vi/") ? `Body dài ${bytes} byte` : `The body is ${bytes} bytes`;

      expect(source).toContain(`content-length: ${bytes}`);
      expect(source).toContain(note);
    }
  });

  it("compares every fence with a framework checkout when requested", async () => {
    const root = process.env.UWEBZOCKETS_ROOT;

    if (!root) return;

    const fixtures = await loadFixtures();

    for (const fixture of fixtures) {
      const page = await readFile(fixture.page, "utf8");
      const source = await readFile(join(root, "examples", fixture.source), "utf8");

      expect(fenceOf(page), fixture.source).toBe(source.trimEnd());
    }
  });
});
