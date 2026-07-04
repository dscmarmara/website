import type { MDXComponents } from "mdx/types";

// Required by @next/mdx (App Router). Blog prose (p, h2, strong, blockquote,
// code blocks) is styled via the `.article` rules in globals.css, so no
// element overrides are needed here.
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return { ...components };
}
