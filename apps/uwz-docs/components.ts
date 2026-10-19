import { defineComponents } from "blume";

import CopyCommand from "./components/copy-command.svelte";

export default defineComponents({
  mdx: {
    CopyCommand: { component: CopyCommand, client: "visible" },
  },
});
