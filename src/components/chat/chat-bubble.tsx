"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { EASE_SMOOTH } from "@/lib/motion";

export type ChatSender = "visitor" | "assistant";

interface ChatBubbleProps {
  from: ChatSender;
  /** Tightens the corner that meets the previous bubble from the same sender. */
  joinsPrevious?: boolean;
  children: ReactNode;
}

/**
 * A message bubble. The corner nearest the sender is tightened into a "tail",
 * and consecutive bubbles from one sender tighten where they meet, so a run of
 * messages reads as one group. Each bubble grows from its sender's side.
 */
export function ChatBubble({ from, joinsPrevious = false, children }: ChatBubbleProps) {
  const isVisitor = from === "visitor";

  return (
    <motion.div
      initial={isVisitor ? { opacity: 0, y: 14, scale: 0.8 } : { opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      // The visitor's own message springs out of the composer; Aira's bubbles glide in.
      transition={isVisitor ? { type: "spring", stiffness: 520, damping: 30 } : { duration: 0.24, ease: EASE_SMOOTH }}
      style={{ transformOrigin: isVisitor ? "bottom right" : "bottom left" }}
      className={cn(
        "w-fit max-w-[85%] rounded-[18px] px-3.5 py-2.5 text-[15px] leading-snug text-pretty break-words",
        isVisitor ? "ml-auto rounded-br-[6px] bg-brand text-white" : "rounded-bl-[6px] bg-surface text-fg",
        joinsPrevious && (isVisitor ? "rounded-tr-[6px]" : "rounded-tl-[6px]"),
      )}
    >
      {children}
    </motion.div>
  );
}

export function TypingBubble({ label }: { label: string }) {
  return (
    <ChatBubble from="assistant">
      <span className="flex h-5 items-center gap-1" aria-hidden>
        {[0, 1, 2].map((dot) => (
          <span
            key={dot}
            style={{ animationDelay: `${dot * 140}ms` }}
            className="size-1.5 animate-typing rounded-full bg-fg-mute motion-reduce:animate-none"
          />
        ))}
      </span>
      <span className="sr-only">{label}</span>
    </ChatBubble>
  );
}
