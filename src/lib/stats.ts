import { networkPoints } from "@/config/markets";
import type { Stat } from "@/types/content";
import type { Catalogue } from "./catalogue";

/** Headline figures, always in sync with the products and markets in the admin. */
export function getHighlightStats(catalogue: Catalogue): Stat[] {
  const countries = new Set([...catalogue.markets.map((market) => market.name), ...networkPoints.map((place) => place.name)]);
  return [
    { value: catalogue.exportProducts.length, label: "Export product lines" },
    { value: catalogue.importProducts.length, label: "Import product lines" },
    { value: catalogue.markets.length, label: "Core markets" },
    { value: countries.size, label: "Countries in our trade network" },
  ];
}
