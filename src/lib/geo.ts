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

export function toPercent(value: number, total: number): string {
  return `${round((value / total) * 100)}%`;
}
