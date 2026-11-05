import type { GeoPoint } from "@/types/content";

export interface Point {
  x: number;
  y: number;
}

export interface MapBounds {
  west: number;
  east: number;
  north: number;
  south: number;
}

export interface MapSize {
  width: number;
  height: number;
}

/** Rounded so server and browser render identical SVG attributes. */
const round = (value: number) => Math.round(value * 100) / 100;

/** Equirectangular projection of a lat/lon into map pixel space. */
export function project({ lat, lon }: GeoPoint, bounds: MapBounds, size: MapSize): Point {
  return {
    x: round(((lon - bounds.west) / (bounds.east - bounds.west)) * size.width),
    y: round(((bounds.north - lat) / (bounds.north - bounds.south)) * size.height),
  };
}

/** A quadratic arc between two points that always bows "north" (upwards). */
export function arcPath(from: Point, to: Point, curvature = 0.28): string {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.hypot(dx, dy) || 1;
  const flip = dx / length > 0 ? 1 : -1;
  const normal = { x: (dy / length) * flip, y: (-dx / length) * flip };
  const control = {
    x: round((from.x + to.x) / 2 + normal.x * length * curvature),
    y: round((from.y + to.y) / 2 + normal.y * length * curvature),
  };
  return `M ${from.x} ${from.y} Q ${control.x} ${control.y} ${to.x} ${to.y}`;
}

/** How the dotted globe is shown (components/ui/dotted-globe.tsx and the PDF brochure's cover). */
export const GLOBE_VIEW = {
  /** Centre longitude at rest: India facing the viewer. */
  startLongitude: 78,
  /** The axis leans towards the viewer so the northern hemisphere shows more. */
  tiltDegrees: 12,
  /** Marked in gold: Hyderabad. */
  highlight: { lon: 78.5, lat: 17.4 },
} as const;

const RADIANS = Math.PI / 180;
const TILT_SIN = Math.sin(GLOBE_VIEW.tiltDegrees * RADIANS);
const TILT_COS = Math.cos(GLOBE_VIEW.tiltDegrees * RADIANS);

/**
 * Orthographic projection onto a unit globe turned to `rotation` degrees of longitude:
 * x and y in -1…1 (y up), and depth > 0 for points on the visible side.
 */
export function orthographic(lon: number, lat: number, rotation: number): { x: number; y: number; depth: number } {
  const lambda = (lon - rotation) * RADIANS;
  const phi = lat * RADIANS;
  const x = Math.cos(phi) * Math.sin(lambda);
  const y = Math.sin(phi);
  const z = Math.cos(phi) * Math.cos(lambda);
  return { x, y: y * TILT_COS - z * TILT_SIN, depth: y * TILT_SIN + z * TILT_COS };
}

export function toPercent(value: number, total: number): string {
  return `${round((value / total) * 100)}%`;
}
