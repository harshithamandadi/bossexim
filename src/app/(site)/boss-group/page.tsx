import { LocalNav } from "@/components/layout/local-nav";
import { PageHero } from "@/components/layout/page-hero";
import { CompanyGrid } from "@/components/sections/group/company-grid";
import { GroupFounders } from "@/components/sections/group/group-founders";
import { GroupJourney } from "@/components/sections/group/group-journey";
import { GroupRecognition } from "@/components/sections/group/group-recognition";
import { CtaSection } from "@/components/sections/shared/cta-section";
import { Reveal } from "@/components/motion/reveal";
import { ProseSplit } from "@/components/sections/shared/prose";
import { FootprintMap } from "@/components/ui/footprint-map";
import { ButtonLink } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { SectionHeader } from "@/components/ui/section-header";
import { groupCompanies, groupIntro, pageContent, routes, sectionIds } from "@/config";
import { createPageMetadata } from "@/lib/metadata";

const content = pageContent.group;
const ids = sectionIds.group;

export const metadata = createPageMetadata({
  title: content.metaTitle,
  description: content.metaDescription,
  path: routes.group,
});

/** BOSS Group overview — only about the Group (client feedback); each vertical has its own page. */
export default function BossGroupPage() {
  return (
    <>
      <PageHero content={content} />
      <LocalNav
        items={[
          { id: ids.companies, label: groupCompanies.heading.eyebrow ?? "Group Companies" },
          { id: ids.founders, label: "Founders" },
          { id: ids.journey, label: "Our Journey" },
          { id: ids.recognition, label: "Recognition" },
        ]}
      />

      <Section spacing="compact">
        <ProseSplit
          accent={false}
          content={groupIntro}
          aside={
            <ButtonLink href={routes.media} variant="secondary" withArrow>
              {pageContent.media.eyebrow}
            </ButtonLink>
          }
        >
          {/* The Group's presence map under the paragraphs, so both columns fill (client request). */}
          <Reveal className="mt-8">
            <FootprintMap className="shadow-[0_30px_60px_-35px_rgb(8_33_79/0.45)]" sizes="(min-width: 1024px) 55vw, 100vw" />
          </Reveal>
        </ProseSplit>
      </Section>

      <Section id={ids.companies} tone="mist" spacing="compact">
        <SectionHeader {...groupCompanies.heading} />
        <CompanyGrid className="mt-10" />
      </Section>

      <Section id={ids.founders} spacing="compact">
        <GroupFounders />
      </Section>

      <Section id={ids.journey} tone="mist" spacing="compact">
        <GroupJourney />
      </Section>

      <Section id={ids.recognition} spacing="compact">
        <GroupRecognition />
      </Section>

      <CtaSection />
    </>
  );
}
