"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { productCategories, productLabels, tradeDirections } from "@/config/products";
import { toAnchorId } from "@/config/routes";
import { createCatalogue, groupByCategory, type MarketFilter } from "@/lib/catalogue";
import { cn } from "@/lib/cn";
import { pluralize } from "@/lib/format";
import { DURATION, EASE_SMOOTH, SPRING_SNAPPY } from "@/lib/motion";
import type { Market, Product, TradeDirection } from "@/types/content";
import { ProductCard } from "./product-card";

const DIRECTIONS: TradeDirection[] = ["export", "import"];
const CATEGORY_ORDER = productCategories.map((category) => category.name);

/** Known categories in their set order; any others (added in the admin) after them. */
function sortByCategory<T extends { category: string }>(groups: T[]): T[] {
  const rank = (name: string) => {
    const index = CATEGORY_ORDER.indexOf(name);
    return index === -1 ? CATEGORY_ORDER.length : index;
  };
  return [...groups].sort((a, b) => rank(a.category) - rank(b.category));
}

/** Exports / Imports segmented control, market filter and an animated product grid. */
interface ProductCatalogueProps {
  initialView: TradeDirection;
  products: Product[];
  markets: Market[];
}

export function ProductCatalogue({ initialView, products, markets }: ProductCatalogueProps) {
  const catalogue = useMemo(() => createCatalogue(products, markets), [products, markets]);
  const [direction, setDirection] = useState(initialView);
  const [market, setMarket] = useState<MarketFilter>("all");
  const visibleProducts = catalogue.filterProducts(direction, market);

  function changeDirection(next: TradeDirection) {
    setDirection(next);
    setMarket("all");
    // Keep the URL shareable without triggering a server round-trip.
    window.history.replaceState(null, "", `?view=${next}`);
  }

  const count = visibleProducts.length;
  const summary = `${productLabels.showing} ${count} ${tradeDirections[direction].singular.toLowerCase()} ${pluralize(count, productLabels.line, productLabels.lines)}`;

  return (
    <div>
      {/* Sticky toolbar: Exports / Imports and the market filter stay in reach while browsing. */}
      <div className="glass sticky top-[4.5rem] z-30 -mx-3 rounded-[1.75rem] px-3 py-3 ring-1 ring-border sm:-mx-4 sm:px-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SegmentedControl
          label={productLabels.directionControl}
          value={direction}
          onChange={changeDirection}
          options={DIRECTIONS.map((value) => ({
            value,
            label: tradeDirections[value].label,
            count: catalogue.getProductsByDirection(value).length,
          }))}
        />
        <p aria-live="polite" className="text-sm text-fg-mute">
          {summary}
        </p>
      </div>

      <AnimatePresence initial={false}>
        {direction === "export" && (
          <motion.div
            key="market-filter"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: DURATION.base, ease: EASE_SMOOTH }}
            className="overflow-hidden"
          >
            <MarketFilterBar markets={catalogue.activeMarkets} value={market} onChange={setMarket} />
          </motion.div>
        )}
      </AnimatePresence>
      </div>

      {/* Products grouped by category, in the order set in config/products.ts. */}
      <div className="mt-8 space-y-12">
        {sortByCategory(groupByCategory(visibleProducts)).map(({ category, items }) => (
          <section key={category} id={toAnchorId(category)} className="scroll-mt-52">
            <div className="flex items-baseline justify-between gap-4 border-b border-border pb-3">
              <h2 className="type-h3">{category}</h2>
              <span className="text-sm text-fg-mute">
                {items.length} {pluralize(items.length, productLabels.line, productLabels.lines)}
              </span>
            </div>
            <motion.ul layout className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout" initial={false}>
                {items.map((product) => (
                  <motion.li
                    key={product.slug}
                    layout
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={SPRING_SNAPPY}
                  >
                    <ProductCard product={product} markets={catalogue.markets} />
                  </motion.li>
                ))}
              </AnimatePresence>
            </motion.ul>
          </section>
        ))}
      </div>
    </div>
  );
}

interface MarketFilterBarProps {
  markets: Market[];
  value: MarketFilter;
  onChange: (value: MarketFilter) => void;
}

function MarketFilterBar({ markets, value, onChange }: MarketFilterBarProps) {
  const options: { value: MarketFilter; label: string }[] = [
    { value: "all", label: productLabels.allMarkets },
    ...markets.map((market) => ({ value: market.code, label: market.shortName })),
  ];

  return (
    <div
      role="group"
      aria-label={productLabels.marketFilter}
      className="no-scrollbar -mx-3 flex items-center gap-2 overflow-x-auto px-3 pt-3 sm:mx-0 sm:flex-wrap sm:px-0"
    >
      <span aria-hidden className="mr-2 hidden shrink-0 text-sm text-fg-mute sm:inline">
        {productLabels.marketFilter}
      </span>
      {options.map((option) => {
        const isSelected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onChange(option.value)}
            className={cn(
              "shrink-0 rounded-full px-3.5 py-1.5 text-[13px] font-medium ring-1 ring-inset transition-colors duration-300",
              isSelected ? "bg-fg text-canvas ring-fg" : "text-fg-mute ring-border hover:text-fg",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
