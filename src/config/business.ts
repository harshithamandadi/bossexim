/** Business page content. DRAFT copy — confirm with the client before launch. */
import type { FeatureSection, SectionContent } from "@/types/content";

export const businessModel: { heading: SectionContent } = {
  heading: {
    eyebrow: "Our Business Model",
    title: "Buy right. Ship right. Deliver as one.",
    description:
      "As a merchant trader we take title to the goods we sell — so sourcing, compliance and delivery sit with a single, accountable team.",
  },
};

export const whyUs: FeatureSection = {
  heading: {
    eyebrow: "Why BOSS EXIM",
    title: "A trading partner you can rely on.",
    description: "What buyers, suppliers and partners gain by working with us.",
  },
  items: [
    {
      title: "Merchant trader model",
      description:
        "We buy and sell in our own name, so you contract, pay and resolve issues with one responsible company.",
      icon: "shield-check",
    },
    {
      title: "Group logistics strength",
      description: "Direct access to BOSS Container Line's NVOCC, freight-forwarding and break-bulk capability.",
      icon: "ship",
    },
    {
      title: "Two-way trade expertise",
      description: "Export and import desks under one roof, with insight into both sides of the supply chain.",
      icon: "arrow-left-right",
    },
    {
      title: "Quality you can verify",
      description: "Specifications agreed upfront and checked before dispatch, with independent inspection on request.",
      icon: "badge-check",
    },
    {
      title: "Compliance built in",
      description: "Trade conducted under our statutory registrations — including IEC, RCMC, GST and AD Code.",
      icon: "file-text",
    },
    {
      title: "A growing network",
      description: "Producers, buyers and overseas representatives across the Middle East, South-East Asia and Australia.",
      icon: "network",
    },
  ],
};

export const currentFocus: { heading: SectionContent; labels: { exports: string; markets: string; imports: string } } = {
  heading: {
    eyebrow: "Our Current Focus",
    title: "Where our trade desk is focused today.",
    description:
      "Indian agri-commodities for buyers across the Middle East, South-East Asia and Australia — and polymers and metal scrap for Indian industry.",
  },
  labels: { exports: "We export", markets: "To", imports: "We import" },
};

export const beyondFocus: FeatureSection = {
  heading: {
    eyebrow: "Beyond Our Current Focus",
    title: "Ready for what's next.",
    description: "Our current lines are where we start, not where we stop. We welcome enquiries in these areas.",
  },
  items: [
    {
      title: "More agri & food commodities",
      description: "Sourcing additional Indian agri and food products on buyer request.",
      icon: "sparkles",
    },
    {
      title: "New destination markets",
      description: "Serving buyers beyond our current markets, supported by overseas representatives.",
      icon: "compass",
    },
    {
      title: "Additional industrial inputs",
      description: "Extending our import desk to further raw materials for Indian manufacturers.",
      icon: "boxes",
    },
    {
      title: "Custom sourcing projects",
      description: "Dedicated sourcing for specific specifications, volumes and schedules.",
      icon: "target",
    },
  ],
};
