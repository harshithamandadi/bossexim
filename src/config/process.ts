/** Trade Process page content — from the client's Trade Process documents. */
import type { FeatureSection, ProcessContent, ProseContent } from "@/types/content";

export const howWeWork: ProcessContent & { note: string } = {
  stepLabel: "Step",
  heading: {
    eyebrow: "How We Work",
    title: "Six Steps from Enquiry to Completion",
    description:
      "Every BGEXIM transaction begins with a clear understanding of the customer’s requirements. This process helps us maintain clarity, accountability and commercial discipline throughout the transaction.",
  },
  steps: [
    {
      title: "Understand",
      description:
        "We identify the product, grade, quantity, destination, timing, quality expectation and preferred commercial terms.",
      icon: "messages-square",
    },
    {
      title: "Source",
      description: "We study suitable sourcing options and identify suppliers who can meet the requirement.",
      icon: "search-check",
    },
    {
      title: "Verify",
      description:
        "Buyer and supplier information, product specifications and commercial details are reviewed before we move to the next stage.",
      icon: "badge-check",
    },
    {
      title: "Structure",
      description:
        "We structure pricing, Incoterms, payment terms, inspection, documentation and delivery responsibilities.",
      icon: "file-text",
    },
    {
      title: "Execute",
      description:
        "BGEXIM coordinates procurement, quality checks, documentation, banking arrangements, logistics and shipment.",
      icon: "ship",
    },
    {
      title: "Complete",
      description: "The transaction is monitored through delivery and payment closure.",
      icon: "handshake",
    },
  ],
  note: "Behind these six stages, our internal process includes more detailed controls for KYC, documentation, payment security, quality, shipping and transaction closure.",
};

export const qualityVerification: FeatureSection & { motto: string } = {
  heading: {
    eyebrow: "Quality & Verification",
    title: "Verify, Then Execute",
    description:
      "Product quality and business verification are essential parts of international trade. Depending on the product and transaction, we review buyer and supplier information, product specifications, available certificates, quality reports and commercial documentation before execution.",
  },
  items: [
    {
      title: "Manufactured Products",
      description: "For polymers and similar products, we may review the manufacturer CoA, TDS and technical data.",
      icon: "layers",
    },
    {
      title: "Agricultural Products",
      description: "Laboratory testing, phytosanitary documents, residue reports or other certificates may be required.",
      icon: "leaf",
    },
    {
      title: "Scrap & Metals",
      description:
        "Grade verification, weight checks, PSIC, radiation or contamination declarations and third-party inspection may be relevant.",
      icon: "recycle",
    },
    {
      title: "Independent Inspection",
      description: "Where necessary, independent surveyors, laboratories or inspection agencies can be involved.",
      icon: "microscope",
    },
    {
      title: "Transaction Documents",
      description: "We also review the shipping, insurance, customs and transaction documentation required for the trade.",
      icon: "clipboard-check",
    },
    {
      title: "Verified Parties",
      description: "Buyer and supplier information is reviewed before any trade is executed.",
      icon: "users",
    },
  ],
  motto: "Verify the product, verify the parties, verify the documents, then execute.",
};

export interface PresenceTier {
  title: string;
  description: string;
  places: string[];
}

export const globalPresence: ProseContent & {
  tiers: PresenceTier[];
  ports: { market: string; origin: string };
} = {
  /** Shown only once ports are entered in the admin (Markets, and Company details → Ports & video). */
  ports: { market: "Ports", origin: "Loading ports in India" },
  heading: {
    eyebrow: "Our Global Presence",
    title: "From Our Base in India to an International Network",
  },
  paragraphs: [
    "BGEXIM’s current core trade markets include India, Singapore, Malaysia, Australia, UAE, Thailand, Saudi Arabia and Indonesia. India is our corporate base and a key sourcing and destination market.",
    "We do not present every country as a BGEXIM office. Instead, we distinguish between our own corporate base, BOSS Group logistics presence, core trade markets and extended network capability — which allows us to support opportunities even where BGEXIM does not maintain a dedicated office.",
  ],
  tiers: [
    {
      title: "Corporate Base",
      description: "Our office, and a key sourcing and destination market.",
      places: ["Hyderabad, India"],
    },
    {
      title: "BOSS Group Logistics Presence",
      description: "BOSS Container Line offices in Singapore, Malaysia and four Indian port cities.",
      places: ["Singapore", "Klang, Malaysia", "Hyderabad", "Navi Mumbai", "Gandhidham", "Chennai"],
    },
    {
      title: "Core Trade Markets",
      description: "Where our trade is focused today.",
      places: ["India", "Singapore", "Malaysia", "Australia", "UAE", "Thailand", "Saudi Arabia", "Indonesia"],
    },
    {
      title: "Extended Network",
      description:
        "31 agency agreements in place through BOSS Container Line, with one more in progress — plus shipping relationships and logistics partners.",
      places: [
        "Indian Subcontinent",
        "Southeast Asia",
        "Middle East & Upper Gulf",
        "Red Sea & Africa",
        "CIS markets",
        "China, Maldives & Turkey",
      ],
    },
  ],
};

/** Labels for the interactive trade-route map. */
export const tradeLanes = {
  eyebrow: "Trade lanes",
  outbound: "Outbound · From India",
  inbound: "Inbound · To India",
  legend: { export: "Exports", import: "Imports" },
  inboundDestination: "India",
};
