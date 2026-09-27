import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { HeroSection } from "@/components/sections/home/hero-section";
import { ProductShowcase } from "@/components/sections/home/product-showcase";
import { StatsSection } from "@/components/sections/home/stats-section";
import { CtaSection } from "@/components/sections/shared/cta-section";
import { FaqSection } from "@/components/sections/shared/faq-section";
import { PartnerTracks } from "@/components/sections/shared/partner-tracks";
import { ProcessScroller } from "@/components/sections/shared/process-scroller";
import { HighlightGrid, ProseSplit } from "@/components/sections/shared/prose";
import { ServicesBento } from "@/components/sections/shared/services-bento";
import { TradeRoutesStage } from "@/components/sections/trade/trade-routes-stage";
import { ButtonLink } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { Section } from "@/components/ui/section";
import { SectionHeader } from "@/components/ui/section-header";
import { homeContent, howWeWork, partnerContent, whyUs } from "@/config";
import { getCatalogue } from "@/lib/content/queries";

export default async function HomePage() {
  const { products, markets } = await getCatalogue();
  const { intro, markets: marketsContent } = homeContent;

  return (
    <>
      <HeroSection products={products} />
      <StatsSection />

      <Section>
        <ProseSplit
          content={intro}
          aside={
            <ButtonLink href={intro.cta.href} variant="secondary" withArrow>
              {intro.cta.label}
            </ButtonLink>
          }
        />
      </Section>

      <Section tone="mist">
        <SectionHeader {...homeContent.services} />
        <ServicesBento className="mt-14" />
      </Section>

      <ProductShowcase />

      <Section tone="mist">
        <SectionHeader {...marketsContent} />
        <RevealGroup as="ul" className="mt-8 flex flex-wrap gap-2">
          {marketsContent.names.map((name) => (
            <RevealItem as="li" key={name}>
              <Chip variant="outline" className="bg-canvas px-4 py-2 text-sm font-semibold">
                {name}
              </Chip>
            </RevealItem>
          ))}
        </RevealGroup>
        <Reveal className="mt-12 overflow-hidden rounded-panel shadow-[0_40px_90px_-50px_rgb(8_33_79/0.6)]">
          <TradeRoutesStage products={products} markets={markets} />
        </Reveal>
      </Section>

      <Section tone="dark">
        <ProcessScroller content={howWeWork} />
      </Section>

      <Section>
        <ProseSplit content={whyUs}>
          <HighlightGrid items={whyUs.strengths} className="mt-10 max-w-2xl" />
        </ProseSplit>
      </Section>

      <Section tone="mist">
        <SectionHeader {...partnerContent.heading} />
        <PartnerTracks className="mt-14" />
      </Section>

      <FaqSection />
      <CtaSection />
    </>
  );
}
