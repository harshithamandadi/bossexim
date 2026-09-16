import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { cardStyles } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { IconTile } from "@/components/ui/icon";
import { productHref } from "@/config/routes";
import { getMarket } from "@/lib/catalogue";
import { cn } from "@/lib/cn";
import type { Product } from "@/types/content";

export function ProductCard({ product, className }: { product: Product; className?: string }) {
  return (
    <Link
      href={productHref(product.slug)}
      className={cardStyles({ interactive: true, className: cn("group flex h-full flex-col", className) })}
    >
      <div className="flex items-start justify-between">
        <IconTile icon={product.icon} />
        <ArrowUpRight
          aria-hidden
          className="size-5 text-fg-mute transition-[color,transform] duration-300 ease-smooth group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-fg"
        />
      </div>
      <p className="type-eyebrow mt-10 text-fg-mute">{product.category}</p>
      <h3 className="type-h4 mt-2">{product.name}</h3>
      <p className="mt-2 text-[15px] leading-relaxed text-fg-mute">{product.summary}</p>
      <ProductTags product={product} className="mt-auto pt-6" />
    </Link>
  );
}

/** Export lines show destination markets; import lines show grades/types. */
export function ProductTags({ product, className }: { product: Product; className?: string }) {
  const tags =
    product.direction === "export"
      ? product.markets.map((code) => ({ label: code, title: getMarket(code).name }))
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
