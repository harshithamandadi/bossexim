"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Fragment } from "react";
import { cn } from "@/lib/cn";

/** Seconds between words, and the longest a whole reply may take to appear. */
const WORD_STEP_S = 0.028;
const MAX_STREAM_S = 1.1;
const WORD_FADE_S = 0.32;

/** How long a reply of this length takes to stream in, so follow-up content can wait for it. */
export function streamDuration(text: string, reduceMotion: boolean | null): number {
  if (reduceMotion) return 0;
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.min(words * WORD_STEP_S, MAX_STREAM_S) + WORD_FADE_S;
}

/**
 * Reveals text word by word, each word sharpening from a soft blur, as if
 * typed live. Only animates when first mounted; line breaks are kept.
 * Screen readers get the whole text at once.
 */
export function StreamingText({ text, className }: { text: string; className?: string }) {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return <p className={cn("whitespace-pre-line", className)}>{text}</p>;

  const parts = text.split(/(\s+)/);
  // Each word's position among the words only (spaces don't count), computed up front.
  const wordIndex = parts.map((part, position) => parts.slice(0, position).filter((earlier) => earlier.trim()).length);
  const wordCount = parts.filter((part) => part.trim()).length;
  const step = Math.min(WORD_STEP_S, MAX_STREAM_S / Math.max(wordCount, 1));

  return (
    <p className={cn("whitespace-pre-line", className)}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {parts.map((part, position) => {
          if (!part.trim()) return <Fragment key={position}>{part}</Fragment>;
          const delay = (wordIndex[position] ?? 0) * step;
          return (
            <motion.span
              key={position}
              className="inline-block"
              initial={{ opacity: 0, filter: "blur(5px)", y: 3 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              transition={{ delay, duration: WORD_FADE_S, ease: [0.32, 0.72, 0, 1] }}
            >
              {part}
            </motion.span>
          );
        })}
      </span>
    </p>
  );
}
