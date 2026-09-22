import { LocalNav } from "@/components/layout/local-nav";
import { PageHero } from "@/components/layout/page-hero";
import { FocusPanel } from "@/components/sections/business/focus-panel";
import { CtaSection } from "@/components/sections/shared/cta-section";
import { FeatureBand } from "@/components/sections/shared/feature-grid";
import { ServicesBento } from "@/components/sections/shared/services-bento";
import { Section } from "@/components/ui/section";
import { SectionHeader } from "@/components/ui/section-header";
import { beyondFocus, businessModel, currentFocus, pageContent, routes, sectionIds, whyUs } from "@/config";
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

      <Section id={ids.model} tone="mist">
        <SectionHeader {...businessModel.heading} />
        <ServicesBento className="mt-14" />
      </Section>

      <FeatureBand id={ids.why} content={whyUs} />

      <Section id={ids.focus} tone="mist">
        <SectionHeader {...currentFocus.heading} />
        <FocusPanel className="mt-14" />
      </Section>

      <FeatureBand id={ids.beyond} content={beyondFocus} columns={4} />

      <CtaSection />
    </>
  );
}
