import { PageHero } from "@/components/layout/page-hero";
import { ResourceList } from "@/components/sections/resources/resource-list";
import { CtaSection } from "@/components/sections/shared/cta-section";
import { ButtonLink } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { SectionHeader } from "@/components/ui/section-header";
import { contactHref, pageContent, resourcesContent, routes, sectionIds } from "@/config";
import { createPageMetadata } from "@/lib/metadata";

const content = pageContent.resources;
const { specifications } = resourcesContent;

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
      <Section id={sectionIds.resources.specifications} tone="mist" spacing="compact">
        <SectionHeader {...specifications}>
          <ButtonLink href={contactHref({ type: "buyer" })} variant="brand" withArrow>
            {specifications.cta}
          </ButtonLink>
        </SectionHeader>
      </Section>
      <CtaSection />
    </>
  );
}
