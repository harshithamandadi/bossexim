import { PageHero } from "@/components/layout/page-hero";
import { Reveal } from "@/components/motion/reveal";
import { ContactFormCard } from "@/components/sections/contact/contact-form";
import { CtaSection } from "@/components/sections/shared/cta-section";
import { FaqSection } from "@/components/sections/shared/faq-section";
import { PartnerTracks } from "@/components/sections/shared/partner-tracks";
import { Section } from "@/components/ui/section";
import { SectionHeader } from "@/components/ui/section-header";
import { SplitLayout } from "@/components/ui/split-layout";
import { pageContent, partnerContent, routes, sectionIds } from "@/config";
import { getCatalogue } from "@/lib/content/queries";
import { createFormToken } from "@/lib/enquiry/form-token";
import { toEnquiryType } from "@/lib/enquiry/schema";
import { createPageMetadata } from "@/lib/metadata";
import type { EnquiryTypeId } from "@/types/content";

const content = pageContent.partner;

/** Registrations and partnerships; general questions belong on the Contact page. */
const PARTNER_TYPES: EnquiryTypeId[] = ["buyer", "supplier", "partnership"];

export const metadata = createPageMetadata({
  title: content.metaTitle,
  description: content.metaDescription,
  path: routes.partner,
});

interface PartnerPageProps {
  searchParams: Promise<{ type?: string | string[] }>;
}

export default async function PartnerPage({ searchParams }: PartnerPageProps) {
  const [{ type }, { products }] = await Promise.all([searchParams, getCatalogue()]);
  const requested = toEnquiryType(type);
  const initialType = requested && PARTNER_TYPES.includes(requested) ? requested : "partnership";

  return (
    <>
      <PageHero content={content} />

      <Section>
        <SectionHeader {...partnerContent.heading} />
        <PartnerTracks withAnchors className="mt-10" />
      </Section>

      <Section id={sectionIds.partner.form} tone="mist" className="scroll-mt-8">
        <SplitLayout aside={<SectionHeader {...partnerContent.form} />} stickyAside>
          <Reveal>
            {/* Keyed so the track buttons above re-select the enquiry type. */}
            <ContactFormCard
              key={initialType}
              initialType={initialType}
              products={products}
              types={PARTNER_TYPES}
              formToken={createFormToken()}
              source={routes.partner}
            />
          </Reveal>
        </SplitLayout>
      </Section>

      <FaqSection />
      <CtaSection />
    </>
  );
}
