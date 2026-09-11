/** Trade Process page content. DRAFT copy — confirm with the client before launch. */
import type { FeatureSection, ProcessContent, SectionContent } from "@/types/content";

export const howWeWork: ProcessContent = {
  stepLabel: "Step",
  heading: {
    eyebrow: "How We Work",
    title: "From enquiry to delivery, in six clear steps.",
    description: "The same disciplined process applies to every export and import contract.",
  },
  steps: [
    {
      title: "Enquiry",
      description:
        "Tell us the product, specification, quantity, packing and destination — our trade desk takes it from there.",
      icon: "messages-square",
    },
    {
      title: "Offer & samples",
      description: "We come back with a priced offer matched to your requirement, with samples where needed.",
      icon: "file-text",
    },
    {
      title: "Contract",
      description: "Price, specification, terms and shipment schedule are confirmed in a written contract.",
      icon: "handshake",
    },
    {
      title: "Sourcing & quality",
      description: "Goods are procured from qualified producers and checked against the agreed specification.",
      icon: "search-check",
    },
    {
      title: "Documentation",
      description: "Export, import and compliance documents are prepared so cargo clears smoothly at both ends.",
      icon: "clipboard-check",
    },
    {
      title: "Shipment & delivery",
      description:
        "Shipping is coordinated with the group's logistics arm, BOSS Container Line, and followed through to delivery.",
      icon: "ship",
    },
  ],
};

export const qualityVerification: FeatureSection = {
  heading: {
    eyebrow: "Quality & Verification",
    title: "Quality agreed upfront. Verified before dispatch.",
    description: "Every consignment is measured against the specification in the contract.",
  },
  items: [
    {
      title: "Agreed specifications",
      description: "Grade, quality parameters, packing and tolerances are fixed in writing before sourcing begins.",
      icon: "ruler",
    },
    {
      title: "Qualified suppliers",
      description: "We source from producers and suppliers assessed for quality and consistency.",
      icon: "users",
    },
    {
      title: "Pre-shipment checks",
      description: "Lots are inspected against the contract specification before dispatch.",
      icon: "scan-search",
    },
    {
      title: "Independent inspection",
      description: "Third-party inspection agencies can be appointed at the buyer's request.",
      icon: "microscope",
    },
    {
      title: "Complete documentation",
      description: "Commercial, regulatory and origin documents prepared for customs clearance.",
      icon: "clipboard-check",
    },
    {
      title: "Shipment visibility",
      description: "Status updates shared from dispatch through to arrival.",
      icon: "radar",
    },
  ],
};

export const globalPresence: { heading: SectionContent } = {
  heading: {
    eyebrow: "Our Global Presence",
    title: "From India to the world.",
    description:
      "Where each of our export lines ships today — with polymers and metal scrap sourced internationally for Indian industry.",
  },
};

/** Labels for the interactive trade-route map. */
export const tradeLanes = {
  eyebrow: "Trade lanes",
  outbound: "Outbound · From India",
  inbound: "Inbound · To India",
  legend: { export: "Exports", import: "Imports" },
  inboundDestination: "India",
};
