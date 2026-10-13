/** Page headers, SEO text and the home page's copy — from the client's page documents. */
import type { CallToAction, LinkItem, PageContent, SectionContent } from "@/types/content";
import { anchorHref, contactHref, routes, sectionIds } from "./routes";
import { siteConfig } from "./site";

const { company } = siteConfig;

export const homeContent: {
  hero: SectionContent & { highlight: string; primaryCta: LinkItem; secondaryCta: LinkItem };
  services: SectionContent & { cta: LinkItem };
  products: SectionContent & { cta: LinkItem; previous: string; next: string; viewRow: string };
  world: SectionContent & { cta: LinkItem; legend: string };
  process: SectionContent & { cta: LinkItem };
} = {
  hero: {
    eyebrow: company.focus,
    title: company.tagline,
    highlight: "Boundaries",
    description: company.summary,
    primaryCta: { label: "Explore products", href: routes.products },
    secondaryCta: { label: "Buy, sell or partner", href: routes.partner },
  },
  services: {
    eyebrow: "What We Do",
    title: "Sourcing, Trading and Supply-Chain Coordination",
    description:
      "We work with a simple approach: understand the requirement, identify suitable sources, verify commercial and quality details, structure the transaction, coordinate documentation and logistics, and complete the trade in a transparent manner.",
    cta: { label: "Explore our business", href: routes.business },
  },
  products: {
    eyebrow: "Products",
    title: "From India to the World. From the World to Indian Industry",
    description:
      "Rice, spices, pulses, fresh produce, seafood and manufactured products for international buyers — and polymers, metal scrap and specialised materials for Indian industry.",
    cta: { label: "View all products", href: routes.products },
    previous: "Previous products",
    next: "Next products",
    viewRow: "See all",
  },
  world: {
    eyebrow: "Worldwide Trade",
    title: company.tagline,
    description:
      "From our corporate base in India we serve buyers and suppliers worldwide — with core trade markets in Singapore, Malaysia, Australia, the UAE, Thailand, Saudi Arabia and Indonesia, and a wider network across the Gulf, Red Sea and Africa, CIS markets and beyond.",
    cta: { label: "Explore our global presence", href: anchorHref(routes.tradeProcess, sectionIds.tradeProcess.presence) },
    legend: "Trade lanes from India — core markets, network and worldwide on request",
  },
  process: {
    eyebrow: "How We Work",
    title: "Six Clear Steps, from Enquiry to Completion",
    description: "A disciplined process keeps every trade transparent and accountable.",
    cta: { label: "See how we work", href: anchorHref(routes.tradeProcess, sectionIds.tradeProcess.howWeWork) },
  },
};

export const closingCta: CallToAction = {
  // The approved tagline, word for word (client request: use it consistently).
  title: company.tagline,
  description:
    "Have a genuine business opportunity? Explore international trade with BOSS EXIM — we invite you to buy, sell or partner with us.",
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
    description: "Our goal is simple: to connect products, markets and people through trusted international trade.",
    metaTitle: "About Us",
    metaDescription:
      "About BOSS EXIM (Global) Pvt. Ltd., the international trading arm of the BOSS Group — vision, mission, values, our team and registrations.",
  },
  business: {
    eyebrow: "Business",
    title: "Focused Today. Flexible for Tomorrow",
    description: "A flexible B2B trading model designed to connect reliable supply with genuine demand.",
    metaTitle: "Business",
    metaDescription:
      "BOSS EXIM's business model: global sourcing & trade facilitation, principal trading, structured / back-to-back trading and supply-chain coordination.",
  },
  products: {
    eyebrow: "Products",
    title: "Our Product Portfolio",
    description:
      "Exports from India and imports into India — a flexible, market-driven portfolio, with each opportunity evaluated on its requirements and commercial feasibility.",
    metaTitle: "Products",
    metaDescription:
      "Exports from India — rice, spices, pulses, vegetables, fruits, dehydrated products, seafood, manufactured products, A2 ghee, jaggery and groundnuts. Imports — polymers, metal scrap, foil rolls, medical bottles and plastic flakes.",
  },
  tradeProcess: {
    eyebrow: "Trade Process",
    title: "Clear from Enquiry to Completion",
    description:
      "A structured trade process designed to reduce uncertainty and keep every transaction clear — with quality verification and a growing international network behind it.",
    metaTitle: "Trade Process",
    metaDescription:
      "How BOSS EXIM works: Understand → Source → Verify → Structure → Execute → Complete. Quality verification, global presence and partnerships.",
  },
  partner: {
    eyebrow: "Partner With Us",
    title: "Buy, Sell or Partner with Us",
    description:
      "BOSS EXIM welcomes long-term relationships with genuine buyers, reliable suppliers and experienced strategic partners.",
    metaTitle: "Partner With Us",
    metaDescription:
      "Register as a buyer or supplier with BOSS EXIM, or become a strategic business partner — logistics, warehousing, inspection, finance or representation.",
  },
  group: {
    eyebrow: "BOSS Group",
    title: "BOSS Group",
    description:
      "A diversified business ecosystem across India and Australia — logistics, retail, construction, hospitality, laundromats, IT, BPO and business services.",
    metaTitle: "BOSS Group",
    metaDescription:
      "The BOSS Group: BOSS Container Line (NVOCC, freight forwarding, trading, break bulk, project cargo, warehousing & 3PL), Retail, Constructions, Hospitality, Laundromats, IT and BPO.",
  },
  media: {
    eyebrow: "Media & Events",
    title: "Our Journey, in Pictures",
    description:
      "BOSS Group’s journey, achievements, partnerships and participation across business and community platforms.",
    metaTitle: "Media & Events",
    metaDescription:
      "BOSS Group media and events: leadership interactions, business meetings, industry events, partner engagements, community initiatives and media coverage.",
  },
  resources: {
    eyebrow: "Resources",
    title: "Corporate & Product Information",
    description: "Useful corporate and product information for buyers, suppliers and business partners.",
    metaTitle: "Resources",
    metaDescription: "BOSS Group video, the BOSS EXIM corporate brochure and product specifications on request.",
  },
  faq: {
    eyebrow: "FAQ",
    title: "Answers for Buyers, Suppliers and Partners",
    description: "Search our most common questions — or ask Aira, our assistant, who answers from the same list.",
    metaTitle: "Frequently Asked Questions",
    metaDescription:
      "Answers about BOSS EXIM's export and import products, markets, trade process, quality checks, pricing and partnerships.",
  },
  contact: {
    eyebrow: "Contact Us",
    title: "Let's Talk Trade",
    description:
      "BOSS EXIM welcomes enquiries from buyers, suppliers and strategic business partners interested in genuine international trade opportunities.",
    metaTitle: "Contact Us",
    metaDescription:
      "Contact BOSS EXIM, BOSS Towers, Madhapur, Hyderabad — general enquiries, buyer enquiries, supplier enquiries and business partnerships.",
  },
};
