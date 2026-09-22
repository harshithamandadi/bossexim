import { siteConfig } from "@/config/site";
import type { CompanyDetails, FaqItem } from "@/types/content";

/** schema.org Organization markup, from site config and the company details in the admin. */
export function getOrganizationJsonLd({ contact, social }: CompanyDetails) {
  const { company, url, seo } = siteConfig;

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.legalName,
    alternateName: [company.name, company.shortName],
    url,
    slogan: company.tagline,
    description: seo.description,
    parentOrganization: { "@type": "Organization", name: company.parentGroup },
    ...(contact.email && { email: contact.email }),
    ...(contact.phone && { telephone: contact.phone }),
    ...(contact.address && { address: contact.address }),
    sameAs: social.flatMap((profile) => (profile.href ? [profile.href] : [])),
  };
}

/** JSON for a <script> tag, with "<" escaped so content can never close the tag early. */
export function serializeJsonLd(data: object): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

/** schema.org FAQPage markup, so search engines can show answers directly. */
export function getFaqPageJsonLd(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}
