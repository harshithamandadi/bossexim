/**
 * Illustrations for the service bento cards — built from live config data, so
 * they update automatically when products, markets or group services change.
 */
import Link from "next/link";
import type { ComponentType } from "react";
import { Chip } from "@/components/ui/chip";
import { Icon } from "@/components/ui/icon";
import { WorldDotsMap } from "@/components/ui/world-dots-map";
import { containerLine, networkPoints, productHref, tradeOrigin } from "@/config";
import { groupByCategory, type Catalogue } from "@/lib/catalogue";
import type { ServiceVisual } from "@/types/content";

interface VisualProps {
  catalogue: Catalogue;
}

function ExportsVisual({ catalogue }: VisualProps) {
  return (
    <ul className="grid gap-2 sm:grid-cols-2">
      {catalogue.exportProducts.map((product) => (
        <li key={product.slug}>
          <Link
            href={productHref(product.slug)}
            className="flex items-center gap-3 rounded-2xl bg-canvas/60 p-3 ring-1 ring-inset ring-border transition-colors duration-300 hover:bg-canvas"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-fg/5">
              <Icon name={product.icon} className="size-4" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-medium">{product.name}</span>
              <span className="block text-xs tracking-wide text-fg-mute">{product.markets.join(" · ")}</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function ImportsVisual({ catalogue }: VisualProps) {
  return (
    <div className="space-y-5">
      {groupByCategory(catalogue.importProducts).map(({ category, items }) => (
        <div key={category}>
          <p className="type-eyebrow text-fg-mute">{category}</p>
          <ul className="mt-2.5 flex flex-wrap gap-1.5">
            {items.map((product) => (
              <li key={product.slug}>
                <Link href={productHref(product.slug)} className="group">
                  <Chip variant="outline" className="transition-colors group-hover:text-fg">
                    <Icon name={product.icon} className="size-3.5" />
                    {product.name}
                  </Chip>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function LogisticsVisual() {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {containerLine.services.map((service) => (
        <li key={service.title}>
          <Chip variant="outline">
            <Icon name={service.icon} className="size-3.5" />
            {service.title}
          </Chip>
        </li>
      ))}
    </ul>
  );
}

/** A dotted world with lanes from India: sourcing is not limited to a handful of countries. */
function SourcingVisual({ catalogue }: VisualProps) {
  const points = [...catalogue.markets.map((market) => market.coordinates), ...networkPoints.map((place) => place.coordinates)].filter(
    (point) => point.lat !== tradeOrigin.coordinates.lat || point.lon !== tradeOrigin.coordinates.lon,
  );
  return <WorldDotsMap origin={tradeOrigin.coordinates} points={points} />;
}

export const serviceVisuals: Record<ServiceVisual, ComponentType<VisualProps>> = {
  exports: ExportsVisual,
  imports: ImportsVisual,
  logistics: LogisticsVisual,
  sourcing: SourcingVisual,
};
