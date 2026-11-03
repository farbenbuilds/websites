import { defineMeta } from "blume";

export default defineMeta({
  title: "WebSocket",
  icon: "plug-2",
  order: 7,
  directory: "none",
  pages: [
    "quickstart",
    "handshake",
    "messages",
    "backpressure",
    "compression",
    "heartbeats",
    "close-codes",
    "pub-sub",
    "cluster-pub-sub",
    "http2-tunnels",
    "security",
    "testing",
    "limits",
  ],
});
