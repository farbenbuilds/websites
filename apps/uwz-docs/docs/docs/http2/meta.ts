import { defineMeta } from "blume";

export default defineMeta({
  title: "HTTP/2",
  icon: "git-fork",
  order: 8,
  directory: "none",
  pages: [
    "getting-started",
    "configuration",
    "frames-and-streams",
    "hpack",
    "flow-control",
    "websocket-tunnels",
    "limits",
    "observability",
    "testing",
  ],
});
