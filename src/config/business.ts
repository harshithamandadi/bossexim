/** Business page content — from the client's Business documents. */
import type { Highlight, ProseContent } from "@/types/content";

export const businessModel: ProseContent & { models: Highlight[] } = {
  heading: {
    eyebrow: "Our Business Model",
    title: "A Flexible B2B Trading Model",
  },
  paragraphs: [
    "BOSS EXIM operates through a flexible B2B trading model designed to connect reliable supply with genuine demand. Our business model combines Global Sourcing & Trade Facilitation, Principal Trading, Structured / Back-to-Back Trading and Supply Chain Coordination.",
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
    eyebrow: "Why BOSS EXIM",
    title: "One Dependable Point of Contact",
  },
  paragraphs: [
    "BOSS EXIM combines international sourcing, market flexibility, structured transactions and access to established logistics capabilities. We work to understand both the buyer’s and the supplier’s requirements, and focus on long-term relationships with genuine buyers, reliable suppliers and strategic partners.",
    "BOSS EXIM does not depend on a single product or country. Our current portfolio gives us a clear starting point, while our broader business model allows us to evaluate additional opportunities when they meet our commercial, quality, logistics and regulatory requirements.",
    "For customers, this means one dependable point of contact for sourcing, trading, verification, documentation and supply-chain coordination.",
  ],
  strengths: [
    { title: "Access to Indian and International Markets", icon: "globe" },
    { title: "A Flexible Product Strategy", icon: "shapes" },
    { title: "Product and Supplier Verification", icon: "search-check" },
    { title: "Structured Documentation", icon: "file-text" },
    { title: "Secured Payment Methods", icon: "shield-check" },
    { title: "Logistics Support Through the BOSS Network", icon: "ship" },
  ],
};

export const currentFocus: ProseContent & { labels: { exports: string; markets: string; imports: string } } = {
  heading: {
    eyebrow: "Our Current Focus",
    title: "Two Clear Trade Directions",
  },
  paragraphs: [
    "BOSS EXIM’s current focus is on selected export and import opportunities supported by disciplined sourcing, quality control and logistics coordination. From India, our export portfolio includes rice, spices, pulses, dehydrated products, fresh produce, seafood, jaggery, groundnuts and selected manufactured products. For imports into India, we focus on polymers, recyclable ferrous and non-ferrous metals, aluminium foil rolls, clear medical bottles and recycled plastic flakes.",
    "Our present trade markets include India, Singapore, Malaysia, Australia, UAE, Thailand, Saudi Arabia and Indonesia. These categories and markets represent our current priorities, while BOSS EXIM remains flexible to pursue suitable opportunities based on customer demand and commercial feasibility.",
  ],
  labels: { exports: "We export", markets: "Core markets", imports: "We import" },
};

export const beyondFocus: ProseContent & { criteria: string[]; motto: string } = {
  heading: {
    eyebrow: "Beyond Our Current Focus",
    title: "Open to Genuine Opportunities",
  },
  paragraphs: [
    "BOSS EXIM is designed to remain flexible. While our current portfolio includes agricultural products, polymers and recyclable metals, we are not limited to these categories or to a fixed list of countries.",
    "We are open to evaluating new products and international markets when a genuine business opportunity is identified. Every new opportunity is considered based on buyer demand, supplier reliability, product quality, commercial viability, logistics feasibility, payment security and regulatory requirements.",
    "This allows BOSS EXIM to respond to changing market conditions without losing commercial discipline. If a verified buyer requires a product outside our current portfolio, our team can study the requirement, identify suitable sources, evaluate the transaction and proceed if it meets our internal standards. This gives customers access to a wider international sourcing and trading platform as our network continues to grow.",
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
