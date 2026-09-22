import { LocalNav } from "@/components/layout/local-nav";
import { PageHero } from "@/components/layout/page-hero";
import { Reveal } from "@/components/motion/reveal";
import { CtaSection } from "@/components/sections/shared/cta-section";
import { FeatureBand } from "@/components/sections/shared/feature-grid";
import { ProcessScroller } from "@/components/sections/shared/process-scroller";
import { MarketGrid } from "@/components/sections/trade/market-grid";
import { TradeRoutesStage } from "@/components/sections/trade/trade-routes-stage";
import { Section } from "@/components/ui/section";
import { SectionHeader } from "@/components/ui/section-header";
import { globalPresence, howWeWork, pageContent, qualityVerification, routes, sectionIds } from "@/config";
import { getCatalogue } from "@/lib/content/queries";
import { createPageMetadata } from "@/lib/metadata";
import { getLocalNavItems } from "@/lib/navigation";

const content = pageContent.tradeProcess;
const ids = sectionIds.tradeProcess;

export const metadata = createPageMetadata({
  title: content.metaTitle,
  description: content.metaDescription,
  path: routes.tradeProcess,
});

export default async function TradeProcessPage() {
  const catalogue = await getCatalogue();
  return (
    <>
      <PageHero content={content} />
      <LocalNav items={getLocalNavItems(routes.tradeProcess)} />

      <Section id={ids.howWeWork}>
        <ProcessScroller content={howWeWork} />
      </Section>

      <FeatureBand id={ids.quality} tone="mist" content={qualityVerification} />

      <Section id={ids.presence}>
        <SectionHeader {...globalPresence.heading} />
        <Reveal className="mt-14 overflow-hidden rounded-panel">
          <TradeRoutesStage products={catalogue.products} markets={catalogue.markets} />
        </Reveal>
        <MarketGrid catalogue={catalogue} className="mt-4" />
      </Section>

      <CtaSection />
    </>
  );
}
