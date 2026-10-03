/** Page headers, SEO text and the home page's copy — from the client's page documents. */
import type { CallToAction, LinkItem, PageContent, SectionContent } from "@/types/content";
import { anchorHref, contactHref, routes, sectionIds } from "./routes";
import { siteConfig } from "./site";

const { company } = siteConfig;

export const homeContent: {
  hero: SectionContent & { highlight: string; primaryCta: LinkItem; secondaryCta: LinkItem };
  services: SectionContent & { cta: LinkItem };
  products: SectionContent & { cta: LinkItem; previous: string; next: string };
  world: SectionContent & { cta: LinkItem; legend: { core: string; network: string; worldwide: string } };
  process: SectionContent & { cta: LinkItem };
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
  services: {
    eyebrow: "What We Do",
    title: "Sourcing, Trading and Supply-Chain Coordination",
    description:
      "Merchant exporter, merchant importer and supply-chain solutions partner — with global sourcing behind every trade.",
    cta: { label: "Explore our business", href: routes.business },
  },
  products: {
    eyebrow: "Products",
    title: "From India to the World. From the World to Indian Industry",
    description:
      "Selected agricultural products for international buyers, and polymers and recyclable metals for Indian manufacturers and recyclers.",
    cta: { label: "View all products", href: routes.products },
    previous: "Previous products",
    next: "Next products",
  },
  world: {
    eyebrow: "Worldwide Trade",
    title: "Trading Without Borders",
    description:
      "From our base in India we serve buyers and suppliers worldwide — with core markets across the Middle East, Southeast Asia and Australia, and a logistics network reaching the Gulf, Africa, CIS countries, China and beyond.",
    cta: { label: "Explore our global presence", href: anchorHref(routes.tradeProcess, sectionIds.tradeProcess.presence) },
    legend: { core: "Core markets", network: "Logistics network", worldwide: "Worldwide, on request" },
  },
  process: {
    eyebrow: "How We Work",
    title: "Six Clear Steps, from Enquiry to Completion",
    description: "A disciplined process keeps every trade transparent and accountable.",
    cta: { label: "See how we work", href: anchorHref(routes.tradeProcess, sectionIds.tradeProcess.howWeWork) },
  },
};

export const closingCta: CallToAction = {
  title: "Ready to Trade Beyond Boundaries?",
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
    title: "Trusted International Trade",
    description:
      "BOSS Global EXIM Pvt. Ltd. is an international trading company — connecting products, markets and people through trusted, structured trade.",
    metaTitle: "About Us",
    metaDescription:
      "About BOSS Global EXIM Pvt. Ltd. (BGEXIM), an international trading company — vision, mission, values, leadership and registrations.",
  },
  business: {
    eyebrow: "Business",
    title: "Focused Today. Flexible for Tomorrow",
    description: "A flexible B2B trading model designed to connect reliable supply with genuine demand.",
    metaTitle: "Business",
    metaDescription:
      "BGEXIM's business model: global sourcing & trade facilitation, principal trading, structured / back-to-back trading and supply-chain coordination.",
  },
  products: {
    eyebrow: "Products",
    title: "Our Product Portfolio",
    description:
      "Agricultural products sourced from India for international buyers, and polymers and recyclable metals sourced internationally for Indian industry.",
    metaTitle: "Products",
    metaDescription:
      "Exports from India — rice, spices, dehydrated onion & garlic, pulses, dried chillies, groundnuts and jaggery. Imports — polymers, polyester chips and recyclable metals.",
  },
  tradeProcess: {
    eyebrow: "Trade Process",
    title: "Clear from Enquiry to Completion",
    description:
      "A structured trade process designed to reduce uncertainty and keep every transaction clear — with quality verification and a growing international network behind it.",
    metaTitle: "Trade Process",
    metaDescription:
      "How BGEXIM works: Understand → Source → Verify → Structure → Execute → Complete. Quality verification, global presence and partnerships.",
  },
  partner: {
    eyebrow: "Partner With Us",
    title: "Buy, Sell or Partner with Us",
    description:
      "BGEXIM welcomes long-term relationships with genuine buyers, reliable suppliers and experienced strategic business partners.",
    metaTitle: "Partner With Us",
    metaDescription:
      "Register as a buyer or supplier with BOSS Global EXIM, or become a strategic business partner — logistics, warehousing, inspection, finance or representation.",
  },
  group: {
    eyebrow: "BOSS Group",
    title: "BOSS Group",
    description:
      "A diversified business group founded in 2000, with operations across India and Australia in logistics, retail, construction, hospitality, IT and BPO.",
    metaTitle: "BOSS Group",
    metaDescription:
      "The BOSS Group: BOSS Container Line (NVOCC, freight forwarding, trading, break bulk), BOSS Retail, BOSS Constructions, BOSS Hospitality, BOSS IT and BOSS BPO.",
  },
  media: {
    eyebrow: "Media & Events",
    title: "Our Business Journey, in Pictures",
    description:
      "Real photographs of the people, places, products and partnerships behind BGEXIM — a growing record of our market development and international trade.",
    metaTitle: "Media & Events",
    metaDescription:
      "BGEXIM media and events: leadership, business meetings, supplier visits, trade events, international business and BOSS Group activities.",
  },
  resources: {
    eyebrow: "Resources",
    title: "Corporate & Product Information",
    description: "Useful corporate and product information for buyers, suppliers and business partners.",
    metaTitle: "Resources",
    metaDescription: "BGEXIM corporate brochure, BOSS Group brochure and product specifications on request.",
  },
  faq: {
    eyebrow: "FAQ",
    title: "Answers for Buyers, Suppliers and Partners",
    description: "Search our most common questions — or ask Aira, our assistant, who answers from the same list.",
    metaTitle: "Frequently Asked Questions",
    metaDescription:
      "Answers about BOSS Global EXIM's export and import products, markets, trade process, quality checks, pricing and partnerships.",
  },
  contact: {
    eyebrow: "Contact Us",
    title: "Let's Talk Trade",
    description:
      "BGEXIM welcomes enquiries from buyers, suppliers and strategic business partners interested in genuine international trade opportunities.",
    metaTitle: "Contact Us",
    metaDescription:
      "Contact BOSS Global EXIM, BOSS Towers, Madhapur, Hyderabad — general enquiries, buyer enquiries, supplier enquiries and business partnerships.",
  },
};
