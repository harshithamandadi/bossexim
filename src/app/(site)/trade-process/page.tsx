import { LocalNav } from "@/components/layout/local-nav";
import { PageHero } from "@/components/layout/page-hero";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { CtaSection } from "@/components/sections/shared/cta-section";
import { FeatureGrid } from "@/components/sections/shared/feature-grid";
import { ProcessScroller } from "@/components/sections/shared/process-scroller";
import { Motto, ProseSplit } from "@/components/sections/shared/prose";
import { MarketGrid } from "@/components/sections/trade/market-grid";
import { TradeRoutesStage } from "@/components/sections/trade/trade-routes-stage";
import { ButtonLink } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { Section } from "@/components/ui/section";
import { SectionHeader } from "@/components/ui/section-header";
import { globalPresence, howWeWork, pageContent, qualityVerification, routes, sectionIds } from "@/config";
import { getCatalogue, getCompanyDetails } from "@/lib/content/queries";
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
  const [catalogue, company] = await Promise.all([getCatalogue(), getCompanyDetails()]);

  return (
    <>
      <PageHero content={content} />
      <LocalNav items={getLocalNavItems(routes.tradeProcess)} />

      <Section id={ids.howWeWork}>
        <ProcessScroller content={howWeWork} />
        <Reveal>
          <p className="mt-12 max-w-2xl text-[15px] leading-relaxed text-fg-mute">{howWeWork.note}</p>
        </Reveal>
      </Section>

      <Section id={ids.quality} tone="dark">
        <SectionHeader {...qualityVerification.heading} />
        <FeatureGrid items={qualityVerification.items} className="mt-10" />
        <Motto className="mt-12">{qualityVerification.motto}</Motto>
      </Section>

      <Section id={ids.presence}>
        <ProseSplit content={globalPresence} accent="globe">
          <RevealGroup as="ul" className="mt-10 grid max-w-2xl gap-3 sm:grid-cols-2">
            {globalPresence.tiers.map((tier) => (
              <RevealItem as="li" key={tier.title} className="card-gradient rounded-card bg-surface p-6">
                <h3 className="type-h4">{tier.title}</h3>
                <p className="mt-1 text-sm text-fg-mute">{tier.description}</p>
                <p className="mt-4 flex flex-wrap gap-1.5">
                  {tier.places.map((place) => (
                    <Chip key={place} variant="outline" className="bg-canvas">
                      {place}
                    </Chip>
                  ))}
                </p>
              </RevealItem>
            ))}
          </RevealGroup>
          {company.originPorts.length > 0 && (
            <p className="mt-6 max-w-2xl text-[15px]">
              <span className="font-semibold">{globalPresence.ports.origin}:</span>{" "}
              <span className="text-fg-mute">{company.originPorts.join(" · ")}</span>
            </p>
          )}
        </ProseSplit>
        <Reveal className="mt-12 overflow-hidden rounded-panel">
          <TradeRoutesStage products={catalogue.products} markets={catalogue.markets} />
        </Reveal>
        <MarketGrid catalogue={catalogue} className="mt-4" />
      </Section>

      <Section tone="mist" spacing="compact">
        <SectionHeader
          eyebrow={pageContent.partner.eyebrow}
          title={pageContent.partner.title}
          description={pageContent.partner.description}
        >
          <ButtonLink href={routes.partner} variant="brand" withArrow>
            {pageContent.partner.eyebrow}
          </ButtonLink>
        </SectionHeader>
      </Section>

      <CtaSection />
    </>
  );
}
