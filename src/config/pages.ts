/** Page headers, SEO text and the home page's section copy. DRAFT — confirm with the client. */
import type { CallToAction, LinkItem, PageContent, SectionContent } from "@/types/content";
import { contactHref, routes } from "./routes";
import { siteConfig } from "./site";

const { company } = siteConfig;

export const homeContent: {
  hero: SectionContent & { highlight: string; primaryCta: LinkItem; secondaryCta: LinkItem };
  services: SectionContent;
  products: SectionContent & { cta: LinkItem };
} = {
  hero: {
    eyebrow: company.focus,
    title: company.tagline,
    highlight: "Boundaries",
    description:
      "BOSS Global EXIM connects Indian agriculture with buyers across the Middle East, South-East Asia and Australia — and sources polymers and metal scrap for industry in India.",
    primaryCta: { label: "Explore products", href: routes.products },
    secondaryCta: { label: "Partner with us", href: routes.partner },
  },
  services: {
    eyebrow: "What we do",
    title: "Everything cross-border trade needs, under one roof.",
    description: company.summary,
  },
  products: {
    eyebrow: "Products",
    title: "Agri out of India. Industry into India.",
    description: "Staple agri-commodities for global buyers, and industrial raw materials for Indian manufacturers.",
    cta: { label: "View the full catalogue", href: routes.products },
  },
};

export const closingCta: CallToAction = {
  title: "Ready to trade beyond boundaries?",
  description: "Tell us what you need to buy, sell or ship — our trade desk will take it from there.",
  primary: { label: "Send an enquiry", href: contactHref() },
  secondary: { label: "Become a partner", href: routes.partner },
};

export type PageKey =
  | "about"
  | "business"
  | "products"
  | "tradeProcess"
  | "partner"
  | "group"
  | "resources"
  | "faq"
  | "contact";

export const pageContent: Record<PageKey, PageContent> = {
  about: {
    eyebrow: "About Us",
    title: "Rooted in India. Trading with the world.",
    description:
      "Who we are, the group behind us, what we stand for, the people who lead us and the registrations we trade under.",
    metaTitle: "About Us",
    metaDescription:
      "About BOSS Global EXIM Pvt. Ltd — a merchant exporter and importer of the BOSS Group. Vision, mission, values, leadership and registrations.",
  },
  business: {
    eyebrow: "Business",
    title: "Built for two-way trade.",
    description:
      "How we work as a merchant exporter, merchant importer and supply chain partner — and where we're focused today.",
    metaTitle: "Business",
    metaDescription:
      "BOSS Global EXIM's business model: merchant export, merchant import, supply chain solutions and global sourcing.",
  },
  products: {
    eyebrow: "Products",
    title: "Our product lines.",
    description: "Agri-commodity exports from India, and industrial raw material imports for Indian manufacturers.",
    metaTitle: "Products",
    metaDescription:
      "Export lines — rice, spices, dehydrated onion & garlic, pulses, dried chillies, groundnuts and jaggery. Import lines — polymers and metal scrap.",
  },
  tradeProcess: {
    eyebrow: "Trade Process",
    title: "Simple, transparent, end to end.",
    description:
      "How an enquiry becomes a delivered shipment, how we verify quality, and where our products travel.",
    metaTitle: "Trade Process",
    metaDescription:
      "How BOSS Global EXIM works — our six-step trade process, quality verification and global presence.",
  },
  partner: {
    eyebrow: "Partner With Us",
    title: "Grow with BOSS EXIM.",
    description: "Register as a buyer or supplier, or join our network as a strategic business partner.",
    metaTitle: "Partner With Us",
    metaDescription:
      "Register as a buyer or supplier with BOSS Global EXIM, or become a strategic business partner in logistics, warehousing, inspection, finance or representation.",
  },
  group: {
    eyebrow: "BOSS Group",
    title: "Part of something bigger.",
    description:
      "BOSS Global EXIM is part of the BOSS Group — with businesses spanning shipping, retail, construction, hospitality, IT and BPO.",
    metaTitle: "BOSS Group",
    metaDescription:
      "The BOSS Group: BOSS Container Line, BOSS Global EXIM, BOSS Retail, BOSS Constructions, BOSS Hospitality, BOSS IT and BOSS BPO.",
  },
  resources: {
    eyebrow: "Resources",
    title: "Brochures & specifications.",
    description: "Company and group brochures, plus specification sheets for our export and import lines.",
    metaTitle: "Resources",
    metaDescription: "Download the BGEXIM corporate brochure, the BOSS Group brochure and product specifications.",
  },
  faq: {
    eyebrow: "FAQ",
    title: "Answers for buyers, suppliers and partners.",
    description: "Search our most common questions — or ask our assistant, who answers from the same list.",
    metaTitle: "Frequently Asked Questions",
    metaDescription:
      "Answers about BOSS Global EXIM's export and import products, markets, trade process, quality checks, pricing and partnerships.",
  },
  contact: {
    eyebrow: "Contact Us",
    title: "Let's talk trade.",
    description: "General, buyer, supplier or partnership enquiries — tell us what you need and we'll respond.",
    metaTitle: "Contact Us",
    metaDescription:
      "Contact BOSS Global EXIM — general enquiries, buyer enquiries, supplier enquiries and business partnerships.",
  },
};
