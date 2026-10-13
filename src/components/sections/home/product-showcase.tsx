import { Reveal } from "@/components/motion/reveal";
import Link from "next/link";
import { ProductMiniCard } from "@/components/sections/products/product-card";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Carousel } from "@/components/ui/carousel";
import { Section } from "@/components/ui/section";
import { SectionHeader } from "@/components/ui/section-header";
import { homeContent, productsViewHref, tradeDirections } from "@/config";
import { getCatalogue } from "@/lib/content/queries";

/** Exports and imports as two endlessly gliding rows of compact cards, with arrows and swipe to browse. */
export async function ProductShowcase() {
  const { products: content } = homeContent;
  const { exportProducts, importProducts } = await getCatalogue();

  return (
    <Section bleed spacing="compact">
      <Container className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeader eyebrow={content.eyebrow} title={content.title} description={content.description} />
        <Reveal className="shrink-0">
          <ButtonLink href={content.cta.href} variant="secondary" withArrow>
            {content.cta.label}
          </ButtonLink>
        </Reveal>
      </Container>
      {/* Exports and imports in separate gliding rows of small cards (photo and name). */}
      <Container className="mt-8 space-y-6">
        {(["export", "import"] as const).map((direction) => {
          const rowProducts = direction === "export" ? exportProducts : importProducts;
          return (
            <Reveal key={direction}>
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="type-eyebrow text-fg-mute">{tradeDirections[direction].label}</h3>
                <Link href={productsViewHref(direction)} className="text-sm font-semibold text-brand hover:underline">
                  {content.viewRow}
                </Link>
              </div>
              <Carousel
                label={tradeDirections[direction].label}
                previousLabel={content.previous}
                nextLabel={content.next}
                slideWidth="12.5rem"
                speed={direction === "export" ? 1 : 0.85}
                reverse={direction === "import"}
                items={rowProducts.map((product) => <ProductMiniCard key={product.slug} product={product} />)}
              />
            </Reveal>
          );
        })}
      </Container>
    </Section>
  );
}
