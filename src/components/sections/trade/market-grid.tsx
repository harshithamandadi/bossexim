import Link from "next/link";
import type { ReactNode } from "react";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { Chip } from "@/components/ui/chip";
import { Icon } from "@/components/ui/icon";
import { productHref } from "@/config/routes";
import { activeMarkets, getProductsForMarket } from "@/lib/catalogue";
import { cn } from "@/lib/cn";
import type { Market } from "@/types/content";

/** A market's code, name and region — shared by the presence grid and product pages. */
export function MarketTile({ market, children, className }: { market: Market; children?: ReactNode; className?: string }) {
  return (
    <div className={cn("h-full rounded-card bg-surface p-7", className)}>
      <div className="flex items-start justify-between gap-4">
        <span className="type-h2 gradient-text">{market.code}</span>
        <Chip variant="outline">{market.region}</Chip>
      </div>
      <h3 className="type-h4 mt-6">{market.name}</h3>
      {children}
    </div>
  );
}

/** Every destination market with the export lines that ship there. */
export function MarketGrid({ className }: { className?: string }) {
  return (
    <RevealGroup as="ul" className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {activeMarkets.map((market) => (
        <RevealItem as="li" key={market.code}>
          <MarketTile market={market}>
            <ul className="mt-5 flex flex-wrap gap-1.5">
              {getProductsForMarket(market.code).map((product) => (
                <li key={product.slug}>
                  <Link href={productHref(product.slug)} className="group">
                    <Chip variant="outline" className="transition-colors group-hover:text-fg group-hover:ring-fg/30">
                      <Icon name={product.icon} className="size-3.5" />
                      {product.name}
                    </Chip>
                  </Link>
                </li>
              ))}
            </ul>
          </MarketTile>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
