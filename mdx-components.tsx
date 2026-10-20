import type { MDXComponents } from "mdx/types";
import { Chart } from "@/components/charts/Chart";
import { Callout, Details, Figure, Grid, H2, H3, MdxLink, Method, Metrics, Pipeline, Stat, Table } from "@/components/mdx";

// Required by @next/mdx (App Router). Blog posts and project case studies share
// these: headings get ids for the table of contents, links and tables are made
// safe for the layout, and the named components can be used in any .mdx file.
// Styling: the `.article` rules in globals.css.
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h2: H2,
    h3: H3,
    a: MdxLink,
    table: Table,
    Figure,
    Callout,
    Method,
    Metrics,
    Stat,
    Grid,
    Details,
    Pipeline,
    Chart,
    ...components,
  };
}
