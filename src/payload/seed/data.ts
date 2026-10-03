/**
 * The site's starting content, loaded into the CMS by `npm run seed`. Text comes
 * from the client's page documents in /requirements. Once seeded, content is
 * edited in the admin — this file only recreates a fresh database.
 */
import { enquiryTypes } from "@/config/contact";
import { FAQ_CATEGORY } from "@/config/faq";
import { howWeWork } from "@/config/process";
import { anchorHref, contactHref, groupVerticalHref, partnerFormHref, productsViewHref, routes, sectionIds } from "@/config/routes";
import { formatList } from "@/lib/format";
import type { IconName } from "@/lib/icons";
import type { FaqItem, GroupCompany, Market, Resource, TeamMember } from "@/types/content";
import { seedProducts } from "./products";

export { seedProducts };

/** Destination markets. Saudi Arabia and Indonesia are core markets without a product lane yet. */
export const seedMarkets: Market[] = [
  { code: "AE", name: "United Arab Emirates", shortName: "UAE", region: "Middle East", coordinates: { lat: 25.2, lon: 55.3 }, labelAnchor: "top" },
  { code: "SA", name: "Saudi Arabia", shortName: "Saudi Arabia", region: "Middle East", coordinates: { lat: 21.49, lon: 39.19 }, labelAnchor: "left" },
  { code: "SG", name: "Singapore", shortName: "Singapore", region: "South-East Asia", coordinates: { lat: 1.35, lon: 103.82 }, labelAnchor: "right" },
  { code: "MY", name: "Malaysia", shortName: "Malaysia", region: "South-East Asia", coordinates: { lat: 3.14, lon: 101.69 }, labelAnchor: "left" },
  { code: "TH", name: "Thailand", shortName: "Thailand", region: "South-East Asia", coordinates: { lat: 13.76, lon: 100.5 }, labelAnchor: "top" },
  { code: "ID", name: "Indonesia", shortName: "Indonesia", region: "South-East Asia", coordinates: { lat: -6.2, lon: 106.85 }, labelAnchor: "bottom" },
  { code: "VN", name: "Vietnam", shortName: "Vietnam", region: "South-East Asia", coordinates: { lat: 10.82, lon: 106.63 }, labelAnchor: "right" },
  { code: "AU", name: "Australia", shortName: "Australia", region: "Oceania", coordinates: { lat: -33.87, lon: 151.21 }, labelAnchor: "left" },
];

export const seedTeam: Omit<TeamMember, "photo">[] = [
  {
    name: "Prasad Kalla",
    role: "Chairman",
    bio: [
      "Mr. Prasad Kalla, Chairman of the BOSS Group, combines technical expertise, business management experience and entrepreneurial leadership. He holds an Engineering degree in Computer Science from Bangalore University and an MBA from Victoria University of Technology, Melbourne, Australia.",
      "With more than three decades of business exposure, he has been associated with diversified ventures across India and Australia. The Group’s Australian operations span retail, fuel stations and convenience stores, real estate and construction, hospitality, e-Commerce and IT services, complementing its broader interests in logistics, trading and other business sectors.",
      "Mr. Kalla has played a key role in expanding the Group by combining practical business insight with technology, disciplined operations and modern management systems. His leadership focuses on long-term growth, diversification, customer service and development of new business opportunities.",
      "Over the years, BOSS Group and its leadership have received several recognitions, including the Commonwealth Bank & Brisbane Indian Times Multicultural Business & Community Award 2012, BP Buying Group – Compliance Winner 2012, a National Award for outstanding commitment to disability and workplace safety, and recognition for Best Hotel in Category Two for 2012 by the Department of Tourism, Andhra Pradesh, India.",
      "As Chairman, Mr. Kalla continues to guide BOSS Group toward sustainable growth and stronger international business participation.",
    ].join("\n\n"),
  },
  {
    name: "Sudhakar C",
    role: "Director",
    bio: [
      "Business savvy individual with deep exposure in many verticals — IT, Shipping Line, Construction, Hospitality, Retail and Gas Stations.",
      "Worked as a senior executive in Wipro with widespread global experience in Business Operations, Delivery Management and People Supply Management in the areas of ERP and Microsoft Technologies.",
      "Well-versed in onshore and offshore delivery execution models.",
    ].join("\n\n"),
  },
  {
    name: "Sekhar C",
    role: "Chief Executive Officer",
    bio: [
      "Mr. Sekhar Chaluvadi is an engineering graduate in Computer Science Engineering from Karnataka University. He has over 27 years of experience in the Shipping Line, Construction, Hospitality and Logistics industries, with good knowledge of Marketing & Sales. His multi-faceted approach to understanding the needs of the organisation and its customers allows him to provide winning solutions for their unique challenges and maintain customer relationships.",
      "He leads with a passion-driven approach towards achieving excellence in everything he does.",
    ].join("\n\n"),
  },
];

