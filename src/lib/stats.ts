import { networkPoints, tradeOrigin } from "@/config/markets";
import type { Stat } from "@/types/content";
import type { Catalogue } from "./catalogue";

/** Headline figures, always in sync with the products and markets in the admin. */
export function getHighlightStats(catalogue: Catalogue): Stat[] {
  const countries = new Set([...catalogue.markets.map((market) => market.name), ...networkPoints.map((place) => place.name)]);
  return [
    { value: catalogue.exportProducts.length, label: "Export products" },
    { value: catalogue.importProducts.length, label: "Import products" },
    // India, our base, is a core trade market too (Current Focus: India, Singapore, Malaysia,
    // Australia, UAE, Thailand, Saudi Arabia and Indonesia).
    { value: new Set([tradeOrigin.code, ...catalogue.markets.map((market) => market.code)]).size, label: "Core trade markets" },
    { value: countries.size, label: "Countries in our trade network" },
  ];
}
