import { defineConfig } from "@x18n/core";

export default defineConfig({
  sourceLocale: "en",
  locales: ["en", "vi"],
  presets: ["general"],
  // Component UI copy only. Documentation pages stay in docs/ and docs/vi/ MDX.
  resources: [{ pattern: "locales/{locale}.json" }],
  usage: {
    // Section components read whole locale objects, so x18n cannot see individual key usages.
    keysInUse: ["**"],
  },
});
