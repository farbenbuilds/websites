import { defineMeta } from "blume";

export default defineMeta({
  title: "Security",
  icon: "shield-check",
  order: 13,
  directory: "none",
  pages: [
    "tls",
    "ephemeral-certificates",
    "production-certificates",
    "mtls",
    "tls-clusters",
    "early-data",
    "certificate-rotation",
    "authentication",
    "rate-limiting",
    "cors-and-headers",
    "input-hardening",
    "websocket-security",
    "http3-security",
    "threat-model",
    "reporting",
  ],
});
