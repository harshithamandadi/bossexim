/**
 * Converts CMS documents into the site's own content types, so components
 * never depend on the CMS's shapes (nulls, ids, upload objects).
 */
import { compliance } from "@/config/about";
import { siteConfig } from "@/config/site";
import type * as Cms from "@/payload-types";
import { socialFieldName } from "@/payload/globals/company-details";
import type {
  CompanyDetails,
  EnquiryTypeId,
  FaqItem,
  Gallery,
  GroupCompany,
  ImageAsset,
  Market,
  Product,
  Resource,
  TeamMember,
} from "@/types/content";

type ImageSize = keyof NonNullable<Cms.Media["sizes"]>;

const optional = <T>(value: T | null | undefined): T | undefined => value ?? undefined;
const nonEmpty = <T>(items: T[] | null | undefined): T[] | undefined => (items?.length ? items : undefined);

export function toImage(media: number | Cms.Media | null | undefined, size?: ImageSize): ImageAsset | undefined {
  if (!media || typeof media === "number" || !media.url) return undefined;
  const variant = size ? media.sizes?.[size] : undefined;
  return {
    src: variant?.url ?? media.url,
    alt: media.alt,
    width: optional(variant?.width ?? media.width),
    height: optional(variant?.height ?? media.height),
  };
}

export function toMarket(doc: Cms.Market): Market {
  return {
    code: doc.code,
    name: doc.name,
    shortName: doc.shortName,
    region: doc.region,
    coordinates: { lat: doc.coordinates.lat, lon: doc.coordinates.lon },
    labelAnchor: optional(doc.labelAnchor),
  };
}

/** `marketCodes` maps market ids to codes, so products can be read without populating relationships. */
export function toProduct(doc: Cms.Product, marketCodes: Map<number, string>): Product {
  const base = {
    slug: doc.slug,
    name: doc.name,
    category: doc.category,
    icon: doc.icon,
    summary: doc.summary,
    description: doc.description,
    variants: nonEmpty(doc.variants),
    variantsLabel: optional(doc.variantsLabel),
    hsCode: optional(doc.hsCode),
  };
  if (doc.direction === "import") return { ...base, direction: "import" };

  const markets = (doc.markets ?? []).flatMap((market) => {
    const code = marketCodes.get(typeof market === "number" ? market : market.id);
    return code ? [code] : [];
  });
  return { ...base, direction: "export", markets };
}

export function toFaq(doc: Cms.Faq): FaqItem {
  const { label, href } = doc.action ?? {};
  return {
    question: doc.question,
    answer: doc.answer,
    category: doc.category,
    keywords: nonEmpty(doc.keywords),
    action: label && href ? { label, href } : undefined,
  };
}

export function toTeamMember(doc: Cms.TeamMember): TeamMember {
  return { name: doc.name, role: doc.role, bio: optional(doc.bio), photo: toImage(doc.photo, "card") };
}

export function toGallery(doc: Cms.Gallery): Gallery {
  return {
    title: doc.title,
    icon: doc.icon,
    images: (doc.images ?? []).flatMap((image) => toImage(image, "card") ?? []),
  };
}

export function toResource(doc: Cms.Resource): Resource {
  const file = typeof doc.file === "object" ? doc.file : undefined;
  return {
    title: doc.title,
    description: doc.description,
    format: doc.format,
    icon: doc.icon,
    href: optional(file?.url),
  };
}

export function toGroupCompany(doc: Cms.GroupCompany): GroupCompany {
  return {
    name: doc.name,
    description: doc.description,
    icon: doc.icon,
    href: optional(doc.href),
    isCurrent: Boolean(doc.isCurrent),
  };
}

export function toCompanyDetails(doc: Cms.CompanyDetail): CompanyDetails {
  const social: Partial<Record<string, string | null>> = doc.social ?? {};
  const registrations = doc.registrations ?? {};
  return {
    contact: {
      website: siteConfig.website,
      email: optional(doc.contact?.email),
      phone: optional(doc.contact?.phone),
      address: optional(doc.contact?.address),
    },
    social: siteConfig.socialPlatforms.map((platform) => ({
      platform,
      href: optional(social[socialFieldName(platform)]),
    })),
    registrations: Object.fromEntries(
      compliance.items.flatMap((item) => {
        const value = registrations[item.key];
        return value ? [[item.key, value]] : [];
      }),
    ),
  };
}

/**
 * Everyone on "All enquiries" plus the extra recipients for this type, without
 * duplicates. With nobody listed, alerts fall back to the contact email.
 */
export function toEnquiryRecipients(doc: Cms.CompanyDetail, type: EnquiryTypeId): string[] {
  const lists = doc.enquiryEmails ?? {};
  const recipients = [...new Set([...(lists.all ?? []), ...(lists[type] ?? [])].map((address) => address.toLowerCase()))];
  if (recipients.length > 0) return recipients;
  return doc.contact?.email ? [doc.contact.email] : [];
}
