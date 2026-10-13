"use client";

import { AnimatePresence, motion } from "framer-motion";
import { IconTile } from "@/components/ui/icon";
import { SectionHeader } from "@/components/ui/section-header";
import { SplitLayout } from "@/components/ui/split-layout";
import { useScrollSpy } from "@/hooks/use-scroll-spy";
import { cn } from "@/lib/cn";
import { formatStepNumber } from "@/lib/format";
import { DURATION, EASE_SMOOTH } from "@/lib/motion";
import type { ProcessContent } from "@/types/content";

const STEP_ID_PREFIX = "process-step";

/**
 * Sticky-scroll timeline: the heading and a big step counter stay pinned while
 * the steps scroll past; the step crossing the middle of the screen lights up.
 */
export function ProcessScroller({ content }: { content: ProcessContent }) {
  const { heading, steps, stepLabel } = content;
  const stepIds = steps.map((_, index) => `${STEP_ID_PREFIX}-${index + 1}`);
  const activeId = useScrollSpy(stepIds);
  const activeIndex = Math.max(0, stepIds.indexOf(activeId ?? ""));

  const aside = (
    <>
      <SectionHeader {...heading} />
      <div aria-hidden className="mt-10 hidden lg:block">
        <div className="flex items-baseline gap-3">
          <span className="type-hero relative block overflow-hidden tabular-nums">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={activeIndex}
                initial={{ y: "60%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "-60%", opacity: 0 }}
                transition={{ duration: DURATION.base, ease: EASE_SMOOTH }}
                className="gradient-text block"
              >
                {formatStepNumber(activeIndex + 1)}
              </motion.span>
            </AnimatePresence>
          </span>
          <span className="type-h4 text-fg-mute">/ {formatStepNumber(steps.length)}</span>
        </div>
        <div className="mt-8 h-1 overflow-hidden rounded-full bg-fg/10">
          <motion.div
            initial={false}
            animate={{ scaleX: (activeIndex + 1) / steps.length }}
            transition={{ duration: DURATION.base, ease: EASE_SMOOTH }}
            className="h-full origin-left rounded-full bg-linear-to-r from-brand to-tide"
          />
        </div>
      </div>
    </>
  );

  return (
    <SplitLayout aside={aside} stickyAside>
      <ol className="space-y-3">
        {steps.map((step, index) => (
          <li
            key={step.title}
            id={stepIds[index]}
            className={cn(
              "card-gradient rounded-card bg-surface p-6 transition-opacity duration-500 ease-smooth sm:p-7",
              index !== activeIndex && "lg:opacity-35",
            )}
          >
            <div className="flex items-center justify-between">
              <span className="type-eyebrow text-brand">
                {stepLabel} {formatStepNumber(index + 1)}
              </span>
              <IconTile icon={step.icon} variant="soft" size="sm" />
            </div>
            <h3 className="type-h4 mt-4">{step.title}</h3>
            <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-pretty text-fg-mute">{step.description}</p>
          </li>
        ))}
      </ol>
    </SplitLayout>
  );
}
