import { defineMeta } from "blume";

export default defineMeta({
  title: "Deployment",
  icon: "rocket",
  order: 17,
  directory: "none",
  pages: [
    "checklist",
    "tls",
    "capacity-planning",
    "hardening",
    "observability",
    "shutdown",
    "docker",
    "kubernetes",
    "systemd",
    "reverse-proxy",
    "http3",
    "zero-downtime",
    "windows",
    "bsd",
  ],
});
