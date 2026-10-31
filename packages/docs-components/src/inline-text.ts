export type InlinePart =
  | { readonly kind: "text"; readonly value: string }
  | { readonly kind: "code"; readonly value: string }
  | { readonly kind: "strong"; readonly value: string }
  | {
      readonly kind: "link";
      readonly value: string;
      readonly href: string;
      readonly className?: string;
    };

export function isExternalHref(href: string): boolean {
  return href.startsWith("https://") || href.startsWith("http://") || href.startsWith("//");
}

export function inlinePartsToMarkdown(parts: readonly InlinePart[]): string {
  return parts
    .map((part) => {
      if (part.kind === "code") return `\`${part.value}\``;

      if (part.kind === "strong") return `**${part.value}**`;

      if (part.kind === "link") return `[${part.value}](${part.href})`;

      return part.value;
    })
    .join("");
}
