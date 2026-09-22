"use client";

import {
  AnimatePresence,
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, type PointerEvent } from "react";
import { Icon } from "@/components/ui/icon";
import { productLabels, products, productsViewHref, tradeDirections } from "@/config";
import { useDomId } from "@/hooks/use-dom-id";
import { groupByCategory } from "@/lib/catalogue";
import { cn } from "@/lib/cn";
import { pluralize } from "@/lib/format";
import { DURATION, EASE_SMOOTH, SPRING_SNAPPY, VIEWPORT_ONCE } from "@/lib/motion";

/* Geometry, in viewBox units. */
const SIZE = 500;
const CENTER = SIZE / 2;
const OUTER_RADIUS = 238;
const INNER_RADIUS = 116;
const GLOBE_RADIUS = INNER_RADIUS - 14;
const SECTOR_GAP_DEGREES = 2;

/** Idle orbit speed in degrees per second: one full turn a minute. */
const ORBIT_SPEED = 6;
/** How quickly the orbit eases to a stop, or back up to speed (per second). */
const ORBIT_RESPONSE = 5;

/** One segment per product category — the wheel grows with the catalogue. */
const segments = groupByCategory(products).flatMap(({ category, items }) => {
  const lead = items[0];
  if (!lead) return [];
  const direction = tradeDirections[lead.direction];
  return [
    {
      category,
      icon: lead.icon,
      href: productsViewHref(lead.direction),
      caption: `${items.length} ${direction.singular.toLowerCase()} ${pluralize(items.length, productLabels.line, productLabels.lines)}`,
    },
  ];
});
type Segment = (typeof segments)[number];

const SECTOR_DEGREES = 360 / segments.length;
const POD_RADIUS = (OUTER_RADIUS + INNER_RADIUS) / 2;

const round = (value: number) => Math.round(value * 100) / 100;
const percent = (value: number) => `${round((value / SIZE) * 100)}%`;

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

/** True when the pointer moves somewhere outside this segment (not just from its wedge onto its pod). */
function leavesSegment(event: PointerEvent, index: number) {
  const next = event.relatedTarget;
  return !(next instanceof Element && next.closest(`[data-segment="${index}"]`));
}

/**
 * The brand wheel: trade categories orbiting a still globe. Pointing at (or
 * focusing) a segment glides the orbit to a stop and brings that segment forward.
 */
