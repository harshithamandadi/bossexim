"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { useDomId } from "@/hooks/use-dom-id";
import { products, productsViewHref } from "@/config";
import { groupByCategory } from "@/lib/catalogue";
import { cn } from "@/lib/cn";
import { DURATION, EASE_SMOOTH, VIEWPORT_ONCE } from "@/lib/motion";

/* Geometry, in viewBox units. */
const SIZE = 500;
const CENTER = SIZE / 2;
const OUTER_RADIUS = 238;
const INNER_RADIUS = 116;
const GLOBE_RADIUS = INNER_RADIUS - 14;
const SECTOR_GAP_DEGREES = 2;

/** One segment per product category — the wheel grows with the catalogue. */
const segments = groupByCategory(products).flatMap(({ category, items }) => {
  const lead = items[0];
  return lead ? [{ category, icon: lead.icon, direction: lead.direction, count: items.length }] : [];
});
const SECTOR_DEGREES = 360 / segments.length;
const POD_RADIUS = (OUTER_RADIUS + INNER_RADIUS) / 2;

const round = (value: number) => Math.round(value * 100) / 100;

function polar(radius: number, degrees: number) {
  const radians = ((degrees - 90) * Math.PI) / 180;
  return { x: round(CENTER + radius * Math.cos(radians)), y: round(CENTER + radius * Math.sin(radians)) };
}

function sectorPath(index: number) {
  const start = index * SECTOR_DEGREES + SECTOR_GAP_DEGREES / 2;
  const end = (index + 1) * SECTOR_DEGREES - SECTOR_GAP_DEGREES / 2;
  const outerStart = polar(OUTER_RADIUS, start);
  const outerEnd = polar(OUTER_RADIUS, end);
  const innerEnd = polar(INNER_RADIUS, end);
  const innerStart = polar(INNER_RADIUS, start);
  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${OUTER_RADIUS} ${OUTER_RADIUS} 0 0 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${INNER_RADIUS} ${INNER_RADIUS} 0 0 0 ${innerStart.x} ${innerStart.y}`,
    "Z",
  ].join(" ");
}

const percent = (value: number) => `${round((value / SIZE) * 100)}%`;

/** The brand wheel: trade categories orbiting a globe. */
export function TradeWheel({ className }: { className?: string }) {
  const id = useDomId("wheel");
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={cn("relative aspect-square w-full", className)}
      initial={{ opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={VIEWPORT_ONCE}
      transition={{ duration: DURATION.slow, ease: EASE_SMOOTH }}
    >
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} aria-hidden className="absolute inset-0 size-full">
        <defs>
          <radialGradient id={`${id}-globe`} cx="35%" cy="30%" r="80%">
            <stop offset="0%" stopColor="#8fd0f7" />
            <stop offset="55%" stopColor="#1f76c9" />
            <stop offset="100%" stopColor="#0c3f80" />
          </radialGradient>
          <linearGradient id={`${id}-warm`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#8fc6f2" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#1560bd" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id={`${id}-cool`} x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#4fa8e8" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#0e4a95" stopOpacity="0.9" />
          </linearGradient>
        </defs>

        <circle
          cx={CENTER}
          cy={CENTER}
          r={OUTER_RADIUS + 12}
          fill="none"
          strokeWidth="2"
          strokeDasharray="3 11"
          className={cn("stroke-brand/40", !reduceMotion && "origin-center animate-orbit")}
        />

        {segments.map((segment, index) => (
          <motion.path
            key={segment.category}
            d={sectorPath(index)}
            fill={`url(#${id}-${index % 2 === 0 ? "warm" : "cool"})`}
            strokeWidth="3"
            className="stroke-canvas"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={VIEWPORT_ONCE}
            transition={{ duration: DURATION.base, ease: EASE_SMOOTH, delay: 0.25 + index * 0.05 }}
          />
        ))}

        <circle cx={CENTER} cy={CENTER} r={GLOBE_RADIUS} fill={`url(#${id}-globe)`} />
        <g fill="none" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="1.5">
          <circle cx={CENTER} cy={CENTER} r={GLOBE_RADIUS} />
          <ellipse cx={CENTER} cy={CENTER} rx={GLOBE_RADIUS * 0.4} ry={GLOBE_RADIUS} />
          <ellipse cx={CENTER} cy={CENTER} rx={GLOBE_RADIUS * 0.78} ry={GLOBE_RADIUS} />
          <path d={`M ${CENTER - GLOBE_RADIUS} ${CENTER} h ${GLOBE_RADIUS * 2}`} />
          <path d={`M ${CENTER - GLOBE_RADIUS * 0.84} ${CENTER - GLOBE_RADIUS * 0.5} h ${GLOBE_RADIUS * 1.68}`} />
          <path d={`M ${CENTER - GLOBE_RADIUS * 0.84} ${CENTER + GLOBE_RADIUS * 0.5} h ${GLOBE_RADIUS * 1.68}`} />
        </g>
      </svg>

      {segments.map((segment, index) => {
        const point = polar(POD_RADIUS, (index + 0.5) * SECTOR_DEGREES);
        return (
          <Link
            key={segment.category}
            href={productsViewHref(segment.direction)}
            style={{ left: percent(point.x), top: percent(point.y) }}
            className="group absolute -translate-x-1/2 -translate-y-1/2"
          >
            <span className="grid size-11 place-items-center rounded-full bg-white shadow-lg shadow-navy/25 ring-1 ring-brand/15 transition-transform duration-200 ease-smooth group-hover:scale-110 sm:size-14">
              <Icon name={segment.icon} className="size-5 text-brand sm:size-6" />
            </span>
            <span className="sr-only">{segment.category}</span>
          </Link>
        );
      })}
    </motion.div>
  );
}
