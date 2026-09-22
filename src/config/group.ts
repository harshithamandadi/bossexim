/** BOSS Group page content. DRAFT descriptions — confirm with the client before launch. */
import type { Feature, SectionContent } from "@/types/content";

export const containerLine: { heading: SectionContent; services: Feature[] } = {
  heading: {
    eyebrow: "BOSS Group · Shipping",
    title: "BOSS Container Line",
    description: "The group's shipping and logistics business — and the backbone of our supply chain solutions.",
  },
  services: [
    {
      title: "NVOCC",
      description: "Ocean transport under its own bills of lading, without operating vessels.",
      icon: "container",
    },
    {
      title: "Freight Forwarding",
      description: "Booking, routing and documentation for cargo across carriers.",
      icon: "route",
    },
    {
      title: "Trading",
      description: "Trading operations alongside the group's shipping services.",
      icon: "arrow-left-right",
    },
    {
      title: "Break Bulk",
      description: "Handling for cargo that moves outside standard containers.",
      icon: "anchor",
    },
  ],
};

/** Headings for the BOSS Group page; the companies and galleries are managed in the admin. */
export const groupCompanies: { heading: SectionContent; currentLabel: string } = {
  heading: {
    eyebrow: "Group Companies",
    title: "One group. Many strengths.",
    description: "BOSS Global EXIM works alongside the group's shipping line and its other businesses.",
  },
  currentLabel: "You are here",
};

export const mediaEvents: { heading: SectionContent; emptyLabel: string } = {
  heading: {
    eyebrow: "Media & Events",
    title: "Moments from the road.",
    description: "Leadership, business meetings, supplier visits, trade events, conferences and group activities.",
  },
  emptyLabel: "Photos coming soon",
};
