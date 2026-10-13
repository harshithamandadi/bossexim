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
  product: "product",
  products: "products",
  shipsTo: "Ships to",
  enquire: "Enquire about this product",
  supply: "Supply this product",
  overview: "Overview",
  defaultVariantsLabel: "Grades & forms",
  facts: {
    direction: "Trade direction",
    category: "Category",
    hsCode: "HSN code",
    markets: "Key markets",
    origin: "Sourced from",
    originValue: "International suppliers",
    specifications: "Specifications",
    specificationsValue: "Available on request",
    /** When typical specifications are shown on the page. */
    specificationsLatest: "Typical values below — latest on request",
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
 * Credits for product photos whose licence requires one, shown under the photo on
 * the product page (slug → credit). Empty now: every product photo is the client's own.
 */
export const photoCredits: Record<string, { text: string; href: string }> = {};

/**
 * Product categories, in the order they appear in the menu and on the Products
 * page. Products in the admin are grouped by their "Category" text; categories
 * not listed here still appear on the page, after these.
 */
export const productCategories: { name: string; direction: TradeDirection; description: string }[] = [
  { name: "Rice & Grains", direction: "export", description: "Basmati, non-Basmati and broken rice." },
  { name: "Spices", direction: "export", description: "Chillies, turmeric, cardamom, pepper & whole spices." },
  { name: "Pulses", direction: "export", description: "Toor dal, red lentils, mung beans, chana dal." },
  { name: "Vegetables", direction: "export", description: "Fresh onions, okra and green beans." },
  { name: "Fresh Fruits", direction: "export", description: "Pomegranates, mangoes and chikoo." },
  { name: "Dehydrated Products", direction: "export", description: "Dehydrated fruits and vegetables." },
  { name: "Seafood", direction: "export", description: "Vannamei shrimp, tiger prawns, catla fish." },
  { name: "Manufactured Products", direction: "export", description: "Areca & bagasse disposables, feed-grade soda." },
  { name: "Other Export Products", direction: "export", description: "A2 ghee, jaggery and groundnuts." },
  { name: "Polymers", direction: "import", description: "PP, PE and polyester chips." },
  { name: "Metal Scrap", direction: "import", description: "Copper, aluminium, UBC, iron and steel." },
  { name: "Other Import Products", direction: "import", description: "Foil rolls, medical bottles, plastic flakes." },
];
