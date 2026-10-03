import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Carousel } from "@/components/ui/carousel";
import { Chip } from "@/components/ui/chip";
import { Flag } from "@/components/ui/flag";
import { Icon } from "@/components/ui/icon";
import { WorldDotsMap } from "@/components/ui/world-dots-map";
import { globalPresence } from "@/config/process";
import { uiLabels } from "@/config/ui";
import { contactHref, productHref } from "@/config/routes";
import type { Catalogue } from "@/lib/catalogue";
import { cn } from "@/lib/cn";
import type { Market } from "@/types/content";

/** A market's flag, code, name and region — shared by the presence grid and product pages. */
export function MarketTile({ market, children, className }: { market: Market; children?: ReactNode; className?: string }) {
  return (
    <div className={cn("group/tile relative isolate h-full overflow-hidden card-gradient rounded-card bg-surface p-7", className)}>
      {/* The flag again, large and faded into the corner, for a touch of the country's colour. */}
      <Flag
        code={market.code}
        className="pointer-events-none absolute -top-6 -right-10 -z-10 w-56 rotate-[-8deg] opacity-[0.13] blur-[1px] [mask-image:radial-gradient(circle_at_top_right,#000_20%,transparent_70%)] transition-opacity duration-500 group-hover/tile:opacity-20"
      />
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <Flag code={market.code} className="w-14 rounded-xl shadow-[0_8px_20px_-8px_rgb(8_33_79/0.45)] ring-2 ring-white" />
          <span className="type-h2 gradient-text leading-none">{market.code}</span>
        </div>
        <Chip variant="outline" className="bg-canvas/70 backdrop-blur">
          {market.region}
        </Chip>
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
const MARKETS_LABEL = "Markets";
const WORLDWIDE = {
  title: "Worldwide",
  text: "Buying for another country? We supply destinations beyond our core markets on request.",
};

/** Closes a row of markets with the "not limited to these countries" message. */
export function WorldwideTile() {
  return (
    <Link
      href={contactHref({ type: "buyer" })}
      data-tone="dark"
      className="group deep-gradient relative isolate flex h-full min-h-56 flex-col justify-between overflow-hidden rounded-card p-7"
    >
      <WorldDotsMap className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 opacity-60" />
      <div className="flex items-start justify-between gap-4">
        <span className="grid h-[2.6rem] w-14 place-items-center rounded-xl bg-white/10 ring-2 ring-white/30">
          <Icon name="globe" className="size-6 text-white" />
        </span>
        <ArrowUpRight
          aria-hidden
          className="size-5 text-fg-mute transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-fg"
        />
      </div>
      <div>
        <h3 className="type-h4">{WORLDWIDE.title}</h3>
        <p className="mt-1.5 text-sm text-fg-mute">{WORLDWIDE.text}</p>
      </div>
    </Link>
  );
}

/** Every market we trade with and the export lines that ship there, as a gliding row. */
export function MarketGrid({ catalogue, className }: { catalogue: Catalogue; className?: string }) {
  return (
    <Carousel
      className={className}
      label={MARKETS_LABEL}
      previousLabel={uiLabels.previous}
      nextLabel={uiLabels.next}
      slideWidth="22rem"
      items={[
        ...catalogue.markets.map((market) => {
          const products = catalogue.getProductsForMarket(market.code);
          return (
            <MarketTile key={market.code} market={market}>
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
          );
        }),
        <WorldwideTile key="worldwide" />,
      ]}
    />
  );
}
