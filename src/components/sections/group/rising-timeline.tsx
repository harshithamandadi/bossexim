"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useId, useRef, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { WorldDotsMap } from "@/components/ui/world-dots-map";
import type { JourneyPeriod } from "@/config";
import { cn } from "@/lib/cn";
import { EASE_SMOOTH } from "@/lib/motion";

/* A single rising arrow from bottom-left to top-right (client's reference image): no ups and downs. */
const WIDTH = 1000;
const HEIGHT = 300;
const START = { x: 20, y: HEIGHT - 20 };
const END = { x: WIDTH - 30, y: 34 };
const CONTROL = { x: WIDTH * 0.62, y: HEIGHT - 10 };
const ADVANCE_MS = 6000;

/** A point on the quadratic curve at t ∈ [0, 1]. */
function pointAt(t: number) {
  const u = 1 - t;
  return {
    x: u * u * START.x + 2 * u * t * CONTROL.x + t * t * END.x,
    y: u * u * START.y + 2 * u * t * CONTROL.y + t * t * END.y,
  };
}

const CURVE = `M${START.x} ${START.y} Q${CONTROL.x} ${CONTROL.y} ${END.x} ${END.y}`;

/**
 * The journey as milestones climbing one arrow. Each milestone shows its years;
 * the selected period's text sits below and moves on by itself (pausing on hover).
 */
export function RisingTimeline({ periods, className }: { periods: JourneyPeriod[]; className?: string }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { amount: 0.4 });
  const reduceMotion = useReducedMotion();
  const gradientId = `${useId().replace(/[^a-zA-Z0-9_-]/g, "")}-rise`;
  const nodes = periods.map((period, index) => ({ period, point: pointAt((index + 0.6) / (periods.length + 0.2)) }));
  const current = periods[active];

  useEffect(() => {
    if (paused || !isInView || reduceMotion) return;
    const timer = window.setTimeout(() => setActive((index) => (index + 1) % periods.length), ADVANCE_MS);
    return () => window.clearTimeout(timer);
  }, [active, paused, isInView, reduceMotion, periods.length]);

  return (
    <div ref={ref} className={cn("relative", className)} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="relative" style={{ aspectRatio: `${WIDTH} / ${HEIGHT + 70}` }}>
        <WorldDotsMap fit="meet" dotClassName="text-fg/40" className="pointer-events-none absolute inset-x-0 -top-6 h-[calc(100%+3rem)] w-full" />
        <svg viewBox={`0 -70 ${WIDTH} ${HEIGHT + 70}`} aria-hidden className="absolute inset-0 size-full overflow-visible">
          <defs>
            <linearGradient id={gradientId} x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="var(--color-brand)" stopOpacity="0.35" />
              <stop offset="100%" stopColor="var(--color-tide)" />
            </linearGradient>
          </defs>
          <motion.path
            d={CURVE}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={14}
            strokeLinecap="round"
            initial={reduceMotion ? false : { pathLength: 0 }}
            animate={isInView ? { pathLength: 1 } : undefined}
            transition={{ duration: 1.4, ease: EASE_SMOOTH }}
          />
          {/* Arrowhead at the top-right end. */}
          <path d={`M${END.x - 22} ${END.y - 8} L${END.x + 16} ${END.y - 14} L${END.x - 4} ${END.y + 20} Z`} className="fill-tide" />
          {nodes.map(({ point }, index) => (
            <line
              key={index}
              x1={point.x}
              x2={point.x}
              y1={point.y - 26}
              y2={point.y - 52}
              className="stroke-brand/30"
              strokeWidth={1.5}
            />
          ))}
        </svg>

        <ol className="absolute inset-0">
          {nodes.map(({ period, point }, index) => {
            const isActive = index === active;
            const left = `${(point.x / WIDTH) * 100}%`;
            const top = `${((point.y + 70) / (HEIGHT + 70)) * 100}%`;
            return (
              <li key={period.period} className="absolute" style={{ left, top }}>
                <button
                  type="button"
                  onClick={() => setActive(index)}
                  aria-pressed={isActive}
                  aria-label={period.period}
                  className={cn(
                    "absolute top-0 left-0 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-white shadow-[0_10px_24px_-10px_rgb(8_33_79/0.6)] ring-4 ring-canvas transition-transform duration-300 ease-smooth",
                    isActive ? "brand-gradient scale-115" : "bg-navy hover:scale-110",
                  )}
                >
                  <Icon name={period.icon} className="size-5" />
                </button>
                <span
                  className={cn(
                    "absolute left-0 w-28 -translate-x-1/2 text-center font-display text-[15px] leading-tight font-extrabold tabular-nums transition-colors",
                    isActive ? "text-brand" : "text-fg",
                  )}
                  style={{ bottom: "3.6rem" }}
                >
                  {period.period}
                </span>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="relative mt-6 min-h-28 rounded-card bg-surface p-6 ring-1 ring-inset ring-border sm:p-7">
        <AnimatePresence mode="wait" initial={false}>
          {current && (
            <motion.div
              key={current.period}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: EASE_SMOOTH }}
              className="flex items-start gap-4"
            >
              <span className="brand-gradient grid size-10 shrink-0 place-items-center rounded-xl text-white">
                <Icon name={current.icon} className="size-5" />
              </span>
              <div>
                <p className="font-display text-lg font-extrabold text-brand tabular-nums">{current.period}</p>
                <p className="mt-1 max-w-3xl text-[15px] leading-relaxed text-pretty text-fg-mute">{current.text}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div aria-hidden className="mt-5 flex gap-1.5">
          {periods.map((period, index) => (
            <span key={period.period} className={cn("h-1 flex-1 rounded-full transition-colors", index <= active ? "bg-brand" : "bg-fg/10")} />
          ))}
        </div>
      </div>
    </div>
  );
}
