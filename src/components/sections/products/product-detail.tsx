import Link from "next/link";
import type { ReactNode } from "react";
import { PageHero } from "@/components/layout/page-hero";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { MarketTile } from "@/components/sections/trade/market-grid";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ButtonLink } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { IconTile } from "@/components/ui/icon";
import { Section } from "@/components/ui/section";
import {
  anchorHref,
  contactHref,
  pageContent,
  productLabels,
  productsViewHref,
  routes,
  sectionIds,
  tradeDirections,
} from "@/config";
import { getMarketsForProduct, getRelatedProducts } from "@/lib/catalogue";
import type { ExportProduct, Product } from "@/types/content";
import { ProductCard } from "./product-card";

export function ProductHero({ product }: { product: Product }) {
  const direction = tradeDirections[product.direction];
  const breadcrumbs = (
    <Breadcrumbs
      items={[
        { label: pageContent.products.metaTitle, href: routes.products },
        { label: direction.label, href: productsViewHref(product.direction) },
      ]}
      current={product.name}
    />
  );

  return (
    <PageHero
      leading={breadcrumbs}
      content={{ eyebrow: `${direction.singular} · ${product.category}`, title: product.name, description: product.summary }}
    >
      <div className="flex flex-wrap gap-3">
        <ButtonLink href={contactHref({ type: "buyer", product: product.slug })} size="lg" withArrow>
          {productLabels.enquire}
        </ButtonLink>
        <ButtonLink href={contactHref({ type: "supplier", product: product.slug })} size="lg" variant="secondary">
          {productLabels.supply}
        </ButtonLink>
      </div>
    </PageHero>
  );
}

function getProductFacts(product: Product): { label: string; value: ReactNode }[] {
  const { facts } = productLabels;
  const direction = tradeDirections[product.direction];

  return [
    { label: facts.direction, value: direction.tagline },
    { label: facts.category, value: product.category },
    ...(product.hsCode ? [{ label: facts.hsCode, value: product.hsCode }] : []),
    product.direction === "export"
      ? { label: facts.markets, value: getMarketsForProduct(product).map((market) => market.shortName).join(", ") }
      : { label: facts.origin, value: facts.originValue },
    {
      label: facts.specifications,
      value: (
        <Link href={anchorHref(routes.resources, sectionIds.resources.downloads)} className="underline-link">
          {facts.specificationsValue}
        </Link>
      ),
    },
  ];
}

export function ProductOverview({ product }: { product: Product }) {
  return (
    <Section spacing="compact">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-20">
        <Reveal>
          <IconTile icon={product.icon} size="lg" />
          <h2 className="type-h3 mt-8">{productLabels.overview}</h2>
          <p className="type-lead mt-4 text-pretty text-fg-mute">{product.description}</p>
          {product.variants && (
            <div className="mt-10">
              <h3 className="type-eyebrow text-fg-mute">{product.variantsLabel ?? productLabels.defaultVariantsLabel}</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {product.variants.map((variant) => (
                  <li key={variant}>
                    <Chip className="px-4 py-2 text-sm">{variant}</Chip>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Reveal>
        <Reveal delay={0.1}>
          <dl className="divide-y divide-border rounded-card bg-surface px-7">
            {getProductFacts(product).map((fact) => (
              <div key={fact.label} className="flex items-baseline justify-between gap-6 py-5">
                <dt className="text-sm text-fg-mute">{fact.label}</dt>
                <dd className="text-right text-sm font-medium">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </Section>
  );
}

export function ProductMarkets({ product }: { product: ExportProduct }) {
  return (
    <Section tone="mist" spacing="compact">
      <h2 className="type-h3">{productLabels.marketsTitle}</h2>
      <RevealGroup as="ul" className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {getMarketsForProduct(product).map((market) => (
          <RevealItem as="li" key={market.code}>
            <MarketTile market={market} />
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}

export function RelatedProducts({ product }: { product: Product }) {
  const related = getRelatedProducts(product);
  if (related.length === 0) return null;

  return (
    <Section spacing="compact">
      <h2 className="type-h3">{productLabels.relatedTitle}</h2>
      <RevealGroup as="ul" className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {related.map((relatedProduct) => (
          <RevealItem as="li" key={relatedProduct.slug}>
            <ProductCard product={relatedProduct} />
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
