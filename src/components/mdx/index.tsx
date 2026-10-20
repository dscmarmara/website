import { isValidElement, type ComponentProps, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { slugify } from "@/lib/slug";

/*
 * Components available in blog posts and project case studies (registered in
 * mdx-components.tsx). Styling lives in globals.css under ".article".
 * Usage examples: content/blog/<lang>/_template.mdx, content/projects/<lang>/_template.mdx.
 */

function textOf(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (isValidElement(node)) return textOf((node.props as { children?: ReactNode }).children);
  return "";
}

// Ids from the same text and slugify() as the table of contents (lib/content.ts → headingsOf).
export function H2({ children, ...rest }: ComponentProps<"h2">) {
  return (
    <h2 id={slugify(textOf(children))} {...rest}>
      {children}
    </h2>
  );
}

export function H3({ children, ...rest }: ComponentProps<"h3">) {
  return (
    <h3 id={slugify(textOf(children))} {...rest}>
      {children}
    </h3>
  );
}

/** Site paths go through the locale-aware Link; other sites open in a new tab. */
export function MdxLink({ href = "", children, ...rest }: ComponentProps<"a">) {
  if (href.startsWith("/") && !href.startsWith("//")) {
    return (
      <Link href={href} {...rest}>
        {children}
      </Link>
    );
  }
  const external = /^https?:\/\//.test(href);
  return (
    <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} {...rest}>
      {children}
    </a>
  );
}

/** Markdown tables scroll sideways on narrow screens instead of widening the page. */
export function Table(props: ComponentProps<"table">) {
  return (
    <div className="table-wrap">
      <table {...props} />
    </div>
  );
}

/**
 * An image from public/ (or any other content as children) in a card, with a
 * caption and optional credit. `wide` lets it extend past the text column on
 * large screens.
 */
export function Figure({
  src,
  alt,
  caption,
  credit,
  wide,
  children,
}: {
  src?: string;
  alt?: string;
  caption?: ReactNode;
  credit?: ReactNode;
  wide?: boolean;
  children?: ReactNode;
}) {
  return (
    <figure className={wide ? "fig fig-wide" : "fig"}>
      <div className="fig-media">
        {src ? (
          // Plain <img>: content images have no known size for next/image; lazy and async-decoded instead.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={alt ?? (typeof caption === "string" ? caption : "")} loading="lazy" decoding="async" />
        ) : (
          children
        )}
      </div>
      {(caption || credit) && (
        <figcaption>
          {caption}
          {credit && <span className="fig-credit">{credit}</span>}
        </figcaption>
      )}
    </figure>
  );
}

/** A boxed aside: `note` (neutral), `finding` (green), `warning` (amber). */
export function Callout({
  tone = "note",
  title,
  children,
}: {
  tone?: "note" | "finding" | "warning";
  title?: string;
  children: ReactNode;
}) {
  const t = useTranslations("article");
  const label = title ?? t(tone === "finding" ? "calloutFinding" : tone === "warning" ? "calloutWarning" : "calloutNote");
  return (
    <aside className="callout" data-tone={tone}>
      <div className="callout-label">{label}</div>
      {children}
    </aside>
  );
}

/** A "// method note": how something was measured or computed, in a quiet monospace box. */
export function Method({ children }: { children: ReactNode }) {
  return <div className="method">{children}</div>;
}

/** A row of key numbers (Stat cards). */
export function Metrics({ children }: { children: ReactNode }) {
  return <div className="metrics">{children}</div>;
}

export function Stat({ value, label, note, accent }: { value: ReactNode; label: ReactNode; note?: ReactNode; accent?: boolean }) {
  return (
    <div className="stat" data-accent={accent ? "" : undefined}>
      <div className="stat-v">{value}</div>
      <div className="stat-l">{label}</div>
      {note && <div className="stat-n">{note}</div>}
    </div>
  );
}

/** Side-by-side figures or charts (one column on phones). */
export function Grid({ cols = 2, children }: { cols?: 2 | 3; children: ReactNode }) {
  return (
    <div className="mdx-grid" data-cols={cols}>
      {children}
    </div>
  );
}

/** Collapsed extra detail (appendix, long method), opened on demand. */
export function Details({ summary, children }: { summary: ReactNode; children: ReactNode }) {
  return (
    <details className="mdx-details">
      <summary>{summary}</summary>
      <div className="mdx-details-body">{children}</div>
    </details>
  );
}

/** Steps of a process: step → step → step (scrolls sideways on phones). */
export function Pipeline({ steps }: { steps: (string | { label: string; note?: string })[] }) {
  return (
    <div className="pipeline" role="list">
      {steps.map((s, i) => {
        const step = typeof s === "string" ? { label: s } : s;
        return (
          <div key={i} role="listitem" className="pipe-step">
            {i > 0 && (
              <span className="pipe-arrow" aria-hidden>
                →
              </span>
            )}
            <span className="pipe-node">
              {step.label}
              {step.note && <small>{step.note}</small>}
            </span>
          </div>
        );
      })}
    </div>
  );
}
