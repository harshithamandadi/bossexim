/** About Us page content — from the client's About documents. */
import type { ComplianceItem, Feature, ProseContent, SectionContent, Statement } from "@/types/content";

/** The corporate video on the About page; hidden until a link is added in the admin. */
export const corporateVideo = {
  playLabel: "Play the corporate video",
};

export const aboutOverview: ProseContent = {
  heading: {
    eyebrow: "About BOSS Global EXIM",
    title: "Connecting Products, Markets and People",
  },
  paragraphs: [
    "BOSS Global EXIM Pvt. Ltd. (BGEXIM) is an international trading company. It was created to connect Indian products with global buyers and to source selected industrial products and recyclable materials from international markets for Indian customers.",
    "Our role is to identify genuine opportunities, study buyer requirements, find reliable suppliers, evaluate products, structure commercial terms and coordinate the trade process from enquiry to delivery. We aim to make international trading simple, organised and dependable for our business partners.",
    "Our current business focus includes agricultural products, polymers, industrial raw materials and ferrous and non-ferrous metals. However, BGEXIM is not limited to these products or to a fixed list of countries. We remain open to new opportunities where there is genuine demand, reliable supply, acceptable commercial value, logistics feasibility and regulatory compliance.",
    "Supported by established logistics capabilities, BGEXIM follows a disciplined approach built on transparency, quality verification, structured documentation, secured payment methods and long-term relationships.",
    "Our goal is simple: to connect products, markets and people through trusted international trade.",
  ],
};

export const visionMissionValues: {
  heading: SectionContent;
  statements: Statement[];
  values: Feature[];
} = {
  heading: {
    eyebrow: "Vision, Mission & Values",
    title: "The Values That Guide Every Transaction",
  },
  statements: [
    {
      label: "Vision",
      text: "To build a trusted global trading network that connects quality products, reliable suppliers and genuine buyers across international markets.",
    },
    {
      label: "Mission",
      text: "To simplify international trade through reliable sourcing, transparent commercial practices, structured transactions, quality verification and dependable supply-chain coordination.",
    },
  ],
  values: [
    { title: "Integrity", description: "Dealing honestly and transparently with business partners.", icon: "scale" },
    { title: "Reliability", description: "Working to meet agreed commitments.", icon: "shield-check" },
    {
      title: "Compliance",
      description: "Conducting trade through recognised legal, customs and banking channels.",
      icon: "file-text",
    },
    { title: "Quality", description: "Focusing on agreed specifications and appropriate verification.", icon: "badge-check" },
    {
      title: "Responsibility",
      description: "Evaluating commercial and operational risks before execution.",
      icon: "search-check",
    },
    {
      title: "Partnership",
      description: "Building long-term and repeat business relationships, not one-time transactions.",
      icon: "handshake",
    },
  ],
};

/** Leadership profiles are managed in the admin (Website content → Team / Leadership). */
export const leadership: { heading: SectionContent; emptyState: string; readProfile: string } = {
  heading: {
    eyebrow: "Our Team / Leadership",
    title: "The People Who Lead BGEXIM",
    description: "Leadership experience across shipping, logistics, construction, hospitality, retail and technology.",
  },
  emptyState: "Leadership profiles will be published here soon.",
  readProfile: "Read full profile",
};

/** The registrations we list; their numbers are entered in the admin (Settings → Company details). */
export const compliance: { heading: SectionContent; note: string; items: ComplianceItem[] } = {
  heading: {
    eyebrow: "Registrations, Certifications & Compliance",
    title: "Trade Built on Proper Registration",
    description:
      "BGEXIM believes that international trade should be supported by proper registration, documentation and regulatory compliance. The company maintains all applicable corporate, tax, customs and trade registrations required for its operations, as and when applicable and obtained.",
  },
  note: "Product-specific approvals, inspection reports, laboratory certificates, certificates of origin, phytosanitary certificates, quality documents and other statutory documents are arranged according to the product, origin, destination and transaction requirements.",
  items: [
    { key: "cin", code: "CIN", name: "Corporate Identity Number", issuer: "Ministry of Corporate Affairs" },
    { key: "pan", code: "PAN", name: "Permanent Account Number", issuer: "Income Tax Department" },
    { key: "gst", code: "GST", name: "Goods & Services Tax Identification Number", issuer: "GST Network" },
    { key: "iec", code: "IEC", name: "Importer-Exporter Code", issuer: "Directorate General of Foreign Trade" },
    { key: "rcmc", code: "RCMC", name: "Registration-cum-Membership Certificate", issuer: "Export Promotion Council" },
    { key: "iso", code: "ISO", name: "ISO Certification", issuer: "Accredited certification body" },
    { key: "adCode", code: "AD Code", name: "Authorised Dealer Code", issuer: "Authorised dealer bank, registered with Customs" },
  ],
};
