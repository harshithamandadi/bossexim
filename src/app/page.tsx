import { HeroSection } from "@/components/sections/home/hero-section";
import { ProductShowcase } from "@/components/sections/home/product-showcase";
import { StatsSection } from "@/components/sections/home/stats-section";
import { CtaSection } from "@/components/sections/shared/cta-section";
import { FaqSection } from "@/components/sections/shared/faq-section";
import { FeatureBand } from "@/components/sections/shared/feature-grid";
import { PartnerTracks } from "@/components/sections/shared/partner-tracks";
import { ProcessScroller } from "@/components/sections/shared/process-scroller";
import { ServicesBento } from "@/components/sections/shared/services-bento";
import { TradeRoutesStage } from "@/components/sections/trade/trade-routes-stage";
import { Reveal } from "@/components/motion/reveal";
import { Section } from "@/components/ui/section";
import { SectionHeader } from "@/components/ui/section-header";
import { globalPresence, homeContent, howWeWork, partnerContent, whyUs } from "@/config";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />

      <Section>
        <SectionHeader {...globalPresence.heading} />
        <Reveal className="mt-12 overflow-hidden rounded-panel shadow-[0_40px_90px_-50px_rgb(8_33_79/0.6)]">
          <TradeRoutesStage />
        </Reveal>
      </Section>

      <Section tone="mist">
        <SectionHeader {...homeContent.services} />
        <ServicesBento className="mt-14" />
      </Section>

      <ProductShowcase />

      <Section tone="dark">
        <ProcessScroller content={howWeWork} />
      </Section>

      <FeatureBand content={whyUs} tone="mist" />

      <Section>
        <SectionHeader {...partnerContent.heading} />
        <PartnerTracks className="mt-14" />
      </Section>

      <FaqSection tone="mist" />
      <CtaSection />
    </>
  );
}
