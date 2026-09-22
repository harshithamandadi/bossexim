/**
 * Shared motion language. Every animation draws from these tokens, so timing and
 * easing stay consistent and can be tuned in one place.
 *
 * Principles (as taught by Emil Kowalski in "Animations on the Web"):
 *  - animate transform and opacity only — they are cheap to composite;
 *  - ease-out for entrances, so motion starts fast and settles gently;
 *  - keep UI feedback short (150–350ms); reserve longer runs for hero moments;
 *  - springs for direct manipulation (selection pills, tactile toggles);
 *  - animations must be interruptible and must respect reduced-motion.
 */
import type { Transition, Variants } from "framer-motion";

/** Ease-out curve: immediate response, soft landing. */
export const EASE_SMOOTH = [0.32, 0.72, 0, 1] as const;

export const DURATION = {
  /** Hover, colour and small state changes. */
  fast: 0.18,
  /** Panels, accordions, list transitions. */
  base: 0.32,
  /** Scroll reveals and hero entrances. */
  slow: 0.55,
} as const;

export const SPRING_SNAPPY: Transition = { type: "spring", bounce: 0.2, duration: 0.45 };

export const SPRING_ISLAND: Transition = { type: "spring", bounce: 0.18, duration: 0.5 };

/** Overlay panels summoned by the pointer (after beUI's panel spring). */
export const SPRING_PANEL: Transition = { type: "spring", stiffness: 420, damping: 40, mass: 0.5 };

/** Trigger once, slightly before the element is fully on screen. */
export const VIEWPORT_ONCE = { once: true, margin: "0px 0px -12% 0px" } as const;

/** Pass a delay (seconds) via `custom`; omit it to let a parent's stagger decide. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: (delay?: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.slow, ease: EASE_SMOOTH, ...(delay ? { delay } : {}) },
  }),
};

/** Props for a one-off entrance on page load (hero copy, buttons). */
export function enterOnLoad(delay: number) {
  return {
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { delay, duration: DURATION.slow, ease: EASE_SMOOTH },
  } as const;
}

/** Headline words rise into place. No blur: it is expensive across large text. */
export const riseIn: Variants = {
  hidden: { opacity: 0, y: "0.32em" },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_SMOOTH } },
};

export function stagger(staggerChildren = 0.06, delayChildren = 0): Variants {
  return { hidden: {}, visible: { transition: { staggerChildren, delayChildren } } };
}
