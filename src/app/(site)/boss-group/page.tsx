import { LocalNav } from "@/components/layout/local-nav";
import { PageHero } from "@/components/layout/page-hero";
import { CompanyGrid } from "@/components/sections/group/company-grid";
import { GroupJourney } from "@/components/sections/group/group-journey";
import { GroupRecognition } from "@/components/sections/group/group-recognition";
import { CtaSection } from "@/components/sections/shared/cta-section";
import { ProseSplit } from "@/components/sections/shared/prose";
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
          { id: ids.journey, label: "Our Journey" },
          { id: ids.recognition, label: "Recognition" },
        ]}
      />

      <Section spacing="compact">
        <ProseSplit
          accent="mark"
          content={groupIntro}
          aside={
            <ButtonLink href={routes.media} variant="secondary" withArrow>
              {pageContent.media.eyebrow}
            </ButtonLink>
          }
        />
      </Section>

      <Section id={ids.companies} tone="mist" spacing="compact">
        <SectionHeader {...groupCompanies.heading} />
        <CompanyGrid className="mt-10" />
      </Section>

      <Section id={ids.journey} spacing="compact">
        <GroupJourney />
      </Section>

      <Section id={ids.recognition} tone="mist" spacing="compact">
        <GroupRecognition />
      </Section>

      <CtaSection />
    </>
  );
}
