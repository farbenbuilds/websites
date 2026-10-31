import type { DocsLocale } from "@farben/docs-components/docs-locale.ts";

export type SupportLocale = DocsLocale;

export type SupportItem = {
  readonly title: string;
  readonly text: string;
};

export type PlatformRow = {
  readonly platform: string;
  readonly architecture: string;
  readonly status: string;
};

export type SupportCopy = {
  readonly label: string;
  readonly heading: string;
  readonly intro: string;
  readonly items: readonly SupportItem[];
  readonly platformsLabel: string;
  readonly platformNote: string;
  readonly platformHeader: string;
  readonly architectureHeader: string;
  readonly statusHeader: string;
  readonly platforms: readonly PlatformRow[];
};

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
    platformNote:
      "Linux runs the hosted runtime matrix; macOS is supported and cross-compiled; Windows is compile-checked.",
    platformHeader: "Platform",
    architectureHeader: "Architecture",
    statusHeader: "Status",
    platforms: [
      { platform: "Linux", architecture: "x86_64", status: "Tested" },
      { platform: "Linux", architecture: "aarch64", status: "Tested" },
      { platform: "macOS", architecture: "x86_64", status: "Supported" },
      { platform: "macOS", architecture: "aarch64", status: "Supported" },
      { platform: "Windows", architecture: "x86_64", status: "Compile-checked" },
    ],
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
    platformNote:
      "Linux chạy ma trận runtime trên CI; macOS được hỗ trợ và cross-compile; Windows được kiểm tra biên dịch.",
    platformHeader: "Nền tảng",
    architectureHeader: "Kiến trúc",
    statusHeader: "Trạng thái",
    platforms: [
      { platform: "Linux", architecture: "x86_64", status: "Đã kiểm thử" },
      { platform: "Linux", architecture: "aarch64", status: "Đã kiểm thử" },
      { platform: "macOS", architecture: "x86_64", status: "Được hỗ trợ" },
      { platform: "macOS", architecture: "aarch64", status: "Được hỗ trợ" },
      { platform: "Windows", architecture: "x86_64", status: "Kiểm tra biên dịch" },
    ],
  },
};

export function supportCopy(locale: string | undefined): SupportCopy {
  return locale === "vi" ? SUPPORT.vi : SUPPORT.en;
}

export function renderSupportMarkdown(locale: string | undefined): string {
  const copy = supportCopy(locale);
  const items = copy.items.map((item) => `- **${item.title}:** ${item.text}`).join("\n");

  const platforms = [
    `| ${copy.platformHeader} | ${copy.architectureHeader} | ${copy.statusHeader} |`,
    "| --- | --- | --- |",
    ...copy.platforms.map(
      (platform) => `| ${platform.platform} | ${platform.architecture} | ${platform.status} |`,
    ),
  ].join("\n");

  return [
    `## ${copy.heading}`,
    copy.intro,
    items,
    `### ${copy.platformsLabel}`,
    copy.platformNote,
    platforms,
  ].join("\n\n");
}
