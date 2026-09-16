"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { riseIn, stagger } from "@/lib/motion";

interface AnimatedHeadlineProps {
  text: string;
  /** Words to render in the brand gradient. */
  highlight?: string;
  className?: string;
}

/** Page-level <h1> whose words rise out of a blur, one after another. */
export function AnimatedHeadline({ text, highlight = "", className }: AnimatedHeadlineProps) {
  const highlighted = new Set(highlight.split(" "));
  const words = text.split(" ");

  return (
    <motion.h1 aria-label={text} className={className} variants={stagger(0.09, 0.15)} initial="hidden" animate="visible">
      {words.map((word, index) => (
        <span key={`${word}-${index}`} aria-hidden>
          <motion.span variants={riseIn} className={cn("inline-block", highlighted.has(word) && "gradient-text")}>
            {word}
          </motion.span>
          {index < words.length - 1 && " "}
        </span>
      ))}
    </motion.h1>
  );
}
