import { HeroSection } from "@/components/sections/home/hero-section";
import { ProductShowcase } from "@/components/sections/home/product-showcase";
import { StatsSection } from "@/components/sections/home/stats-section";
import { CtaSection } from "@/components/sections/shared/cta-section";
import { FaqSection } from "@/components/sections/shared/faq-section";
import { FeatureBand } from "@/components/sections/shared/feature-grid";
import { PartnerTracks } from "@/components/sections/shared/partner-tracks";
import { ProcessScroller } from "@/components/sections/shared/process-scroller";
import { ServicesBento } from "@/components/sections/shared/services-bento";
import { Section } from "@/components/ui/section";
import { SectionHeader } from "@/components/ui/section-header";
import { homeContent, howWeWork, partnerContent, whyUs } from "@/config";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />

      <Section tone="mist">
        <SectionHeader {...homeContent.services} />
        <ServicesBento className="mt-14" />
      </Section>

      <ProductShowcase />

      <Section tone="dark">
        <ProcessScroller content={howWeWork} />
      </Section>

      <FeatureBand content={whyUs} />

      <Section tone="mist">
        <SectionHeader {...partnerContent.heading} />
        <PartnerTracks className="mt-14" />
      </Section>

      <FaqSection />
      <CtaSection />
    </>
  );
}
