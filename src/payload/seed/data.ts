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

/** Core trade markets, from the client's Current Focus and Global Presence documents (India is the base). */
export const seedMarkets: Market[] = [
  { code: "UAE", name: "United Arab Emirates", shortName: "UAE", region: "Middle East", coordinates: { lat: 25.2, lon: 55.3 }, labelAnchor: "top" },
  { code: "SAU", name: "Saudi Arabia", shortName: "Saudi Arabia", region: "Middle East", coordinates: { lat: 21.49, lon: 39.19 }, labelAnchor: "bottom" },
  { code: "SGP", name: "Singapore", shortName: "Singapore", region: "South-East Asia", coordinates: { lat: 1.35, lon: 103.82 }, labelAnchor: "right" },
  { code: "MYS", name: "Malaysia", shortName: "Malaysia", region: "South-East Asia", coordinates: { lat: 3.14, lon: 101.69 }, labelAnchor: "left" },
  { code: "THA", name: "Thailand", shortName: "Thailand", region: "South-East Asia", coordinates: { lat: 13.76, lon: 100.5 }, labelAnchor: "top" },
  { code: "IDN", name: "Indonesia", shortName: "Indonesia", region: "South-East Asia", coordinates: { lat: -6.2, lon: 106.85 }, labelAnchor: "bottom" },
  { code: "AUS", name: "Australia", shortName: "Australia", region: "Oceania", coordinates: { lat: -33.87, lon: 151.21 }, labelAnchor: "left" },
];

export const seedTeam: (Omit<TeamMember, "photo"> & { photo?: { file: string; alt: string } })[] = [
  {
    name: "Sekhar C",
    role: "Chief Executive Officer",
    photo: { file: "team/sekhar-c.jpg", alt: "Sekhar C, Chief Executive Officer" },
    // Profiles from the client's Profile Data document (23 Oct 2026).
    bio: "Mr. Sekhar C serves as Chief Executive Officer and brings over 27 years of experience across shipping, construction, hospitality and logistics. An Engineering graduate in Computer Science from Karnataka University, he has developed strong expertise in marketing, sales, customer relationship management, business development and operational coordination. His leadership combines strategic thinking with practical execution, supported by a strong focus on transparency, responsiveness and long-term customer relationships. He continues to contribute to business growth by identifying new opportunities, strengthening customer and partner networks, improving operational effectiveness and guiding teams to maintain high standards of professionalism, accountability and consistent service delivery.",
  },
  {
    name: "Pradeep K",
    role: "Chief Operating Officer",
    photo: { file: "team/pradeep-k.jpg", alt: "Pradeep K, Chief Operating Officer" },
    bio: "Mr. Pradeep Kamareddy serves as Chief Operating Officer (COO) of BOSS Exim Global Pvt. Ltd., providing strategic leadership across international trade, global business development, and import-export operations. He drives market expansion, strategic sourcing, commercial negotiations, and international business partnerships, with a focus on sustainable growth, operational excellence, and long-term value creation. With over 15 years of professional and entrepreneurial experience across India and the United Kingdom, he brings a multidisciplinary perspective spanning international trading, operations management, construction, and real estate development. He holds a Master of Science (MSc) from the University of Bedfordshire, UK, and a Bachelor of Engineering (B.E.).",
  },
  {
    name: "Nagaraju P",
    role: "Chief Finance Officer",
    photo: { file: "team/nagaraju-p-2.jpg", alt: "Nagaraju P, Chief Finance Officer" },
    bio: "Mr. Nagaraju P. serves as CFO of BOSS Group India and brings over 10 years of experience across shipping, construction and logistics. He holds a Master of Commerce in Financial Management from Sri Venkateswara University. Over the years, he has developed strong expertise in financial planning, banking coordination, commercial finance and business support. His ability to build and maintain strong relationships with financial institutions has contributed to improving access to financial resources and supporting organisational growth. He brings a disciplined, practical and commercially focused approach to finance, with emphasis on financial control, banking relationships, compliance and sustainable business development.",
  },
];

