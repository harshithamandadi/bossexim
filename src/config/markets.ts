/** Destination markets are managed in the admin (Catalogue → Markets). */
import type { GeoPoint } from "@/types/content";

/** Where export routes start on the map. */
export const tradeOrigin: { code: string; name: string; coordinates: GeoPoint } = {
  code: "IN",
  name: "India",
  coordinates: { lat: 19.08, lon: 72.88 },
};
