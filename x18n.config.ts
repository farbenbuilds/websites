import { defineConfig } from "@x18n/core";

export default defineConfig({
  sourceLocale: "en",
  locales: ["en", "vi"],
  presets: ["general"],
  projects: ["apps/*"],
});
