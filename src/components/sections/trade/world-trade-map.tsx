"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { useDomId } from "@/hooks/use-dom-id";
import { toPercent } from "@/lib/geo";
import { cn } from "@/lib/cn";
import { EASE_SMOOTH } from "@/lib/motion";
import { LAND_PATH, LANE_COLORS, TRADE_MAP_SIZE as SIZE, TRADE_ORIGIN, tradeLanes } from "@/lib/trade-lanes";
import type { LabelAnchor, Market } from "@/types/content";

const origin = TRADE_ORIGIN.point;

const LABEL_GAP_PX = 8;
const LABEL_TRANSFORMS: Record<LabelAnchor, string> = {
  top: `translate(-50%, calc(-100% - ${LABEL_GAP_PX}px))`,
  bottom: `translate(-50%, ${LABEL_GAP_PX}px)`,
  left: `translate(calc(-100% - ${LABEL_GAP_PX}px), -50%)`,
  right: `translate(${LABEL_GAP_PX}px, -50%)`,
};

interface WorldTradeMapProps {
  /** Core markets (from the admin); the extra lanes come from config. */
  markets: Market[];
  /** Legend text for the lanes. */
  label: string;
  className?: string;
}

/**
 * A dotted world map with trade lanes from India. Every lane is drawn the same way
 * (client request: uniform, consistent lanes) and labelled with its code only.
 */
export function WorldTradeMap({ markets, label, className }: WorldTradeMapProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const reduceMotion = useReducedMotion();
  const gradientId = useDomId("world-lane");
  const lanes = tradeLanes(markets);
  const draw = (delay: number) =>
    reduceMotion
      ? { initial: false as const }
      : {
          initial: { pathLength: 0, opacity: 0 },
          animate: isInView ? { pathLength: 1, opacity: 1 } : undefined,
          transition: { duration: 1.4, delay, ease: EASE_SMOOTH },
        };

  return (
    <div ref={ref} className={cn("relative w-full", className)} style={{ aspectRatio: `${SIZE.width} / ${SIZE.height}` }}>
      <svg viewBox={`0 0 ${SIZE.width} ${SIZE.height}`} aria-hidden className="absolute inset-0 size-full overflow-visible">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={LANE_COLORS.from} />
            <stop offset="100%" stopColor={LANE_COLORS.to} />
          </linearGradient>
        </defs>
        <path d={LAND_PATH} stroke="currentColor" strokeWidth={2.3} strokeLinecap="round" className="text-fg/25" />

        {lanes.map((lane, index) => (
          <g key={lane.code}>
            <motion.path d={lane.path} fill="none" stroke={`url(#${gradientId})`} strokeWidth={1.5} {...draw(0.2 + index * 0.06)} />
            {!reduceMotion && (
              <path
                d={lane.path}
                fill="none"
                stroke="#ffffff"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeDasharray="2 14"
                className="animate-dash opacity-70"
                style={{ animationDuration: `${1.6 + (index % 3) * 0.3}s` }}
              />
            )}
          </g>
        ))}
        {lanes.map((lane) => (
          <circle key={lane.code} cx={lane.point.x} cy={lane.point.y} r={3.4} className="fill-sky stroke-canvas" strokeWidth={1.5} />
        ))}
        <circle cx={origin.x} cy={origin.y} r={9} className="animate-ping fill-gold/40 motion-reduce:animate-none" style={{ transformOrigin: `${origin.x}px ${origin.y}px`, transformBox: "view-box" }} />
        <circle cx={origin.x} cy={origin.y} r={5} className="fill-gold stroke-canvas" strokeWidth={2} />
      </svg>

      {lanes.map(({ code, point, labelAnchor }) => (
        <span
          key={code}
          aria-hidden
          className="pointer-events-none absolute hidden rounded-full bg-canvas/80 px-1.5 py-0.5 text-[10px] font-bold tracking-wide whitespace-nowrap text-fg ring-1 ring-border backdrop-blur md:block"
          style={{ left: toPercent(point.x, SIZE.width), top: toPercent(point.y, SIZE.height), transform: LABEL_TRANSFORMS[labelAnchor] }}
        >
          {code}
        </span>
      ))}
      <span
        aria-hidden
        className="pointer-events-none absolute -translate-x-1/2 translate-y-3 text-[11px] font-bold tracking-wide text-gold"
        style={{ left: toPercent(origin.x, SIZE.width), top: toPercent(origin.y, SIZE.height) }}
      >
        {TRADE_ORIGIN.code}
      </span>

      <p className="absolute bottom-0 left-0 flex items-center gap-2 text-xs text-fg-mute">
        <span aria-hidden className="h-0.5 w-5 rounded-full bg-linear-to-r from-gold to-tide" />
        {label}
      </p>
    </div>
  );
}
