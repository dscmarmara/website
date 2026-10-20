import type { Heading } from "@/lib/content";

/** "01", "02" for chapters (##) and "01", "02" restarting per chapter for sections (###). */
export function tocNumbers(items: Heading[]): string[] {
  let ch = 0;
  let sec = 0;
  const two = (n: number) => String(n).padStart(2, "0");
  return items.map((it) => {
    if (it.level === 2) {
      ch++;
      sec = 0;
      return two(ch);
    }
    sec++;
    return two(sec);
  });
}

export function TocList({ items, numbered, active }: { items: Heading[]; numbered?: boolean; active?: string | null }) {
  const nums = numbered ? tocNumbers(items) : [];
  return (
    <ol className="toc-list">
      {items.map((it, i) => (
        <li key={`${it.id}-${i}`} data-level={it.level}>
          <a href={`#${it.id}`} aria-current={active === it.id ? "location" : undefined}>
            {numbered && <span className="toc-n">{it.level === 2 ? nums[i] : `[${nums[i]}]`}</span>}
            {it.text}
          </a>
        </li>
      ))}
    </ol>
  );
}

/** Narrow screens: the contents as a collapsed box under the header. */
export function TocInline({ items, label, numbered }: { items: Heading[]; label: string; numbered?: boolean }) {
  return (
    <details className="toc-inline">
      <summary>{label}</summary>
      <TocList items={items} numbered={numbered} />
    </details>
  );
}
