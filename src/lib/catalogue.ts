/**
 * Catalogue helpers. Counts, market lists and filters are derived from the
 * products and markets managed in the admin, so adding either never requires
 * touching the UI. Pure functions: safe on the server and in the browser.
 */
import { productCategories } from "@/config/products";
import type {
  ExportProduct,
  ImportProduct,
  Market,
  MarketCode,
  Product,
  TradeDirection,
} from "@/types/content";

export type MarketFilter = MarketCode | "all";

export interface Catalogue {
  products: Product[];
  exportProducts: ExportProduct[];
  importProducts: ImportProduct[];
  markets: Market[];
  /** Markets that at least one export line currently ships to. */
  activeMarkets: Market[];
  activeRegions: string[];
  getProductsByDirection: (direction: TradeDirection) => Product[];
  getProductBySlug: (slug: string) => Product | undefined;
  getMarketsForProduct: (product: ExportProduct) => Market[];
  getProductsForMarket: (code: MarketCode) => ExportProduct[];
  filterProducts: (direction: TradeDirection, market: MarketFilter) => Product[];
  getRelatedProducts: (product: Product, limit?: number) => Product[];
}

export function createCatalogue(products: Product[], markets: Market[]): Catalogue {
  const exportProducts = products.filter((product): product is ExportProduct => product.direction === "export");
  const importProducts = products.filter((product): product is ImportProduct => product.direction === "import");
  const marketsByCode = new Map(markets.map((market) => [market.code, market]));

  const getProductsByDirection = (direction: TradeDirection): Product[] =>
    direction === "export" ? exportProducts : importProducts;
  const getProductsForMarket = (code: MarketCode) => exportProducts.filter((product) => product.markets.includes(code));
  const activeMarkets = markets.filter((market) => getProductsForMarket(market.code).length > 0);

  return {
    products,
    exportProducts,
    importProducts,
    markets,
    activeMarkets,
    activeRegions: [...new Set(activeMarkets.map((market) => market.region))],
    getProductsByDirection,
    getProductBySlug: (slug) => products.find((product) => product.slug === slug),
    getMarketsForProduct: (product) => product.markets.flatMap((code) => marketsByCode.get(code) ?? []),
    getProductsForMarket,
    filterProducts: (direction, market) =>
      direction === "import" || market === "all" ? getProductsByDirection(direction) : getProductsForMarket(market),
    getRelatedProducts: (product, limit = 3) =>
      getProductsByDirection(product.direction)
        .filter((candidate) => candidate.slug !== product.slug)
        .slice(0, limit),
  };
}

const categoryKey = (name: string) => name.trim().replace(/\s+/g, " ").toLowerCase();
const KNOWN_CATEGORIES = new Map(productCategories.map((category) => [categoryKey(category.name), category.name]));

/**
 * Groups products by category, keeping first-seen order. Categories typed in the admin
 * are matched ignoring case and spacing ("seafood " joins "Seafood"), so a product added
 * later always lands in its existing section.
 */
export function groupByCategory<T extends Pick<Product, "category">>(items: T[]): { category: string; items: T[] }[] {
  const groups = new Map<string, { category: string; items: T[] }>();
  for (const item of items) {
    const key = categoryKey(item.category);
    const group = groups.get(key) ?? { category: KNOWN_CATEGORIES.get(key) ?? item.category.trim(), items: [] };
    group.items.push(item);
    groups.set(key, group);
  }
  return [...groups.values()];
}

const CATEGORY_ORDER = productCategories.map((category) => category.name);

/** Known categories in their set order; any others (added in the admin) after them. */
export function sortByCategory<T extends { category: string }>(groups: T[]): T[] {
  const rank = (name: string) => {
    const index = CATEGORY_ORDER.indexOf(name);
    return index === -1 ? CATEGORY_ORDER.length : index;
  };
  return [...groups].sort((a, b) => rank(a.category) - rank(b.category));
}

/** Exports, then imports, each grouped by category in the set order, as on the Products page. */
export function groupByDirection<T extends Pick<Product, "category" | "direction">>(
  items: T[],
): { direction: TradeDirection; groups: { category: string; items: T[] }[] }[] {
  return (["export", "import"] as const)
    .map((direction) => ({
      direction,
      groups: sortByCategory(groupByCategory(items.filter((item) => item.direction === direction))),
    }))
    .filter((section) => section.groups.length > 0);
}
