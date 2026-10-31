import { localizeHref, type SiteLocale } from "../../site-links.ts";
import type { InlinePart } from "../inline-text/inline-text.ts";

export type LandingLocale = SiteLocale;

export type LandingLink = {
  readonly label: string;
  readonly href: string;
};

export type LandingAction = LandingLink;

export type LandingStep = {
  readonly title: string;
  readonly text: string;
};

export type LandingSocial = {
  readonly label: string;
  readonly value: string;
  readonly href: string;
  readonly ariaLabel: string;
};

export type LandingCopy = {
  readonly hero: {
    readonly eyebrow: string;
    readonly title: string;
    readonly markSrc: string;
    readonly summary: readonly InlinePart[];
    readonly primaryAction: LandingAction;
    readonly secondaryAction: LandingAction;
    readonly dictionary: {
      readonly label: string;
      readonly lines: readonly string[];
      readonly status: string;
    };
    readonly butterflySeed?: number;
  };
  readonly server: {
    readonly label: string;
    readonly heading: string;
    readonly intro: string;
    readonly steps: readonly LandingStep[];
    readonly ctaText: string;
    readonly cta: LandingLink;
  };
  readonly author: {
    readonly label: string;
    readonly name: string;
    readonly avatarSrc: string;
    readonly avatarAlt: string;
    readonly bio: readonly InlinePart[];
    readonly socials: readonly LandingSocial[];
  };
  readonly sponsor: {
    readonly label: string;
    readonly heading: string;
    readonly logoSrc: string;
    readonly logoAlt: string;
    readonly body: string;
    readonly action: LandingAction;
  };
};

