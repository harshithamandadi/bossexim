/**
 * Shared motion language. Every animation on the site draws from these tokens so
 * timing and easing feel consistent (and can be tuned in one place).
 */
import type { Transition, Variants } from "framer-motion";

/** Apple-style "ease out expo" — fast start, long graceful settle. */
export const EASE_APPLE = [0.16, 1, 0.3, 1] as const;

export const DURATION = {
  fast: 0.3,
  base: 0.6,
  slow: 0.9,
} as const;

export const SPRING_SNAPPY: Transition = { type: "spring", bounce: 0.18, duration: 0.55 };

export const SPRING_ISLAND: Transition = { type: "spring", bounce: 0.22, duration: 0.6 };

/** Trigger once, slightly before the element is fully on screen. */
export const VIEWPORT_ONCE = { once: true, margin: "0px 0px -10% 0px" } as const;

/** Pass a delay (seconds) via `custom`; omit it to let a parent's stagger decide. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay?: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.slow, ease: EASE_APPLE, ...(delay ? { delay } : {}) },
  }),
};

/** Props for a one-off entrance on page load (hero copy, buttons). */
export function enterOnLoad(delay: number) {
  return {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { delay, duration: DURATION.slow, ease: EASE_APPLE },
  } as const;
}

/** Headline words: rise out of a soft blur. */
export const blurUp: Variants = {
  hidden: { opacity: 0, y: "0.35em", filter: "blur(12px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 1.1, ease: EASE_APPLE } },
};

export function stagger(staggerChildren = 0.08, delayChildren = 0): Variants {
  return { hidden: {}, visible: { transition: { staggerChildren, delayChildren } } };
}
