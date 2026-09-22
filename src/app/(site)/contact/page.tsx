import { PageHero } from "@/components/layout/page-hero";
import { SocialLinks } from "@/components/layout/social-links";
import { Reveal } from "@/components/motion/reveal";
import { ContactDetails } from "@/components/sections/contact/contact-details";
import { ContactFormCard } from "@/components/sections/contact/contact-form";
import { EnquiryTypeList } from "@/components/sections/contact/enquiry-type-list";
import { Section } from "@/components/ui/section";
import { SectionHeader } from "@/components/ui/section-header";
import { contactContent, pageContent, routes, sectionIds } from "@/config";
import { getCatalogue, getCompanyDetails } from "@/lib/content/queries";
import { toEnquiryType, toProductSlug } from "@/lib/enquiry/schema";
import { createPageMetadata } from "@/lib/metadata";

const content = pageContent.contact;

export const metadata = createPageMetadata({
  title: content.metaTitle,
  description: content.metaDescription,
  path: routes.contact,
});

interface ContactPageProps {
  searchParams: Promise<{ type?: string | string[]; product?: string | string[] }>;
}

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const [params, catalogue, company] = await Promise.all([searchParams, getCatalogue(), getCompanyDetails()]);
  const initialProduct = toProductSlug(
    params.product,
    catalogue.products.map((product) => product.slug),
  );
  const initialType = toEnquiryType(params.type) ?? (initialProduct ? "buyer" : "general");

  return (
    <>
      <PageHero content={content} />
      <Section spacing="compact" className="pb-24 sm:pb-32">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
          <div className="space-y-12">
            <SectionHeader {...contactContent.heading} />
            <EnquiryTypeList />
            <ContactDetails contact={company.contact} />
            <div>
              <h3 className="type-h4">{contactContent.social.title}</h3>
              <SocialLinks links={company.social} className="mt-5" />
            </div>
          </div>
          <Reveal id={sectionIds.contact.form} className="scroll-mt-32">
            {/* Keyed so choosing a different enquiry type or product re-initialises the form. */}
            <ContactFormCard
              key={`${initialType}-${initialProduct ?? ""}`}
              initialType={initialType}
              initialProduct={initialProduct}
              products={catalogue.products}
            />
          </Reveal>
        </div>
      </Section>
    </>
  );
}
