import { defineMeta } from "blume";

export default defineMeta({
  title: "Kiến trúc",
  icon: "network",
  order: 14,
  directory: "none",
  pages: [
    "shared-nothing",
    "event-loop",
    "memory-model",
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
