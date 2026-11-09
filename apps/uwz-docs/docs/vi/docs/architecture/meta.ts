import { defineMeta } from "blume";

export default defineMeta({
  title: "Kiến trúc",
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
