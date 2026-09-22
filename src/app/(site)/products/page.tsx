import { PageHero } from "@/components/layout/page-hero";
import { ProductCatalogue } from "@/components/sections/products/product-catalogue";
import { CtaSection } from "@/components/sections/shared/cta-section";
import { Section } from "@/components/ui/section";
import { pageContent, routes } from "@/config";
import { getCatalogue } from "@/lib/content/queries";
import { createPageMetadata } from "@/lib/metadata";
import type { TradeDirection } from "@/types/content";

const content = pageContent.products;

export const metadata = createPageMetadata({
  title: content.metaTitle,
  description: content.metaDescription,
  path: routes.products,
});

interface ProductsPageProps {
  searchParams: Promise<{ view?: string | string[] }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const [{ view }, { products, markets }] = await Promise.all([searchParams, getCatalogue()]);
  const initialView: TradeDirection = view === "import" ? "import" : "export";

  return (
    <>
      <PageHero content={content} />
      <Section spacing="compact" className="pt-4 sm:pt-6">
        {/* Keyed so the header's Exports/Imports links switch tabs even on this page. */}
        <ProductCatalogue key={initialView} initialView={initialView} products={products} markets={markets} />
      </Section>
      <CtaSection />
    </>
  );
}
