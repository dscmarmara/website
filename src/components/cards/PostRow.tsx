"use client";

import { useFormatter, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Avatar } from "@/components/common/Avatar";

export interface PostRowData {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readingTime: string;
  authorSlug?: string;
  authorName?: string;
  authorInitials?: string;
}

export function PostRow({ post }: { post: PostRowData }) {
  const t = useTranslations("blog");
  const format = useFormatter();
  const dateLabel = format
    .dateTime(new Date(post.date), { year: "numeric", month: "short", day: "numeric" })
    .toUpperCase();

  return (
    <div
      className="post-row"
      data-reveal
      style={{ position: "relative", display: "grid", gridTemplateColumns: "120px 1fr auto", gap: 26, alignItems: "baseline", color: "var(--text)", padding: "28px 0", borderBottom: "1px solid var(--border)" }}
    >
      <Link href={`/blog/${post.slug}`} aria-label={post.title} style={{ position: "absolute", inset: 0, zIndex: 1 }} />
      <div style={{ fontFamily: "var(--font-mono-stack)", fontSize: 12, letterSpacing: "0.04em", color: "var(--text-muted)", paddingTop: 4 }}>
        <div style={{ color: "var(--accent)", marginBottom: 6 }}>{post.category}</div>
        <div>{dateLabel}</div>
        <div style={{ marginTop: 3 }}>{post.readingTime}</div>
      </div>
      <div>
        <h3 className="row-title" style={{ fontFamily: "var(--font-display-stack)", fontWeight: 600, fontSize: "clamp(20px,2.4vw,26px)", lineHeight: 1.2, margin: "0 0 10px" }}>
          {post.title}
        </h3>
        <p style={{ fontFamily: "var(--font-body-stack)", fontSize: 15, lineHeight: 1.65, color: "var(--text-muted)", margin: "0 0 14px", maxWidth: "60ch" }}>
          {post.excerpt}
        </p>
        {post.authorSlug && post.authorName && post.authorInitials && (
          <Link
            href={`/team/${post.authorSlug}`}
            className="author-link"
            style={{ position: "relative", zIndex: 2, display: "inline-flex", alignItems: "center", gap: 9, textDecoration: "none", color: "var(--text)", width: "fit-content" }}
          >
            <Avatar photo={null} initials={post.authorInitials} size={26} radius={999} fontSize={10} />
            <span className="al-name" style={{ fontFamily: "var(--font-body-stack)", fontWeight: 600, fontSize: 13 }}>{post.authorName}</span>
          </Link>
        )}
      </div>
      <span className="row-arrow" style={{ fontFamily: "var(--font-display-stack)", fontSize: 22, color: "var(--accent)", alignSelf: "center" }}>→</span>
    </div>
  );
}
