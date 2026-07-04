"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { PostRow, type PostRowData } from "@/components/cards/PostRow";
import { DEPARTMENTS } from "@/lib/constants";

export function BlogFilter({ posts }: { posts: PostRowData[] }) {
  const t = useTranslations("blog");
  const [cat, setCat] = useState<string>("All");

  const cats: string[] = ["All", ...DEPARTMENTS];
  const visible = cat === "All" ? posts : posts.filter((p) => p.category === cat);

  return (
    <>
      <div data-reveal style={{ display: "flex", gap: 11, flexWrap: "wrap", marginBottom: 14 }}>
        {cats.map((c) => (
          <button
            key={c}
            className="chip"
            data-active={c === cat ? "" : undefined}
            onClick={() => setCat(c)}
            style={{ padding: "8px 16px", borderRadius: 100, border: "1px solid var(--border)", background: "var(--bg-elev)", color: "var(--text-muted)", fontFamily: "var(--font-body-stack)", fontWeight: 600, fontSize: 13 }}
          >
            {c === "All" ? t("all") : c}
          </button>
        ))}
      </div>
      <div>
        {visible.map((p) => (
          <PostRow key={p.slug} post={p} />
        ))}
      </div>
    </>
  );
}
