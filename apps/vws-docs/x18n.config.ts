import { defineConfig } from "@x18n/core";

export default defineConfig({
  sourceLocale: "en",
  locales: ["en", "vi"],
  presets: ["general"],
  resources: [{ pattern: "locales/{locale}.json" }],
  usage: {
    // Section components read whole locale objects, so x18n cannot see individual key usages.
    keysInUse: ["**"],
  },
});
