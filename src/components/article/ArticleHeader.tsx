import { Children, type ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/effects/Reveal";

/**
 * Header of a reading page (blog post, project case study), in the text
 * column: back link, a meta line (first item in accent), a plain display-font
 * title, an optional standfirst, then the byline between hairlines.
 */
export function ArticleHeader({
  back,
  meta,
  title,
  standfirst,
  byline,
  children,
}: {
  back: { href: string; label: string };
  meta: ReactNode[];
  title: string;
  standfirst?: string;
  byline?: ReactNode;
  /** Extra row under the byline (e.g. a project's stack and links). */
  children?: ReactNode;
}) {
  return (
    <header className="ah">
      <Link href={back.href} className="ah-back">
        {back.label}
      </Link>
      <Reveal className="ah-meta">
        {meta.filter(Boolean).map((m, i) => (
          <span key={i} className="ah-meta-item">
            {i > 0 && <span className="ah-dot" aria-hidden />}
            {m}
          </span>
        ))}
      </Reveal>
      <Reveal as="h1" className="ah-title">
        {title}
      </Reveal>
      {standfirst && (
        <Reveal as="p" className="ah-standfirst">
          {standfirst}
        </Reveal>
      )}
      {byline && <Reveal className="ah-byline">{byline}</Reveal>}
      {Children.toArray(children).length > 0 && <Reveal className="ah-extra">{children}</Reveal>}
    </header>
  );
}
