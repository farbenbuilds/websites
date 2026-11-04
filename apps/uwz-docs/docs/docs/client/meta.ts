import { defineMeta } from "blume";

export default defineMeta({
  title: "HTTP client",
  icon: "send",
  order: 12,
  directory: "none",
  pages: [
    "quickstart",
    "fetch-blocking",
    "callback-client",
    "tls-trust",
    "timeouts-and-errors",
    "limits",
  ],
});
