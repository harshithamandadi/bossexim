import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  ProductHero,
  ProductMarkets,
  ProductOverview,
  RelatedProducts,
} from "@/components/sections/products/product-detail";
import { CtaSection } from "@/components/sections/shared/cta-section";
import { productHref } from "@/config";
import { getCatalogue, getProducts } from "@/lib/content/queries";
import { createPageMetadata } from "@/lib/metadata";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

/** Pre-builds every product page; products added later in the admin render on their first visit. */
export async function generateStaticParams() {
  return (await getProducts()).map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const [{ slug }, catalogue] = await Promise.all([params, getCatalogue()]);
  const product = catalogue.getProductBySlug(slug);
  if (!product) return {};

  return createPageMetadata({
    title: product.name,
    description: `${product.summary} ${product.description}`,
    path: productHref(product.slug),
  });
}

export default async function ProductPage({ params }: ProductPageProps) {
  const [{ slug }, catalogue] = await Promise.all([params, getCatalogue()]);
  const product = catalogue.getProductBySlug(slug);
  if (!product) notFound();

  return (
    <>
      <ProductHero product={product} />
      <ProductOverview product={product} catalogue={catalogue} />
      {product.direction === "export" && <ProductMarkets product={product} catalogue={catalogue} />}
      <RelatedProducts product={product} catalogue={catalogue} />
      <CtaSection />
    </>
  );
}
