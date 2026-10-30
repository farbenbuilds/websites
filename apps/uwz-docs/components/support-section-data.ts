export type SupportLocale = "en" | "vi";

export type SupportItem = {
  readonly title: string;
  readonly text: string;
};

export type PlatformRow = {
  readonly target: string;
  readonly status: string;
};

export type BenchmarkBar = {
  readonly name: string;
  readonly value: string;
  readonly share: number;
  readonly leader?: boolean;
};

export type SupportCopy = {
  readonly label: string;
  readonly heading: string;
  readonly intro: string;
  readonly items: readonly SupportItem[];
  readonly platformsLabel: string;
  readonly targetLabel: string;
  readonly statusLabel: string;
  readonly platforms: readonly PlatformRow[];
  readonly benchmarkLabel: string;
  readonly benchmarkHeading: string;
  readonly benchmarkMeta: string;
  readonly benchmarkAria: string;
  readonly benchmarkSource: string;
  readonly bars: readonly BenchmarkBar[];
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

const SUPPORT: Readonly<Record<SupportLocale, SupportCopy>> = {
  en: {
    label: "02 / Support",
    heading: "What µWZ supports",
    intro:
      "One server surface for the transports a Zig service actually needs, with the same routing, limits, and lifecycle across each one.",
    items: [
      {
        title: "HTTP/1.1 and HTTP/2",
        text: "Persistent connections, streaming bodies, multiplexed streams, and TLS ALPN in one handler model.",
      },
      {
        title: "HTTP/3",
        text: "QUIC over UDP with the same routing and handlers as the TCP transports. QUIC clustering is not supported.",
      },
      {
        title: "WebSocket",
        text: "RFC 6455 with compression, pub/sub, and heartbeats for long-lived connections.",
      },
      {
        title: "RPC",
        text: "Typed request and response calls that share the app, limits, and worker model.",
      },
      {
        title: "TLS",
        text: "Ephemeral and production credentials, ALPN, 0-RTT, and mutual TLS.",
      },
      {
        title: "Static assets",
        text: "Serve files from the same process instead of adding a second asset server.",
      },
      {
        title: "Thread-per-core workers",
        text: "Shared-nothing workers with one event loop each, pinned to physical cores where the platform allows.",
      },
      {
        title: "Zero allocation",
        text: "Bounded startup slabs and explicit capacity limits on every request path.",
      },
    ],
    platformsLabel: "Platforms",
    targetLabel: "Target",
    statusLabel: "Status",
    platforms: [
      { target: "Linux x86_64", status: "Tested" },
      { target: "Linux aarch64", status: "Tested" },
      { target: "macOS x86_64", status: "Supported" },
      { target: "macOS aarch64", status: "Supported" },
      { target: "Windows x86_64", status: "Compile-checked" },
    ],
    benchmarkLabel: "Benchmark",
    benchmarkHeading: "Plaintext throughput",
    benchmarkMeta: "Requests per second · Plaintext · Linux x86_64 · 32 connections · 8 seconds",
    benchmarkAria: "Zig server plaintext throughput in requests per second",
    benchmarkSource: "Source: bench.zig.bd, captured 2026-10-30. Higher is better.",
    bars: BARS,
  },
  vi: {
    label: "02 / Hỗ trợ",
    heading: "µWZ hỗ trợ gì",
    intro:
      "Một bề mặt máy chủ cho các giao thức mà dịch vụ Zig thực sự cần, với cùng định tuyến, giới hạn và vòng đời cho từng giao thức.",
    items: [
      {
        title: "HTTP/1.1 và HTTP/2",
        text: "Kết nối liên tục, body dạng stream, luồng đa hợp và ALPN TLS trong cùng một mô hình handler.",
      },
      {
        title: "HTTP/3",
        text: "QUIC trên UDP với cùng định tuyến và handler như các transport TCP. Cluster QUIC chưa được hỗ trợ.",
      },
      {
        title: "WebSocket",
        text: "RFC 6455 với nén, pub/sub và heartbeat cho kết nối dài hạn.",
      },
      {
        title: "RPC",
        text: "Lời gọi request/response có kiểu, dùng chung app, giới hạn và mô hình worker.",
      },
      {
        title: "TLS",
        text: "Chứng chỉ tạm thời và production, ALPN, 0-RTT và mutual TLS.",
      },
      {
        title: "Tài nguyên tĩnh",
        text: "Phục vụ tệp trong cùng tiến trình thay vì thêm một máy chủ tài sản thứ hai.",
      },
      {
        title: "Worker thread-per-core",
        text: "Worker shared-nothing với một event loop mỗi worker, được ghim vào lõi vật lý khi nền tảng cho phép.",
      },
      {
        title: "Zero allocation",
        text: "Slab khởi động có giới hạn và giới hạn dung lượng tường minh trên mọi đường xử lý.",
      },
    ],
    platformsLabel: "Nền tảng",
    targetLabel: "Mục tiêu",
    statusLabel: "Trạng thái",
    platforms: [
      { target: "Linux x86_64", status: "Đã kiểm thử" },
      { target: "Linux aarch64", status: "Đã kiểm thử" },
      { target: "macOS x86_64", status: "Được hỗ trợ" },
      { target: "macOS aarch64", status: "Được hỗ trợ" },
      { target: "Windows x86_64", status: "Kiểm tra biên dịch" },
    ],
    benchmarkLabel: "Benchmark",
    benchmarkHeading: "Thông lượng plaintext",
    benchmarkMeta: "Yêu cầu mỗi giây · Plaintext · Linux x86_64 · 32 kết nối · 8 giây",
    benchmarkAria: "Thông lượng plaintext của máy chủ Zig, yêu cầu mỗi giây",
    benchmarkSource: "Nguồn: bench.zig.bd, ghi nhận 2026-10-30. Cao hơn là tốt hơn.",
    bars: BARS,
  },
};

export function supportCopy(locale: string | undefined): SupportCopy {
  return locale === "vi" ? SUPPORT.vi : SUPPORT.en;
}

export function renderSupportMarkdown(locale: string | undefined): string {
  const copy = supportCopy(locale);
  const items = copy.items.map((item) => `- **${item.title}:** ${item.text}`).join("\n");

  const platforms = [
    `| ${copy.targetLabel} | ${copy.statusLabel} |`,
    "| --- | --- |",
    ...copy.platforms.map((platform) => `| ${platform.target} | ${platform.status} |`),
  ].join("\n");

  const bars = copy.bars.map((bar) => `- ${bar.name}: ${bar.value}`).join("\n");

  return [
    `## ${copy.heading}`,
    copy.intro,
    items,
    `### ${copy.platformsLabel}`,
    platforms,
    `### ${copy.benchmarkHeading}`,
    copy.benchmarkMeta,
    bars,
    copy.benchmarkSource,
  ].join("\n\n");
}
