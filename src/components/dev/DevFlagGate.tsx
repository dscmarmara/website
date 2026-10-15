"use client";

import type { ReactNode } from "react";
import { IS_PRODUCTION } from "@/lib/env";
import { useDevFlag, type DevFlag } from "@/lib/devFlags";

/**
 * Renders its children only while the given dev-options switch is on, and
 * never on the live site — for sections still under review on previews.
 */
export function DevFlagGate({ flag, children }: { flag: DevFlag; children: ReactNode }) {
  const on = useDevFlag(flag);
  if (IS_PRODUCTION || !on) return null;
  return children;
}
