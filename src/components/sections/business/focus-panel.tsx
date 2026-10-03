import Link from "next/link";
import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/reveal";
import { Icon } from "@/components/ui/icon";
import { currentFocus, productHref } from "@/config";
import { cn } from "@/lib/cn";
import { getCatalogue } from "@/lib/content/queries";
import type { Product } from "@/types/content";

/** "We export → To → We import", derived entirely from the catalogue. */
export async function FocusPanel({ className }: { className?: string }) {
  const { labels } = currentFocus;
  const { exportProducts, importProducts, markets } = await getCatalogue();

  return (
    <Reveal className={className}>
      <div
        data-tone="dark"
        className="deep-gradient grid gap-10 rounded-panel p-8 sm:p-12 lg:grid-cols-3 lg:gap-0 lg:divide-x lg:divide-border"
      >
        <FocusColumn label={labels.exports}>
          <ProductRows products={exportProducts} />
        </FocusColumn>
        <FocusColumn label={labels.markets}>
          {markets.map((market) => (
            <FocusRow key={market.code} leading={<span className="text-xs font-semibold">{market.code}</span>}>
              {market.name}
            </FocusRow>
          ))}
        </FocusColumn>
        <FocusColumn label={labels.imports}>
          <ProductRows products={importProducts} />
        </FocusColumn>
      </div>
    </Reveal>
  );
}

function FocusColumn({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="lg:px-10 lg:first:pl-0 lg:last:pr-0">
      <p className="type-eyebrow text-fg-mute">{label}</p>
      <ul className="mt-5 space-y-1">{children}</ul>
    </div>
  );
}

function ProductRows({ products }: { products: Product[] }) {
  return products.map((product) => (
    <FocusRow key={product.slug} href={productHref(product.slug)} leading={<Icon name={product.icon} className="size-4" />}>
      {product.name}
    </FocusRow>
  ));
}

function FocusRow({ leading, href, children }: { leading: ReactNode; href?: string; children: ReactNode }) {
  const content = (
    <>
      <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-surface">{leading}</span>
      <span className="text-[15px]">{children}</span>
    </>
  );
  const rowStyles = "flex items-center gap-3 rounded-xl py-1.5";

  return (
    <li>
      {href ? (
        <Link href={href} className={cn(rowStyles, "transition-colors hover:text-fg-mute")}>
          {content}
        </Link>
      ) : (
        <span className={rowStyles}>{content}</span>
      )}
    </li>
  );
}
