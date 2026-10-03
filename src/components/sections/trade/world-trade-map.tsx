"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { networkPoints, tradeOrigin, worldwideHubs } from "@/config/markets";
import { useDomId } from "@/hooks/use-dom-id";
import { arcPath, project, toPercent, type MapBounds, type MapSize } from "@/lib/geo";
import { cn } from "@/lib/cn";
import { EASE_SMOOTH } from "@/lib/motion";
import { WORLD_DOTS } from "@/lib/world-dots";
import type { LabelAnchor, Market } from "@/types/content";

/* The whole world (minus the polar caps), equirectangular. */
const BOUNDS: MapBounds = { west: -180, east: 180, north: 76, south: -56 };
const SIZE: MapSize = { width: 1000, height: 367 };
const toMap = (lat: number, lon: number) => project({ lat, lon }, BOUNDS, SIZE);

/** Every land dot as one path of zero-length segments: thousands of dots, one DOM node. */
const LAND_PATH = WORLD_DOTS.map(([lon, lat]) => {
  const point = toMap(lat, lon);
  return `M${point.x} ${point.y}h0`;
}).join("");

const origin = toMap(tradeOrigin.coordinates.lat, tradeOrigin.coordinates.lon);
const network = networkPoints.map((place) => {
  const point = toMap(place.coordinates.lat, place.coordinates.lon);
  return { ...place, point, path: arcPath(origin, point, 0.22) };
});

const hubs = worldwideHubs.map((place) => {
  const point = toMap(place.coordinates.lat, place.coordinates.lon);
  return { ...place, point, path: arcPath(origin, point, 0.25) };
});

const LABEL_GAP_PX = 8;
const LABEL_TRANSFORMS: Record<LabelAnchor, string> = {
  top: `translate(-50%, calc(-100% - ${LABEL_GAP_PX}px))`,
  bottom: `translate(-50%, ${LABEL_GAP_PX}px)`,
  left: `translate(calc(-100% - ${LABEL_GAP_PX}px), -50%)`,
  right: `translate(${LABEL_GAP_PX}px, -50%)`,
};

interface WorldTradeMapProps {
  /** Core markets, drawn as highlighted, labelled lanes. */
  markets: Market[];
  labels: { core: string; network: string; worldwide: string };
  className?: string;
}

/** A dotted world map with trade lanes from India: core markets highlighted, the wider network behind them. */
export function WorldTradeMap({ markets, labels, className }: WorldTradeMapProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const reduceMotion = useReducedMotion();
  const gradientId = useDomId("world-lane");
  const core = markets
    .filter((market) => market.code !== tradeOrigin.code)
    .map((market) => {
      const point = toMap(market.coordinates.lat, market.coordinates.lon);
      return { market, point, path: arcPath(origin, point, 0.3) };
    });
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
            <stop offset="0%" stopColor="#f2b34b" />
            <stop offset="100%" stopColor="#4fa8e8" />
          </linearGradient>
        </defs>

        <path d={LAND_PATH} stroke="currentColor" strokeWidth={2.3} strokeLinecap="round" className="text-fg/25" />

        {network.map((lane, index) => (
          <motion.path
            key={lane.name}
            d={lane.path}
            fill="none"
            stroke="currentColor"
            strokeWidth={0.8}
            className="text-tide/45"
            {...draw(0.6 + index * 0.03)}
          />
        ))}
        {hubs.map((lane, index) => (
          <motion.path
            key={lane.name}
            d={lane.path}
            fill="none"
            stroke="currentColor"
            strokeWidth={1}
            strokeDasharray="3 5"
            className="text-gold/50"
            {...draw(1 + index * 0.08)}
          />
        ))}
        {core.map((lane, index) => (
          <g key={lane.market.code}>
            <motion.path d={lane.path} fill="none" stroke={`url(#${gradientId})`} strokeWidth={1.8} {...draw(0.2 + index * 0.08)} />
            {!reduceMotion && (
              <path
                d={lane.path}
                fill="none"
                stroke="#ffffff"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeDasharray="2 14"
                className="animate-dash opacity-80"
                style={{ animationDuration: `${1.4 + (index % 3) * 0.3}s` }}
              />
            )}
          </g>
        ))}

        {network.map((lane) => (
          <circle key={lane.name} cx={lane.point.x} cy={lane.point.y} r={2.2} className="fill-tide" />
        ))}
        {hubs.map((lane) => (
          <circle key={lane.name} cx={lane.point.x} cy={lane.point.y} r={3} className="fill-gold/70" />
        ))}
        {core.map((lane) => (
          <circle key={lane.market.code} cx={lane.point.x} cy={lane.point.y} r={3.6} className="fill-sky stroke-canvas" strokeWidth={1.5} />
        ))}
        <circle cx={origin.x} cy={origin.y} r={9} className="animate-ping fill-gold/40 motion-reduce:animate-none" style={{ transformOrigin: `${origin.x}px ${origin.y}px`, transformBox: "view-box" }} />
        <circle cx={origin.x} cy={origin.y} r={5} className="fill-gold stroke-canvas" strokeWidth={2} />
      </svg>

      {core.map(({ market, point }) => (
        <span
          key={market.code}
          aria-hidden
          className="pointer-events-none absolute hidden rounded-full bg-canvas/80 px-1.5 py-0.5 text-[10px] font-semibold whitespace-nowrap text-fg ring-1 ring-border backdrop-blur md:block"
          style={{
            left: toPercent(point.x, SIZE.width),
            top: toPercent(point.y, SIZE.height),
            transform: LABEL_TRANSFORMS[market.labelAnchor ?? "right"],
          }}
        >
          {market.shortName}
        </span>
      ))}
      <span
        aria-hidden
        className="pointer-events-none absolute -translate-x-1/2 translate-y-3 text-[11px] font-bold tracking-wide text-gold"
        style={{ left: toPercent(origin.x, SIZE.width), top: toPercent(origin.y, SIZE.height) }}
      >
        {tradeOrigin.name}
      </span>

      <ul className="absolute bottom-0 left-0 flex flex-wrap gap-x-5 gap-y-1 text-xs text-fg-mute">
        <li className="flex items-center gap-2">
          <span aria-hidden className="h-0.5 w-5 rounded-full bg-linear-to-r from-gold to-tide" />
          {labels.core}
        </li>
        <li className="flex items-center gap-2">
          <span aria-hidden className="h-px w-5 bg-tide/60" />
          {labels.network}
        </li>
        <li className="flex items-center gap-2">
          <span aria-hidden className="w-5 border-t border-dashed border-gold/70" />
          {labels.worldwide}
        </li>
      </ul>
    </div>
  );
}
