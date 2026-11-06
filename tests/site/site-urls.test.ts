import { describe, expect, it } from "vite-plus/test";

import {
  AUTHOR_URL,
  BENCHMARK_URL,
  FACEBOOK_URL,
  HTTP_ARENA_FRAMEWORK_URL,
  PRODUCT_LICENSE_URL,
  PRODUCT_REPOSITORY_URL,
  SPONSOR_URL,
  X_URL,
} from "../../apps/uwz-docs/site-urls.ts";

const EXPECTED_URLS = {
  author: "https://github.com/Coder-Blue",
  benchmark: "https://bench.zig.bd/",
  facebook: "https://www.facebook.com/noah.tran1109",
  httpArena: "https://http-arena.com/frameworks/uwebzockets/",
  productLicense: "https://github.com/farbenbuilds/uWebZockets/blob/main/LICENSE",
  productRepository: "https://github.com/farbenbuilds/uWebZockets",
  sponsor: "https://github.com/sponsors/farbenbuilds",
  x: "https://x.com/sh1ro_code",
} as const;

const ACTUAL_URLS = {
  author: AUTHOR_URL,
  benchmark: BENCHMARK_URL,
  facebook: FACEBOOK_URL,
  httpArena: HTTP_ARENA_FRAMEWORK_URL,
  productLicense: PRODUCT_LICENSE_URL,
  productRepository: PRODUCT_REPOSITORY_URL,
  sponsor: SPONSOR_URL,
  x: X_URL,
} as const;

describe("site URLs", () => {
  it("keeps the exact external destinations", () => {
    expect(ACTUAL_URLS).toEqual(EXPECTED_URLS);
  });

  it("keeps every external destination on HTTPS", () => {
    for (const url of Object.values(ACTUAL_URLS)) {
      expect(new URL(url).protocol).toBe("https:");
    }
  });
});
