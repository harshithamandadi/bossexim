"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Ref } from "react";
import { uiLabels } from "@/config/ui";
import { DURATION } from "@/lib/motion";
import type { NavGroup } from "@/types/content";

interface DesktopPanelProps {
  group: NavGroup;
  onNavigate: () => void;
  /**
   * Needed by AnimatePresence's "popLayout" mode, which lifts the outgoing panel out of the
   * flow while it fades. Without it the old and new panels stack and the island grows tall.
   */
  ref?: Ref<HTMLDivElement>;
}

/** The expanded island on desktop: an overview tile plus the group's links. */
export function DesktopPanel({ group, onNavigate, ref }: DesktopPanelProps) {
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, filter: "blur(6px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, filter: "blur(6px)" }}
      transition={{ duration: DURATION.fast }}
      // w-0 + min-w-full: fill the island without widening it.
      className="hidden w-0 min-w-full px-2 pb-2 xl:block"
    >
      <div className="grid grid-cols-[13rem_1fr] gap-2 rounded-[20px] bg-white/[0.04] p-2">
        <Link
          href={group.href}
          onClick={onNavigate}
          className="group flex flex-col justify-between gap-8 rounded-2xl bg-white/[0.06] p-5 transition-colors duration-300 hover:bg-white/10"
        >
          <span className="type-eyebrow text-fg-mute">{uiLabels.overview}</span>
          <span>
            <span className="type-h4 block">{group.label}</span>
            <span className="mt-2 inline-flex items-center gap-1 text-sm text-fg-mute transition-colors group-hover:text-fg">
              {uiLabels.explore}
              <ArrowRight aria-hidden className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
            </span>
          </span>
        </Link>
        <ul className="grid grid-cols-2 content-start gap-1">
          {group.items.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                onClick={onNavigate}
                className="block rounded-2xl p-4 transition-colors duration-300 hover:bg-white/[0.07]"
              >
                <span className="block text-sm font-medium">{item.label}</span>
                {item.description && (
                  <span className="mt-1 block text-[13px] leading-snug text-fg-mute">{item.description}</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
