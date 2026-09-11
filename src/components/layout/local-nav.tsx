"use client";

import { motion } from "framer-motion";
import { useId } from "react";
import { uiLabels } from "@/config/ui";
import { useScrollSpy } from "@/hooks/use-scroll-spy";
import { cn } from "@/lib/cn";
import { SPRING_SNAPPY } from "@/lib/motion";
import type { LocalNavItem } from "@/lib/navigation";

/**
 * Apple-style "on this page" bar. Zero-height sticky wrapper, so it floats
 * over content instead of pushing it down.
 */
export function LocalNav({ items }: { items: LocalNavItem[] }) {
  const activeId = useScrollSpy(items.map((item) => item.id));
  const pillId = useId();

  if (items.length === 0) return null;

  return (
    <div className="pointer-events-none sticky top-[4.75rem] z-40 h-0">
      <div className="flex justify-center px-4">
        <nav
          aria-label={uiLabels.onThisPage}
          className="glass no-scrollbar pointer-events-auto max-w-full overflow-x-auto rounded-full p-1 shadow-[0_10px_30px_-14px_rgb(0_0_0/0.3)] ring-1 ring-border"
        >
          <ul className="flex">
            {items.map((item) => {
              const isActive = item.id === activeId;
              return (
                <li key={item.id} className="relative">
                  {isActive && (
                    <motion.span layoutId={pillId} transition={SPRING_SNAPPY} className="absolute inset-0 rounded-full bg-fg" />
                  )}
                  <a
                    href={`#${item.id}`}
                    aria-current={isActive ? "location" : undefined}
                    className={cn(
                      "relative block rounded-full px-4 py-2 text-[13px] font-medium whitespace-nowrap transition-colors duration-300",
                      isActive ? "text-canvas" : "text-fg-mute hover:text-fg",
                    )}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
}
