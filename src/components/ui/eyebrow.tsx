import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Small label above a heading. The dot is inline so it stays beside the first word when text wraps. */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("type-eyebrow text-balance text-fg-mute", className)}>
      <span aria-hidden className="mr-2 inline-block size-1.5 -translate-y-px rounded-full bg-brand align-middle" />
      {children}
    </p>
  );
}
