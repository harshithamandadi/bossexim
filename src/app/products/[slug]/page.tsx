import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  ProductHero,
  ProductMarkets,
  ProductOverview,
  RelatedProducts,
} from "@/components/sections/products/product-detail";
import { CtaSection } from "@/components/sections/shared/cta-section";
import { productHref, products } from "@/config";
import { getProductBySlug } from "@/lib/catalogue";
import { createPageMetadata } from "@/lib/metadata";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

/** One static page per product in config — unknown slugs 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return products.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = getProductBySlug((await params).slug);
  if (!product) return {};

  return createPageMetadata({
    title: product.name,
    description: `${product.summary} ${product.description}`,
    path: productHref(product.slug),
  });
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = getProductBySlug((await params).slug);
  if (!product) notFound();

  return (
    <>
      <ProductHero product={product} />
      <ProductOverview product={product} />
      {product.direction === "export" && <ProductMarkets product={product} />}
      <RelatedProducts product={product} />
      <CtaSection />
    </>
  );
}