export const seedCompanyDetails = {
  contact: {
    email: "bgexim@bossgrp.com",
    address: "BOSS Towers, Street No. 2, Patrika Nagar, Madhapur, Hyderabad – 500081, Telangana, India",
  },
};

export const seedGroupCompanies: Omit<GroupCompany, "logo">[] = [
  {
    name: "BOSS Global EXIM",
    description:
      "The Group’s international trading arm — connecting Indian products with global buyers, and sourcing selected industrial products and recyclable materials for Indian customers.",
    icon: "globe",
    isCurrent: true,
  },
  {
    name: "BOSS Container Line",
    description:
      "The shipping and logistics vertical — a registered NVOCC offering freight forwarding, container trading, break bulk, project cargo and 3PL, with 31 agency agreements across Asia, the Middle East and Africa.",
    icon: "ship",
  },
  {
    name: "BOSS Retail",
    description:
      "Fuel stations and convenience stores across Australia, working with BP, AMPOL, Shell and Caltex — premium fuel, daily essentials and in-store cafés, backed by strong systems and customer-centric policies.",
    icon: "store",
  },
  {
    name: "BOSS Constructions",
    description:
      "Commercial and residential construction in India and Australia, including Elite Construction & Projects — from site finding and due diligence to turnkey delivery, plus building and upgrading fuel stations and convenience stores.",
    icon: "building",
  },
  {
    name: "BOSS Hospitality",
    description:
      "Hotels and motels in Australia, India and Italy — blending comfort, accessibility and affordability in locations near key transport points.",
    icon: "hotel",
  },
  {
    name: "BOSS IT",
    description:
      "The Group’s technology capability — digital solutions, business systems and IT-enabled services, delivered with 100+ professionals across the Group’s IT and BPO teams.",
    icon: "cpu",
  },
  {
    name: "BOSS BPO",
    description:
      "Business process outsourcing for HR and finance operations — recruitment, payroll and employee relations, accounts processing, reconciliation, invoicing, payments, analytics and budgeting.",
    icon: "headset",
  },
];

export const seedGalleries: { title: string; icon: IconName; photos?: { file: string; alt: string }[] }[] = [
  { title: "Leadership", icon: "user-round" },
  { title: "Business Meetings", icon: "briefcase" },
  { title: "Supplier Visits", icon: "factory" },
  { title: "Trade Events", icon: "presentation" },
  { title: "International Business", icon: "globe" },
  {
    title: "Group Activities",
    icon: "party-popper",
    // From the BOSS Australia website: first EV site (April 2024) and the McGrath Foundation partnership.
    photos: [
      { file: "ev-site-launch-team.jpg", alt: "BOSS team at the opening of BP Brackenridge, the Group’s first EV site, April 2024" },
      { file: "ev-site-launch-charger.jpg", alt: "Electric vehicle charging at BP Brackenridge on opening day" },
      { file: "ev-site-launch-ceremony.jpg", alt: "Ribbon-cutting at the BP Brackenridge EV site opening" },
      { file: "mcgrath-foundation-ribbon.jpg", alt: "Pink ribbon display for the McGrath Foundation partnership" },
      { file: "mcgrath-foundation-store.jpg", alt: "Convenience store decorated in pink for the McGrath Foundation" },
      { file: "mcgrath-foundation-counter.jpg", alt: "Store counter with McGrath Foundation pink balloons" },
      { file: "mcgrath-foundation-window.jpg", alt: "McGrath Foundation lettering on a store window" },
    ],
  },
];

export const seedResources: Omit<Resource, "href">[] = [
  {
    title: "BGEXIM Corporate Brochure",
    description:
      "A concise introduction to BOSS Global EXIM — our business model, products, markets, trade process and capabilities.",
    format: "PDF",
    icon: "book-open",
  },
  {
    title: "BOSS Group Brochure",
    description:
      "A short overview of the wider business ecosystem — logistics, retail, construction, hospitality, IT, BPO and related activities.",
    format: "PDF",
    icon: "building",
  },
];

const CATEGORY = FAQ_CATEGORY;
const exportNames = formatList(seedProducts.filter((p) => p.direction === "export").map((p) => p.name.toLowerCase()));
const importNames = formatList(seedProducts.filter((p) => p.direction === "import").map((p) => p.name));
const coreMarkets = "India, Singapore, Malaysia, Australia, UAE, Thailand, Saudi Arabia and Indonesia";

