"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/cn";

interface ExpandableBioProps {
  paragraphs: string[];
  /** e.g. "Read full profile". */
  moreLabel: string;
  /** e.g. "Show less". */
  lessLabel: string;
  className?: string;
}

/**
 * A profile's first paragraph, with the rest behind a toggle. The toggle sits at the
 * end of the text, so once opened it is found below the full profile (client request).
 */
export function ExpandableBio({ paragraphs, moreLabel, lessLabel, className }: ExpandableBioProps) {
  const [open, setOpen] = useState(false);
  const [lead, ...rest] = paragraphs;

  return (
    <div className={cn("flex flex-1 flex-col text-[15px] leading-relaxed text-pretty text-fg-mute", className)}>
      <p>{lead}</p>
      {open && (
        <div className="mt-3 space-y-3">
          {rest.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      )}
      {rest.length > 0 && (
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="mt-auto inline-flex items-center gap-1.5 self-start pt-4 text-sm font-semibold text-brand"
        >
          {open ? lessLabel : moreLabel}
          <ChevronDown aria-hidden className={cn("size-4 transition-transform duration-300", open && "rotate-180")} />
        </button>
      )}
    </div>
  );
}
