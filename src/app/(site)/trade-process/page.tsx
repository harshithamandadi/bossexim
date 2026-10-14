import { LocalNav } from "@/components/layout/local-nav";
import { PageHero } from "@/components/layout/page-hero";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { CtaSection } from "@/components/sections/shared/cta-section";
import { FeatureGrid } from "@/components/sections/shared/feature-grid";
import { PartnerTracks } from "@/components/sections/shared/partner-tracks";
import { ProcessScroller } from "@/components/sections/shared/process-scroller";
import { Motto, ProseSplit } from "@/components/sections/shared/prose";
import { WorldTradeMap } from "@/components/sections/trade/world-trade-map";
import { ButtonLink } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Section } from "@/components/ui/section";
import { SectionHeader } from "@/components/ui/section-header";
import { globalPresence, homeContent, howWeWork, pageContent, partnerContent, qualityVerification, routes, sectionIds } from "@/config";
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
        {/* One world map with uniform, code-labelled lanes — no country lists or slides (client request). */}
        <Reveal className="mt-12">
          <div data-tone="dark" className="deep-gradient rounded-panel p-5 text-fg sm:p-8 lg:p-10">
            <Eyebrow>{homeContent.world.eyebrow}</Eyebrow>
            <WorldTradeMap markets={catalogue.markets} label={homeContent.world.legend} className="mt-6" />
          </div>
        </Reveal>
      </Section>

      {/* Partner With Us — its own section of Trade Process, per the client's website structure. */}
      <Section id={sectionIds.tradeProcess.partner} tone="mist" spacing="compact">
        <SectionHeader
          eyebrow={partnerContent.heading.eyebrow}
          title={pageContent.partner.title}
          description={partnerContent.tradeProcessIntro}
        >
          <ButtonLink href={routes.partner} variant="brand" withArrow>
            {partnerContent.tradeProcessCta}
          </ButtonLink>
        </SectionHeader>
        <PartnerTracks detailed className="mt-10" />
      </Section>

      <CtaSection />
    </>
  );
}
