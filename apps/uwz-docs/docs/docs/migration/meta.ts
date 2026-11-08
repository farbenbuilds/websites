import { defineMeta } from "blume";

export default defineMeta({
  title: "Migration",
  icon: "git-compare",
  order: 19,
  directory: "none",
  pages: [
    "from-uwebsockets",
    "from-std-http",
    "from-other-zig-frameworks",
    "from-c",
    "v1-to-v2",
    "v2-1-to-v2-2",
    "breaking-changes",
  ],
});
