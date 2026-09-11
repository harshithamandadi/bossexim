/** About Us page content. DRAFT copy — confirm with the client before launch. */
import type {
  ComplianceItem,
  Feature,
  LinkItem,
  SectionContent,
  Statement,
  TeamMember,
} from "@/types/content";
import { routes } from "./routes";

export const aboutOverview: { heading: SectionContent; paragraphs: string[] } = {
  heading: {
    eyebrow: "About BOSS EXIM",
    title: "An Indian trading house, built for cross-border trade.",
  },
  paragraphs: [
    "BOSS Global EXIM Pvt. Ltd is a global trading company and part of the BOSS Group. We work as a merchant exporter and merchant importer — buying, selling and shipping goods across borders in our own name — and add supply chain solutions so our partners deal with one team from sourcing to delivery.",
    "On the export side, we connect Indian agriculture with buyers in the Middle East, South-East Asia and Australia. On the import side, we source polymers and metal scrap internationally for manufacturers and recyclers in India.",
  ],
};

export const aboutGroup: { heading: SectionContent; cta: LinkItem } = {
  heading: {
    eyebrow: "About BOSS Group",
    title: "Backed by a diversified group.",
    description:
      "BOSS Global EXIM is part of the BOSS Group, whose businesses span shipping and logistics, retail, construction, hospitality, IT and BPO. Its shipping arm, BOSS Container Line, gives our trade desk direct access to NVOCC and freight-forwarding capability.",
  },
  cta: { label: "Explore the BOSS Group", href: routes.group },
};

export const visionMissionValues: {
  heading: SectionContent;
  statements: Statement[];
  values: Feature[];
} = {
  heading: {
    eyebrow: "Vision, Mission & Values",
    title: "What guides every contract we sign.",
  },
  statements: [
    {
      label: "Vision",
      text: "To be a trusted global trading house that carries the best of India to the world — and brings the world's resources to Indian industry.",
    },
    {
      label: "Mission",
      text: "To trade with integrity, deliver consistent quality and make cross-border supply simple for every buyer, supplier and partner we work with.",
    },
  ],
  values: [
    { title: "Integrity", description: "Honest pricing, clear terms and commitments we keep.", icon: "scale" },
    { title: "Quality first", description: "Every consignment matched to the agreed specification.", icon: "badge-check" },
    { title: "Accountability", description: "One responsible partner from contract to delivery.", icon: "shield-check" },
    { title: "Compliance", description: "Trade conducted under full statutory registration.", icon: "file-text" },
    { title: "Partnership", description: "Relationships built to last beyond a single shipment.", icon: "handshake" },
  ],
};

export const leadership: { heading: SectionContent; members: TeamMember[]; emptyState: string } = {
  heading: {
    eyebrow: "Our Team / Leadership",
    title: "The people behind BOSS EXIM.",
    description: "Experienced leadership across trade, sourcing and logistics.",
  },
  /**
   * Add leaders here, e.g.
   * { name: "Full Name", role: "Managing Director", bio: "Short profile…", photo: "/team/name.jpg" },
   */
  members: [],
  emptyState: "Leadership profiles will be published here soon.",
};

export const compliance: { heading: SectionContent; items: ComplianceItem[] } = {
  heading: {
    eyebrow: "Registrations, Certifications & Compliance",
    title: "The registrations we trade under.",
    description:
      "Our statutory registrations and certifications. Registration numbers will be listed here once verified.",
  },
  items: [
    { code: "CIN", name: "Corporate Identity Number", issuer: "Ministry of Corporate Affairs", value: undefined },
    { code: "PAN", name: "Permanent Account Number", issuer: "Income Tax Department", value: undefined },
    { code: "GST", name: "Goods & Services Tax Identification Number", issuer: "GST Network", value: undefined },
    { code: "IEC", name: "Importer-Exporter Code", issuer: "Directorate General of Foreign Trade", value: undefined },
    { code: "RCMC", name: "Registration-cum-Membership Certificate", issuer: "Export Promotion Council", value: undefined },
    { code: "ISO", name: "ISO Certification", issuer: "Accredited certification body", value: undefined },
    { code: "AD Code", name: "Authorised Dealer Code", issuer: "Authorised dealer bank, registered with Customs", value: undefined },
  ],
};
