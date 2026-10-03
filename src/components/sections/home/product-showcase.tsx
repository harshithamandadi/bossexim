import { Reveal } from "@/components/motion/reveal";
import { ProductCard } from "@/components/sections/products/product-card";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Carousel } from "@/components/ui/carousel";
import { Section } from "@/components/ui/section";
import { SectionHeader } from "@/components/ui/section-header";
import { homeContent } from "@/config";
import { getCatalogue } from "@/lib/content/queries";

/** Every product in one endlessly gliding row, with arrows and swipe to browse. */
export async function ProductShowcase() {
  const { products: content } = homeContent;
  const { products, markets } = await getCatalogue();

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
      <Container>
        <Reveal className="mt-10">
          <Carousel
            label={content.eyebrow ?? "Products"}
            previousLabel={content.previous}
            nextLabel={content.next}
            items={products.map((product) => (
              <ProductCard key={product.slug} product={product} markets={markets} className="h-full" />
            ))}
          />
        </Reveal>
      </Container>
    </Section>
  );
}
