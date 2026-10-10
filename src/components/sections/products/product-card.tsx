import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { PhotoWatermark } from "@/components/ui/photo-watermark";
import Link from "next/link";
import { cardStyles } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { Icon } from "@/components/ui/icon";
import { productLabels } from "@/config/products";
import { productHref } from "@/config/routes";
import { cn } from "@/lib/cn";
import type { Market, Product } from "@/types/content";
import { toAlpha3 } from "@/lib/country-codes";

interface ProductCardProps {
  product: Product;
  /** Used to name the markets in each tag's tooltip. */
  markets: Market[];
  className?: string;
}

export function ProductCard({ product, markets, className }: ProductCardProps) {
  const photo = product.images?.[0];
  const arrow = (
    <ArrowUpRight
      aria-hidden
      className="size-4 text-fg transition-[color,transform] duration-300 ease-smooth group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand"
    />
  );

  return (
    <Link
      href={productHref(product.slug)}
      className={cardStyles({ interactive: true, className: cn("group flex h-full flex-col", className) })}
    >
      {/* Every card has the same picture area, so cards line up whether or not a photo exists. */}
      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-surface">
        {photo ? (
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
            className="object-cover transition-transform duration-500 ease-smooth group-hover:scale-[1.04]"
          />
        ) : (
          <div aria-hidden className="brand-gradient absolute inset-0 grid place-items-center">
            <div className="dot-grid absolute inset-0 opacity-30 [mask-image:radial-gradient(circle_at_center,#000,transparent_75%)]" />
            <Icon name={product.icon} className="relative size-12 text-white/90 transition-transform duration-500 ease-smooth group-hover:scale-110" />
          </div>
        )}
        {photo && <PhotoWatermark />}
        <span className="absolute top-3 right-3 grid size-9 place-items-center rounded-full bg-elevated/90 shadow-sm">{arrow}</span>
      </div>
      <p className="type-eyebrow mt-5 text-fg-mute">{product.category}</p>
      <h3 className="type-h4 mt-2">{product.name}</h3>
      <p className="mt-2 text-[15px] leading-relaxed text-fg-mute">{product.summary}</p>
      <ProductTags product={product} markets={markets} className="mt-auto pt-6" />
    </Link>
  );
}

/** Export lines show destination markets; import lines show grades/types. */
export function ProductTags({ product, markets, className }: ProductCardProps) {
  const tags =
    product.direction === "export"
      ? [
          ...product.markets.map((code) => ({ label: toAlpha3(code), title: markets.find((market) => market.code === code)?.name ?? code })),
          // Markets are a current focus, not a limit.
          { label: `+ ${productLabels.worldwide}`, title: productLabels.worldwideTitle },
        ]
      : (product.variants ?? []).map((variant) => ({ label: variant, title: variant }));

  if (tags.length === 0) return null;

  return (
    <ul className={cn("flex flex-wrap gap-1.5", className)}>
      {tags.map((tag) => (
        <li key={tag.label}>
          <Chip variant="outline" title={tag.title}>
            {tag.label}
          </Chip>
        </li>
      ))}
    </ul>
  );
}

/** A compact card — photo and name only — for the gliding rows on Home. */
export function ProductMiniCard({ product, className }: { product: Product; className?: string }) {
  const photo = product.images?.[0];
  return (
    <Link
      href={productHref(product.slug)}
      className={cn(
        "group card-gradient block h-full overflow-hidden rounded-2xl bg-surface p-2 ring-1 ring-inset ring-border",
        "transition-[transform,box-shadow] duration-500 ease-smooth hover:-translate-y-1 hover:shadow-[0_20px_40px_-24px_rgb(8_33_79/0.4)]",
        className,
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-surface">
        {photo ? (
          <>
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="220px"
              className="object-cover transition-transform duration-500 ease-smooth group-hover:scale-[1.05]"
            />
            <PhotoWatermark size="sm" />
          </>
        ) : (
          <div aria-hidden className="brand-gradient absolute inset-0 grid place-items-center">
            <Icon name={product.icon} className="size-9 text-white/90" />
          </div>
        )}
      </div>
      <p className="truncate px-1.5 pt-2.5 pb-1 text-[14px] font-semibold">{product.name}</p>
    </Link>
  );
}
