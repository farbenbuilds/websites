import type { DocsLocale } from "@farben/docs-components/docs-locale.ts";

import en from "../../locales/en.json" with { type: "json" };
import vi from "../../locales/vi.json" with { type: "json" };

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

type BenchmarkMessages = typeof en;

type ArenaMetricKey = keyof BenchmarkMessages["benchmark"]["metrics"];

const MESSAGES: Record<BenchmarkLocale, BenchmarkMessages> = { en, vi };

const BARS: readonly BenchmarkBar[] = [
  { name: "µWebZockets", value: "148,237", share: 100, leader: true },
  { name: "httpz", value: "109,571", share: 73.9 },
  { name: "zap", value: "102,595", share: 69.2 },
  { name: "dusty+zio", value: "91,995", share: 62.1 },
  { name: "std", value: "90,021", share: 60.7 },
  { name: "dusty+std", value: "60,801", share: 41 },
  { name: "zzz", value: "40,453", share: 27.3 },
];

const ARENA_METRICS: readonly {
  readonly key: ArenaMetricKey;
  readonly label: string;
  readonly value: string;
  readonly unit: string;
}[] = [
  { key: "http1", label: "HTTP/1.1", value: "3,736,192", unit: "req/s" },
  { key: "http2", label: "HTTP/2", value: "2,483,817", unit: "req/s" },
  { key: "webSocket", label: "WebSocket", value: "4,311,546", unit: "msg/s" },
  { key: "jsonCompression", label: "JSON compression", value: "16,639", unit: "req/s" },
  { key: "http3", label: "HTTP/3", value: "1,771", unit: "req/s" },
];

export function benchmarkCopy(locale: string | undefined): BenchmarkCopy {
  const resolvedLocale: BenchmarkLocale = locale === "vi" ? "vi" : "en";
  const messages = MESSAGES[resolvedLocale].benchmark;

  return {
    label: messages.label,
    heading: messages.heading,
    intro: messages.intro,
    benchLabel: "bench.zig.bd",
    benchHeading: messages.benchHeading,
    benchMeta: messages.benchMeta,
    benchAria: messages.benchAria,
    benchSource: messages.benchSource,
    bars: BARS,
    arenaLabel: "HTTP Arena",
    arenaHeading: messages.arenaHeading,
    arenaMeta: messages.arenaMeta,
    arenaSource: messages.arenaSource,
    arenaLink: "http-arena.com",
    arenaMetrics: ARENA_METRICS.map(({ key, label, value, unit }) => ({
      label,
      value,
      unit,
      detail: messages.metrics[key].detail,
    })),
  };
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
