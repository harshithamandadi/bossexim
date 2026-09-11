/**
 * Product catalogue — every export and import line.
 *
 * To add a product: copy an entry, give it a unique `slug` (used in the URL,
 * lowercase-with-dashes), and pick an `icon` from src/lib/icons.ts.
 * Export lines must list the market codes they ship to (see markets.ts).
 * Add `hsCode: "1006"` or `variants: [...]` whenever they are confirmed.
 */
import type { Product, TradeDirection } from "@/types/content";

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
    markets: "Destination markets",
    origin: "Sourced from",
    originValue: "International suppliers",
    specifications: "Specifications",
    specificationsValue: "Available on request",
  },
  marketsTitle: "Where it ships",
  relatedTitle: "Related products",
};

export const products: Product[] = [
  /* ─────────────────────────────── Exports ─────────────────────────────── */
  {
    slug: "rice",
    name: "Rice",
    direction: "export",
    category: "Grains",
    icon: "wheat",
    summary: "Indian rice for importers, wholesalers and distributors.",
    description:
      "Rice sourced from established Indian mills, cleaned, graded and packed to the buyer's brand, bag size and specification.",
    markets: ["AE", "SG", "MY", "VN"],
  },
  {
    slug: "spices-and-spice-blends",
    name: "Spices & Spice Blends",
    direction: "export",
    category: "Spices",
    icon: "leaf",
    summary: "Whole, ground and blended Indian spices.",
    description:
      "A range of Indian spices and spice blends for importers, food manufacturers and retail brands, supplied to agreed specifications.",
    markets: ["AE", "SG", "MY", "AU"],
  },
  {
    slug: "dehydrated-onion-and-garlic",
    name: "Dehydrated Onion & Garlic",
    direction: "export",
    category: "Dehydrated foods",
    icon: "sun",
    summary: "Dehydrated onion and garlic for food processors and distributors.",
    description:
      "Dehydrated onion and garlic products supplied in the forms and pack sizes our buyers require.",
    markets: ["AE", "SG", "MY"],
  },
  {
    slug: "pulses-and-dal-products",
    name: "Pulses & Dal Products",
    direction: "export",
    category: "Pulses",
    icon: "bean",
    summary: "Whole pulses and dal products from India.",
    description:
      "Pulses and dal products sourced from Indian processors and packed for importers, wholesalers and retail.",
    markets: ["AE", "SG", "MY", "AU"],
  },
  {
    slug: "dried-chillies",
    name: "Dried Chillies",
    direction: "export",
    category: "Spices",
    icon: "flame",
    summary: "Indian dried chillies, graded by variety.",
    description:
      "Dried chillies from India's growing regions, sorted and graded to the variety and quality the buyer specifies.",
    markets: ["AE", "SG", "MY", "TH"],
  },
  {
    slug: "groundnuts-and-peanuts",
    name: "Groundnuts & Peanuts",
    direction: "export",
    category: "Oilseeds & nuts",
    icon: "nut",
    summary: "Groundnuts and peanuts for food and processing.",
    description:
      "Groundnuts and peanuts sourced from Indian growers and processors, graded and packed for export.",
    markets: ["AE", "MY", "TH"],
  },
  {
    slug: "jaggery",
    name: "Jaggery",
    direction: "export",
    category: "Natural sweeteners",
    icon: "candy",
    summary: "Traditional Indian jaggery.",
    description:
      "Jaggery — India's traditional unrefined cane sugar — supplied to importers, distributors and food brands.",
    markets: ["AE", "SG", "MY"],
  },

  /* ─────────────────────────────── Imports ─────────────────────────────── */
  {
    slug: "polypropylene",
    name: "Polypropylene (PP)",
    direction: "import",
    category: "Polymers",
    icon: "package",
    summary: "Polypropylene for Indian converters and manufacturers.",
    description:
      "Polypropylene sourced from international suppliers for moulding, film, fibre and packaging applications in India.",
  },
  {
    slug: "polyethylene",
    name: "Polyethylene (PE)",
    direction: "import",
    category: "Polymers",
    icon: "layers",
    summary: "HDPE, LDPE and LLDPE for Indian industry.",
    description:
      "Polyethylene in high-density, low-density and linear low-density grades, sourced internationally for Indian manufacturers.",
    variants: ["HDPE", "LDPE", "LLDPE"],
    variantsLabel: "Grades",
  },
  {
    slug: "polyester-chips",
    name: "Polyester Chips",
    direction: "import",
    category: "Polymers",
    icon: "shapes",
    summary: "Polyester chips for fibre, film and packaging.",
    description:
      "Polyester chips sourced from international producers for Indian fibre, film and packaging manufacturers.",
  },
  {
    slug: "aluminium-scrap",
    name: "Aluminium Scrap",
    direction: "import",
    category: "Metal scrap",
    icon: "recycle",
    summary: "Aluminium scrap across six common grades.",
    description:
      "Aluminium scrap sourced internationally for Indian recyclers, smelters and foundries.",
    variants: ["Cable", "Extrusion", "Sheet", "Cast", "UBC", "Formwork"],
    variantsLabel: "Types",
  },
  {
    slug: "copper-scrap",
    name: "Copper Scrap",
    direction: "import",
    category: "Metal scrap",
    icon: "cable",
    summary: "Copper wire, extrusion, sheet and cast scrap.",
    description: "Copper scrap sourced internationally for Indian refiners, recyclers and manufacturers.",
    variants: ["Wire", "Extrusion", "Sheet", "Cast"],
    variantsLabel: "Types",
  },
  {
    slug: "iron-scrap",
    name: "Iron Scrap",
    direction: "import",
    category: "Metal scrap",
    icon: "hammer",
    summary: "Iron extrusion, sheet, cast and shuttering scrap.",
    description: "Iron scrap sourced internationally for Indian steel mills and foundries.",
    variants: ["Extrusion", "Sheet", "Cast", "Shuttering"],
    variantsLabel: "Types",
  },
  {
    slug: "stainless-steel-scrap",
    name: "Stainless Steel Scrap",
    direction: "import",
    category: "Metal scrap",
    icon: "cog",
    summary: "Stainless steel scrap in grades 202, 304 and 316.",
    description: "Stainless steel scrap sourced internationally for Indian melters and manufacturers.",
    variants: ["202", "304", "316"],
    variantsLabel: "Grades",
  },
];
