/**
 * TypeScript can't parse `.svelte` files, so imports of them are declared as an
 * untyped module here. `svelte-check` resolves the real module shape — including
 * `buttonVariants` and the exported prop types — while TypeScript-based checkers
 * (such as Oxlint's type-aware pass) accept the import instead of reporting it
 * as unresolved.
 */
declare module "*.svelte";
