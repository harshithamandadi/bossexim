/** Page headers, SEO text and the home page's copy — from the client's page documents. */
import type { CallToAction, LinkItem, PageContent, ProseContent, SectionContent } from "@/types/content";
import { contactHref, routes } from "./routes";
import { siteConfig } from "./site";

const { company } = siteConfig;

export const homeContent: {
  hero: SectionContent & { highlight: string; primaryCta: LinkItem; secondaryCta: LinkItem };
  intro: ProseContent & { cta: LinkItem };
  markets: SectionContent & { names: string[] };
  services: SectionContent;
  products: SectionContent & { cta: LinkItem };
} = {
  hero: {
    eyebrow: company.focus,
    title: company.tagline,
    highlight: "Boundaries",
    description:
      "BOSS Global EXIM Pvt. Ltd. (BGEXIM) connects reliable suppliers, genuine buyers and international markets through structured sourcing, trading and supply-chain coordination.",
    primaryCta: { label: "Explore products", href: routes.products },
    secondaryCta: { label: "Buy, sell or partner", href: routes.partner },
  },
  intro: {
    heading: {
      eyebrow: "How we trade",
      title: company.motto,
    },
    paragraphs: [
      "We work with a simple approach: understanding the requirement, identifying suitable sources, verifying commercial and quality details, structuring the transaction, coordinating documentation and logistics, and completing the trade in a transparent manner.",
      "BGEXIM is part of the wider BOSS Group and benefits from the Group’s experience in shipping, freight forwarding, logistics, retail, construction, hospitality, IT and BPO. This wider ecosystem gives us access to practical business experience and international logistics support.",
    ],
    cta: { label: "About BOSS Global EXIM", href: routes.about },
  },
  markets: {
    eyebrow: "Core markets",
    title: "Where we trade today.",
    description:
      "Our current core markets include India, Singapore, Malaysia, Australia, UAE, Thailand, Saudi Arabia and Indonesia, while our wider network can support additional international opportunities.",
    names: ["India", "Singapore", "Malaysia", "Australia", "UAE", "Thailand", "Saudi Arabia", "Indonesia"],
  },
  services: {
    eyebrow: "What we do",
    title: "Sourcing, trading and supply-chain coordination.",
    description:
      "Merchant exporter, merchant importer and supply-chain solutions partner — with global sourcing behind every trade.",
  },
  products: {
    eyebrow: "Products",
    title: "From India to the world. From the world to Indian industry.",
    description:
      "Selected agricultural products for international buyers, and polymers and recyclable metals for Indian manufacturers and recyclers.",
    cta: { label: "View all products", href: routes.products },
  },
};

export const closingCta: CallToAction = {
  title: "Ready to trade beyond boundaries?",
  description:
    "If you have a genuine business opportunity and would like to explore international trade with BGEXIM, we invite you to buy, sell or partner with us.",
  primary: { label: "Send an enquiry", href: contactHref() },
  secondary: { label: "Partner with us", href: routes.partner },
};

/** Shown with product information: the client's content note. */
export const contentNote =
  "Product availability, specifications, certifications, regulatory requirements and documentation vary by product, HS classification, origin, destination and transaction. All requirements should be confirmed before commercial execution.";

export type PageKey =
  | "about"
  | "business"
  | "products"
  | "tradeProcess"
  | "partner"
  | "group"
  | "media"
  | "resources"
  | "faq"
  | "contact";

export const pageContent: Record<PageKey, PageContent> = {
  about: {
    eyebrow: "About Us",
    title: "Trusted international trade.",
    description:
      "BOSS Global EXIM Pvt. Ltd. is an international trading arm within the wider BOSS business ecosystem — connecting products, markets and people.",
    metaTitle: "About Us",
    metaDescription:
      "About BOSS Global EXIM Pvt. Ltd. (BGEXIM), the international trading arm of the BOSS Group — vision, mission, values, leadership and registrations.",
  },
  business: {
    eyebrow: "Business",
    title: "Focused today. Flexible for tomorrow.",
    description: "A flexible B2B trading model designed to connect reliable supply with genuine demand.",
    metaTitle: "Business",
    metaDescription:
      "BGEXIM's business model: global sourcing & trade facilitation, principal trading, structured / back-to-back trading and supply-chain coordination.",
  },
  products: {
    eyebrow: "Products",
    title: "Our product portfolio.",
    description:
      "Agricultural products sourced from India for international buyers, and polymers and recyclable metals sourced internationally for Indian industry.",
    metaTitle: "Products",
    metaDescription:
      "Exports from India — rice, spices, dehydrated onion & garlic, pulses, dried chillies, groundnuts and jaggery. Imports — polymers, polyester chips and recyclable metals.",
  },
  tradeProcess: {
    eyebrow: "Trade Process",
    title: "Clear from enquiry to completion.",
    description:
      "A structured trade process designed to reduce uncertainty and keep every transaction clear — with quality verification and a growing international network behind it.",
    metaTitle: "Trade Process",
    metaDescription:
      "How BGEXIM works: Understand → Source → Verify → Structure → Execute → Complete. Quality verification, global presence and partnerships.",
  },
  partner: {
    eyebrow: "Partner With Us",
    title: "Buy, sell or partner with us.",
    description:
      "BGEXIM welcomes long-term relationships with genuine buyers, reliable suppliers and experienced strategic business partners.",
    metaTitle: "Partner With Us",
    metaDescription:
      "Register as a buyer or supplier with BOSS Global EXIM, or become a strategic business partner — logistics, warehousing, inspection, finance or representation.",
  },
  group: {
    eyebrow: "BOSS Group",
    title: "Backed by a diversified group.",
    description:
      "BGEXIM is part of the wider BOSS Group — a diversified business ecosystem with interests in logistics, retail, construction, hospitality, IT, BPO and business services.",
    metaTitle: "BOSS Group",
    metaDescription:
      "The BOSS Group: BOSS Container Line (NVOCC, freight forwarding, trading, break bulk), BOSS Retail, BOSS Constructions, BOSS Hospitality, BOSS IT and BOSS BPO.",
  },
  media: {
    eyebrow: "Media & Events",
    title: "Our business journey, in pictures.",
    description:
      "Real photographs of the people, places, products and partnerships behind BGEXIM — a growing record of our market development and international trade.",
    metaTitle: "Media & Events",
    metaDescription:
      "BGEXIM media and events: leadership, business meetings, supplier visits, trade events, international business and BOSS Group activities.",
  },
  resources: {
    eyebrow: "Resources",
    title: "Corporate & product information.",
    description: "Useful corporate and product information for buyers, suppliers and business partners.",
    metaTitle: "Resources",
    metaDescription: "BGEXIM corporate brochure, BOSS Group brochure and product specifications on request.",
  },
  faq: {
    eyebrow: "FAQ",
    title: "Answers for buyers, suppliers and partners.",
    description: "Search our most common questions — or ask Aira, our assistant, who answers from the same list.",
    metaTitle: "Frequently Asked Questions",
    metaDescription:
      "Answers about BOSS Global EXIM's export and import products, markets, trade process, quality checks, pricing and partnerships.",
  },
  contact: {
    eyebrow: "Contact Us",
    title: "Let's talk trade.",
    description:
      "BGEXIM welcomes enquiries from buyers, suppliers and strategic business partners interested in genuine international trade opportunities.",
    metaTitle: "Contact Us",
    metaDescription:
      "Contact BOSS Global EXIM, BOSS Towers, Madhapur, Hyderabad — general enquiries, buyer enquiries, supplier enquiries and business partnerships.",
  },
};
