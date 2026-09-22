import { PageHero } from "@/components/layout/page-hero";
import { FaqExplorer } from "@/components/sections/faq/faq-explorer";
import { CtaSection } from "@/components/sections/shared/cta-section";
import { Section } from "@/components/ui/section";
import { closingCta, faqCategories, faqPageLabels, pageContent, routes } from "@/config";
import { getFaqs } from "@/lib/content/queries";
import { createPageMetadata } from "@/lib/metadata";
import { getFaqPageJsonLd, serializeJsonLd } from "@/lib/structured-data";

const content = pageContent.faq;

export const metadata = createPageMetadata({
  title: content.metaTitle,
  description: content.metaDescription,
  path: routes.faq,
});

export default async function FaqPage() {
  const faqs = await getFaqs();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(getFaqPageJsonLd(faqs)) }}
      />
      <PageHero content={content} />
      <Section spacing="compact">
        <FaqExplorer
          items={faqs}
          categories={faqCategories}
          labels={faqPageLabels}
          enquiry={closingCta.primary}
        />
      </Section>
      <CtaSection />
    </>
  );
}
