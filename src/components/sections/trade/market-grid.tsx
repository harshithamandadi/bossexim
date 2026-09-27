import Link from "next/link";
import type { ReactNode } from "react";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { Chip } from "@/components/ui/chip";
import { Icon } from "@/components/ui/icon";
import { globalPresence } from "@/config/process";
import { productHref } from "@/config/routes";
import type { Catalogue } from "@/lib/catalogue";
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
      {market.ports && (
        <p className="mt-1 text-sm text-fg-mute">
          {globalPresence.ports.market}: {market.ports.join(" · ")}
        </p>
      )}
      {children}
    </div>
  );
}

const CORE_MARKET_NOTE = "Core trade market — products sourced on request.";

/** Every market we trade with, and the export lines that ship there. */
export function MarketGrid({ catalogue, className }: { catalogue: Catalogue; className?: string }) {
  return (
    <RevealGroup as="ul" className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {catalogue.markets.map((market) => {
        const products = catalogue.getProductsForMarket(market.code);
        return (
          <RevealItem as="li" key={market.code}>
            <MarketTile market={market}>
              {products.length === 0 ? (
                <p className="mt-5 text-sm text-fg-mute">{CORE_MARKET_NOTE}</p>
              ) : (
                <ul className="mt-5 flex flex-wrap gap-1.5">
                  {products.map((product) => (
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
              )}
            </MarketTile>
          </RevealItem>
        );
      })}
    </RevealGroup>
  );
}
