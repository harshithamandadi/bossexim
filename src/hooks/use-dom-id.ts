"use client";

import { useId } from "react";

/** A unique id that is safe inside CSS/SVG `url(#…)` references. */
export function useDomId(prefix: string): string {
  return `${prefix}-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
}
