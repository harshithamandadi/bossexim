/** BOSS Group page content — from the client's BOSS Group documents. */
import type { Feature, ProseContent, SectionContent } from "@/types/content";

export const groupIntro: ProseContent = {
  heading: {
    eyebrow: "BOSS Group",
    title: "The strength and range behind BGEXIM.",
  },
  paragraphs: [
    "BGEXIM is part of the wider BOSS Group, a diversified business ecosystem with activities across India and Australia. The Group’s interests span logistics, retail, construction, hospitality, IT, BPO and business services.",
    "For BGEXIM, the most direct strategic support comes from BOSS Container Line and the wider logistics network. The Group’s diversified background gives BGEXIM access to practical business knowledge, international relationships and operational capability across multiple sectors and markets.",
  ],
};

export const containerLine: { heading: SectionContent; paragraphs: string[]; motto: string; services: Feature[] } = {
  heading: {
    eyebrow: "BOSS Group · Shipping & logistics",
    title: "BOSS Container Line",
    description:
      "The shipping and logistics vertical within the wider BOSS Group — integrated logistics solutions through NVOCC services, freight forwarding, container trading, break bulk cargo handling and related supply-chain support.",
  },
  paragraphs: [
    "Its operations are supported by offices in key locations and a wider network of international carrier and agent relationships — coordinating container movement, ocean freight, customs-related support, documentation, tracking and destination logistics across multiple markets.",
    "For BGEXIM, this logistics capability is an important strategic advantage: access to an experienced logistics ecosystem allows us to structure transactions with a clearer understanding of freight, routing and operational requirements.",
  ],
  motto: "BOSS Container Line supports the movement behind international trade.",
  services: [
    {
      title: "NVOCC",
      description:
        "Reliable, cost-effective container movement across selected trade routes — booking coordination, container planning, documentation, routing support and shipment follow-up, without operating its own vessel fleet.",
      icon: "container",
    },
    {
      title: "Freight Forwarding",
      description:
        "Coordinated cargo movement from origin to destination — ocean freight, multimodal transport, documentation, customs-related coordination and door-to-door movement.",
      icon: "route",
    },
    {
      title: "Trading",
      description:
        "Buying, selling and leasing shipping containers and related equipment — standard and customised containers, subject to availability, condition and commercial terms.",
      icon: "arrow-left-right",
    },
    {
      title: "Break Bulk",
      description:
        "Oversized, heavy or irregular cargo such as machinery, steel and construction equipment — with cargo-specific planning for loading, lifting, securing, vessel space and port handling.",
      icon: "anchor",
    },
    {
      title: "Project Cargo",
      description: "Planned movement of industrial equipment and project shipments. Details to be confirmed.",
      icon: "boxes",
    },
    {
      title: "Warehouse",
      description: "Storage and handling support within the wider logistics network. Details to be confirmed.",
      icon: "warehouse",
    },
  ],
};

/** Headings for the group companies; the companies themselves are managed in the admin. */
export const groupCompanies: { heading: SectionContent; currentLabel: string } = {
  heading: {
    eyebrow: "Group Companies",
    title: "One group. Many strengths.",
    description:
      "Experience in customer service, project execution, hospitality, technology and business operations — across India and international markets.",
  },
  currentLabel: "You are here",
};

/** Headings for the Media & Events page; the galleries are managed in the admin. */
export const mediaEvents: { heading: SectionContent; emptyLabel: string; note: string } = {
  heading: {
    eyebrow: "Media & Events",
    title: "Real people. Real business.",
    description:
      "Leadership, business meetings, supplier visits, factory inspections, trade events, conferences, international business visits and BOSS Group activities.",
  },
  emptyLabel: "Photos coming soon",
  note: "Every image here shows genuine people, locations, products or business activity — real BGEXIM and BOSS photographs, not stock images.",
};
