/**
 * Frequently asked questions — shown on the FAQ page, in FAQ sections and in the
 * chatbot. Answers that list products, markets, steps or companies are generated
 * from the other config files, so they never go stale.
 *
 *  • category  groups questions (and orders the groups by first appearance).
 *  • keywords  are extra words visitors might type; they help the chatbot match.
 *  • action    is an optional next step shown under the answer.
 */
import { activeMarkets, exportProducts, importProducts } from "@/lib/catalogue";
import { formatList } from "@/lib/format";
import type { FaqItem, SectionContent } from "@/types/content";
import { enquiryTypes } from "./contact";
import { containerLine, groupCompanies } from "./group";
import { partnerContent } from "./partners";
import { howWeWork, qualityVerification } from "./process";
import { anchorHref, contactHref, productsViewHref, routes, sectionIds } from "./routes";
import { siteConfig } from "./site";

const CATEGORY = {
  company: "About us",
  catalogue: "Products & markets",
  trading: "Working with us",
} as const;

const names = (items: { name: string }[]) => formatList(items.map((item) => item.name));
const lowerFirst = (text: string) => text.charAt(0).toLowerCase() + text.slice(1);
const strategicAudiences = partnerContent.tracks.find((track) => track.featured)?.audiences ?? [];
const otherGroupCompanies = groupCompanies.items.filter((company) => !company.isCurrent);
const { email } = siteConfig.contact;

