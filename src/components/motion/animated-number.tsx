"use client";

import { animate, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useLayoutEffect, useRef } from "react";
import { cn } from "@/lib/cn";
import { EASE_APPLE } from "@/lib/motion";

const COUNT_DURATION = 1.6;

/**
 * Counts up from zero when scrolled into view. The final value is server-rendered,
 * so search engines and no-JS visitors always see the real figure.
 */
export function AnimatedNumber({ value, className }: { value: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduceMotion = useReducedMotion();

  useLayoutEffect(() => {
    if (!reduceMotion && ref.current) ref.current.textContent = "0";
  }, [reduceMotion]);

  useEffect(() => {
    const node = ref.current;
    if (!isInView || reduceMotion || !node) return;
    const controls = animate(0, value, {
      duration: COUNT_DURATION,
      ease: EASE_APPLE,
      onUpdate: (latest) => {
        node.textContent = String(Math.round(latest));
      },
    });
    return () => controls.stop();
  }, [isInView, reduceMotion, value]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {value}
    </span>
  );
}
