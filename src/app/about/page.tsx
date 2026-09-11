import { LocalNav } from "@/components/layout/local-nav";
import { PageHero } from "@/components/layout/page-hero";
import { AboutOverview } from "@/components/sections/about/about-overview";
import { ComplianceTable } from "@/components/sections/about/compliance-table";
import { GroupSnapshot } from "@/components/sections/about/group-snapshot";
import { TeamGrid } from "@/components/sections/about/team-grid";
import { VisionMission } from "@/components/sections/about/vision-mission";
import { CtaSection } from "@/components/sections/shared/cta-section";
import { Section } from "@/components/ui/section";
import { SectionHeader } from "@/components/ui/section-header";
import { SplitLayout } from "@/components/ui/split-layout";
import { compliance, leadership, pageContent, routes, sectionIds } from "@/config";
import { createPageMetadata } from "@/lib/metadata";
import { getLocalNavItems } from "@/lib/navigation";

const content = pageContent.about;
const ids = sectionIds.about;

export const metadata = createPageMetadata({
  title: content.metaTitle,
  description: content.metaDescription,
  path: routes.about,
});

export default function AboutPage() {
  return (
    <>
      <PageHero content={content} />
      <LocalNav items={getLocalNavItems(routes.about)} />

      <Section id={ids.overview}>
        <AboutOverview />
      </Section>

      <Section id={ids.group} tone="mist">
        <GroupSnapshot />
      </Section>

      <Section id={ids.vision}>
        <VisionMission />
      </Section>

      <Section id={ids.leadership} tone="mist">
        <SectionHeader {...leadership.heading} />
        <TeamGrid className="mt-14" />
      </Section>

      <Section id={ids.compliance}>
        <SplitLayout aside={<SectionHeader {...compliance.heading} />} stickyAside>
          <ComplianceTable />
        </SplitLayout>
      </Section>

      <CtaSection />
    </>
  );
}
