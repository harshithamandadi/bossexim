/** BOSS Group page content. DRAFT descriptions — confirm with the client before launch. */
import type { Feature, Gallery, GroupCompany, SectionContent } from "@/types/content";

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

export const groupCompanies: { heading: SectionContent; items: GroupCompany[]; currentLabel: string } = {
  heading: {
    eyebrow: "Group Companies",
    title: "One group. Many strengths.",
    description: "BOSS Global EXIM works alongside the group's shipping line and its other businesses.",
  },
  currentLabel: "You are here",
  items: [
    {
      name: "BOSS Global EXIM",
      description: "International trading — merchant export & import.",
      icon: "globe",
      isCurrent: true,
    },
    {
      name: "BOSS Container Line",
      description: "Shipping & logistics — NVOCC, freight forwarding, trading & break bulk.",
      icon: "ship",
    },
    { name: "BOSS Retail", description: "Retail and consumer business.", icon: "store" },
    { name: "BOSS Constructions", description: "Construction and projects.", icon: "building" },
    { name: "BOSS Hospitality", description: "Hospitality services.", icon: "hotel" },
    { name: "BOSS IT", description: "Information technology services.", icon: "cpu" },
    { name: "BOSS BPO", description: "Business process outsourcing.", icon: "headset" },
  ],
};

export const mediaEvents: { heading: SectionContent; galleries: Gallery[]; emptyLabel: string } = {
  heading: {
    eyebrow: "Media & Events",
    title: "Moments from the road.",
    description: "Leadership, business meetings, supplier visits, trade events, conferences and group activities.",
  },
  emptyLabel: "Photos coming soon",
  /** Add photos under /public/media and list them, e.g. images: [{ src: "/media/expo-1.jpg", alt: "…" }] */
  galleries: [
    { title: "Leadership", icon: "user-round", images: [] },
    { title: "Business Meetings", icon: "briefcase", images: [] },
    { title: "Supplier Visits", icon: "factory", images: [] },
    { title: "Trade Events", icon: "presentation", images: [] },
    { title: "Conferences", icon: "mic", images: [] },
    { title: "Group Activities", icon: "party-popper", images: [] },
  ],
};
