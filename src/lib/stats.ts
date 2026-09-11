import { groupCompanies } from "@/config/group";
import type { Stat } from "@/types/content";
import { activeMarkets, exportProducts, importProducts } from "./catalogue";

/** Headline figures, always in sync with the catalogue and group config. */
export function getHighlightStats(): Stat[] {
  return [
    { value: exportProducts.length, label: "Export product lines" },
    { value: importProducts.length, label: "Import product lines" },
    { value: activeMarkets.length, label: "Destination markets" },
    { value: groupCompanies.items.length, label: "BOSS Group businesses" },
  ];
}
