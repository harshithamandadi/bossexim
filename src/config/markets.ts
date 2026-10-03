/** Destination markets are managed in the admin (Catalogue → Markets). */
import type { GeoPoint } from "@/types/content";

/** Where export routes start on the map. */
export const tradeOrigin: { code: string; name: string; coordinates: GeoPoint } = {
  code: "IN",
  name: "India",
  coordinates: { lat: 19.08, lon: 72.88 },
};

export interface NetworkPoint {
  name: string;
  coordinates: GeoPoint;
}

/**
 * Places in the wider network (BOSS Container Line's agency network, from its
 * brochure and footprint map), drawn as lanes on the world trade map. The core
 * markets themselves come from the admin.
 */
export const networkPoints: NetworkPoint[] = [
  { name: "Bangladesh", coordinates: { lat: 22.33, lon: 91.83 } },
  { name: "Sri Lanka", coordinates: { lat: 6.93, lon: 79.85 } },
  { name: "Maldives", coordinates: { lat: 4.18, lon: 73.51 } },
  { name: "Oman", coordinates: { lat: 23.59, lon: 58.41 } },
  { name: "Kuwait", coordinates: { lat: 29.37, lon: 47.98 } },
  { name: "Iraq", coordinates: { lat: 30.51, lon: 47.81 } },
  { name: "Iran", coordinates: { lat: 27.18, lon: 56.27 } },
  { name: "Yemen", coordinates: { lat: 12.79, lon: 45.02 } },
  { name: "Jordan", coordinates: { lat: 29.53, lon: 35.01 } },
  { name: "Egypt", coordinates: { lat: 31.26, lon: 32.3 } },
  { name: "Sudan", coordinates: { lat: 19.62, lon: 37.22 } },
  { name: "Ethiopia", coordinates: { lat: 9.03, lon: 38.74 } },
  { name: "Kenya", coordinates: { lat: -4.04, lon: 39.67 } },
  { name: "Tanzania", coordinates: { lat: -6.79, lon: 39.21 } },
  { name: "Turkey", coordinates: { lat: 36.8, lon: 34.63 } },
  { name: "Kazakhstan", coordinates: { lat: 43.24, lon: 76.89 } },
  { name: "Uzbekistan", coordinates: { lat: 41.3, lon: 69.24 } },
  { name: "Kyrgyzstan", coordinates: { lat: 42.87, lon: 74.59 } },
  { name: "Turkmenistan", coordinates: { lat: 37.96, lon: 58.33 } },
  { name: "China", coordinates: { lat: 31.23, lon: 121.47 } },
];

/**
 * Illustrative hubs beyond the current focus, drawn as dashed "on request" lanes
 * on the world map: BGEXIM evaluates new markets case by case.
 */
export const worldwideHubs: NetworkPoint[] = [
  { name: "Europe", coordinates: { lat: 51.92, lon: 4.48 } },
  { name: "North America", coordinates: { lat: 40.71, lon: -74.0 } },
  { name: "South America", coordinates: { lat: -23.96, lon: -46.33 } },
  { name: "West Africa", coordinates: { lat: 6.45, lon: 3.39 } },
  { name: "East Asia", coordinates: { lat: 35.44, lon: 139.64 } },
];
