/**
 * Frequently asked questions. Answers that list products, markets or group
 * companies are generated from the other config files, so they never go stale.
 */
import { activeMarkets, exportProducts, importProducts } from "@/lib/catalogue";
import { formatList } from "@/lib/format";
import type { FaqItem, SectionContent } from "@/types/content";
import { groupCompanies } from "./group";
import { partnerContent } from "./partners";

const names = (items: { name: string }[]) => formatList(items.map((item) => item.name));
const strategicAudiences = partnerContent.tracks.find((track) => track.featured)?.audiences ?? [];
const otherGroupCompanies = groupCompanies.items.filter((company) => !company.isCurrent);

export const faqContent: { heading: SectionContent; items: FaqItem[] } = {
  heading: {
    eyebrow: "FAQ",
    title: "Questions, answered.",
    description: "Can't find what you're looking for? Send us an enquiry and our trade desk will help.",
  },
  items: [
    {
      question: "What does BOSS Global EXIM do?",
      answer:
        "We are a global trading company working as a merchant exporter, merchant importer and supply chain solutions partner. We export Indian agri-commodities and import industrial raw materials for Indian industry.",
    },
    {
      question: "Which products do you export?",
      answer: `We currently export ${names(exportProducts)}. Each product page lists the markets it ships to.`,
    },
    {
      question: "Which markets do you supply?",
      answer: `Our export lines currently ship to ${names(activeMarkets)}. We also welcome enquiries from buyers in other markets.`,
    },
    {
      question: "What do you import into India?",
      answer: `We import ${names(importProducts)} for manufacturers and recyclers in India.`,
    },
    {
      question: "How do I register as a buyer or supplier?",
      answer:
        "Visit Partner With Us, or send a Buyer or Supplier enquiry from the Contact page. Our trade desk will follow up with next steps.",
    },
    {
      question: "Who can become a Strategic Business Partner?",
      answer: `We work with ${formatList(strategicAudiences.map((audience) => audience.toLowerCase()))} as strategic business partners.`,
    },
    {
      question: "How is BOSS Global EXIM connected to the BOSS Group?",
      answer: `BOSS Global EXIM is one of the BOSS Group's businesses, alongside ${names(otherGroupCompanies)}.`,
    },
    {
      question: "Where can I get product specifications?",
      answer:
        "Specification sheets will be available under Resources. In the meantime, request them with a Buyer enquiry and we'll share them directly.",
    },
  ],
};
