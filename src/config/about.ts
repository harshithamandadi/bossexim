/** About Us page content — from the client's About documents. */
import type { ComplianceItem, Feature, ImageAsset, ProseContent, SectionContent, Statement } from "@/types/content";

export const aboutOverview: ProseContent = {
  heading: {
    eyebrow: "About BOSS EXIM Global",
    title: "Connecting Products, Markets and People",
  },
  paragraphs: [
    "BOSS EXIM (Global) Pvt. Ltd. is an international trading arm within the wider BOSS business ecosystem. BOSS EXIM is created to connect Indian products with global buyers and to source selected industrial products and recyclable materials from international markets for Indian customers.",
    "Our role is to identify genuine opportunities, study buyer requirements, find reliable suppliers, evaluate products, structure commercial terms and coordinate the trade process from enquiry to delivery. We aim to make international trading simple, organised and dependable for our business partners.",
    "Our current business focus includes agricultural products, polymers, industrial raw materials and ferrous and non-ferrous metals. However, BOSS EXIM is not limited to these products or to a fixed list of countries. We remain open to new opportunities where there is genuine demand, reliable supply, acceptable commercial value, logistics feasibility and regulatory compliance.",
    "Supported by the wider BOSS Group and its logistics capabilities, BOSS EXIM follows a disciplined approach built on transparency, quality verification, structured documentation, secured payment methods and long-term relationships.",
    "Our goal is simple: to connect products, markets and people through trusted international trade.",
  ],
};

export const visionMissionValues: {
  heading: SectionContent;
  statements: Statement[];
  intro: string;
  valuesImage: ImageAsset;
  values: Feature[];
} = {
  heading: {
    eyebrow: "Vision, Mission & Values",
    title: "The Values That Guide Every Transaction",
  },
  statements: [
    {
      label: "Vision",
      image: { src: "/images/about/vision.webp", alt: "Binoculars reflecting a world map — our vision", width: 277, height: 237 },
      text: "To build a trusted global trading network that connects quality products, reliable suppliers and genuine buyers across international markets.",
    },
    {
      label: "Mission",
      image: { src: "/images/about/mission.webp", alt: "A target with an arrow in the bullseye — our mission", width: 228, height: 278 },
      text: "To simplify international trade through reliable sourcing, transparent commercial practices, structured transactions, quality verification and dependable supply-chain coordination.",
    },
  ],
  valuesImage: {
    src: "/images/about/values-2026-11.webp",
    alt: "Our values: integrity, partnership, compliance, quality, responsibility and reliability",
    width: 1200,
    height: 1200,
  },
  intro: "Our values guide how we conduct every transaction and build lasting business relationships across international markets.",
  values: [
    { title: "Integrity", description: "We uphold honesty, transparency and ethical conduct in every business interaction.", icon: "scale" },
    { title: "Reliability", description: "We strive to honour our commitments and deliver on agreed terms and timelines.", icon: "shield-check" },
    {
      title: "Compliance",
      description: "We conduct international trade through recognised legal, customs and banking channels, in accordance with applicable regulations.",
      icon: "file-text",
    },
    { title: "Quality", description: "We focus on agreed product specifications, appropriate verification and consistent quality standards.", icon: "badge-check" },
    {
      title: "Responsibility",
      description: "We assess commercial, operational and compliance risks before proceeding with transactions.",
      icon: "search-check",
    },
    {
      title: "Partnership",
      description: "We build long-term, mutually beneficial relationships founded on trust, collaboration and repeat business rather than one-time transactions.",
      icon: "handshake",
    },
  ],
};

/** Leadership profiles are managed in the admin (Website content → Team / Leadership). */
export const leadership: { heading: SectionContent; emptyState: string; readProfile: string; showLess: string } = {
  heading: {
    eyebrow: "Our Team",
    title: "Meet Our Team",
    description:
      "BOSS EXIM’s operations team brings practical experience in international trade, sourcing, supplier coordination, commercial negotiation, quality verification, documentation, logistics and customer support. The team follows structured processes, clear communication and disciplined transaction control to manage opportunities efficiently, reduce operational risk and support reliable execution from enquiry through delivery.",
  },
  emptyState: "Leadership profiles will be published here soon.",
  readProfile: "Read full profile",
  showLess: "Show less",
};

/** The registrations we list; their numbers are entered in the admin (Settings → Company details). */
export const compliance: { heading: SectionContent; note: string; items: ComplianceItem[] } = {
  heading: {
    eyebrow: "Registrations, Certifications & Compliance",
    title: "The Registrations We Trade Under",
    description:
      "BOSS EXIM believes that international trade should be supported by proper registration, documentation and regulatory compliance. The company will maintain all applicable corporate, tax, customs and trade registrations required for its operations — including CIN, PAN, GST, IEC, RCMC, ISO certification and AD Code, as and when applicable and obtained.",
  },
  note: "Product-specific approvals, inspection reports, laboratory certificates, certificates of origin, phytosanitary certificates, quality documents and other statutory documents will be arranged according to the product, origin, destination and transaction requirements.",
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
