import { readdir } from "node:fs/promises";
import { describe, expect, it } from "vite-plus/test";

import rootConfig from "../../x18n.config.ts";
import uwzDocsConfig from "../../apps/uwz-docs/x18n.config.ts";
import vwsDocsConfig from "../../apps/vws-docs/x18n.config.ts";

const APP_CONFIGS = [uwzDocsConfig, vwsDocsConfig];
const DOCS_APPS = ["uwz-docs", "vws-docs"];

describe("i18n boundaries", () => {
  it("checks only component locale resources", () => {
    for (const config of APP_CONFIGS) {
      const patterns = (config.resources ?? []).map(({ pattern }) => pattern);

      expect(patterns.length).toBeGreaterThan(0);

      for (const pattern of patterns) {
        expect(pattern.startsWith("locales/")).toBe(true);
        expect(pattern).not.toMatch(/docs|\.mdx?$/);
      }
    }
  });

  it("keeps documentation directories out of the x18n projects", () => {
    expect(rootConfig.projects).toEqual(["apps/*"]);
  });

  it("ships one en and one vi locale file per docs app", async () => {
    for (const app of DOCS_APPS) {
      const files = await readdir(new URL(`../../apps/${app}/locales/`, import.meta.url));

      expect(files.sort()).toEqual(["en.json", "vi.json"]);
    }
  });
});
