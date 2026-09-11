"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { tradeOrigin, type MarketCode } from "@/config/markets";
import { productLabels } from "@/config/products";
import { useDomId } from "@/hooks/use-dom-id";
import { activeMarkets, getProductsForMarket } from "@/lib/catalogue";
import { cn } from "@/lib/cn";
import { formatList, pluralize } from "@/lib/format";
import { arcPath, project, toPercent, type MapBounds, type MapSize, type Point } from "@/lib/geo";
import { DURATION, EASE_APPLE } from "@/lib/motion";
import type { LabelAnchor, Market } from "@/types/content";
import { laneInteractionProps, type ActiveLaneChange } from "./lane-interaction";

const MAP_SIZE: MapSize = { width: 1000, height: 690 };
const MAP_BOUNDS: MapBounds = { west: 40, east: 160, north: 38, south: -45 };
const GRATICULE_STEP_DEGREES = 15;
/** Imports are sourced globally, so inbound lanes enter from the map's edges. */
const IMPORT_ENTRY_POINTS: Point[] = [
  { x: 0, y: 70 },
  { x: MAP_SIZE.width, y: 30 },
];
const LABEL_GAP_PX = 14;
const LABEL_TRANSFORMS: Record<LabelAnchor, string> = {
  top: `translate(-50%, calc(-100% - ${LABEL_GAP_PX}px))`,
  bottom: `translate(-50%, ${LABEL_GAP_PX}px)`,
  left: `translate(calc(-100% - ${LABEL_GAP_PX}px), -50%)`,
  right: `translate(${LABEL_GAP_PX}px, -50%)`,
};

const toMap = (point: Parameters<typeof project>[0]) => project(point, MAP_BOUNDS, MAP_SIZE);

function multiplesBetween(start: number, end: number, step: number): number[] {
  const first = Math.ceil(start / step) * step;
  return Array.from({ length: Math.floor((end - first) / step) + 1 }, (_, index) => first + index * step);
}

/* Static geometry, computed once per module load. */
const origin = toMap(tradeOrigin.coordinates);
const exportLanes = activeMarkets.map((market) => {
  const point = toMap(market.coordinates);
  return { market, point, path: arcPath(origin, point) };
});
const importLanes = IMPORT_ENTRY_POINTS.map((point) => arcPath(point, origin, 0.18));
const graticule = {
  x: multiplesBetween(MAP_BOUNDS.west, MAP_BOUNDS.east, GRATICULE_STEP_DEGREES).map((lon) => toMap({ lat: 0, lon }).x),
  y: multiplesBetween(MAP_BOUNDS.south, MAP_BOUNDS.north, GRATICULE_STEP_DEGREES).map((lat) => toMap({ lat, lon: 0 }).y),
};
const mapDescription = `Export routes from ${tradeOrigin.name} to ${formatList(activeMarkets.map((market) => market.name))}.`;

interface TradeRouteMapProps {
  activeCode: MarketCode | null;
  onActiveChange: ActiveLaneChange;
  className?: string;
}

