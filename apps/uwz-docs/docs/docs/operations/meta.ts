import { defineMeta } from "blume";

export default defineMeta({
  title: "Operations",
  icon: "wrench",
  order: 16,
  directory: "none",
  pages: [
    "build",
    "nix",
    "testing",
    "sanitizers",
    "fuzzing",
    "cross-compilation",
    "c-abi",
    "releases",
    "dependencies",
    "platforms",
    "logging",
    "metrics",
    "graceful-shutdown",
    "troubleshooting",
    "development-log",
    "ebpf",
    "wasm",
    "ktls",
    "af-xdp",
  ],
});
