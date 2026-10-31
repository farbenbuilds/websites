import astro from "eslint-plugin-astro";

// Oxlint exposes .astro frontmatter as a plain Program and does not implement
// custom parsers. Astro rules gate on parserServices.isAstro, so this adapter
// supplies the flag for the frontmatter-only rules the project enables.
export const FRONTMATTER_RULES = [
  "no-deprecated-astro-canonicalurl",
  "no-deprecated-astro-fetchcontent",
  "no-deprecated-astro-resolve",
  "no-deprecated-getentrybyslug",
  "no-exports-from-components",
  "no-prerender-export-outside-pages",
];

function withAstroParserServices(rule) {
  return {
    ...rule,
    create(context) {
      if (!context.filename?.endsWith(".astro")) return rule.create(context);

      // Object.create preserves the upstream context methods; a Proxy fails
      // because Oxlint exposes some context properties as non-configurable.
      const sourceCode = context.sourceCode;
      const sourceProxy = Object.create(sourceCode);

      Object.defineProperty(sourceProxy, "parserServices", {
        value: { ...sourceCode.parserServices, isAstro: true },
        enumerable: true,
      });

      const contextProxy = Object.create(context);

      Object.defineProperty(contextProxy, "sourceCode", {
        value: sourceProxy,
        enumerable: true,
      });
      Object.defineProperty(contextProxy, "getSourceCode", {
        value: () => sourceProxy,
        enumerable: true,
      });

      return rule.create(contextProxy);
    },
  };
}

export default {
  meta: astro.meta,
  rules: Object.fromEntries(
    FRONTMATTER_RULES.flatMap((name) => {
      const rule = astro.rules[name];

      return rule ? [[name, withAstroParserServices(rule)]] : [];
    }),
  ),
};
