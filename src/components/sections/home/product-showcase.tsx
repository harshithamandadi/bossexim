import { Reveal } from "@/components/motion/reveal";
import { ProductCard } from "@/components/sections/products/product-card";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Marquee } from "@/components/ui/marquee";
import { Section } from "@/components/ui/section";
import { SectionHeader } from "@/components/ui/section-header";
import { homeContent } from "@/config";
import { getCatalogue } from "@/lib/content/queries";
import type { Market, Product } from "@/types/content";

const MARQUEE_SECONDS = 55;

export async function ProductShowcase() {
  const { products: content } = homeContent;
  const { exportProducts, importProducts, markets } = await getCatalogue();

  return (
    <Section bleed>
      <Container className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeader eyebrow={content.eyebrow} title={content.title} description={content.description} />
        <Reveal>
          <ButtonLink href={content.cta.href} variant="secondary" withArrow>
            {content.cta.label}
          </ButtonLink>
        </Reveal>
      </Container>
      <Reveal className="mt-16 space-y-2">
        <ShowcaseRow products={exportProducts} markets={markets} />
        <ShowcaseRow products={importProducts} markets={markets} reverse />
      </Reveal>
    </Section>
  );
}

function ShowcaseRow({ products, markets, reverse = false }: { products: Product[]; markets: Market[]; reverse?: boolean }) {
  return (
    <Marquee reverse={reverse} durationSeconds={MARQUEE_SECONDS} className="py-2">
      {products.map((product) => (
        <ProductCard key={product.slug} product={product} markets={markets} className="w-[19rem] shrink-0" />
      ))}
    </Marquee>
  );
}
