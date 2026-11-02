import { defineMeta } from "blume";

export default defineMeta({
  title: "Concepts",
  icon: "layers",
  order: 5,
  directory: "none",
  pages: [
    "application-model",
    "request-lifecycle",
    "response-lifecycle",
    "routing-model",
    "handler-shapes",
    "middleware-model",
    "async-responses",
    "ownership-and-lifetimes",
    "capacity-model",
    "zero-allocation",
    "shared-nothing",
    "backpressure",
    "protocol-negotiation",
    "type-safety",
    "errors",
    "cluster-model",
    "security-model",
    "web-standards",
  ],
});
