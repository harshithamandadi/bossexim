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
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState, type PointerEvent } from "react";
import { DottedGlobe } from "@/components/ui/dotted-globe";
import { Icon } from "@/components/ui/icon";
import { productLabels, productsViewHref, tradeDirections } from "@/config";
import { useDomId } from "@/hooks/use-dom-id";
import { groupByCategory } from "@/lib/catalogue";
import { cn } from "@/lib/cn";
import { pluralize } from "@/lib/format";
import { DURATION, EASE_SMOOTH, SPRING_SNAPPY, VIEWPORT_ONCE } from "@/lib/motion";
import type { IconName } from "@/lib/icons";
import { WHEEL, WHEEL_COLORS, polar, sectorPath } from "@/lib/trade-wheel";
import type { Product } from "@/types/content";

/* Geometry, in viewBox units (shared with the PDF brochure's cover). */
const { size: SIZE, center: CENTER, outerRadius: OUTER_RADIUS, globeRadius: GLOBE_RADIUS, podRadius: POD_RADIUS } = WHEEL;

/** Idle orbit speed in degrees per second: one full turn a minute. */
const ORBIT_SPEED = 6;
/** How quickly the orbit eases to a stop, or back up to speed (per second). */
const ORBIT_RESPONSE = 5;

interface Segment {
  category: string;
  icon: IconName;
  href: string;
  caption: string;
  /** A product photo for the category, shown in its pod around the wheel. */
  photo?: { src: string; alt: string };
}

/** One segment per product category — the wheel grows with the catalogue. */
function buildSegments(products: Product[]): Segment[] {
  return groupByCategory(products).flatMap(({ category, items }) => {
    const lead = items[0];
    if (!lead) return [];
    const direction = tradeDirections[lead.direction];
    return [
      {
        category,
        icon: lead.icon,
        href: productsViewHref(lead.direction),
        caption: `${items.length} ${direction.singular.toLowerCase()} ${pluralize(items.length, productLabels.line, productLabels.lines)}`,
        photo: items.find((item) => item.images?.[0])?.images?.[0],
      },
    ];
  });
}

const round = (value: number) => Math.round(value * 100) / 100;
const percent = (value: number) => `${round((value / SIZE) * 100)}%`;

/** True when the pointer moves somewhere outside this segment (not just from its wedge onto its pod). */
function leavesSegment(event: PointerEvent, index: number) {
  const next = event.relatedTarget;
  return !(next instanceof Element && next.closest(`[data-segment="${index}"]`));
}

/**
 * The brand wheel: trade categories orbiting a still globe. Pointing at (or
 * focusing) a segment glides the orbit to a stop and brings that segment forward.
 */
export function TradeWheel({ products, className }: { products: Product[]; className?: string }) {
  const segments = useMemo(() => buildSegments(products), [products]);
  const sectorDegrees = 360 / segments.length;
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
              <stop offset="0%" stopColor={WHEEL_COLORS.light.from} stopOpacity={WHEEL_COLORS.light.fromOpacity} />
              <stop offset="100%" stopColor={WHEEL_COLORS.light.to} stopOpacity={WHEEL_COLORS.light.toOpacity} />
            </linearGradient>
            <linearGradient id={`${id}-deep`} x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stopColor={WHEEL_COLORS.deep.from} stopOpacity={WHEEL_COLORS.deep.fromOpacity} />
              <stop offset="100%" stopColor={WHEEL_COLORS.deep.to} stopOpacity={WHEEL_COLORS.deep.toOpacity} />
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
                d={sectorPath(index, sectorDegrees)}
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
          const point = polar(POD_RADIUS, (index + 0.5) * sectorDegrees);
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

      <Globe gradientId={`${id}-globe`} paused={!isOnScreen} />
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
          "relative grid size-12 place-items-center overflow-hidden rounded-full bg-white ring-2 ring-white transition-shadow duration-200 sm:size-16",
          "group-focus-visible:ring-2 group-focus-visible:ring-brand",
          isActive ? "shadow-xl shadow-navy/35" : "shadow-lg shadow-navy/25",
        )}
      >
        {segment.photo ? (
          <Image src={segment.photo.src} alt="" fill sizes="80px" className="object-cover" />
        ) : (
          <Icon name={segment.icon} className="size-5 text-brand sm:size-6" />
        )}
      </motion.span>
      <span className="sr-only">{segment.category}</span>
    </Link>
  );
}

/** A blue sphere with land dots spinning on it, at the still centre of the orbiting wheel. */
function Globe({ gradientId, paused }: { gradientId: string; paused: boolean }) {
  const inset = percent(CENTER - GLOBE_RADIUS);
  return (
    <>
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} aria-hidden className="pointer-events-none absolute inset-0 size-full">
        <defs>
          <radialGradient id={gradientId} cx="35%" cy="30%" r="80%">
            {WHEEL_COLORS.globe.map((stop) => (
              <stop key={stop.offset} offset={stop.offset} stopColor={stop.color} />
            ))}
          </radialGradient>
        </defs>
        <circle cx={CENTER} cy={CENTER} r={GLOBE_RADIUS} fill={`url(#${gradientId})`} />
        <circle cx={CENTER} cy={CENTER} r={GLOBE_RADIUS} fill="none" stroke="#ffffff" strokeOpacity="0.35" strokeWidth="1.5" />
      </svg>
      <div aria-hidden className="pointer-events-none absolute" style={{ inset }}>
        <DottedGlobe paused={paused} className="size-full" />
      </div>
    </>
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
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6, transition: { duration: DURATION.fast } }}
            transition={{ duration: 0.24, ease: EASE_SMOOTH }}
            className="rounded-2xl bg-navy-deep/60 px-3 py-2 text-center text-white"
          >
            <p className="font-display text-sm leading-tight font-bold sm:text-base">{segment.category}</p>
            <p className="mt-0.5 text-[11px] font-medium text-white/85 sm:text-xs">{segment.caption}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
