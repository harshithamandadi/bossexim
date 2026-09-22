import { PageHero } from "@/components/layout/page-hero";
import { CtaSection } from "@/components/sections/shared/cta-section";
import { FaqSection } from "@/components/sections/shared/faq-section";
import { PartnerTracks } from "@/components/sections/shared/partner-tracks";
import { Section } from "@/components/ui/section";
import { SectionHeader } from "@/components/ui/section-header";
import { pageContent, partnerContent, routes } from "@/config";
import { createPageMetadata } from "@/lib/metadata";

const content = pageContent.partner;

export const metadata = createPageMetadata({
  title: content.metaTitle,
  description: content.metaDescription,
  path: routes.partner,
});

export default function PartnerPage() {
  return (
    <>
      <PageHero content={content} />

      <Section>
        <SectionHeader {...partnerContent.heading} />
        <PartnerTracks withAnchors className="mt-14" />
      </Section>

      <FaqSection tone="mist" />
      <CtaSection />
    </>
  );
}
