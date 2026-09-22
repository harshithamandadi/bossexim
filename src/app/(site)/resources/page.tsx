import { PageHero } from "@/components/layout/page-hero";
import { ResourceList } from "@/components/sections/resources/resource-list";
import { CtaSection } from "@/components/sections/shared/cta-section";
import { Section } from "@/components/ui/section";
import { SectionHeader } from "@/components/ui/section-header";
import { pageContent, resourcesContent, routes, sectionIds } from "@/config";
import { createPageMetadata } from "@/lib/metadata";

const content = pageContent.resources;

export const metadata = createPageMetadata({
  title: content.metaTitle,
  description: content.metaDescription,
  path: routes.resources,
});

export default function ResourcesPage() {
  return (
    <>
      <PageHero content={content} />
      <Section id={sectionIds.resources.downloads} spacing="compact">
        <SectionHeader {...resourcesContent.heading} />
        <ResourceList className="mt-12" />
      </Section>
      <CtaSection />
    </>
  );
}
