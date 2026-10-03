import { Reveal } from "@/components/motion/reveal";
import { ProductCard } from "@/components/sections/products/product-card";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Marquee } from "@/components/ui/marquee";
import { Section } from "@/components/ui/section";
import { SectionHeader } from "@/components/ui/section-header";
import { homeContent } from "@/config";
import { getCatalogue } from "@/lib/content/queries";

const MARQUEE_SECONDS = 70;

/** One gently scrolling row of every product, kept within the page's wide margins. */
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
      <Container size="wide">
        <Reveal className="mt-10">
          <Marquee durationSeconds={MARQUEE_SECONDS} className="py-2">
            {products.map((product) => (
              <ProductCard key={product.slug} product={product} markets={markets} className="w-[18rem] shrink-0" />
            ))}
          </Marquee>
        </Reveal>
      </Container>
    </Section>
  );
}
