import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cardStyles } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { Icon } from "@/components/ui/icon";
import { productLabels } from "@/config/products";
import { productHref } from "@/config/routes";
import { cn } from "@/lib/cn";
import type { Market, Product } from "@/types/content";

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
      className="size-4 text-navy transition-[color,transform] duration-300 ease-smooth group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand"
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
        <span className="absolute top-3 right-3 grid size-9 place-items-center rounded-full bg-white/90 shadow-sm">{arrow}</span>
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
          ...product.markets.map((code) => ({ label: code, title: markets.find((market) => market.code === code)?.name ?? code })),
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
