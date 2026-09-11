"use client";

import { ArrowDownRight } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Icon } from "@/components/ui/icon";
import type { MarketCode } from "@/config/markets";
import { tradeLanes } from "@/config/process";
import { activeMarkets, getProductsForMarket, groupByCategory, importProducts } from "@/lib/catalogue";
import { cn } from "@/lib/cn";
import type { Product } from "@/types/content";
import { laneInteractionProps, type ActiveLaneChange } from "./lane-interaction";
import { TradeRouteMap } from "./trade-route-map";

/** Dark "stage": interactive route map plus the matching lane list. */
export function TradeRoutesStage({ className }: { className?: string }) {
  const [activeCode, setActiveCode] = useState<MarketCode | null>(null);

  return (
    <div
      data-tone="dark"
      className={cn(
        "grid gap-8 bg-canvas p-5 text-fg sm:p-8 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-10 lg:p-10",
        className,
      )}
    >
      <div className="min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Eyebrow>{tradeLanes.eyebrow}</Eyebrow>
          <MapLegend />
        </div>
        <TradeRouteMap activeCode={activeCode} onActiveChange={setActiveCode} className="mt-6" />
      </div>
      <LaneList activeCode={activeCode} onActiveChange={setActiveCode} />
    </div>
  );
}

function MapLegend() {
  return (
    <ul className="flex items-center gap-5 text-xs text-fg-mute">
      <li className="flex items-center gap-2">
        <span aria-hidden className="h-0.5 w-6 rounded-full bg-linear-to-r from-brand to-tide" />
        {tradeLanes.legend.export}
      </li>
      <li className="flex items-center gap-2">
        <span aria-hidden className="w-6 border-t-2 border-dashed border-saffron" />
        {tradeLanes.legend.import}
      </li>
    </ul>
  );
}

function LaneList({ activeCode, onActiveChange }: { activeCode: MarketCode | null; onActiveChange: ActiveLaneChange }) {
  return (
    <div className="flex flex-col gap-8 lg:border-l lg:border-border lg:pl-10">
      <LaneGroup title={tradeLanes.outbound}>
        {activeMarkets.map((market) => {
          const isActive = market.code === activeCode;
          return (
            <li key={market.code}>
              <button
                type="button"
                {...laneInteractionProps(market.code, isActive, onActiveChange)}
                className={cn(
                  "flex w-full items-center gap-3 py-2.5 text-left transition-opacity duration-300",
                  activeCode !== null && !isActive && "opacity-40",
                )}
              >
                <span className="w-7 text-xs font-semibold text-fg-mute">{market.code}</span>
                <span className="flex-1 text-sm font-medium">{market.shortName}</span>
                <ProductIcons products={getProductsForMarket(market.code)} />
              </button>
            </li>
          );
        })}
      </LaneGroup>
      <LaneGroup title={tradeLanes.inbound}>
        {groupByCategory(importProducts).map(({ category, items }) => (
          <li key={category} className="flex items-center gap-3 py-2.5">
            <span className="w-7">
              <ArrowDownRight aria-hidden className="size-4 text-saffron" />
            </span>
            <span className="flex-1 text-sm font-medium">{category}</span>
            <ProductIcons products={items} />
          </li>
        ))}
      </LaneGroup>
    </div>
  );
}

function LaneGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <p className="type-eyebrow text-fg-mute">{title}</p>
      <ul className="mt-3 divide-y divide-border">{children}</ul>
    </div>
  );
}

function ProductIcons({ products }: { products: Product[] }) {
  return (
    <span className="flex -space-x-1.5">
      {products.map((product) => (
        <span
          key={product.slug}
          title={product.name}
          className="grid size-6 place-items-center rounded-full bg-surface ring-2 ring-canvas"
        >
          <Icon name={product.icon} className="size-3" />
        </span>
      ))}
    </span>
  );
}
