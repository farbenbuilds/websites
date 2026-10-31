import type { DocsLocale } from "@farben/docs-components/docs-locale.ts";
import type { InlinePart } from "@farben/docs-components/inline-text.ts";

export type LandingLocale = DocsLocale;

export type LandingHighlight = {
  readonly lead: readonly InlinePart[];
  readonly text: readonly InlinePart[];
};

export type LandingCopy = {
  readonly intro: readonly InlinePart[];
  readonly highlights: {
    readonly items: readonly LandingHighlight[];
  };
  readonly example: {
    readonly lang: string;
    readonly code: string;
  };
  readonly notes: {
    readonly warning: readonly InlinePart[];
    readonly note: readonly InlinePart[];
  };
};

const ECHO_EXAMPLE = `import { WebSocket, WebSocketServer } from "ventiws";

const server = new WebSocketServer({ port: 8080 });

server.on("connection", (socket) => {
  socket.on("message", (data, isBinary) => {
    socket.send(isBinary ? data : \`echo: \${data.toString()}\`);
  });
});

const client = new WebSocket("ws://127.0.0.1:8080/");
client.on("open", () => client.send("hello"));
client.on("message", (data) => console.log("client saw", data.toString()));`;

const LANDING: Readonly<Record<LandingLocale, LandingCopy>> = {
  en: {
    intro: [
      { kind: "strong", value: "ventiws" },
      {
        kind: "text",
        value: " is a WebSocket implementation for Node.js with the API of ",
      },
      { kind: "link", value: "ws", href: "https://github.com/websockets/ws" },
      {
        kind: "text",
        value: ", delivered as a native addon whose framing engine is written in ",
      },
      { kind: "link", value: "Zig", href: "https://ziglang.org" },
      { kind: "text", value: ". It targets " },
      { kind: "code", value: "ws" },
      {
        kind: "text",
        value:
          " 8.22.0 and reproduces that release's observable behaviour rather than its source. ventiws is not affiliated with the ",
      },
      { kind: "code", value: "ws" },
      {
        kind: "text",
        value: " project and vendors none of its code.",
      },
    ],
    highlights: {
      items: [
        {
          lead: [
            { kind: "text", value: "The " },
            { kind: "code", value: "ws" },
            { kind: "text", value: " API" },
          ],
          text: [
            { kind: "code", value: "WebSocket" },
            { kind: "text", value: " and " },
            { kind: "code", value: "WebSocketServer" },
            { kind: "text", value: ", with option defaults matching " },
            { kind: "code", value: "ws" },
            { kind: "text", value: ": " },
            { kind: "code", value: "maxPayload" },
            { kind: "text", value: " 100 MiB, " },
            { kind: "code", value: "maxFragments" },
            { kind: "text", value: " 16384, and " },
            { kind: "code", value: "closeTimeout" },
            { kind: "text", value: " 30000 ms." },
          ],
        },
        {
          lead: [{ kind: "text", value: "A native addon" }],
          text: [
            {
              kind: "text",
              value:
                "the framing engine is Zig; the constructors are plain functions returning state records, with no ",
            },
            { kind: "code", value: "class" },
            { kind: "text", value: ", no " },
            { kind: "code", value: "this" },
            { kind: "text", value: ", and no prototype." },
          ],
        },
        {
          lead: [{ kind: "text", value: "No compiler on install" }],
          text: [
            { kind: "text", value: "per-platform binding packages mean " },
            { kind: "code", value: "pnpm add ventiws" },
            { kind: "text", value: " needs no toolchain." },
          ],
        },
        {
          lead: [{ kind: "text", value: "Compatibility you can check" }],
          text: [
            { kind: "text", value: "every " },
            { kind: "code", value: "ws" },
            {
              kind: "text",
              value:
                " surface item, its status, and the evidence test behind it are tracked in the repository's compatibility matrix.",
            },
          ],
        },
        {
          lead: [{ kind: "text", value: "A dev logger" }],
          text: [
            {
              kind: "text",
              value:
                "lifecycle records print as they happen (splash, open, close, error) with no callbacks to subscribe.",
            },
          ],
        },
      ],
    },
    example: {
      lang: "ts",
      code: ECHO_EXAMPLE,
    },
    notes: {
      warning: [
        {
          kind: "text",
          value:
            "ventiws is pre-1.0: the surface may change between beta releases, and Windows is not supported yet. The compatibility matrix and the known divergences from ",
        },
        { kind: "code", value: "ws" },
        { kind: "text", value: " live in the " },
        {
          kind: "link",
          value: "repository",
          href: "https://github.com/farbenbuilds/ventiws",
        },
        { kind: "text", value: "." },
      ],
      note: [
        {
          kind: "text",
          value: "This documentation site is being prepared. ",
        },
        {
          kind: "link",
          value: "Getting Started",
          href: "/getting-started",
        },
        {
          kind: "text",
          value: " covers install and first use; the rest of the guides are on the way.",
        },
      ],
    },
  },
  vi: {
    intro: [
      { kind: "strong", value: "ventiws" },
      {
        kind: "text",
        value: " là một bản triển khai WebSocket cho Node.js với API của ",
      },
      { kind: "link", value: "ws", href: "https://github.com/websockets/ws" },
      {
        kind: "text",
        value: ", được cung cấp dưới dạng native addon với bộ máy đóng khung viết bằng ",
      },
      { kind: "link", value: "Zig", href: "https://ziglang.org" },
      { kind: "text", value: ". Nó nhắm tới " },
      { kind: "code", value: "ws" },
      {
        kind: "text",
        value:
          " 8.22.0 và tái tạo hành vi quan sát được của bản phát hành đó thay vì mã nguồn. ventiws không liên kết với dự án ",
      },
      { kind: "code", value: "ws" },
      {
        kind: "text",
        value: " và không nhúng mã nguồn nào của dự án đó.",
      },
    ],
    highlights: {
      items: [
        {
          lead: [
            { kind: "text", value: "API " },
            { kind: "code", value: "ws" },
          ],
          text: [
            { kind: "code", value: "WebSocket" },
            { kind: "text", value: " và " },
            { kind: "code", value: "WebSocketServer" },
            { kind: "text", value: ", với giá trị mặc định của tùy chọn khớp " },
            { kind: "code", value: "ws" },
            { kind: "text", value: ": " },
            { kind: "code", value: "maxPayload" },
            { kind: "text", value: " 100 MiB, " },
            { kind: "code", value: "maxFragments" },
            { kind: "text", value: " 16384 và " },
            { kind: "code", value: "closeTimeout" },
            { kind: "text", value: " 30000 ms." },
          ],
        },
        {
          lead: [{ kind: "text", value: "Native addon" }],
          text: [
            {
              kind: "text",
              value:
                "bộ máy đóng khung viết bằng Zig; các constructor là hàm thuần trả về bản ghi trạng thái, không ",
            },
            { kind: "code", value: "class" },
            { kind: "text", value: ", không " },
            { kind: "code", value: "this" },
            { kind: "text", value: ", không prototype." },
          ],
        },
        {
          lead: [{ kind: "text", value: "Không cần compiler khi cài" }],
          text: [
            {
              kind: "text",
              value: "các gói binding theo nền tảng giúp ",
            },
            { kind: "code", value: "pnpm add ventiws" },
            { kind: "text", value: " không cần toolchain." },
          ],
        },
        {
          lead: [
            {
              kind: "text",
              value: "Khả năng tương thích có thể kiểm chứng",
            },
          ],
          text: [
            { kind: "text", value: "mọi mục bề mặt của " },
            { kind: "code", value: "ws" },
            {
              kind: "text",
              value:
                ", trạng thái và bài kiểm thử bằng chứng đều được theo dõi trong ma trận tương thích của kho.",
            },
          ],
        },
        {
          lead: [{ kind: "text", value: "Dev logger" }],
          text: [
            {
              kind: "text",
              value:
                "các bản ghi vòng đời được in ngay khi xảy ra (splash, open, close, error) mà không cần đăng ký callback.",
            },
          ],
        },
      ],
    },
    example: {
      lang: "ts",
      code: ECHO_EXAMPLE,
    },
    notes: {
      warning: [
        {
          kind: "text",
          value:
            "ventiws đang ở giai đoạn trước 1.0: bề mặt API có thể thay đổi giữa các bản beta, và Windows chưa được hỗ trợ. Ma trận tương thích và các khác biệt đã biết so với ",
        },
        { kind: "code", value: "ws" },
        { kind: "text", value: " nằm trong " },
        {
          kind: "link",
          value: "kho",
          href: "https://github.com/farbenbuilds/ventiws",
        },
        { kind: "text", value: "." },
      ],
      note: [
        {
          kind: "text",
          value: "Trang tài liệu này đang được chuẩn bị. ",
        },
        {
          kind: "link",
          value: "Bắt đầu",
          href: "/vi/getting-started",
        },
        {
          kind: "text",
          value: " hướng dẫn cài đặt và sử dụng lần đầu; các hướng dẫn còn lại sẽ được bổ sung.",
        },
      ],
    },
  },
};

export function landingCopy(locale: string | undefined): LandingCopy {
  return locale === "vi" ? LANDING.vi : LANDING.en;
}
