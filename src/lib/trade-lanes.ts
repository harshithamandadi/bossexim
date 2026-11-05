/**
 * The dotted world map with trade lanes from India, shared by the website
 * (components/sections/trade/world-trade-map.tsx) and the PDF brochure's back cover.
 */
import { extraTradeLanes, tradeOrigin } from "@/config/markets";
import { toAlpha3 } from "@/lib/country-codes";
import { arcPath, project, type MapBounds, type MapSize, type Point } from "@/lib/geo";
import { WORLD_DOTS } from "@/lib/world-dots";
import type { LabelAnchor, Market } from "@/types/content";

/* The whole world (minus the polar caps), equirectangular. */
const BOUNDS: MapBounds = { west: -180, east: 180, north: 76, south: -56 };
export const TRADE_MAP_SIZE: MapSize = { width: 1000, height: 367 };
const toMap = (lat: number, lon: number) => project({ lat, lon }, BOUNDS, TRADE_MAP_SIZE);

/** Every land dot as one path of zero-length segments: thousands of dots, one shape. */
export const LAND_PATH = WORLD_DOTS.map(([lon, lat]) => {
  const point = toMap(lat, lon);
  return `M${point.x} ${point.y}h0`;
}).join("");

export const TRADE_ORIGIN = { code: toAlpha3(tradeOrigin.code), point: toMap(tradeOrigin.coordinates.lat, tradeOrigin.coordinates.lon) };

/** Lane colours: gold at India, sky blue at the far end. */
export const LANE_COLORS = { from: "#f2b34b", to: "#4fa8e8" } as const;

export interface TradeLane {
  code: string;
  point: Point;
  path: string;
  labelAnchor: LabelAnchor;
}

/** One lane per core market (from the admin) plus the extra lanes from config. */
export function tradeLanes(markets: Market[]): TradeLane[] {
  const destinations = [
    ...markets
      .filter((market) => market.code !== tradeOrigin.code)
      .map((market) => ({ code: toAlpha3(market.code), coordinates: market.coordinates, labelAnchor: market.labelAnchor ?? "right" })),
    ...extraTradeLanes,
  ];
  return destinations.map((destination) => {
    const point = toMap(destination.coordinates.lat, destination.coordinates.lon);
    // Longer lanes arc higher, so lanes to the west and east read as a balanced fan.
    return { code: destination.code, point, path: arcPath(TRADE_ORIGIN.point, point, 0.28), labelAnchor: destination.labelAnchor };
  });
}
