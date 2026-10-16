"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Carousel } from "@/components/ui/carousel";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { uiLabels } from "@/config/ui";
import { productCategories, productLabels, tradeDirections } from "@/config/products";
import { toAnchorId } from "@/config/routes";
import { createCatalogue, groupByCategory } from "@/lib/catalogue";
import { pluralize } from "@/lib/format";
import { SPRING_SNAPPY } from "@/lib/motion";
import type { Market, Product, TradeDirection } from "@/types/content";
import { ProductCard } from "./product-card";

const DIRECTIONS: TradeDirection[] = ["export", "import"];
/** Categories with more products than this slide instead of wrapping into rows. */
const MAX_GRID_ITEMS = 3;
const CATEGORY_ORDER = productCategories.map((category) => category.name);

/** Known categories in their set order; any others (added in the admin) after them. */
function sortByCategory<T extends { category: string }>(groups: T[]): T[] {
  const rank = (name: string) => {
    const index = CATEGORY_ORDER.indexOf(name);
    return index === -1 ? CATEGORY_ORDER.length : index;
  };
  return [...groups].sort((a, b) => rank(a.category) - rank(b.category));
}

/** Exports / Imports segmented control and the product grid, grouped by category (no market filter — client request). */
interface ProductCatalogueProps {
  initialView: TradeDirection;
  products: Product[];
  markets: Market[];
}

export function ProductCatalogue({ initialView, products, markets }: ProductCatalogueProps) {
  const catalogue = useMemo(() => createCatalogue(products, markets), [products, markets]);
  const [direction, setDirection] = useState(initialView);
  const visibleProducts = catalogue.filterProducts(direction, "all");

  function changeDirection(next: TradeDirection) {
    setDirection(next);
    // Keep the URL shareable without triggering a server round-trip.
    window.history.replaceState(null, "", `?view=${next}`);
  }

  const count = visibleProducts.length;
  const summary = `${productLabels.showing} ${count} ${tradeDirections[direction].singular.toLowerCase()} ${pluralize(count, productLabels.line, productLabels.lines)}`;

  return (
    <div>
      {/* Sticky toolbar: Exports / Imports stays in reach while browsing. */}
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
            {/* More than three products: a sliding row (client request); otherwise a grid. */}
            {items.length > MAX_GRID_ITEMS ? (
              <Carousel
                className="mt-3"
                label={category}
                previousLabel={uiLabels.previous}
                nextLabel={uiLabels.next}
                slideWidth="21rem"
                speed={0.7}
                items={items.map((product) => (
                  <ProductCard key={product.slug} product={product} markets={catalogue.markets} className="h-full" />
                ))}
              />
            ) : (
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
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
