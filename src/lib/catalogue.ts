/**
 * Derived catalogue data. Counts, market lists and filters are computed from
 * config so that adding a product or market never requires touching the UI.
 */
import { markets, type MarketCode } from "@/config/markets";
import { products } from "@/config/products";
import type { ExportProduct, ImportProduct, Market, Product, TradeDirection } from "@/types/content";

export type MarketFilter = MarketCode | "all";

export const exportProducts: ExportProduct[] = products.filter(
  (product): product is ExportProduct => product.direction === "export",
);

export const importProducts: ImportProduct[] = products.filter(
  (product): product is ImportProduct => product.direction === "import",
);

const marketsByCode = new Map<MarketCode, Market>(markets.map((market) => [market.code, market]));

export function getProductsByDirection(direction: TradeDirection): Product[] {
  return direction === "export" ? exportProducts : importProducts;
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export function getMarket(code: MarketCode): Market {
  const market = marketsByCode.get(code);
  if (!market) throw new Error(`Unknown market code "${code}" — add it to src/config/markets.ts`);
  return market;
}

export function getMarketsForProduct(product: ExportProduct): Market[] {
  return product.markets.map(getMarket);
}

export function getProductsForMarket(code: MarketCode): ExportProduct[] {
  return exportProducts.filter((product) => product.markets.includes(code));
}

/** Markets that at least one export line currently ships to. */
export const activeMarkets = markets.filter((market) => getProductsForMarket(market.code).length > 0);

export const activeRegions = [...new Set(activeMarkets.map((market) => market.region))];

export function filterProducts(direction: TradeDirection, market: MarketFilter): Product[] {
  if (direction === "import" || market === "all") return getProductsByDirection(direction);
  return getProductsForMarket(market);
}

export function getRelatedProducts(product: Product, limit = 3): Product[] {
  return getProductsByDirection(product.direction)
    .filter((candidate) => candidate.slug !== product.slug)
    .slice(0, limit);
}

/** Groups import lines by category, e.g. { Polymers: [...], "Metal scrap": [...] }. */
export function groupByCategory<T extends Product>(items: T[]): { category: string; items: T[] }[] {
  const groups = new Map<string, T[]>();
  for (const item of items) groups.set(item.category, [...(groups.get(item.category) ?? []), item]);
  return [...groups].map(([category, grouped]) => ({ category, items: grouped }));
}
