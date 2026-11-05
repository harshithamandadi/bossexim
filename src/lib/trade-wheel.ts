/**
 * Geometry and colours of the brand wheel (product categories orbiting a globe), shared
 * by the Home hero (components/sections/home/trade-wheel.tsx) and the PDF brochure's cover.
 * All values are in viewBox units of a WHEEL.size square.
 */
export const WHEEL = {
  size: 500,
  center: 250,
  outerRadius: 238,
  innerRadius: 116,
  globeRadius: 102,
  /** Where the photo pods sit: halfway across the ring. */
  podRadius: 177,
  sectorGapDegrees: 2,
} as const;

/** Segment fills, alternating light and deep, and the globe's shading. */
export const WHEEL_COLORS = {
  light: { from: "#8fc6f2", to: "#1560bd", fromOpacity: 0.85, toOpacity: 0.9 },
  deep: { from: "#4fa8e8", to: "#0e4a95", fromOpacity: 0.85, toOpacity: 0.9 },
  globe: [
    { offset: "0%", color: "#4fa8e8" },
    { offset: "55%", color: "#1560bd" },
    { offset: "100%", color: "#0a3270" },
  ],
} as const;

const round = (value: number) => Math.round(value * 100) / 100;

/** A point at `radius` from the centre, `degrees` clockwise from 12 o'clock. */
export function polar(radius: number, degrees: number) {
  const radians = ((degrees - 90) * Math.PI) / 180;
  return { x: round(WHEEL.center + radius * Math.cos(radians)), y: round(WHEEL.center + radius * Math.sin(radians)) };
}

/** The ring segment for `index`, with a small gap either side. */
export function sectorPath(index: number, sectorDegrees: number) {
  const { outerRadius, innerRadius, sectorGapDegrees } = WHEEL;
  const start = index * sectorDegrees + sectorGapDegrees / 2;
  const end = (index + 1) * sectorDegrees - sectorGapDegrees / 2;
  const outerStart = polar(outerRadius, start);
  const outerEnd = polar(outerRadius, end);
  const innerEnd = polar(innerRadius, end);
  const innerStart = polar(innerRadius, start);
  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${outerRadius} ${outerRadius} 0 0 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${innerRadius} ${innerRadius} 0 0 0 ${innerStart.x} ${innerStart.y}`,
    "Z",
  ].join(" ");
}
