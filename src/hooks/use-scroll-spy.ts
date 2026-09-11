"use client";

import { useEffect, useState } from "react";

/** A thin band across the middle of the viewport decides which element is "current". */
const CENTER_BAND = "-45% 0px -50% 0px";

/**
 * Returns the id of the element currently crossing the middle of the viewport.
 * Used by the "on this page" nav and the sticky process timeline.
 */
export function useScrollSpy(ids: readonly string[], rootMargin = CENTER_BAND): string | undefined {
  const [activeId, setActiveId] = useState<string | undefined>(ids[0]);
  const idsKey = ids.join("|");

  useEffect(() => {
    const elements = idsKey
      .split("|")
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActiveId(entry.target.id);
      },
      { rootMargin },
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [idsKey, rootMargin]);

  return activeId;
}
