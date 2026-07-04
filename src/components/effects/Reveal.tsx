import type { ElementType, HTMLAttributes } from "react";

/** Wraps children with `data-reveal` to opt into the scroll-reveal animation. */
export function Reveal({
  as: Tag = "div",
  ...props
}: { as?: ElementType } & HTMLAttributes<HTMLElement>) {
  return <Tag data-reveal {...props} />;
}
