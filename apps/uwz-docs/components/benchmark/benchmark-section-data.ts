import type { DocsLocale } from "../docs-locale.ts";

export type BenchmarkLocale = DocsLocale;

export type BenchmarkBar = {
  readonly name: string;
  readonly value: string;
  readonly share: number;
  readonly leader?: boolean;
};

export type ArenaMetric = {
  readonly label: string;
  readonly value: string;
  readonly unit: string;
  readonly detail: string;
};

export type BenchmarkCopy = {
  readonly label: string;
  readonly heading: string;
  readonly intro: string;
  readonly benchLabel: string;
  readonly benchHeading: string;
  readonly benchMeta: string;
  readonly benchAria: string;
  readonly benchSource: string;
  readonly bars: readonly BenchmarkBar[];
  readonly arenaLabel: string;
  readonly arenaHeading: string;
  readonly arenaMeta: string;
  readonly arenaSource: string;
  readonly arenaLink: string;
  readonly arenaMetrics: readonly ArenaMetric[];
};

const BARS: readonly BenchmarkBar[] = [
  { name: "µWebZockets", value: "148,237", share: 100, leader: true },
  { name: "httpz", value: "109,571", share: 73.9 },
  { name: "zap", value: "102,595", share: 69.2 },
  { name: "dusty+zio", value: "91,995", share: 62.1 },
  { name: "std", value: "90,021", share: 60.7 },
  { name: "dusty+std", value: "60,801", share: 41 },
  { name: "zzz", value: "40,453", share: 27.3 },
];

const ARENA_METRICS: readonly ArenaMetric[] = [
  { label: "HTTP/1.1", value: "3,736,192", unit: "req/s", detail: "4,096 connections" },
  { label: "HTTP/2", value: "2,483,817", unit: "req/s", detail: "4,096 connections" },
  { label: "WebSocket", value: "4,311,546", unit: "msg/s", detail: "4,096 connections" },
  { label: "JSON compression", value: "16,639", unit: "req/s", detail: "4,096 connections" },
  { label: "HTTP/3", value: "1,771", unit: "req/s", detail: "64 connections" },
];

const BENCHMARKS: Readonly<Record<BenchmarkLocale, BenchmarkCopy>> = {
  en: {
    label: "03 / Benchmark",
    heading: "Benchmarks.",
    intro:
      "Independent measurements from two Zig server benchmarks. Higher is better; the linked pages carry the full runs.",
    benchLabel: "bench.zig.bd",
    benchHeading: "Plaintext throughput",
    benchMeta: "Requests per second · Plaintext · Linux x86_64 · 32 connections · 8 seconds",
    benchAria: "Zig server plaintext throughput in requests per second",
    benchSource: "Source: bench.zig.bd, captured 2026-10-30.",
    bars: BARS,
    arenaLabel: "HTTP Arena",
    arenaHeading: "Cross-protocol results",
    arenaMeta: "Alpha Round · 23 runs · updated 2026-10-28",
    arenaSource: "Source: HTTP Arena. Requests per second unless noted.",
    arenaLink: "http-arena.com",
    arenaMetrics: ARENA_METRICS,
  },
  vi: {
    label: "03 / Benchmark",
    heading: "Hiệu năng.",
    intro:
      "Các phép đo độc lập từ hai benchmark máy chủ Zig. Cao hơn là tốt hơn; trang nguồn có đầy đủ kết quả.",
    benchLabel: "bench.zig.bd",
    benchHeading: "Thông lượng plaintext",
    benchMeta: "Yêu cầu mỗi giây · Plaintext · Linux x86_64 · 32 kết nối · 8 giây",
    benchAria: "Thông lượng plaintext của máy chủ Zig, yêu cầu mỗi giây",
    benchSource: "Nguồn: bench.zig.bd, ghi nhận 2026-10-30.",
    bars: BARS,
    arenaLabel: "HTTP Arena",
    arenaHeading: "Kết quả đa giao thức",
    arenaMeta: "Alpha Round · 23 lần chạy · cập nhật 2026-10-28",
    arenaSource: "Nguồn: HTTP Arena. Đơn vị là yêu cầu mỗi giây trừ khi có ghi chú.",
    arenaLink: "http-arena.com",
    arenaMetrics: ARENA_METRICS,
  },
};

export function benchmarkCopy(locale: string | undefined): BenchmarkCopy {
  return locale === "vi" ? BENCHMARKS.vi : BENCHMARKS.en;
}

export function renderBenchmarkMarkdown(locale: string | undefined): string {
  const copy = benchmarkCopy(locale);
  const bars = copy.bars.map((bar) => `- ${bar.name}: ${bar.value}`).join("\n");

  const arena = copy.arenaMetrics
    .map((metric) => `- ${metric.label}: ${metric.value} ${metric.unit} (${metric.detail})`)
    .join("\n");

  return [
    `## ${copy.heading}`,
    copy.intro,
    `### ${copy.benchLabel} · ${copy.benchHeading}`,
    copy.benchMeta,
    bars,
    copy.benchSource,
    `### ${copy.arenaLabel} · ${copy.arenaHeading}`,
    copy.arenaMeta,
    arena,
    copy.arenaSource,
  ].join("\n\n");
}
