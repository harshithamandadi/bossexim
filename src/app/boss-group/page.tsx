import { LocalNav } from "@/components/layout/local-nav";
import { PageHero } from "@/components/layout/page-hero";
import { CompanyGrid } from "@/components/sections/group/company-grid";
import { ContainerLineSpotlight } from "@/components/sections/group/container-line";
import { MediaGrid } from "@/components/sections/group/media-grid";
import { CtaSection } from "@/components/sections/shared/cta-section";
import { Section } from "@/components/ui/section";
import { SectionHeader } from "@/components/ui/section-header";
import { groupCompanies, mediaEvents, pageContent, routes, sectionIds } from "@/config";
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

      <Section id={ids.containerLine}>
        <ContainerLineSpotlight />
      </Section>

      <Section id={ids.companies} tone="mist">
        <SectionHeader {...groupCompanies.heading} />
        <CompanyGrid className="mt-14" />
      </Section>

      <Section id={ids.media}>
        <SectionHeader {...mediaEvents.heading} />
        <MediaGrid className="mt-14" />
      </Section>

      <CtaSection />
    </>
  );
}