export function TradeWheel({ className }: { className?: string }) {
  const id = useDomId("wheel");
  const router = useRouter();
  const wheelRef = useRef<HTMLDivElement>(null);
  const isOnScreen = useInView(wheelRef);
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const rotation = useMotionValue(0);
  const counterRotation = useTransform(rotation, (degrees) => -degrees);
  const speed = useRef(ORBIT_SPEED);

  useAnimationFrame((_, deltaMs) => {
    if (reduceMotion || !isOnScreen) return;
    const seconds = deltaMs / 1000;
    const target = activeIndex === null ? ORBIT_SPEED : 0;
    speed.current += (target - speed.current) * Math.min(1, seconds * ORBIT_RESPONSE);
    rotation.set((rotation.get() + speed.current * seconds) % 360);
  });

  const segmentProps = (index: number) => ({
    "data-segment": index,
    onPointerEnter: () => setActiveIndex(index),
    onPointerLeave: (event: PointerEvent) => {
      if (leavesSegment(event, index)) setActiveIndex(null);
    },
  });

  const activeSegment = activeIndex === null ? undefined : segments[activeIndex];

  return (
    <motion.div
      ref={wheelRef}
      className={cn("relative aspect-square w-full", className)}
      initial={{ opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={VIEWPORT_ONCE}
      transition={{ duration: DURATION.slow, ease: EASE_SMOOTH }}
    >
      <motion.div style={{ rotate: rotation }} className="absolute inset-0 will-change-transform">
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} aria-hidden className="absolute inset-0 size-full overflow-visible">
          <defs>
            <linearGradient id={`${id}-light`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#8fc6f2" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#1560bd" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id={`${id}-deep`} x1="0" y1="1" x2="1" y2="0">
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
            className="stroke-brand/40"
          />

          {segments.map((segment, index) => {
            const isActive = index === activeIndex;
            return (
              <motion.path
                key={segment.category}
                {...segmentProps(index)}
                d={sectorPath(index)}
                fill={`url(#${id}-${index % 2 === 0 ? "light" : "deep"})`}
                strokeWidth="3"
                className="cursor-pointer stroke-canvas"
                style={{ transformBox: "view-box", transformOrigin: `${CENTER}px ${CENTER}px` }}
                animate={{ scale: isActive ? 1.05 : 1, opacity: activeIndex !== null && !isActive ? 0.5 : 1 }}
                transition={SPRING_SNAPPY}
                onClick={() => router.push(segment.href)}
              />
            );
          })}
        </svg>

        {segments.map((segment, index) => {
          const point = polar(POD_RADIUS, (index + 0.5) * SECTOR_DEGREES);
          return (
            <div
              key={segment.category}
              style={{ left: percent(point.x), top: percent(point.y) }}
              className={cn("absolute -translate-x-1/2 -translate-y-1/2", index === activeIndex && "z-10")}
            >
              <motion.div style={{ rotate: counterRotation }}>
                <SegmentPod
                  segment={segment}
                  isActive={index === activeIndex}
                  {...segmentProps(index)}
                  onFocus={() => setActiveIndex(index)}
                  onBlur={() => setActiveIndex(null)}
                />
              </motion.div>
            </div>
          );
        })}
      </motion.div>

      <Globe gradientId={`${id}-globe`} />
      <GlobeCaption segment={activeSegment} />
    </motion.div>
  );
}

interface SegmentPodProps {
  segment: Segment;
  isActive: boolean;
  "data-segment": number;
  onPointerEnter: () => void;
  onPointerLeave: (event: PointerEvent) => void;
  onFocus: () => void;
  onBlur: () => void;
}

function SegmentPod({ segment, isActive, ...props }: SegmentPodProps) {
  return (
    <Link href={segment.href} {...props} className="group block rounded-full outline-none">
      <motion.span
        animate={{ scale: isActive ? 1.4 : 1 }}
        transition={SPRING_SNAPPY}
        className={cn(
          "grid size-11 place-items-center rounded-full bg-white ring-1 ring-brand/15 transition-shadow duration-200 sm:size-14",
          "group-focus-visible:ring-2 group-focus-visible:ring-brand",
          isActive ? "shadow-xl shadow-navy/35" : "shadow-lg shadow-navy/25",
        )}
      >
        <Icon name={segment.icon} className="size-5 text-brand sm:size-6" />
      </motion.span>
      <span className="sr-only">{segment.category}</span>
    </Link>
  );
}

/** Stays still at the centre while the segments orbit it. */
function Globe({ gradientId }: { gradientId: string }) {
  return (
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`} aria-hidden className="pointer-events-none absolute inset-0 size-full">
      <defs>
        <radialGradient id={gradientId} cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#8fd0f7" />
          <stop offset="55%" stopColor="#1f76c9" />
          <stop offset="100%" stopColor="#0c3f80" />
        </radialGradient>
      </defs>
      <circle cx={CENTER} cy={CENTER} r={GLOBE_RADIUS} fill={`url(#${gradientId})`} />
      <g fill="none" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="1.5">
        <circle cx={CENTER} cy={CENTER} r={GLOBE_RADIUS} />
        <ellipse cx={CENTER} cy={CENTER} rx={GLOBE_RADIUS * 0.4} ry={GLOBE_RADIUS} />
        <ellipse cx={CENTER} cy={CENTER} rx={GLOBE_RADIUS * 0.78} ry={GLOBE_RADIUS} />
        <path d={`M ${CENTER - GLOBE_RADIUS} ${CENTER} h ${GLOBE_RADIUS * 2}`} />
        <path d={`M ${CENTER - GLOBE_RADIUS * 0.84} ${CENTER - GLOBE_RADIUS * 0.5} h ${GLOBE_RADIUS * 1.68}`} />
        <path d={`M ${CENTER - GLOBE_RADIUS * 0.84} ${CENTER + GLOBE_RADIUS * 0.5} h ${GLOBE_RADIUS * 1.68}`} />
      </g>
    </svg>
  );
}

/** Names the segment being pointed at, written across the globe. */
function GlobeCaption({ segment }: { segment?: Segment }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 grid place-items-center"
      style={{ padding: percent(CENTER - GLOBE_RADIUS * 0.8) }}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {segment && (
          <motion.div
            key={segment.category}
            initial={{ opacity: 0, y: 6, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -6, filter: "blur(4px)", transition: { duration: DURATION.fast } }}
            transition={{ duration: 0.24, ease: EASE_SMOOTH }}
            className="rounded-2xl bg-navy-deep/45 px-3 py-2 text-center text-white backdrop-blur-sm"
          >
            <p className="font-display text-sm leading-tight font-bold sm:text-base">{segment.category}</p>
            <p className="mt-0.5 text-[11px] font-medium text-white/80 sm:text-xs">{segment.caption}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
