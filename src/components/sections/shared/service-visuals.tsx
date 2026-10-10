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
import { containerLine, containerLineServiceHref, productHref } from "@/config";
import { cn } from "@/lib/cn";
import { groupByCategory, type Catalogue } from "@/lib/catalogue";
import type { ServiceVisual } from "@/types/content";
import { toAlpha3 } from "@/lib/country-codes";

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
              <span className="block text-xs tracking-wide text-fg-mute">{product.markets.map(toAlpha3).join(" · ")}</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/**
 * Import lines as photo tiles, grouped by category. The tiles stretch to fill the
 * card, so it matches the height of the export list beside it.
 */
function ImportsVisual({ catalogue }: VisualProps) {
  return (
    <div className="flex flex-1 flex-col gap-5">
      {groupByCategory(catalogue.importProducts).map(({ category, items }) => (
        <div key={category} className="flex flex-1 flex-col">
          <p className="type-eyebrow text-fg-mute">{category}</p>
          <ul className={cn("mt-2.5 grid flex-1 auto-rows-fr gap-2", items.length >= 4 ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-3")}>
            {items.map((product) => {
              const photo = product.images?.[0];
              return (
                <li key={product.slug}>
                  <Link
                    href={productHref(product.slug)}
                    className="group relative isolate flex h-full min-h-28 flex-col justify-end overflow-hidden rounded-2xl bg-surface p-3 ring-1 ring-inset ring-border"
                  >
                    {photo ? (
                      <Image
                        src={photo.src}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 12vw, 45vw"
                        className="-z-10 object-cover transition-transform duration-500 ease-smooth group-hover:scale-105"
                      />
                    ) : (
                      <span aria-hidden className="brand-gradient absolute inset-0 -z-10 grid place-items-center">
                        <Icon name={product.icon} className="size-8 text-white/80" />
                      </span>
                    )}
                    <span aria-hidden className="absolute inset-0 -z-10 bg-linear-to-t from-black/75 via-black/20 to-transparent" />
                    <span className="text-sm leading-tight font-semibold text-white">{product.name}</span>
                    {photo && <PhotoWatermark size="sm" className="top-2 bottom-auto" />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
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
