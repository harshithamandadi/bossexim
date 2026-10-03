import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { PageHero } from "@/components/layout/page-hero";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { toParagraphs } from "@/components/sections/shared/prose";
import { MarketTile, WorldwideTile } from "@/components/sections/trade/market-grid";
import { Carousel } from "@/components/ui/carousel";
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
  photoCredits,
  productLabels,
  productsViewHref,
  routes,
  sectionIds,
  tradeDirections,
  uiLabels,
} from "@/config";
import type { Catalogue } from "@/lib/catalogue";
import type { ExportProduct, Product, SpecificationTable } from "@/types/content";
import { ProductCard } from "./product-card";

export function ProductHero({ product }: { product: Product }) {
  const direction = tradeDirections[product.direction];
  const photo = product.images?.[0];
  const credit = photoCredits[product.slug];
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
          <Reveal>
            <div className="relative aspect-[4/3] overflow-hidden rounded-panel bg-surface shadow-[0_40px_80px_-40px_rgb(8_33_79/0.45)]">
              <Image src={photo.src} alt={photo.alt} fill priority sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
            </div>
            {credit && (
              <a href={credit.href} target="_blank" rel="noreferrer" className="mt-2 block text-right text-[11px] text-fg-mute hover:text-fg">
                {credit.text}
              </a>
            )}
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
      ? {
          label: facts.markets,
          value: `${catalogue
            .getMarketsForProduct(product)
            .map((market) => market.shortName)
            .join(", ")} ${productLabels.worldwideSuffix}`,
        }
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
          <dl className="overflow-hidden rounded-card text-sm ring-1 ring-inset ring-border">
            {getProductFacts(product, catalogue).map((fact) => (
              <div key={fact.label} className="grid grid-cols-[8.5rem_minmax(0,1fr)] border-b border-border last:border-b-0">
                <dt className="bg-mist px-4 py-4 font-medium text-navy/70">{fact.label}</dt>
                <dd className="bg-elevated px-4 py-4 font-semibold">{fact.value}</dd>
              </div>
            ))}
          </dl>
          {product.images && product.images.length > 1 && (
            <ul className="mt-4 grid grid-cols-2 gap-3">
              {product.images.slice(1).map((image) => (
                <li key={image.src} className="relative aspect-[4/3] overflow-hidden card-gradient rounded-card bg-surface">
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
      <RevealGroup as="ul" className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
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
    <article className="h-full rounded-card bg-elevated p-5 shadow-[0_20px_50px_-35px_rgb(8_33_79/0.35)] ring-1 ring-inset ring-border sm:p-6">
      <div className="flex items-start gap-3">
        <span aria-hidden className="brand-gradient mt-1 h-8 w-1 shrink-0 rounded-full" />
        <div>
          <h3 className="type-h4">{table.title}</h3>
          {table.subtitle && <p className="mt-0.5 text-[13px] text-fg-mute">{table.subtitle}</p>}
        </div>
      </div>
      {/* Label column shaded, values bold: parameters and data read as two distinct columns. */}
      <dl className="mt-5 overflow-hidden rounded-xl text-[13px] ring-1 ring-inset ring-border">
        {table.rows.map((row) => (
          <div
            key={row.label}
            className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] border-b border-border last:border-b-0"
          >
            <dt className="bg-mist px-3 py-2.5 font-medium text-navy/70">{row.label}</dt>
            <dd className="px-3 py-2.5 font-semibold text-fg">{row.value}</dd>
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
      <p className="mt-2 text-[15px] text-fg-mute">{productLabels.marketsNote}</p>
      <Carousel
        className="mt-6"
        label={productLabels.marketsTitle}
        previousLabel={uiLabels.previous}
        nextLabel={uiLabels.next}
        slideWidth="17rem"
        items={[
          ...catalogue.getMarketsForProduct(product).map((market) => <MarketTile key={market.code} market={market} />),
          <WorldwideTile key="worldwide" />,
        ]}
      />
    </Section>
  );
}

export function RelatedProducts({ product, catalogue }: { product: Product; catalogue: Catalogue }) {
  const related = catalogue.getRelatedProducts(product, Number.POSITIVE_INFINITY);
  if (related.length === 0) return null;

  return (
    <Section spacing="compact">
      <h2 className="type-h3">{productLabels.relatedTitle}</h2>
      <Carousel
        className="mt-6"
        label={productLabels.relatedTitle}
        previousLabel={uiLabels.previous}
        nextLabel={uiLabels.next}
        items={related.map((relatedProduct) => (
          <ProductCard key={relatedProduct.slug} product={relatedProduct} markets={catalogue.markets} className="h-full" />
        ))}
      />
    </Section>
  );
}