export const seedFaqs: FaqItem[] = [
  {
    category: CATEGORY.company,
    question: "What is BOSS Global EXIM?",
    answer:
      "BOSS Global EXIM Pvt. Ltd. is an international trading company engaged in Merchant Exports, Merchant Imports, Global Sourcing, International Trading and Supply Chain Solutions. It is part of the wider BOSS Group.",
    keywords: ["about", "company", "who", "bgexim", "merchant", "trading"],
    action: { label: "About us", href: routes.about },
  },
  {
    category: CATEGORY.company,
    question: "What does BOSS Global EXIM do?",
    answer:
      "We connect international buyers with Indian products through sourcing, merchant exports, international trading and supply-chain coordination — and source selected industrial products and recyclable materials from international markets for Indian customers.",
    keywords: ["do", "business", "services", "work", "role"],
    action: { label: "Our business model", href: anchorHref(routes.business, sectionIds.business.model) },
  },
  {
    category: CATEGORY.company,
    question: "How is BOSS Global EXIM connected to the BOSS Group?",
    answer:
      "BGEXIM is the international trading arm of the BOSS Group, founded in 2000 — a diversified business group with activities across Australia, Singapore, Malaysia and India in shipping, retail, construction, hospitality, real estate, IT and BPO. Its shipping arm, BOSS Container Line, supports our logistics.",
    keywords: ["group", "parent", "sister", "companies", "owner", "behind"],
    action: { label: "Explore the BOSS Group", href: routes.group },
  },
  {
    category: CATEGORY.company,
    question: "What is BOSS Container Line?",
    answer:
      "BOSS Container Line is the BOSS Group’s shipping and logistics company — a registered NVOCC providing freight forwarding, container trading, break bulk and project cargo, and 3PL and warehousing, with offices in Singapore, Malaysia, Hyderabad, Navi Mumbai, Gandhidham and Chennai.",
    keywords: ["shipping", "logistics", "freight", "nvocc", "container", "forwarding", "break", "bulk", "warehouse", "3pl"],
    action: { label: "Container Line", href: groupVerticalHref("container-line") },
  },
  {
    category: CATEGORY.company,
    question: "How far does the BOSS logistics network reach?",
    answer:
      "Through BOSS Container Line, the Group has 31 agency agreements in place (with one more in progress) across the Indian Subcontinent, Southeast Asia, the Middle East and Upper Gulf, the Red Sea and Africa, CIS destinations, China, the Maldives and Turkey.",
    keywords: ["network", "agents", "agency", "countries", "reach", "coverage", "offices", "where", "ports"],
    action: { label: "Network & offices", href: anchorHref(groupVerticalHref("container-line"), sectionIds.group.network) },
  },
  {
    category: CATEGORY.catalogue,
    question: "Which products do you export?",
    answer: `Our current export portfolio includes ${exportNames}. These are targeted mainly at the Middle East, South-East Asia and selected international markets.`,
    keywords: ["export", "sell", "agri", "agriculture", "food", "rice", "spices", "chilli", "turmeric", "pulses"],
    action: { label: "See export products", href: productsViewHref("export") },
  },
  {
    category: CATEGORY.catalogue,
    question: "What do you import into India?",
    answer: `Our import focus includes ${importNames} — polymers and selected ferrous and non-ferrous recyclable metals for Indian buyers.`,
    keywords: ["import", "polymer", "scrap", "metal", "raw", "materials", "industrial", "aluminium", "copper"],
    action: { label: "See import products", href: productsViewHref("import") },
  },
  {
    category: CATEGORY.catalogue,
    question: "Which markets do you serve?",
    answer: `Our core trade markets include ${coreMarkets}. Our wider network, through the BOSS Group and our logistics partners, can support additional international opportunities.`,
    keywords: ["markets", "countries", "destinations", "regions", "ship", "uae", "saudi", "indonesia", "singapore"],
    action: { label: "Our global presence", href: anchorHref(routes.tradeProcess, sectionIds.tradeProcess.presence) },
  },
  {
    category: CATEGORY.catalogue,
    question: "Can you source products outside your current portfolio?",
    answer:
      "Yes. Our current portfolio is our starting point, not a restriction. If a verified buyer requires another product, our team studies the requirement, identifies suitable sources and proceeds if it meets our commercial, quality, logistics and regulatory standards.",
    keywords: ["other", "new", "different", "custom", "outside", "portfolio", "sourcing"],
    action: { label: "Beyond our current focus", href: anchorHref(routes.business, sectionIds.business.beyond) },
  },
  {
    category: CATEGORY.catalogue,
    question: "Where do you source your products?",
    answer:
      "We source from suitable Indian producers, processors, manufacturers and suppliers based on product requirements, quality specifications, availability and commercial feasibility — and from international suppliers for our import lines.",
    keywords: ["source", "suppliers", "origin", "from", "producers", "manufacturers"],
  },
  {
    category: CATEGORY.catalogue,
    question: "Where can I get product specifications?",
    answer:
      "Specifications are provided based on your requirement and the latest supplier information, as they vary by grade, supplier and transaction. Send a Buyer enquiry and we’ll share the current specification.",
    keywords: ["specs", "specification", "sheet", "datasheet", "grade", "tds", "coa", "details"],
    action: { label: "Request specifications", href: contactHref({ type: "buyer" }) },
  },
  {
    category: CATEGORY.catalogue,
    question: "Can products be customised to my requirements?",
    answer:
      "Where commercially and operationally feasible, product grade, specifications, size, packaging and other requirements can be discussed according to your requirements and applicable regulations. Private labelling is available for several products.",
    keywords: ["customise", "customize", "private", "label", "packaging", "packing", "tailor"],
  },
  {
    category: CATEGORY.trading,
    question: "How do I get a price quote?",
    answer:
      "We don’t publish fixed prices, because they change with market conditions, freight, currency and supply. Send your product, quantity, specification and destination, and our team will prepare a transaction-specific quotation.",
    keywords: ["price", "quote", "quotation", "rate", "cost", "moq", "minimum", "quantity"],
    action: { label: "Request a quote", href: contactHref({ type: "buyer" }) },
  },
  {
    category: CATEGORY.trading,
    question: "How does a trade work, from enquiry to completion?",
    answer: `Every transaction follows six stages: ${formatList(howWeWork.steps.map((step) => step.title))}. Behind them sit detailed controls for KYC, documentation, payment security, quality and shipping.`,
    keywords: ["process", "order", "steps", "procedure", "timeline", "delivery", "how"],
    action: { label: "See how we work", href: anchorHref(routes.tradeProcess, sectionIds.tradeProcess.howWeWork) },
  },
  {
    category: CATEGORY.trading,
    question: "How do you check quality?",
    answer:
      "Our approach is simple: verify the product, verify the parties, verify the documents, then execute. Depending on the product, that can include manufacturer CoA and TDS, laboratory and residue testing, PSIC, weight checks or independent inspection.",
    keywords: ["quality", "inspection", "check", "verify", "testing", "certificate", "lab"],
    action: { label: "Quality & verification", href: anchorHref(routes.tradeProcess, sectionIds.tradeProcess.quality) },
  },
  {
    category: CATEGORY.trading,
    question: "Do you work with international buyers?",
    answer:
      "Yes. We work with international buyers seeking Indian products for import, distribution, trading, manufacturing and other commercial requirements.",
    keywords: ["international", "buyers", "overseas", "foreign", "abroad", "importer"],
    action: { label: "Register as a buyer", href: partnerFormHref("buyer") },
  },
  {
    category: CATEGORY.trading,
    question: "How do I register as a buyer or supplier?",
    answer:
      "Use the registration form on Partner With Us. We review every registration before further discussion; registration doesn’t by itself create a commercial commitment, and we contact you when there is a genuine match.",
    keywords: ["register", "registration", "become", "join", "vendor", "seller", "supplier", "onboard"],
    action: { label: "Partner with us", href: routes.partner },
  },
  {
    category: CATEGORY.trading,
    question: "Who can become a Strategic Business Partner?",
    answer:
      "Logistics providers, freight forwarders, shipping companies, warehouses, inspection agencies, testing laboratories, financial institutions, trade-finance providers, customs-support companies and overseas representatives.",
    keywords: ["partner", "partnership", "logistics", "warehouse", "inspection", "finance", "agent", "representative"],
    action: { label: "Strategic partnerships", href: partnerFormHref("partnership") },
  },
  {
    category: CATEGORY.trading,
    question: "How can I contact BOSS Global EXIM?",
    answer: `Email bgexim@bossgrp.com, or send an enquiry from the Contact page — choose ${formatList(enquiryTypes.map((type) => type.shortLabel))}. Our corporate office is at BOSS Towers, Madhapur, Hyderabad, India.`,
    keywords: ["contact", "email", "phone", "call", "reach", "address", "office", "hyderabad"],
    action: { label: "Send an enquiry", href: contactHref() },
  },
];
