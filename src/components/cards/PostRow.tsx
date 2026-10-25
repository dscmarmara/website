"use client";

import { useFormatter, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Avatar } from "@/components/common/Avatar";

export interface PostRowData {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readingTime: string;
  /** Member slug; absent for an author who isn't on the team (shown unlinked). */
  authorSlug?: string;
  authorName?: string;
  authorInitials?: string;
  authorPhoto?: string | null;
}

export function PostRow({ post }: { post: PostRowData }) {
  const format = useFormatter();
  const locale = useLocale();
  // Locale-aware so Turkish months keep their dotted İ ("NİS", not "NIS").
  const dateLabel = format
    .dateTime(new Date(post.date), { year: "numeric", month: "short", day: "numeric" })
    .toLocaleUpperCase(locale);

  return (
    <div
      className="post-row post-row__layout"
      data-reveal
      style={{ display: "grid", gridTemplateColumns: "120px 1fr auto", color: "var(--text)", padding: "28px 0", borderBottom: "1px solid var(--border)" }}
    >
      <Link className="post-row__cover" href={`/blog/${post.slug}`} aria-label={post.title} />
      <div className="post-row__meta">
        <div className="post-row__category">{post.category}</div>
        <div>{dateLabel}</div>
        <div className="post-row__time">{post.readingTime}</div>
      </div>
      <div>
        <h3 className="row-title post-row__title">
          {post.title}
        </h3>
        <p className="post-row__excerpt">
          {post.excerpt}
        </p>
        {post.authorName && post.authorInitials && (post.authorSlug ? (
          <Link
            href={`/team/${post.authorSlug}`}
            className="author-link post-row__author"
            style={{ color: "var(--text)" }}
          >
            <Avatar photo={post.authorPhoto ?? null} initials={post.authorInitials} size={26} radius={999} fontSize={10} />
            <span className="al-name post-row__author-name">{post.authorName}</span>
          </Link>
        ) : (
          <span className="post-row__author-plain">
            <Avatar photo={post.authorPhoto ?? null} initials={post.authorInitials} size={26} radius={999} fontSize={10} />
            <span className="post-row__author-name">{post.authorName}</span>
          </span>
        ))}
      </div>
      <span className="row-arrow post-row__arrow">→</span>
    </div>
  );
}
