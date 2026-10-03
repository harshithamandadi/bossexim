/**
 * Wording for the product catalogue. The products themselves are managed in
 * the admin (Catalogue → Products).
 */
import type { TradeDirection } from "@/types/content";

export const tradeDirections: Record<
  TradeDirection,
  { label: string; singular: string; tagline: string }
> = {
  export: { label: "Exports", singular: "Export", tagline: "From India to the world" },
  import: { label: "Imports", singular: "Import", tagline: "From the world to Indian industry" },
};

/** Wording used by the catalogue and product pages. */
export const productLabels = {
  directionControl: "Trade direction",
  marketFilter: "Filter by market",
  allMarkets: "All markets",
  showing: "Showing",
  line: "line",
  lines: "lines",
  shipsTo: "Ships to",
  enquire: "Enquire about this product",
  supply: "Supply this product",
  overview: "Overview",
  defaultVariantsLabel: "Grades & forms",
  facts: {
    direction: "Trade direction",
    category: "Category",
    hsCode: "HS heading",
    markets: "Key markets",
    origin: "Sourced from",
    originValue: "International suppliers",
    specifications: "Specifications",
    specificationsValue: "Available on request",
  },
  marketsTitle: "Key Destination Markets",
  marketsNote: "Current focus markets. We also supply buyers worldwide — tell us your destination.",
  worldwide: "Worldwide",
  worldwideTitle: "Also supplied to other destinations on request",
  worldwideSuffix: "and worldwide on request",
  relatedTitle: "Related Products",
  packaging: "Packaging",
  specificationsTitle: "Specifications",
  specificationsNote: "Typical specifications. Exact values are agreed for each transaction.",
  keyFeatures: "Key Features",
  documentationTitle: "Typical Documentation",
  documentationNote: "As applicable — documents depend on the product, destination and transaction.",
};
