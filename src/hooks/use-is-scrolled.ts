"use client";

import { useMotionValueEvent, useScroll } from "framer-motion";
import { useState } from "react";

/** True once the page has scrolled past `threshold` pixels. */
export function useIsScrolled(threshold = 24): boolean {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => setIsScrolled(latest > threshold));

  return isScrolled;
}
