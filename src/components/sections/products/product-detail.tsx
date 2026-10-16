import Image from "next/image";
import { PhotoWatermark } from "@/components/ui/photo-watermark";
import Link from "next/link";
import type { ReactNode } from "react";
import { PageHero } from "@/components/layout/page-hero";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { toParagraphs } from "@/components/sections/shared/prose";
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
import { toAlpha3 } from "@/lib/country-codes";
import type { Product, SpecificationTable } from "@/types/content";
import { ProductMiniCard } from "./product-card";

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
            <div className="relative aspect-[4/3] overflow-hidden rounded-panel bg-white shadow-[0_40px_80px_-40px_rgb(8_33_79/0.45)]">
              <Image src={photo.src} alt={photo.alt} fill priority sizes="(min-width: 1024px) 40vw, 100vw" className="object-contain" />
              <PhotoWatermark size="lg" />
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
            .map((market) => toAlpha3(market.code))
            .join(", ")} ${productLabels.worldwideSuffix}`,
        }
      : { label: facts.origin, value: facts.originValue },
    ...(product.packaging ? [{ label: productLabels.packaging, value: product.packaging }] : []),
    {
      label: facts.specifications,
      value: (
        <Link href={anchorHref(routes.resources, sectionIds.resources.specifications)} className="underline-link">
          {product.specifications?.length ? facts.specificationsLatest : facts.specificationsValue}
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
                <dt className="bg-surface px-4 py-4 font-medium text-fg-mute">{fact.label}</dt>
                <dd className="bg-elevated px-4 py-4 font-semibold">{fact.value}</dd>
              </div>
            ))}
          </dl>
          {product.images && product.images.length > 1 && (
            <ul className="mt-4 grid grid-cols-2 gap-3">
              {product.images.slice(1).map((image) => (
                <li key={image.src} className="relative aspect-[4/3] overflow-hidden rounded-card bg-white">
                  <Image src={image.src} alt={image.alt} fill sizes="(min-width: 1024px) 20vw, 50vw" className="object-contain" />
                  <PhotoWatermark size="sm" />
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
      <RevealGroup as="ul" className="mt-6 grid gap-4">
        {product.specifications.map((table) => (
          <RevealItem as="li" key={table.title}>
            <SpecificationCard table={table} />
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}

/** One spec table as equal tiles: 4 across on desktop (a 12-row table is 4 × 3 — client request), 3 on tablets, 2 on phones. */
function SpecificationCard({ table }: { table: SpecificationTable }) {
  return (
    <article className="rounded-card bg-elevated p-5 shadow-[0_20px_50px_-35px_rgb(8_33_79/0.35)] ring-1 ring-inset ring-border sm:p-6">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span aria-hidden className="brand-gradient h-5 w-1 self-center rounded-full" />
        <h3 className="type-h4">{table.title}</h3>
        {table.subtitle && <p className="text-[13px] text-fg-mute">{table.subtitle}</p>}
      </div>
      <dl className="mt-4 grid auto-rows-fr grid-cols-2 gap-px overflow-hidden rounded-xl bg-border ring-1 ring-border sm:grid-cols-3 lg:grid-cols-4">
        {table.rows.map((row) => (
          <div key={row.label} className="bg-canvas px-3.5 py-3">
            <dt className="text-xs font-semibold text-fg-mute">{row.label}</dt>
            <dd className="mt-1 text-[13.5px] leading-snug font-semibold text-pretty">{row.value}</dd>
          </div>
        ))}
      </dl>
      {table.keyFeatures && (
        <ul className="mt-4 flex flex-wrap items-center gap-1.5">
          <li className="type-eyebrow mr-1 text-[10px] text-fg-mute">{productLabels.keyFeatures}</li>
          {table.keyFeatures.map((feature) => (
            <li key={feature}>
              <Chip variant="outline">{feature}</Chip>
            </li>
          ))}
        </ul>
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

/** Related products as compact cards (photo and name only), in an exports row and an imports row gliding opposite ways. */
export function RelatedProducts({ product, catalogue }: { product: Product; catalogue: Catalogue }) {
  const rows = (["export", "import"] as const)
    .map((direction) => ({
      direction,
      items: (direction === "export" ? catalogue.exportProducts : catalogue.importProducts).filter((item) => item.slug !== product.slug),
    }))
    // The product's own direction first.
    .sort((a, b) => Number(b.direction === product.direction) - Number(a.direction === product.direction))
    .filter((row) => row.items.length > 0);
  if (rows.length === 0) return null;

  return (
    <Section spacing="compact">
      <h2 className="type-h3">{productLabels.relatedTitle}</h2>
      <div className="mt-6 space-y-6">
        {rows.map((row, index) => (
          <div key={row.direction}>
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="type-eyebrow text-fg-mute">{tradeDirections[row.direction].label}</h3>
              <Link href={productsViewHref(row.direction)} className="text-sm font-semibold text-brand hover:underline">
                {productLabels.seeAll}
              </Link>
            </div>
            <Carousel
              label={tradeDirections[row.direction].label}
              previousLabel={uiLabels.previous}
              nextLabel={uiLabels.next}
              slideWidth="12.5rem"
              speed={index === 0 ? 1 : 0.85}
              reverse={index === 1}
              items={row.items.map((item) => (
                <ProductMiniCard key={item.slug} product={item} />
              ))}
            />
          </div>
        ))}
      </div>
    </Section>
  );
}
