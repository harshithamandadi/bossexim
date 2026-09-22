/**
 * Catalogue helpers. Counts, market lists and filters are derived from the
 * products and markets managed in the admin, so adding either never requires
 * touching the UI. Pure functions: safe on the server and in the browser.
 */
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

/** Groups products by category, e.g. { Polymers: [...], "Metal scrap": [...] }, keeping first-seen order. */
export function groupByCategory<T extends Product>(items: T[]): { category: string; items: T[] }[] {
  const groups = new Map<string, T[]>();
  for (const item of items) groups.set(item.category, [...(groups.get(item.category) ?? []), item]);
  return [...groups].map(([category, grouped]) => ({ category, items: grouped }));
}
