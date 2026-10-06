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

/**
 * Credits for product photos whose licence requires one (Wikimedia Commons,
 * CC BY-SA 4.0), shown under the photo on the product page. The other stock
 * product photos are public domain (CC0) and need no credit. Remove an entry
 * once the client supplies their own photo for that product.
 */
export const photoCredits: Record<string, { text: string; href: string }> = {
  jaggery: {
    text: "Photo: Mangosapiens, CC BY-SA 4.0, via Wikimedia Commons",
    href: "https://commons.wikimedia.org/wiki/File:Jaggery_cubes.jpg",
  },
  polyethylene: {
    text: "Photo: ISIPLAST S.A. de C.V., CC BY-SA 4.0, via Wikimedia Commons",
    href: "https://commons.wikimedia.org/wiki/File:Pellet_azul.jpg",
  },
};

/**
 * Product categories, in the order they appear in the menu and on the Products
 * page. Products in the admin are grouped by their "Category" text; categories
 * not listed here still appear on the page, after these.
 */
export const productCategories: { name: string; direction: TradeDirection; description: string }[] = [
  { name: "Rice & Grains", direction: "export", description: "Basmati and non-basmati rice." },
  { name: "Spices", direction: "export", description: "Turmeric, cardamom, pepper, chillies & blends." },
  { name: "Pulses", direction: "export", description: "Toor, moong, chana, masoor and urad dal." },
  { name: "Fresh Fruits & Vegetables", direction: "export", description: "Pomegranate, onions and mangoes." },
  { name: "Dehydrated & Herbal", direction: "export", description: "Onion, garlic, fruits, ginger, moringa, amla." },
  { name: "Seafood", direction: "export", description: "Frozen Indian shrimp." },
  { name: "Nuts & Oilseeds", direction: "export", description: "Groundnuts and peanut kernels." },
  { name: "Natural Sweeteners", direction: "export", description: "Traditional Indian jaggery." },
  { name: "Polymers", direction: "import", description: "PP, PE and polyester chips." },
  { name: "Metal Scrap", direction: "import", description: "Aluminium, copper, iron and stainless steel." },
];
