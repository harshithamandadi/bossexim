/**
 * Illustrations for the service bento cards — built from live config data, so
 * they update automatically when products, markets or group services change.
 */
import Image from "next/image";
import Link from "next/link";
import type { ComponentType } from "react";
import { Icon } from "@/components/ui/icon";
import { PhotoWatermark } from "@/components/ui/photo-watermark";
import { FootprintMap } from "@/components/ui/footprint-map";
import { containerLine, containerLineServiceHref, productCategories, productCategoryHref, productLabels } from "@/config";
import { groupByCategory, type Catalogue } from "@/lib/catalogue";
import type { Product, ServiceVisual, TradeDirection } from "@/types/content";

interface VisualProps {
  catalogue: Catalogue;
}

/** A product category as a photo tile (its first product's photo), linking to its section of the Products page. */
function CategoryTile({ category, direction, items }: { category: string; direction: TradeDirection; items: Product[] }) {
  const photo = items.find((item) => item.images?.[0])?.images?.[0];
  const icon = items[0]?.icon ?? "package";
  return (
    <Link
      href={productCategoryHref(direction, category)}
      className="group relative isolate flex h-full min-h-28 flex-col justify-end overflow-hidden rounded-2xl bg-surface p-3 ring-1 ring-inset ring-border"
    >
      {photo ? (
        <Image
          src={photo.src}
          alt=""
          fill
          sizes="(min-width: 1024px) 14vw, 45vw"
          className="-z-10 object-cover transition-transform duration-500 ease-smooth group-hover:scale-105"
        />
      ) : (
        <span aria-hidden className="brand-gradient absolute inset-0 -z-10 grid place-items-center">
          <Icon name={icon} className="size-8 text-white/80" />
        </span>
      )}
      <span aria-hidden className="absolute inset-0 -z-10 bg-linear-to-t from-black/80 via-black/25 to-transparent" />
      <span className="text-sm leading-tight font-semibold text-white">{category}</span>
      <span className="mt-0.5 text-xs text-white/75">
        {items.length} {items.length === 1 ? productLabels.product : productLabels.products}
      </span>
      {photo && <PhotoWatermark size="sm" className="top-2 bottom-auto" />}
    </Link>
  );
}

/** Categories in the menu's order (productCategories), then any others. */
function categoriesFor(direction: TradeDirection, items: Product[]) {
  const order = productCategories.filter((category) => category.direction === direction).map((category) => category.name);
  const rank = (name: string) => (order.includes(name) ? order.indexOf(name) : order.length);
  return groupByCategory(items).sort((a, b) => rank(a.category) - rank(b.category));
}

/** Export categories as a 3-column grid of photo tiles. */
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

/** Import categories as tall photo tiles that fill the card beside the export grid. */
function ImportsVisual({ catalogue }: VisualProps) {
  return (
    <ul className="grid flex-1 auto-rows-fr gap-2 sm:grid-cols-3">
      {categoriesFor("import", catalogue.importProducts).map(({ category, items }) => (
        <li key={category}>
          <CategoryTile category={category} direction="import" items={items} />
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
