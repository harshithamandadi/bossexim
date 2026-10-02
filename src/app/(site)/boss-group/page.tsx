import { LocalNav } from "@/components/layout/local-nav";
import { PageHero } from "@/components/layout/page-hero";
import { CompanyGrid } from "@/components/sections/group/company-grid";
import { ContainerLineSpotlight } from "@/components/sections/group/container-line";
import { ContainerLineNetwork } from "@/components/sections/group/container-line-network";
import { GroupJourney } from "@/components/sections/group/group-journey";
import { GroupRecognition } from "@/components/sections/group/group-recognition";
import { CtaSection } from "@/components/sections/shared/cta-section";
import { ProseSplit } from "@/components/sections/shared/prose";
import { ButtonLink } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { SectionHeader } from "@/components/ui/section-header";
import { groupCompanies, groupIntro, pageContent, routes, sectionIds } from "@/config";
import { createPageMetadata } from "@/lib/metadata";
import { getLocalNavItems } from "@/lib/navigation";

const content = pageContent.group;
const ids = sectionIds.group;

export const metadata = createPageMetadata({
  title: content.metaTitle,
  description: content.metaDescription,
  path: routes.group,
});

export default function BossGroupPage() {
  return (
    <>
      <PageHero content={content} />
      <LocalNav items={getLocalNavItems(routes.group)} />

      <Section>
        <ProseSplit
          content={groupIntro}
          aside={
            <ButtonLink href={routes.media} variant="secondary" withArrow>
              {pageContent.media.eyebrow}
            </ButtonLink>
          }
        />
      </Section>

      <Section id={ids.containerLine} className="scroll-mt-16 pt-0 sm:pt-0">
        <ContainerLineSpotlight />
      </Section>

      <Section id={ids.network} className="pt-0 sm:pt-0">
        <ContainerLineNetwork />
      </Section>

      <Section id={ids.companies} tone="mist">
        <SectionHeader {...groupCompanies.heading} />
        <CompanyGrid className="mt-14" />
      </Section>

      <Section id={ids.journey}>
        <GroupJourney />
      </Section>

      <Section id={ids.recognition} tone="mist">
        <GroupRecognition />
      </Section>

      <CtaSection />
    </>
  );
}
