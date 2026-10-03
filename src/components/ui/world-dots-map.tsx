import { arcPath, project, type MapBounds, type MapSize } from "@/lib/geo";
import { cn } from "@/lib/cn";
import { WORLD_DOTS } from "@/lib/world-dots";
import type { GeoPoint } from "@/types/content";

const BOUNDS: MapBounds = { west: -180, east: 180, north: 76, south: -56 };
const SIZE: MapSize = { width: 1000, height: 367 };

const LAND_PATH = WORLD_DOTS.map(([lon, lat]) => {
  const point = project({ lat, lon }, BOUNDS, SIZE);
  return `M${point.x} ${point.y}h0`;
}).join("");

interface WorldDotsMapProps {
  /** Lanes are drawn from the origin to each of these points. */
  origin?: GeoPoint;
  points?: GeoPoint[];
  className?: string;
}

/** A static dotted world map (no JavaScript), with optional lanes from an origin. */
export function WorldDotsMap({ origin, points = [], className }: WorldDotsMapProps) {
  const start = origin && project(origin, BOUNDS, SIZE);

  return (
    <svg viewBox={`0 0 ${SIZE.width} ${SIZE.height}`} aria-hidden className={cn("h-auto w-full", className)}>
      <path d={LAND_PATH} stroke="currentColor" strokeWidth={2.6} strokeLinecap="round" className="text-fg/20" />
      {start &&
        points.map((point) => {
          const end = project(point, BOUNDS, SIZE);
          return (
            <g key={`${point.lat},${point.lon}`}>
              <path d={arcPath(start, end, 0.3)} fill="none" strokeWidth={2} className="stroke-brand/60" />
              <circle cx={end.x} cy={end.y} r={5} className="fill-tide" />
            </g>
          );
        })}
      {start && <circle cx={start.x} cy={start.y} r={8} className="fill-gold" />}
    </svg>
  );
}
