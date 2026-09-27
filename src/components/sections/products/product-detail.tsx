import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { PageHero } from "@/components/layout/page-hero";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { toParagraphs } from "@/components/sections/shared/prose";
import { MarketTile } from "@/components/sections/trade/market-grid";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ButtonLink } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { IconTile } from "@/components/ui/icon";
import { Section } from "@/components/ui/section";
import {
  anchorHref,
  contactHref,
  contentNote,
  pageContent,
  productLabels,
  productsViewHref,
  routes,
  sectionIds,
  tradeDirections,
} from "@/config";
import type { Catalogue } from "@/lib/catalogue";
import type { ExportProduct, Product, SpecificationTable } from "@/types/content";
import { ProductCard } from "./product-card";

export function ProductHero({ product }: { product: Product }) {
  const direction = tradeDirections[product.direction];
  const photo = product.images?.[0];
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
      media={
        photo && (
          <Reveal className="relative aspect-[4/3] overflow-hidden rounded-panel bg-surface shadow-[0_40px_80px_-40px_rgb(8_33_79/0.45)]">
            <Image src={photo.src} alt={photo.alt} fill priority sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
          </Reveal>
        )
      }
    >
      <div className="flex flex-wrap gap-3">
        <ButtonLink href={contactHref({ type: "buyer", product: product.slug })} size="lg" variant="brand" withArrow>
          {productLabels.enquire}
        </ButtonLink>
        <ButtonLink href={contactHref({ type: "supplier", product: product.slug })} size="lg" variant="secondary">
          {productLabels.supply}
        </ButtonLink>
      </div>
    </PageHero>
  );
}

function getProductFacts(product: Product, catalogue: Catalogue): { label: string; value: ReactNode }[] {
  const { facts } = productLabels;
  const direction = tradeDirections[product.direction];

  return [
    { label: facts.direction, value: direction.tagline },
    { label: facts.category, value: product.category },
    ...(product.hsCode ? [{ label: facts.hsCode, value: product.hsCode }] : []),
    product.direction === "export"
      ? { label: facts.markets, value: catalogue.getMarketsForProduct(product).map((market) => market.shortName).join(", ") }
      : { label: facts.origin, value: facts.originValue },
    ...(product.packaging ? [{ label: productLabels.packaging, value: product.packaging }] : []),
    {
      label: facts.specifications,
      value: (
        <Link href={anchorHref(routes.resources, sectionIds.resources.specifications)} className="underline-link">
          {facts.specificationsValue}
        </Link>
      ),
    },
  ];
}

export function ProductOverview({ product, catalogue }: { product: Product; catalogue: Catalogue }) {
  return (
    <Section spacing="compact">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-20">
        <Reveal>
          <IconTile icon={product.icon} size="lg" />
          <h2 className="type-h3 mt-8">{productLabels.overview}</h2>
          <div className="mt-4 space-y-4">
            {toParagraphs(product.description).map((paragraph) => (
              <p key={paragraph} className="type-body text-pretty text-fg-mute">
                {paragraph}
              </p>
            ))}
          </div>
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
            {getProductFacts(product, catalogue).map((fact) => (
              <div key={fact.label} className="flex items-baseline justify-between gap-6 py-5">
                <dt className="shrink-0 text-sm text-fg-mute">{fact.label}</dt>
                <dd className="text-right text-sm font-medium">{fact.value}</dd>
              </div>
            ))}
          </dl>
          {product.images && product.images.length > 1 && (
            <ul className="mt-4 grid grid-cols-2 gap-3">
              {product.images.slice(1).map((image) => (
                <li key={image.src} className="relative aspect-[4/3] overflow-hidden rounded-card bg-surface">
                  <Image src={image.src} alt={image.alt} fill sizes="(min-width: 1024px) 20vw, 50vw" className="object-cover" />
                </li>
              ))}
            </ul>
          )}
        </Reveal>
      </div>
    </Section>
  );
}

export function ProductSpecifications({ product }: { product: Product }) {
  if (!product.specifications) return null;

  return (
    <Section tone="mist" spacing="compact">
      <h2 className="type-h3">{productLabels.specificationsTitle}</h2>
      <p className="mt-2 text-[15px] text-fg-mute">{productLabels.specificationsNote}</p>
      <RevealGroup as="ul" className="mt-8 grid items-start gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {product.specifications.map((table) => (
          <RevealItem as="li" key={table.title}>
            <SpecificationCard table={table} />
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}

function SpecificationCard({ table }: { table: SpecificationTable }) {
  return (
    <article className="rounded-card bg-canvas p-6 ring-1 ring-inset ring-border sm:p-7">
      <h3 className="type-h4">{table.title}</h3>
      {table.subtitle && <p className="mt-1 text-sm text-fg-mute">{table.subtitle}</p>}
      <dl className="mt-5 divide-y divide-border text-sm">
        {table.rows.map((row) => (
          <div key={row.label} className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-4 py-2.5">
            <dt className="text-fg-mute">{row.label}</dt>
            <dd className="font-medium">{row.value}</dd>
          </div>
        ))}
      </dl>
      {table.keyFeatures && (
        <div className="mt-5">
          <p className="type-eyebrow text-[10px] text-fg-mute">{productLabels.keyFeatures}</p>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {table.keyFeatures.map((feature) => (
              <li key={feature}>
                <Chip variant="outline">{feature}</Chip>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}

export function ProductDocumentation({ product }: { product: Product }) {
  return (
    <Section spacing="compact">
      {product.documentation && (
        <Reveal>
          <h2 className="type-h3">{productLabels.documentationTitle}</h2>
          <p className="mt-2 text-[15px] text-fg-mute">{productLabels.documentationNote}</p>
          <ul className="mt-6 flex max-w-4xl flex-wrap gap-2">
            {product.documentation.map((document) => (
              <li key={document}>
                <Chip variant="outline" className="px-3.5 py-1.5 text-sm">
                  {document}
                </Chip>
              </li>
            ))}
          </ul>
        </Reveal>
      )}
      <Reveal>
        <p className="mt-10 max-w-3xl border-l-2 border-brand/40 pl-4 text-sm leading-relaxed text-fg-mute">{contentNote}</p>
      </Reveal>
    </Section>
  );
}

export function ProductMarkets({ product, catalogue }: { product: ExportProduct; catalogue: Catalogue }) {
  return (
    <Section tone="mist" spacing="compact">
      <h2 className="type-h3">{productLabels.marketsTitle}</h2>
      <RevealGroup as="ul" className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {catalogue.getMarketsForProduct(product).map((market) => (
          <RevealItem as="li" key={market.code}>
            <MarketTile market={market} />
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}

export function RelatedProducts({ product, catalogue }: { product: Product; catalogue: Catalogue }) {
  const related = catalogue.getRelatedProducts(product);
  if (related.length === 0) return null;

  return (
    <Section spacing="compact">
      <h2 className="type-h3">{productLabels.relatedTitle}</h2>
      <RevealGroup as="ul" className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {related.map((relatedProduct) => (
          <RevealItem as="li" key={relatedProduct.slug}>
            <ProductCard product={relatedProduct} markets={catalogue.markets} />
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
