import { defineMeta } from "blume";

export default defineMeta({
  title: "Architecture",
  icon: "network",
  order: 14,
  directory: "none",
  pages: [
    "event-loop",
    "router-internals",
    "callback-lifecycle",
    "shutdown",
    "transports",
    "cluster-internals",
    "backends",
    "edge-and-wasm",
    "c-abi",
    "dependencies",
    "ktls-and-xdp",
  ],
});
