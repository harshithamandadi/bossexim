/**
 * Illustrations for the service bento cards — built from live config data, so
 * they update automatically when products, markets or group services change.
 */
import Link from "next/link";
import type { ComponentType } from "react";
import { Chip } from "@/components/ui/chip";
import { Icon } from "@/components/ui/icon";
import { containerLine, productHref, tradeOrigin } from "@/config";
import { groupByCategory, type Catalogue } from "@/lib/catalogue";
import { cn } from "@/lib/cn";
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

function SourcingVisual({ catalogue }: VisualProps) {
  const nodes = [
    { code: tradeOrigin.code, label: tradeOrigin.name, isOrigin: true },
    ...catalogue.activeMarkets.map((market) => ({ code: market.code, label: market.shortName, isOrigin: false })),
  ];

  return (
    <div className="relative flex items-start justify-between gap-1 sm:gap-2">
      <span aria-hidden className="absolute inset-x-5 top-[1.125rem] border-t border-dashed border-fg/20 sm:inset-x-6 sm:top-6" />
      {nodes.map((node) => (
        <span key={node.code} className="relative flex flex-col items-center gap-2">
          <span
            className={cn(
              "grid size-9 place-items-center rounded-full text-[10px] font-semibold ring-1 ring-inset ring-border sm:size-12 sm:text-xs",
              node.isOrigin ? "bg-fg text-canvas" : "bg-canvas",
            )}
          >
            {node.code}
          </span>
          <span className="hidden text-xs text-fg-mute sm:block">{node.label}</span>
        </span>
      ))}
    </div>
  );
}

export const serviceVisuals: Record<ServiceVisual, ComponentType<VisualProps>> = {
  exports: ExportsVisual,
  imports: ImportsVisual,
  logistics: LogisticsVisual,
  sourcing: SourcingVisual,
};