export const seedCompanyDetails = {
  contact: {
    // Client inputs, 17 Oct 2026.
    email: "sales.exim@bossgrp.com",
    phone: "+91 99493 44428",
    address: "BOSS Towers, Street No. 2, Patrika Nagar, Madhapur, Hyderabad – 500081, Telangana, India",
  },
  /** The client's social profiles (15 and 17 Oct 2026); X has no account link yet. */
  social: {
    linkedin: "https://www.linkedin.com/in/admin-exim-1830a7444",
    facebook: "https://www.facebook.com/profile.php?id=61595075745047",
    instagram: "https://www.instagram.com/boss.exim.global",
    youtube: "https://www.youtube.com/@BOSSEXIM",
  },
};

export const seedGroupCompanies: Omit<GroupCompany, "logo">[] = [
  {
    name: "BOSS EXIM Global",
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
    name: "BOSS Laundromats",
    description:
      "Self-service laundry with modern washers and dryers, practical facilities and reliable service — for individuals, families, students and working professionals.",
    icon: "washing-machine",
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
  // Leadership, Business Meetings and Trade Events have no photos for launch (client, 23 Oct 2026:
  // no empty or sample sections; their photos follow). A gallery without photos is hidden on the
  // site, so each one appears again as soon as photos are uploaded to it in the admin.
  { title: "Leadership", icon: "user-round" },
  { title: "Business Meetings", icon: "briefcase" },
  {
    title: "Supplier Visits",
    icon: "factory",
    // The client's supplier visits (23 Oct 2026): rice mills, dry chilli warehouses and market yards.
    photos: [
      { file: "media/supplier-visit-01.jpg", alt: "BOSS EXIM team with the supplier at a rice mill" },
      { file: "media/supplier-visit-02.jpg", alt: "Checking rice quality at a supplier’s rice mill" },
      { file: "media/supplier-visit-03.jpg", alt: "BOSS EXIM team with a supplier at a dry red chilli warehouse" },
      { file: "media/supplier-visit-04.jpg", alt: "Inspecting dry red chilli stock at a supplier’s warehouse" },
      { file: "media/supplier-visit-05.jpg", alt: "BOSS EXIM team at a dry red chilli cold-storage warehouse" },
      { file: "media/supplier-visit-06.jpg", alt: "BOSS EXIM team with suppliers at a grain warehouse" },
      { file: "media/supplier-visit-07.jpg", alt: "Discussion with traders at a chilli market yard" },
      { file: "media/supplier-visit-08.jpg", alt: "Meeting traders at a chilli market yard" },
      { file: "media/supplier-visit-09.jpg", alt: "BOSS EXIM team with a supplier at their office" },
    ],
  },
  { title: "Trade Events", icon: "presentation" },
  {
    title: "International Business",
    icon: "globe",
    // BOSS Container Line teams at container yards and ports.
    photos: [
      { file: "media/yards-img_5862.jpg", alt: "BOSS Container Line team at a container yard" },
      { file: "media/yards-img_6149.jpg", alt: "BOSS Container Line team at a container yard" },
      { file: "media/yards-img_7813.jpg", alt: "BOSS Container Line team at a container yard" },
      { file: "media/yards-img_7819.jpg", alt: "BOSS Container Line team at a container yard" },
      { file: "media/yards-img_9490.jpg", alt: "BOSS Container Line team at a container yard" },
    ],
  },
  {
    title: "Group Activities",
    icon: "party-popper",
    // Team gatherings and the first EV site (April 2024). The four McGrath Foundation photos were
    // taken out at the client's request (23 Oct 2026).
    photos: [
      { file: "media/gatherings-as__9413.jpg", alt: "BOSS Group team gathering" },
      { file: "media/gatherings-as__9589.jpg", alt: "BOSS Group team gathering" },
      { file: "media/gatherings-dsc_0400.jpg", alt: "BOSS Group team gathering" },
      { file: "media/gatherings-dsc_0639.jpg", alt: "BOSS Group team gathering" },
      { file: "media/gatherings-img_0445.jpg", alt: "BOSS Group team gathering" },
      { file: "media/gatherings-img_0924.jpg", alt: "BOSS Group team gathering" },
      { file: "media/gatherings-img_1304.jpg", alt: "BOSS Group team gathering" },
      { file: "media/gatherings-img_20211018_211309.jpg", alt: "BOSS Group team gathering" },
      { file: "media/gatherings-img_5324.jpg", alt: "BOSS Group team gathering" },
      { file: "ev-site-launch-team.jpg", alt: "BOSS team at the opening of BP Brackenridge, the Group’s first EV site, April 2024" },
      { file: "ev-site-launch-charger.jpg", alt: "Electric vehicle charging at BP Brackenridge on opening day" },
      { file: "ev-site-launch-ceremony.jpg", alt: "Ribbon-cutting at the BP Brackenridge EV site opening" },
    ],
  },
];

export const seedResources: Omit<Resource, "href">[] = [
  {
    title: "BOSS EXIM Corporate Brochure",
    description:
      "A concise introduction to BOSS EXIM Global — our business model, products, markets, trade process and capabilities — for buyers, suppliers, banks, strategic partners and other stakeholders.",
    format: "PDF",
    icon: "book-open",
  },
];

const CATEGORY = FAQ_CATEGORY;
const coreMarkets = "India, Singapore, Malaysia, Australia, UAE, Thailand, Saudi Arabia and Indonesia";

export const seedFaqs: FaqItem[] = [
  {
    category: CATEGORY.company,
    question: "What is BOSS EXIM Global?",
    answer:
      "BOSS EXIM (Global) Pvt. Ltd. is an international trading company engaged in Merchant Exports, Merchant Imports, Global Sourcing, International Trading and Supply Chain Solutions. It is part of the wider BOSS Group.",
    keywords: ["about", "company", "who", "bgexim", "merchant", "trading"],
    action: { label: "About us", href: routes.about },
  },
  {
    category: CATEGORY.company,
    question: "What does BOSS EXIM Global do?",
    answer:
      "We connect international buyers with Indian products through sourcing, merchant exports, international trading and supply-chain coordination — and source selected industrial products and recyclable materials from international markets for Indian customers.",
    keywords: ["do", "business", "services", "work", "role"],
    action: { label: "Our business model", href: anchorHref(routes.business, sectionIds.business.model) },
  },
  {
    category: CATEGORY.company,
    question: "How is BOSS EXIM Global connected to the BOSS Group?",
    answer:
      "BOSS EXIM is the international trading arm of the BOSS Group, founded in 2000 — a diversified business group with activities across Australia, Singapore, Malaysia and India in shipping, retail, construction, hospitality, real estate, IT and BPO. Its shipping arm, BOSS Container Line, supports our logistics.",
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
    answer: "Our export categories include rice and grains, spices, pulses, fresh vegetables, fruits, dehydrated products, seafood, manufactured products, jaggery, peanuts and other food commodities — for buyers in the Middle East, Southeast Asia, Australia and other international markets.",
    keywords: ["export", "sell", "agri", "agriculture", "food", "rice", "spices", "chilli", "turmeric", "pulses"],
    action: { label: "See export products", href: productsViewHref("export") },
  },
  {
    category: CATEGORY.catalogue,
    question: "What do you import into India?",
    answer: "Our import categories include polymers, recyclable metal scrap such as copper, aluminium, used beverage cans, iron and steel, along with aluminium foil rolls, clear medical bottles and recycled plastic flakes — for Indian buyers.",
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
    question: "How can I contact BOSS EXIM Global?",
    answer: `Email sales.exim@bossgrp.com or call +91 99493 44428, or send an enquiry from the Contact page — choose ${formatList(enquiryTypes.map((type) => type.shortLabel))}. Our corporate office is at BOSS Towers, Madhapur, Hyderabad, India.`,
    keywords: ["contact", "email", "phone", "call", "reach", "address", "office", "hyderabad"],
    action: { label: "Send an enquiry", href: contactHref() },
  },
];
