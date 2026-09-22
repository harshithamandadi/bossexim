import type { GroupCompany, Stat } from "@/types/content";
import type { Catalogue } from "./catalogue";

/** Headline figures, always in sync with the products, markets and group companies in the admin. */
export function getHighlightStats(catalogue: Catalogue, groupCompanies: GroupCompany[]): Stat[] {
  return [
    { value: catalogue.exportProducts.length, label: "Export product lines" },
    { value: catalogue.importProducts.length, label: "Import product lines" },
    { value: catalogue.activeMarkets.length, label: "Destination markets" },
    { value: groupCompanies.length, label: "BOSS Group businesses" },
  ];
}