/** Abstract, data-driven route map: arcs draw in on scroll, cargo dots travel each lane. */
export function TradeRouteMap({ activeCode, onActiveChange, className }: TradeRouteMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const isInView = useInView(svgRef, { once: true, amount: 0.3 });
  const reduceMotion = useReducedMotion();
  const gradientPrefix = useDomId("lane");
  const glowId = useDomId("glow");

  return (
    <div className={cn("relative w-full", className)} style={{ aspectRatio: `${MAP_SIZE.width} / ${MAP_SIZE.height}` }}>
      <div
        aria-hidden
        className="dot-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_45%_45%,#000_25%,transparent_75%)]"
      />
      <svg
        ref={svgRef}
        viewBox={`0 0 ${MAP_SIZE.width} ${MAP_SIZE.height}`}
        role="img"
        aria-label={mapDescription}
        className="absolute inset-0 size-full overflow-visible"
      >
        <defs>
          {exportLanes.map(({ market, point }) => (
            <linearGradient
              key={market.code}
              id={`${gradientPrefix}-${market.code}`}
              gradientUnits="userSpaceOnUse"
              x1={origin.x}
              y1={origin.y}
              x2={point.x}
              y2={point.y}
            >
              <stop offset="0%" stopColor="var(--color-brand)" />
              <stop offset="100%" stopColor="var(--color-tide)" />
            </linearGradient>
          ))}
          <radialGradient id={glowId}>
            <stop offset="0%" stopColor="var(--color-brand)" stopOpacity={0.55} />
            <stop offset="100%" stopColor="var(--color-brand)" stopOpacity={0} />
          </radialGradient>
        </defs>

        <g stroke="currentColor" strokeOpacity={0.06}>
          {graticule.x.map((x) => (
            <line key={`lon-${x}`} x1={x} x2={x} y1={0} y2={MAP_SIZE.height} />
          ))}
          {graticule.y.map((y) => (
            <line key={`lat-${y}`} x1={0} x2={MAP_SIZE.width} y1={y} y2={y} />
          ))}
        </g>

        {importLanes.map((path) => (
          <path
            key={path}
            d={path}
            fill="none"
            stroke="var(--color-saffron)"
            strokeOpacity={0.75}
            strokeWidth={1.5}
            strokeDasharray="4 4"
            className="animate-dash motion-reduce:animate-none"
          />
        ))}

        {exportLanes.map(({ market, point, path }, index) => {
          const isActive = market.code === activeCode;
          const isDimmed = activeCode !== null && !isActive;
          return (
            <g key={market.code}>
              <path d={path} fill="none" stroke="currentColor" strokeOpacity={0.1} strokeWidth={1.5} />
              <motion.path
                d={path}
                fill="none"
                stroke={`url(#${gradientPrefix}-${market.code})`}
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 1, strokeWidth: 2 }}
                animate={
                  isInView ? { pathLength: 1, opacity: isDimmed ? 0.2 : 1, strokeWidth: isActive ? 3.5 : 2 } : undefined
                }
                transition={{
                  pathLength: { duration: 1.8, delay: 0.3 + index * 0.12, ease: EASE_APPLE },
                  default: { duration: DURATION.fast },
                }}
              />
              {isInView && !reduceMotion && (
                <motion.circle
                  r={3}
                  fill="white"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isDimmed ? 0.2 : 1 }}
                  transition={{ delay: 2 + index * 0.12 }}
                >
                  <animateMotion dur={`${3.2 + index * 0.35}s`} repeatCount="indefinite" path={path} />
                </motion.circle>
              )}
              <circle
                cx={point.x}
                cy={point.y}
                r={22}
                fill={`url(#${glowId})`}
                opacity={isDimmed ? 0.2 : 1}
                className="transition-opacity duration-300"
              />
              <circle
                cx={point.x}
                cy={point.y}
                r={isActive ? 7 : 5}
                fill="var(--color-brand)"
                stroke="var(--color-canvas)"
                strokeWidth={2}
              />
            </g>
          );
        })}

        <OriginNode point={origin} isAnimated={!reduceMotion} />
      </svg>

      {exportLanes.map(({ market, point }) => (
        <MarketLabel
          key={market.code}
          market={market}
          point={point}
          isActive={market.code === activeCode}
          isDimmed={activeCode !== null && market.code !== activeCode}
          onActiveChange={onActiveChange}
        />
      ))}
      <span
        className="pointer-events-none absolute text-[11px] font-semibold sm:text-sm"
        style={{
          left: toPercent(origin.x, MAP_SIZE.width),
          top: toPercent(origin.y, MAP_SIZE.height),
          transform: LABEL_TRANSFORMS.bottom,
        }}
      >
        {tradeOrigin.name}
      </span>
    </div>
  );
}

function OriginNode({ point, isAnimated }: { point: Point; isAnimated: boolean }) {
  return (
    <g>
      {isAnimated &&
        [0, 1.2].map((delay) => (
          <motion.circle
            key={delay}
            cx={point.x}
            cy={point.y}
            fill="none"
            stroke="var(--color-fg)"
            strokeWidth={1}
            initial={{ r: 8, opacity: 0.6 }}
            animate={{ r: 34, opacity: 0 }}
            transition={{ duration: 2.4, delay, repeat: Infinity, ease: "easeOut" }}
          />
        ))}
      <circle cx={point.x} cy={point.y} r={9} fill="var(--color-fg)" />
      <circle cx={point.x} cy={point.y} r={3.5} fill="var(--color-canvas)" />
    </g>
  );
}

interface MarketLabelProps {
  market: Market;
  point: Point;
  isActive: boolean;
  isDimmed: boolean;
  onActiveChange: ActiveLaneChange;
}

function MarketLabel({ market, point, isActive, isDimmed, onActiveChange }: MarketLabelProps) {
  const code = market.code as MarketCode;
  const lineCount = getProductsForMarket(code).length;

  return (
    <button
      type="button"
      {...laneInteractionProps(code, isActive, onActiveChange)}
      aria-label={`${market.name}: ${lineCount} ${pluralize(lineCount, productLabels.line, productLabels.lines)}`}
      style={{
        left: toPercent(point.x, MAP_SIZE.width),
        top: toPercent(point.y, MAP_SIZE.height),
        transform: LABEL_TRANSFORMS[market.labelAnchor ?? "top"],
      }}
      className={cn(
        "absolute z-10 flex items-center gap-1.5 rounded-full bg-elevated/85 px-2 py-0.5 text-[10px] font-medium whitespace-nowrap",
        "ring-1 ring-border backdrop-blur-md transition-[opacity,box-shadow] duration-300 sm:px-2.5 sm:py-1 sm:text-xs",
        isDimmed && "opacity-40",
        isActive && "ring-brand",
      )}
    >
      <span className="font-semibold">{market.code}</span>
      <span className="hidden text-fg-mute md:inline">{market.shortName}</span>
    </button>
  );
}
