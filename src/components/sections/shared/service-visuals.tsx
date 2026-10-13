/**
 * Illustrations for the service bento cards — built from live config data, so
 * they update automatically when products, markets or group services change.
 */
import Link from "next/link";
import type { ComponentType } from "react";
import { Icon } from "@/components/ui/icon";
import { FootprintMap } from "@/components/ui/footprint-map";
import { containerLine, containerLineServiceHref, productCategories, productCategoryHref, productLabels } from "@/config";
import { groupByCategory, type Catalogue } from "@/lib/catalogue";
import type { Product, ServiceVisual, TradeDirection } from "@/types/content";

interface VisualProps {
  catalogue: Catalogue;
}

/** A product category as an icon tile (no photos — client request), linking to its section of the Products page. */
function CategoryTile({ category, direction, items }: { category: string; direction: TradeDirection; items: Product[] }) {
  const icon = items[0]?.icon ?? "package";
  return (
    <Link
      href={productCategoryHref(direction, category)}
      className="group flex h-full min-h-24 flex-col justify-between gap-3 rounded-2xl bg-canvas/60 p-3.5 ring-1 ring-inset ring-border transition-colors duration-300 hover:bg-canvas"
    >
      <span className="grid size-9 place-items-center rounded-xl bg-fg/5 transition-colors group-hover:bg-brand/20">
        <Icon name={icon} className="size-[18px]" />
      </span>
      <span>
        <span className="block text-sm leading-tight font-semibold">{category}</span>
        <span className="mt-0.5 block text-xs text-fg-mute">
          {items.length} {items.length === 1 ? productLabels.product : productLabels.products}
        </span>
      </span>
    </Link>
  );
}

/** Categories in the menu's order (productCategories), then any others. */
function categoriesFor(direction: TradeDirection, items: Product[]) {
  const order = productCategories.filter((category) => category.direction === direction).map((category) => category.name);
  const rank = (name: string) => (order.includes(name) ? order.indexOf(name) : order.length);
  return groupByCategory(items).sort((a, b) => rank(a.category) - rank(b.category));
}

/** Export categories as a 3-column grid of tiles. */
function ExportsVisual({ catalogue }: VisualProps) {
  return (
    <ul className="grid flex-1 auto-rows-fr grid-cols-2 gap-2 sm:grid-cols-3">
      {categoriesFor("export", catalogue.exportProducts).map(({ category, items }) => (
        <li key={category}>
          <CategoryTile category={category} direction="export" items={items} />
        </li>
      ))}
    </ul>
  );
}

/** Import categories as rows — icon, name and the products in each — filling the card beside the export grid. */
function ImportsVisual({ catalogue }: VisualProps) {
  return (
    <ul className="grid flex-1 auto-rows-fr gap-2">
      {categoriesFor("import", catalogue.importProducts).map(({ category, items }) => (
        <li key={category}>
          <Link
            href={productCategoryHref("import", category)}
            className="group flex h-full items-center gap-4 rounded-2xl bg-canvas/60 p-4 ring-1 ring-inset ring-border transition-colors duration-300 hover:bg-canvas"
          >
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-fg/5 transition-colors group-hover:bg-brand/20">
              <Icon name={items[0]?.icon ?? "package"} className="size-5" />
            </span>
            <span className="min-w-0">
              <span className="block text-[15px] font-semibold">{category}</span>
              <span className="mt-0.5 block text-[13px] leading-snug text-fg-mute">{items.map((item) => item.name).join(" · ")}</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** The six Container Line services as tiles, each linking to its own page. */
function LogisticsVisual() {
  return (
    <ul className="grid flex-1 auto-rows-fr gap-2 sm:grid-cols-2">
      {containerLine.services.map((service) => (
        <li key={service.slug}>
          <Link
            href={containerLineServiceHref(service.slug)}
            className="group flex h-full items-center gap-3 rounded-2xl bg-canvas/60 p-3.5 ring-1 ring-inset ring-border transition-colors duration-300 hover:bg-canvas"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-fg/5 transition-colors group-hover:bg-brand/20">
              <Icon name={service.icon} className="size-[18px]" />
            </span>
            <span className="min-w-0">
              <span className="block text-[15px] font-semibold">{service.title}</span>
              <span className="mt-0.5 block text-[13px] leading-snug text-fg-mute">{service.tagline}</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** The client's own footprint map: sourcing reaches well beyond a handful of countries. */
function SourcingVisual() {
  return <FootprintMap />;
}

export const serviceVisuals: Record<ServiceVisual, ComponentType<VisualProps>> = {
  exports: ExportsVisual,
  imports: ImportsVisual,
  logistics: LogisticsVisual,
  sourcing: SourcingVisual,
};
