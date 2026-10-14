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
import { useEffect, useMemo, useRef, useState, type PointerEvent } from "react";
import { DottedGlobe } from "@/components/ui/dotted-globe";
import { Icon } from "@/components/ui/icon";
import { productLabels, productsViewHref, tradeDirections } from "@/config";
import { useDomId } from "@/hooks/use-dom-id";
import { groupByCategory } from "@/lib/catalogue";
import { cn } from "@/lib/cn";
import { pluralize } from "@/lib/format";
import { DURATION, EASE_SMOOTH, SPRING_SNAPPY, VIEWPORT_ONCE } from "@/lib/motion";
import type { IconName } from "@/lib/icons";
import type { Product } from "@/types/content";

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

interface Segment {
  category: string;
  icon: IconName;
  href: string;
  caption: string;
  /** A product photo for the category, shown inside the globe. */
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

const POD_RADIUS = (OUTER_RADIUS + INNER_RADIUS) / 2;

const round = (value: number) => Math.round(value * 100) / 100;
const percent = (value: number) => `${round((value / SIZE) * 100)}%`;

function polar(radius: number, degrees: number) {
  const radians = ((degrees - 90) * Math.PI) / 180;
  return { x: round(CENTER + radius * Math.cos(radians)), y: round(CENTER + radius * Math.sin(radians)) };
}

function sectorPath(index: number, sectorDegrees: number) {
  const start = index * sectorDegrees + SECTOR_GAP_DEGREES / 2;
  const end = (index + 1) * sectorDegrees - SECTOR_GAP_DEGREES / 2;
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
      <GlobePhotos segments={segments} activeIndex={activeIndex} paused={reduceMotion === true || !isOnScreen} />
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
          "relative grid size-11 place-items-center overflow-hidden rounded-full bg-white ring-1 ring-brand/15 transition-shadow duration-200 sm:size-14",
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

/** A blue sphere with land dots spinning on it, at the still centre of the orbiting wheel. */
function Globe({ gradientId, paused }: { gradientId: string; paused: boolean }) {
  const inset = percent(CENTER - GLOBE_RADIUS);
  return (
    <>
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} aria-hidden className="pointer-events-none absolute inset-0 size-full">
        <defs>
          <radialGradient id={gradientId} cx="35%" cy="30%" r="80%">
            <stop offset="0%" stopColor="#4fa8e8" />
            <stop offset="55%" stopColor="#1560bd" />
            <stop offset="100%" stopColor="#0a3270" />
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

/** Time each category's photo stays in the globe while the wheel turns on its own. */
const PHOTO_INTERVAL_MS = 2800;

/**
 * Product photos inside the globe (client request): they cycle through the categories
 * as the wheel turns, and show the category being pointed at, with its name.
 */
function GlobePhotos({ segments, activeIndex, paused }: { segments: Segment[]; activeIndex: number | null; paused: boolean }) {
  const withPhotos = segments.map((segment, index) => ({ segment, index })).filter(({ segment }) => segment.photo);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    if (paused || activeIndex !== null || withPhotos.length < 2) return;
    const timer = window.setInterval(() => setCycle((value) => value + 1), PHOTO_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [paused, activeIndex, withPhotos.length]);

  const shown =
    activeIndex !== null ? segments[activeIndex] : withPhotos.length > 0 ? withPhotos[cycle % withPhotos.length]?.segment : undefined;
  const inset = percent(CENTER - GLOBE_RADIUS * 0.86);

  return (
    <div aria-hidden className="pointer-events-none absolute" style={{ inset }}>
      <AnimatePresence initial={false}>
        {shown?.photo && (
          <motion.div
            key={shown.category}
            initial={{ opacity: 0, scale: 0.92, rotate: -8 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 1.04, rotate: 8 }}
            transition={{ duration: 0.6, ease: EASE_SMOOTH }}
            className="absolute inset-0 overflow-hidden rounded-full bg-white shadow-[inset_0_0_30px_rgb(10_50_112/0.35)] ring-4 ring-white/70"
          >
            <Image src={shown.photo.src} alt="" fill sizes="220px" className="scale-110 object-cover" />
            <span className="absolute inset-x-0 bottom-0 bg-linear-to-t from-navy-deep/80 via-navy-deep/40 to-transparent px-4 pt-6 pb-[14%] text-center text-white">
              <span className="block font-display text-[13px] leading-tight font-bold sm:text-sm">{shown.category}</span>
              <span className="mt-0.5 block text-[10px] text-white/80 sm:text-[11px]">{shown.caption}</span>
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
