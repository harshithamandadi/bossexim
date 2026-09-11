"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { fadeUp, stagger, VIEWPORT_ONCE } from "@/lib/motion";

const motionTags = {
  div: motion.div,
  ul: motion.ul,
  ol: motion.ol,
  li: motion.li,
} as const;

type RevealTag = keyof typeof motionTags;

interface RevealProps {
  as?: RevealTag;
  id?: string;
  className?: string;
  children: ReactNode;
}

/** Fades and lifts its content into view once. */
export function Reveal({ as = "div", delay, ...props }: RevealProps & { delay?: number }) {
  const Tag = motionTags[as];
  return <Tag variants={fadeUp} custom={delay} initial="hidden" whileInView="visible" viewport={VIEWPORT_ONCE} {...props} />;
}

/** Reveals its <RevealItem> children one after another. */
export function RevealGroup({ as = "div", interval, ...props }: RevealProps & { interval?: number }) {
  const Tag = motionTags[as];
  return <Tag variants={stagger(interval)} initial="hidden" whileInView="visible" viewport={VIEWPORT_ONCE} {...props} />;
}

export function RevealItem({ as = "div", ...props }: RevealProps) {
  const Tag = motionTags[as];
  return <Tag variants={fadeUp} {...props} />;
}
