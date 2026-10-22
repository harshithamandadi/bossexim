import { networkPoints } from "@/config/markets";

/** Core trade markets shown in the stats (client figure; change here if it changes). */
const CORE_TRADE_MARKETS = 12;
import type { Stat } from "@/types/content";
import type { Catalogue } from "./catalogue";

/** Headline figures, always in sync with the products and markets in the admin. */
export function getHighlightStats(catalogue: Catalogue): Stat[] {
  const countries = new Set([...catalogue.markets.map((market) => market.name), ...networkPoints.map((place) => place.name)]);
  return [
    { value: catalogue.exportProducts.length, label: "Export products" },
    { value: catalogue.importProducts.length, label: "Import products" },
    // A set figure from the client (22 Oct 2026), not counted from the markets in the admin.
    { value: CORE_TRADE_MARKETS, label: "Core trade markets" },
    { value: countries.size, label: "Countries in our trade network" },
  ];
}
