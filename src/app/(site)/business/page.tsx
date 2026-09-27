import { LocalNav } from "@/components/layout/local-nav";
import { PageHero } from "@/components/layout/page-hero";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { FocusPanel } from "@/components/sections/business/focus-panel";
import { CtaSection } from "@/components/sections/shared/cta-section";
import { HighlightGrid, Motto, ProseSplit } from "@/components/sections/shared/prose";
import { ServicesBento } from "@/components/sections/shared/services-bento";
import { Chip } from "@/components/ui/chip";
import { Section } from "@/components/ui/section";
import { SectionHeader } from "@/components/ui/section-header";
import { beyondFocus, businessModel, currentFocus, homeContent, pageContent, routes, sectionIds, whyUs } from "@/config";
import { createPageMetadata } from "@/lib/metadata";
import { getLocalNavItems } from "@/lib/navigation";

const content = pageContent.business;
const ids = sectionIds.business;

export const metadata = createPageMetadata({
  title: content.metaTitle,
  description: content.metaDescription,
  path: routes.business,
});

export default function BusinessPage() {
  return (
    <>
      <PageHero content={content} />
      <LocalNav items={getLocalNavItems(routes.business)} />

      <Section id={ids.model}>
        <ProseSplit content={businessModel}>
          <HighlightGrid items={businessModel.models} className="mt-10 max-w-2xl" />
        </ProseSplit>
      </Section>

      <Section tone="mist">
        <SectionHeader {...homeContent.services} />
        <ServicesBento className="mt-14" />
      </Section>

      <Section id={ids.why}>
        <ProseSplit content={whyUs}>
          <HighlightGrid items={whyUs.strengths} className="mt-10 max-w-2xl" />
        </ProseSplit>
      </Section>

      <Section id={ids.focus} tone="mist">
        <ProseSplit content={currentFocus} />
        <FocusPanel className="mt-14" />
      </Section>

      <Section id={ids.beyond}>
        <ProseSplit content={beyondFocus}>
          <RevealGroup as="ul" className="mt-10 flex max-w-2xl flex-wrap gap-2">
            {beyondFocus.criteria.map((criterion) => (
              <RevealItem as="li" key={criterion}>
                <Chip variant="outline" className="px-3.5 py-1.5 text-sm">
                  {criterion}
                </Chip>
              </RevealItem>
            ))}
          </RevealGroup>
          <Motto>{beyondFocus.motto}</Motto>
        </ProseSplit>
      </Section>

      <CtaSection />
    </>
  );
}
