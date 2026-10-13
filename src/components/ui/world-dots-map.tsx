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
  /** "backdrop": softer dots and animated lanes, for use behind content. */
  variant?: "inline" | "backdrop";
  /** Fill the box, cropping the edges ("slice"), or show the whole world ("meet"). */
  fit?: "slice" | "meet";
  /** An aeroplane flying a looping route from `flight.from` to `flight.to`. */
  flight?: { from: GeoPoint; to: GeoPoint };
  className?: string;
}

/** A small aeroplane (nose pointing along +x, so it follows its path with rotate="auto"). */
const PLANE_PATH =
  "M2 -0.8 L-0.6 -0.8 L-3.4 -5 L-4.6 -5 L-3 -0.8 L-6 -0.8 L-7 -2.2 L-7.8 -2.2 L-7.2 0 L-7.8 2.2 L-7 2.2 L-6 0.8 L-3 0.8 L-4.6 5 L-3.4 5 L-0.6 0.8 L2 0.8 Q3.6 0.8 3.6 0 Q3.6 -0.8 2 -0.8 Z";

/** A static dotted world map (no JavaScript), with optional lanes from an origin. */
export function WorldDotsMap({ origin, points = [], variant = "inline", fit, flight, className }: WorldDotsMapProps) {
  const start = origin && project(origin, BOUNDS, SIZE);
  const isBackdrop = variant === "backdrop";
  const flightPath = flight && arcPath(project(flight.from, BOUNDS, SIZE), project(flight.to, BOUNDS, SIZE), 0.35);

  return (
    <svg
      viewBox={`0 0 ${SIZE.width} ${SIZE.height}`}
      preserveAspectRatio={`xMidYMid ${fit ?? (isBackdrop ? "slice" : "meet")}`}
      aria-hidden
      className={cn(isBackdrop ? "size-full" : "h-auto w-full", className)}
    >
      <path
        d={LAND_PATH}
        stroke="currentColor"
        strokeWidth={isBackdrop ? 2.1 : 2.6}
        strokeLinecap="round"
        className={isBackdrop ? "text-brand/45" : "text-fg/20"}
      />
      {start &&
        points.map((point, index) => {
          const end = project(point, BOUNDS, SIZE);
          const path = arcPath(start, end, 0.3);
          return (
            <g key={`${point.lat},${point.lon}`}>
              <path d={path} fill="none" strokeWidth={isBackdrop ? 0.8 : 2} className={isBackdrop ? "stroke-brand/35" : "stroke-brand/60"} />
              {isBackdrop && (
                <path
                  d={path}
                  fill="none"
                  strokeWidth={1}
                  strokeLinecap="round"
                  strokeDasharray="1.5 10"
                  className="animate-dash stroke-brand/70 motion-reduce:animate-none"
                  style={{ animationDuration: `${1.6 + (index % 4) * 0.35}s` }}
                />
              )}
              <circle cx={end.x} cy={end.y} r={isBackdrop ? 2.2 : 5} className={isBackdrop ? "fill-tide/80" : "fill-tide"} />
            </g>
          );
        })}
      {start && <circle cx={start.x} cy={start.y} r={isBackdrop ? 4 : 8} className="fill-gold" />}
      {flightPath && (
        <g>
          <path d={flightPath} fill="none" strokeWidth={1.2} strokeDasharray="4 6" strokeLinecap="round" className="stroke-brand/55" />
          {/* The moving plane is hidden for reduced-motion visitors; the dashed route stays. */}
          <g className="fill-brand motion-reduce:hidden">
            <path d={PLANE_PATH} transform="scale(1.7)">
              <animateMotion dur="9s" repeatCount="indefinite" rotate="auto" path={flightPath} />
            </path>
          </g>
        </g>
      )}
    </svg>
  );
}
