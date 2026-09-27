/** Business page content — from the client's Business documents. */
import type { Highlight, ProseContent } from "@/types/content";

export const businessModel: ProseContent & { models: Highlight[] } = {
  heading: {
    eyebrow: "Our Business Model",
    title: "A flexible B2B trading model.",
  },
  paragraphs: [
    "BGEXIM operates through a flexible B2B trading model designed to connect reliable supply with genuine demand.",
    "We begin by understanding the buyer’s requirements, including product, grade, quantity, destination, quality expectations and commercial terms. We also coordinate documentation, inspection and logistics through the wider BOSS ecosystem and external partners where required.",
    "Our public business model focuses on disciplined international trading. Internal commission structures, transaction margins and proprietary commercial arrangements remain confidential.",
  ],
  models: [
    { title: "Global Sourcing & Trade Facilitation", icon: "globe" },
    { title: "Principal Trading", icon: "handshake" },
    { title: "Structured / Back-to-Back Trading", icon: "arrow-left-right" },
    { title: "Supply Chain Coordination", icon: "route" },
  ],
};

export const whyUs: ProseContent & { strengths: Highlight[] } = {
  heading: {
    eyebrow: "Why BOSS Global EXIM",
    title: "One dependable point of contact.",
  },
  paragraphs: [
    "BGEXIM combines international sourcing, market flexibility, structured transactions and access to established logistics capabilities. We work to understand both the buyer’s and the supplier’s requirements, and focus on long-term relationships with genuine buyers, reliable suppliers and strategic partners.",
    "BGEXIM does not depend on a single product or country. Our current portfolio gives us a clear starting point, while our broader business model allows us to evaluate additional opportunities when they meet our commercial, quality, logistics and regulatory requirements.",
    "For customers, this means one dependable point of contact for sourcing, trading, verification, documentation and supply-chain coordination.",
  ],
  strengths: [
    { title: "Access to Indian and international markets", icon: "globe" },
    { title: "A flexible product strategy", icon: "shapes" },
    { title: "Product and supplier verification", icon: "search-check" },
    { title: "Structured documentation", icon: "file-text" },
    { title: "Secured payment methods", icon: "shield-check" },
    { title: "Logistics support through the BOSS network", icon: "ship" },
  ],
};

export const currentFocus: ProseContent & { labels: { exports: string; markets: string; imports: string } } = {
  heading: {
    eyebrow: "Our Current Focus",
    title: "Two clear trade directions.",
  },
  paragraphs: [
    "From India, we source and export selected agricultural products such as rice, spices, dehydrated onion and garlic, pulses, dried chillies, groundnuts and jaggery. For imports into India, our focus includes polymers, polyester chips and selected ferrous and non-ferrous recyclable metals.",
    "This focused approach allows us to develop product knowledge, supplier relationships and buyer networks in selected categories while maintaining disciplined transaction control. The current portfolio represents our starting point, not a permanent restriction on the products or markets in which BGEXIM can operate.",
  ],
  labels: { exports: "We export", markets: "Core markets", imports: "We import" },
};

export const beyondFocus: ProseContent & { criteria: string[]; motto: string } = {
  heading: {
    eyebrow: "Beyond Our Current Focus",
    title: "Open to genuine opportunities.",
  },
  paragraphs: [
    "BGEXIM is designed to remain flexible. While our current portfolio includes agricultural products, polymers and recyclable metals, we are not limited to these categories or to a fixed list of countries.",
    "This allows BGEXIM to respond to changing market conditions without losing commercial discipline. If a verified buyer requires a product outside our current portfolio, our team can study the requirement, identify suitable sources, evaluate the transaction and proceed if it meets our internal standards.",
  ],
  criteria: [
    "Buyer demand",
    "Supplier reliability",
    "Product quality",
    "Commercial viability",
    "Logistics feasibility",
    "Payment security",
    "Regulatory requirements",
  ],
  motto: "Focused Today & Flexible for Tomorrow.",
};