export const faqContent: { heading: SectionContent; items: FaqItem[] } = {
  heading: {
    eyebrow: "FAQ",
    title: "Questions, answered.",
    description: "Can't find what you're looking for? Send us an enquiry and our trade desk will help.",
  },
  items: [
    {
      category: CATEGORY.company,
      question: "What does BOSS Global EXIM do?",
      answer:
        "We are a global trading company working as a merchant exporter, merchant importer and supply chain solutions partner. We export Indian agri-commodities and import industrial raw materials for Indian industry.",
      keywords: ["about", "company", "business", "merchant", "trading", "who", "services"],
      action: { label: "About us", href: routes.about },
    },
    {
      category: CATEGORY.catalogue,
      question: "Which products do you export?",
      answer: `We currently export ${names(exportProducts)}. Each product page lists the markets it ships to.`,
      keywords: ["export", "sell", "agri", "agriculture", "commodities", "food", ...exportProducts.map((p) => p.name)],
      action: { label: "See export products", href: productsViewHref("export") },
    },
    {
      category: CATEGORY.catalogue,
      question: "Which markets do you supply?",
      answer: `Our export lines currently ship to ${names(activeMarkets)}. We also welcome enquiries from buyers in other markets.`,
      keywords: ["markets", "countries", "destinations", "regions", "ship", ...activeMarkets.flatMap((m) => [m.name, m.shortName])],
      action: {
        label: "See our trade lanes",
        href: anchorHref(routes.tradeProcess, sectionIds.tradeProcess.presence),
      },
    },
    {
      category: CATEGORY.catalogue,
      question: "What do you import into India?",
      answer: `We import ${names(importProducts)} for manufacturers and recyclers in India.`,
      keywords: ["import", "raw", "materials", "industrial", "scrap", "polymer", "metal", ...importProducts.map((p) => p.name)],
      action: { label: "See import products", href: productsViewHref("import") },
    },
    {
      category: CATEGORY.catalogue,
      question: "Where can I get product specifications?",
      answer:
        "Specification sheets will be available under Resources. In the meantime, request them with a Buyer enquiry and we'll share them directly.",
      keywords: ["specs", "specification", "sheet", "datasheet", "grade", "details", "hs", "code", "brochure"],
      action: { label: "Request specifications", href: contactHref({ type: "buyer" }) },
    },
    {
      category: CATEGORY.trading,
      question: "How do I get a price quote?",
      answer:
        "Prices depend on the product, grade, quantity, packing and destination. Send a Buyer enquiry with those details and our trade desk will come back with a quote.",
      keywords: ["price", "quote", "rate", "cost", "quantity", "moq", "minimum", "ton", "tonne", "volume", "packing", "offer"],
      action: { label: "Request a quote", href: contactHref({ type: "buyer" }) },
    },
    {
      category: CATEGORY.trading,
      question: "How does an order work, from enquiry to delivery?",
      answer: `Every trade follows ${howWeWork.steps.length} steps: ${formatList(howWeWork.steps.map((step) => step.title.toLowerCase()))}.`,
      keywords: ["process", "order", "steps", "procedure", "timeline", "lead", "time", "long", "shipment", "delivery", "contract", "samples"],
      action: {
        label: "See the trade process",
        href: anchorHref(routes.tradeProcess, sectionIds.tradeProcess.howWeWork),
      },
    },
    {
      category: CATEGORY.trading,
      question: "How do you check quality?",
      answer: `${qualityVerification.heading.title} Our checks cover ${formatList(qualityVerification.items.map((item) => item.title.toLowerCase()))}.`,
      keywords: ["quality", "inspection", "check", "verify", "testing", "standards", "certificate", "certification", "certified", "control"],
      action: {
        label: "Quality & verification",
        href: anchorHref(routes.tradeProcess, sectionIds.tradeProcess.quality),
      },
    },
    {
      category: CATEGORY.trading,
      question: "How do I register as a buyer or supplier?",
      answer:
        "Visit Partner With Us, or send a Buyer or Supplier enquiry from the Contact page. Our trade desk will follow up with next steps.",
      keywords: ["register", "registration", "become", "join", "vendor", "seller", "purchase", "onboard", "sign"],
      action: { label: "Partner with us", href: routes.partner },
    },
    {
      category: CATEGORY.trading,
      question: "Who can become a Strategic Business Partner?",
      answer: `We work with ${formatList(strategicAudiences.map((audience) => audience.toLowerCase()))} as strategic business partners.`,
      keywords: ["partner", "partnership", "collaborate", "agent", "distributor", "logistics", "warehousing", "finance"],
      action: {
        label: "Strategic partnerships",
        href: anchorHref(routes.partner, sectionIds.partner.strategic),
      },
    },
    {
      category: CATEGORY.trading,
      question: "How can I contact BOSS Global EXIM?",
      answer: `Send an enquiry from the Contact page — choose ${formatList(enquiryTypes.map((type) => type.shortLabel))} and our trade desk will respond.${email ? ` You can also email ${email}.` : ""}`,
      keywords: ["contact", "email", "phone", "call", "reach", "address", "office", "talk", "person", "team"],
      action: { label: "Send an enquiry", href: contactHref() },
    },
    {
      category: CATEGORY.company,
      question: "How is BOSS Global EXIM connected to the BOSS Group?",
      answer: `BOSS Global EXIM is one of the BOSS Group's businesses, alongside ${names(otherGroupCompanies)}.`,
      keywords: ["group", "parent", "sister", "companies", "owner", "own", "behind"],
      action: { label: "Explore the BOSS Group", href: routes.group },
    },
    {
      category: CATEGORY.company,
      question: `What is ${containerLine.heading.title}?`,
      answer: `${containerLine.heading.title} is ${lowerFirst(containerLine.heading.description ?? "")} Its services are ${formatList(containerLine.services.map((service) => service.title))}.`,
      keywords: ["shipping", "logistics", "freight", "nvocc", "container", "forwarding", "break", "bulk", "vessel"],
      action: {
        label: containerLine.heading.title,
        href: anchorHref(routes.group, sectionIds.group.containerLine),
      },
    },
  ],
};

/** Labels for the FAQ page's search and filters. */
export const faqPageLabels = {
  searchLabel: "Search the FAQs",
  searchPlaceholder: "Search, e.g. “price quote” or “which markets”",
  clearSearch: "Clear search",
  categoryFilter: "Filter by topic",
  allCategories: "All topics",
  result: "answer",
  results: "answers",
  for: "for",
  noResultsTitle: "No matching questions",
  noResultsDescription: "Our assistant may still help — or send the question straight to our trade desk.",
  askAssistant: "Ask the assistant",
  seeAll: "See all questions",
};

/** Category names in display order. */
export const faqCategories: string[] = [...new Set(faqContent.items.map((item) => item.category))];
