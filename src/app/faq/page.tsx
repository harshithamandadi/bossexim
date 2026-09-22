import { PageHero } from "@/components/layout/page-hero";
import { FaqExplorer } from "@/components/sections/faq/faq-explorer";
import { CtaSection } from "@/components/sections/shared/cta-section";
import { Section } from "@/components/ui/section";
import { closingCta, faqCategories, faqContent, faqPageLabels, pageContent, routes } from "@/config";
import { createPageMetadata } from "@/lib/metadata";
import { getFaqPageJsonLd, serializeJsonLd } from "@/lib/structured-data";

const content = pageContent.faq;

export const metadata = createPageMetadata({
  title: content.metaTitle,
  description: content.metaDescription,
  path: routes.faq,
});

export default function FaqPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(getFaqPageJsonLd(faqContent.items)) }}
      />
      <PageHero content={content} />
      <Section spacing="compact">
        <FaqExplorer
          items={faqContent.items}
          categories={faqCategories}
          labels={faqPageLabels}
          enquiry={closingCta.primary}
        />
      </Section>
      <CtaSection />
    </>
  );
}