const LANDING: Readonly<Record<LandingLocale, LandingCopy>> = {
  en: {
    hero: {
      eyebrow: "Zig / HTTP / WebSocket / RPC",
      title: "µWebZockets",
      markSrc: "/icon.svg",
      summary: [
        {
          kind: "text",
          value:
            "A zero-allocation, shared-nothing server framework for Zig. HTTP/1.1, HTTP/2, HTTP/3, WebSocket, and RPC through one type-safe ",
        },
        { kind: "code", value: "Request" },
        { kind: "text", value: "/" },
        { kind: "code", value: "Response" },
        { kind: "text", value: " API." },
      ],
      primaryAction: {
        label: "Getting Started",
        href: localizeHref("/getting-started", "en"),
      },
      secondaryAction: {
        label: "View on GitHub",
        href: "https://github.com/farbenbuilds/uWebZockets",
      },
      dictionary: {
        label: "Dictionary entry for the word fast",
        lines: [
          "速い",
          "/はやい/ · 形容詞",
          "1. 動きや動作の速度が大きい。",
          "2. Zig で HTTP、WebSocket、RPC をゼロアロケーションで処理する。",
        ],
        status: "Semi-production ready.",
      },
    },
    server: {
      label: "04 / Server",
      heading: "Use µWZ as your server",
      intro:
        "Keep the Zig application you already have. The runtime takes over transport, TLS, limits, and shutdown without changing how your handlers are written.",
      steps: [
        {
          title: "Add the package",
          text: "Fetch the pinned dependencies through the Zig package manager. No CMake, Ninja, Go, Perl, Python, or system zlib.",
        },
        {
          title: "Mount your handlers",
          text: "Register HTTP, WebSocket, RPC, and static routes on one app. Your handlers stay ordinary Zig functions.",
        },
        {
          title: "Run where you deploy",
          text: "Start one process or a thread-per-core cluster. Each worker owns its event loop, slab set, and physical core affinity where the platform allows.",
        },
      ],
      ctaText: "Bring your routes. The runtime owns transport, TLS, limits, and shutdown.",
      cta: {
        label: "Read the setup guide",
        href: localizeHref("/getting-started", "en"),
      },
    },
    author: {
      label: "05 / Author",
      name: "Noah Trần",
      avatarSrc: "/author/noah-tran.webp",
      avatarAlt: "Noah Trần",
      bio: [
        {
          kind: "text",
          value:
            "Noah Trần is a software engineer based in Ho Chi Minh, working across Svelte, Astro, Zig, Rust, design, and framework/tooling. They are the creator of ",
        },
        { kind: "link", value: "Hope Art", href: "https://hope-art.app" },
        { kind: "text", value: " and now author and lead maintainer of " },
        { kind: "link", value: "Farben", href: "https://github.com/farbenbuilds" },
        { kind: "text", value: "." },
      ],
      socials: [
        {
          label: "Facebook",
          value: "Noah Trần",
          href: "https://www.facebook.com/noah.tran1109",
          ariaLabel: "Facebook: Noah Trần",
        },
        {
          label: "X",
          value: "@sh1ro_code",
          href: "https://x.com/sh1ro_code",
          ariaLabel: "X: @sh1ro_code",
        },
      ],
    },
    sponsor: {
      label: "06 / Sponsor",
      heading: "Sponsor the maintainers.",
      logoSrc: "/sponsor/farben-logo.png",
      logoAlt: "Farben logo",
      body: "Thank you to the Farben maintainers for their hard work across the runtime, packages, and documentation. If µWebZockets helps your service, sponsor the work on GitHub.",
      action: {
        label: "Sponsor Farben",
        href: "https://github.com/sponsors/farbenbuilds",
      },
    },
  },
  vi: {
    hero: {
      eyebrow: "Zig / HTTP / WebSocket / RPC",
      title: "µWebZockets",
      markSrc: "/icon.svg",
      summary: [
        {
          kind: "text",
          value:
            "Framework máy chủ zero-allocation, shared-nothing cho Zig. HTTP/1.1, HTTP/2, HTTP/3, WebSocket và RPC qua một API type-safe ",
        },
        { kind: "code", value: "Request" },
        { kind: "text", value: "/" },
        { kind: "code", value: "Response" },
        { kind: "text", value: " duy nhất." },
      ],
      primaryAction: {
        label: "Bắt đầu",
        href: localizeHref("/getting-started", "vi"),
      },
      secondaryAction: {
        label: "Xem trên GitHub",
        href: "https://github.com/farbenbuilds/uWebZockets",
      },
      dictionary: {
        label: "Mục từ điển cho từ fast",
        lines: [
          "速い",
          "/はやい/ · 形容詞",
          "1. 動きや動作の速度が大きい。",
          "2. Zig で HTTP、WebSocket、RPC をゼロアロケーションで処理する。",
        ],
        status: "Sẵn sàng ở mức bán production.",
      },
      butterflySeed: 20261030,
    },
    server: {
      label: "04 / Máy chủ",
      heading: "Dùng µWZ làm máy chủ",
      intro:
        "Giữ ứng dụng Zig bạn đã có. Runtime đảm nhận transport, TLS, giới hạn và shutdown mà không đổi cách viết handler.",
      steps: [
        {
          title: "Thêm gói",
          text: "Tải các phụ thuộc được ghim qua trình quản lý gói của Zig. Không cần CMake, Ninja, Go, Perl, Python hay zlib hệ thống.",
        },
        {
          title: "Gắn handler",
          text: "Đăng ký route HTTP, WebSocket, RPC và tệp tĩnh trên một app. Handler của bạn vẫn là các hàm Zig bình thường.",
        },
        {
          title: "Chạy nơi bạn triển khai",
          text: "Khởi động một tiến trình hoặc cluster thread-per-core. Mỗi worker sở hữu event loop, bộ slab và affinity lõi vật lý khi nền tảng cho phép.",
        },
      ],
      ctaText: "Mang theo route. Runtime lo transport, TLS và shutdown.",
      cta: {
        label: "Đọc hướng dẫn cài đặt",
        href: localizeHref("/getting-started", "vi"),
      },
    },
    author: {
      label: "05 / Tác giả",
      name: "Noah Trần",
      avatarSrc: "/author/noah-tran.webp",
      avatarAlt: "Noah Trần",
      bio: [
        {
          kind: "text",
          value:
            "Noah Trần là kỹ sư phần mềm tại Thành phố Hồ Chí Minh, làm việc với Svelte, Astro, Zig, Rust, thiết kế và framework/tooling. Tác giả đã tạo ra ",
        },
        { kind: "link", value: "Hope Art", href: "https://hope-art.app" },
        { kind: "text", value: " và hiện là tác giả, lead maintainer của " },
        { kind: "link", value: "Farben", href: "https://github.com/farbenbuilds" },
        { kind: "text", value: "." },
      ],
      socials: [
        {
          label: "Facebook",
          value: "Noah Trần",
          href: "https://www.facebook.com/noah.tran1109",
          ariaLabel: "Facebook: Noah Trần",
        },
        {
          label: "X",
          value: "@sh1ro_code",
          href: "https://x.com/sh1ro_code",
          ariaLabel: "X: @sh1ro_code",
        },
      ],
    },
    sponsor: {
      label: "06 / Tài trợ",
      heading: "Tài trợ cho các maintainer.",
      logoSrc: "/sponsor/farben-logo.png",
      logoAlt: "Logo Farben",
      body: "Cảm ơn các maintainer của Farben vì công sức của họ cho runtime, các gói và tài liệu. Nếu µWebZockets hữu ích cho dịch vụ của bạn, hãy tài trợ cho dự án trên GitHub.",
      action: {
        label: "Tài trợ Farben",
        href: "https://github.com/sponsors/farbenbuilds",
      },
    },
  },
};

export function landingCopy(locale: string | undefined): LandingCopy {
  return locale === "vi" ? LANDING.vi : LANDING.en;
}
