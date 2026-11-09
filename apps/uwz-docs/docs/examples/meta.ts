import { defineMeta } from "blume";

export default defineMeta({
  title: "Examples",
  icon: "boxes",
  order: 3,
  directory: "none",
  pages: [
    "hello-world",
    "https-server",
    "shared-nothing-cluster",
    "tls-cluster",
    "basic-microservice",
    "custom-builder",
    "chat-server",
    "rpc-server",
    "http3-server",
    "delay-server",
  ],
});
