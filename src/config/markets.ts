/**
 * Destination markets for export lines.
 *
 * To add a market: copy one entry, change the code/name, and set `coordinates`
 * to its main city (used to draw the trade-route map). Then list the new code
 * under `markets` for each product in products.ts that ships there.
 * `labelAnchor` moves the map label if it overlaps a neighbour.
 */
import type { GeoPoint, Market } from "@/types/content";

export const markets = [
  {
    code: "AE",
    name: "United Arab Emirates",
    shortName: "UAE",
    region: "Middle East",
    coordinates: { lat: 25.2, lon: 55.3 },
    labelAnchor: "top",
  },
  {
    code: "SG",
    name: "Singapore",
    shortName: "Singapore",
    region: "South-East Asia",
    coordinates: { lat: 1.35, lon: 103.82 },
    labelAnchor: "right",
  },
  {
    code: "MY",
    name: "Malaysia",
    shortName: "Malaysia",
    region: "South-East Asia",
    coordinates: { lat: 3.14, lon: 101.69 },
    labelAnchor: "left",
  },
  {
    code: "VN",
    name: "Vietnam",
    shortName: "Vietnam",
    region: "South-East Asia",
    coordinates: { lat: 10.82, lon: 106.63 },
    labelAnchor: "right",
  },
  {
    code: "AU",
    name: "Australia",
    shortName: "Australia",
    region: "Oceania",
    coordinates: { lat: -33.87, lon: 151.21 },
    labelAnchor: "left",
  },
  {
    code: "TH",
    name: "Thailand",
    shortName: "Thailand",
    region: "South-East Asia",
    coordinates: { lat: 13.76, lon: 100.5 },
    labelAnchor: "top",
  },
] as const satisfies readonly Market[];

export type MarketCode = (typeof markets)[number]["code"];

/** Where export routes start on the map. */
export const tradeOrigin: { code: string; name: string; coordinates: GeoPoint } = {
  code: "IN",
  name: "India",
  coordinates: { lat: 19.08, lon: 72.88 },
};
