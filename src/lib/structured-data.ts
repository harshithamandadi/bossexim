import { siteConfig } from "@/config/site";

/** schema.org Organization markup, built from site config. */
export function getOrganizationJsonLd() {
  const { company, url, contact, social, seo } = siteConfig;

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
