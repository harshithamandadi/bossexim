"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";
import { DURATION, EASE_SMOOTH } from "@/lib/motion";

/** Site-wide motion defaults; honours the visitor's "reduce motion" setting. */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={{ duration: DURATION.base, ease: EASE_SMOOTH }}>
      {children}
    </MotionConfig>
  );
}
