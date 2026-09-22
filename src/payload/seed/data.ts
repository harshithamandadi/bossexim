/**
 * The site's starting content, loaded into the CMS by `npm run seed`.
 * Once seeded, content is edited in the admin — this file only recreates a
 * fresh database. FAQ answers that list products or markets are written out
 * from this data at seed time; after that they are ordinary editable text.
 */
import { enquiryTypes } from "@/config/contact";
import { FAQ_CATEGORY } from "@/config/faq";
import { containerLine } from "@/config/group";
import { partnerContent } from "@/config/partners";
import { howWeWork, qualityVerification } from "@/config/process";
import { anchorHref, contactHref, productsViewHref, routes, sectionIds } from "@/config/routes";
import { createCatalogue } from "@/lib/catalogue";
import { formatList } from "@/lib/format";
import type { IconName } from "@/lib/icons";
import type { FaqItem, GroupCompany, Market, Product, Resource } from "@/types/content";

export const seedMarkets: Market[] = [
  {
    code: "AE",
    name: "United Arab Emirates",
    shortName: "UAE",
    region: "Middle East",
    coordinates: { lat: 25.2, lon: 55.3 },
    labelAnchor: "top",
  },
  {
    code: "SG",
    name: "Singapore",
    shortName: "Singapore",
    region: "South-East Asia",
    coordinates: { lat: 1.35, lon: 103.82 },
    labelAnchor: "right",
  },
  {
    code: "MY",
    name: "Malaysia",
    shortName: "Malaysia",
    region: "South-East Asia",
    coordinates: { lat: 3.14, lon: 101.69 },
    labelAnchor: "left",
  },
  {
    code: "VN",
    name: "Vietnam",
    shortName: "Vietnam",
    region: "South-East Asia",
    coordinates: { lat: 10.82, lon: 106.63 },
    labelAnchor: "right",
  },
  {
    code: "AU",
    name: "Australia",
    shortName: "Australia",
    region: "Oceania",
    coordinates: { lat: -33.87, lon: 151.21 },
    labelAnchor: "left",
  },
  {
    code: "TH",
    name: "Thailand",
    shortName: "Thailand",
    region: "South-East Asia",
    coordinates: { lat: 13.76, lon: 100.5 },
    labelAnchor: "top",
  },
];

export const seedProducts: Product[] = [
  /* ─────────────────────────────── Exports ─────────────────────────────── */
  {
    slug: "rice",
    name: "Rice",
    direction: "export",
    category: "Grains",
    icon: "wheat",
    summary: "Indian rice for importers, wholesalers and distributors.",
    description:
      "Rice sourced from established Indian mills, cleaned, graded and packed to the buyer's brand, bag size and specification.",
    markets: ["AE", "SG", "MY", "VN"],
  },
  {
    slug: "spices-and-spice-blends",
    name: "Spices & Spice Blends",
    direction: "export",
    category: "Spices",
    icon: "leaf",
    summary: "Whole, ground and blended Indian spices.",
    description:
      "A range of Indian spices and spice blends for importers, food manufacturers and retail brands, supplied to agreed specifications.",
    markets: ["AE", "SG", "MY", "AU"],
  },
  {
    slug: "dehydrated-onion-and-garlic",
    name: "Dehydrated Onion & Garlic",
    direction: "export",
    category: "Dehydrated foods",
    icon: "sun",
    summary: "Dehydrated onion and garlic for food processors and distributors.",
    description:
      "Dehydrated onion and garlic products supplied in the forms and pack sizes our buyers require.",
    markets: ["AE", "SG", "MY"],
  },
  {
    slug: "pulses-and-dal-products",
    name: "Pulses & Dal Products",
    direction: "export",
    category: "Pulses",
    icon: "bean",
    summary: "Whole pulses and dal products from India.",
    description:
      "Pulses and dal products sourced from Indian processors and packed for importers, wholesalers and retail.",
    markets: ["AE", "SG", "MY", "AU"],
  },
  {
    slug: "dried-chillies",
    name: "Dried Chillies",
    direction: "export",
    category: "Spices",
    icon: "flame",
    summary: "Indian dried chillies, graded by variety.",
    description:
      "Dried chillies from India's growing regions, sorted and graded to the variety and quality the buyer specifies.",
    markets: ["AE", "SG", "MY", "TH"],
  },
  {
    slug: "groundnuts-and-peanuts",
    name: "Groundnuts & Peanuts",
    direction: "export",
    category: "Oilseeds & nuts",
    icon: "nut",
    summary: "Groundnuts and peanuts for food and processing.",
    description:
      "Groundnuts and peanuts sourced from Indian growers and processors, graded and packed for export.",
    markets: ["AE", "MY", "TH"],
  },
  {
    slug: "jaggery",
    name: "Jaggery",
    direction: "export",
    category: "Natural sweeteners",
    icon: "candy",
    summary: "Traditional Indian jaggery.",
    description:
      "Jaggery — India's traditional unrefined cane sugar — supplied to importers, distributors and food brands.",
    markets: ["AE", "SG", "MY"],
  },

  /* ─────────────────────────────── Imports ─────────────────────────────── */
  {
    slug: "polypropylene",
    name: "Polypropylene (PP)",
    direction: "import",
    category: "Polymers",
    icon: "package",
    summary: "Polypropylene for Indian converters and manufacturers.",
    description:
      "Polypropylene sourced from international suppliers for moulding, film, fibre and packaging applications in India.",
  },
  {
    slug: "polyethylene",
    name: "Polyethylene (PE)",
    direction: "import",
    category: "Polymers",
    icon: "layers",
    summary: "HDPE, LDPE and LLDPE for Indian industry.",
    description:
      "Polyethylene in high-density, low-density and linear low-density grades, sourced internationally for Indian manufacturers.",
    variants: ["HDPE", "LDPE", "LLDPE"],
    variantsLabel: "Grades",
  },
  {
    slug: "polyester-chips",
    name: "Polyester Chips",
    direction: "import",
    category: "Polymers",
    icon: "shapes",
    summary: "Polyester chips for fibre, film and packaging.",
    description:
      "Polyester chips sourced from international producers for Indian fibre, film and packaging manufacturers.",
  },
  {
    slug: "aluminium-scrap",
    name: "Aluminium Scrap",
    direction: "import",
    category: "Metal scrap",
    icon: "recycle",
    summary: "Aluminium scrap across six common grades.",
    description:
      "Aluminium scrap sourced internationally for Indian recyclers, smelters and foundries.",
    variants: ["Cable", "Extrusion", "Sheet", "Cast", "UBC", "Formwork"],
    variantsLabel: "Types",
  },
  {
    slug: "copper-scrap",
    name: "Copper Scrap",
    direction: "import",
    category: "Metal scrap",
    icon: "cable",
    summary: "Copper wire, extrusion, sheet and cast scrap.",
    description: "Copper scrap sourced internationally for Indian refiners, recyclers and manufacturers.",
    variants: ["Wire", "Extrusion", "Sheet", "Cast"],
    variantsLabel: "Types",
  },
  {
    slug: "iron-scrap",
    name: "Iron Scrap",
    direction: "import",
    category: "Metal scrap",
    icon: "hammer",
    summary: "Iron extrusion, sheet, cast and shuttering scrap.",
    description: "Iron scrap sourced internationally for Indian steel mills and foundries.",
    variants: ["Extrusion", "Sheet", "Cast", "Shuttering"],
    variantsLabel: "Types",
  },
  {
    slug: "stainless-steel-scrap",
    name: "Stainless Steel Scrap",
    direction: "import",
    category: "Metal scrap",
    icon: "cog",
    summary: "Stainless steel scrap in grades 202, 304 and 316.",
    description: "Stainless steel scrap sourced internationally for Indian melters and manufacturers.",
    variants: ["202", "304", "316"],
    variantsLabel: "Grades",
  },
];

export const seedGroupCompanies: GroupCompany[] = [
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
];

export const seedGalleries: { title: string; icon: IconName }[] = [
  { title: "Leadership", icon: "user-round" },
  { title: "Business Meetings", icon: "briefcase" },
  { title: "Supplier Visits", icon: "factory" },
  { title: "Trade Events", icon: "presentation" },
  { title: "Conferences", icon: "mic" },
  { title: "Group Activities", icon: "party-popper" },
];

export const seedResources: Omit<Resource, "href">[] = [
  {
    title: "BGEXIM Corporate Brochure",
    description: "Company profile, product lines and markets.",
    format: "PDF",
    icon: "book-open",
  },
  {
    title: "BOSS Group Brochure",
    description: "An overview of every BOSS Group business.",
    format: "PDF",
    icon: "building",
  },
  {
    title: "Product Specifications",
    description: "Specification sheets for our export and import lines.",
    format: "PDF",
    icon: "file-text",
  },
];

const catalogue = createCatalogue(seedProducts, seedMarkets);
const CATEGORY = FAQ_CATEGORY;
const names = (items: { name: string }[]) => formatList(items.map((item) => item.name));
const lowerFirst = (text: string) => text.charAt(0).toLowerCase() + text.slice(1);
const strategicAudiences = partnerContent.tracks.find((track) => track.featured)?.audiences ?? [];
const otherGroupCompanies = seedGroupCompanies.filter((company) => !company.isCurrent);

export const seedFaqs: FaqItem[] = [
  {
    category: CATEGORY.company,
    question: "What does BOSS Global EXIM do?",
    answer:
      "We are a global trading company working as a merchant exporter, merchant importer and supply chain solutions partner. We export Indian agri-commodities and import industrial raw materials for Indian industry.",
    keywords: ["about", "company", "business", "merchant", "trading", "who", "services"],
    action: { label: "About us", href: routes.about },
  },
  {
    category: CATEGORY.catalogue,
    question: "Which products do you export?",
    answer: `We currently export ${names(catalogue.exportProducts)}. Each product page lists the markets it ships to.`,
    keywords: ["export", "sell", "agri", "agriculture", "commodities", "food", ...catalogue.exportProducts.map((p) => p.name)],
    action: { label: "See export products", href: productsViewHref("export") },
  },
  {
    category: CATEGORY.catalogue,
    question: "Which markets do you supply?",
    answer: `Our export lines currently ship to ${names(catalogue.activeMarkets)}. We also welcome enquiries from buyers in other markets.`,
    keywords: ["markets", "countries", "destinations", "regions", "ship", ...catalogue.activeMarkets.flatMap((m) => [m.name, m.shortName])],
    action: {
      label: "See our trade lanes",
      href: anchorHref(routes.tradeProcess, sectionIds.tradeProcess.presence),
    },
  },
  {
    category: CATEGORY.catalogue,
    question: "What do you import into India?",
    answer: `We import ${names(catalogue.importProducts)} for manufacturers and recyclers in India.`,
    keywords: ["import", "raw", "materials", "industrial", "scrap", "polymer", "metal", ...catalogue.importProducts.map((p) => p.name)],
    action: { label: "See import products", href: productsViewHref("import") },
  },
  {
    category: CATEGORY.catalogue,
    question: "Where can I get product specifications?",
    answer:
      "Specification sheets will be available under Resources. In the meantime, request them with a Buyer enquiry and we'll share them directly.",
    keywords: ["specs", "specification", "sheet", "datasheet", "grade", "details", "hs", "code", "brochure"],
    action: { label: "Request specifications", href: contactHref({ type: "buyer" }) },
  },
  {
    category: CATEGORY.trading,
    question: "How do I get a price quote?",
    answer:
      "Prices depend on the product, grade, quantity, packing and destination. Send a Buyer enquiry with those details and our trade desk will come back with a quote.",
    keywords: ["price", "quote", "rate", "cost", "quantity", "moq", "minimum", "ton", "tonne", "volume", "packing", "offer"],
    action: { label: "Request a quote", href: contactHref({ type: "buyer" }) },
  },
  {
    category: CATEGORY.trading,
    question: "How does an order work, from enquiry to delivery?",
    answer: `Every trade follows ${howWeWork.steps.length} steps: ${formatList(howWeWork.steps.map((step) => step.title.toLowerCase()))}.`,
    keywords: ["process", "order", "steps", "procedure", "timeline", "lead", "time", "long", "shipment", "delivery", "contract", "samples"],
    action: {
      label: "See the trade process",
      href: anchorHref(routes.tradeProcess, sectionIds.tradeProcess.howWeWork),
    },
  },
  {
    category: CATEGORY.trading,
    question: "How do you check quality?",
    answer: `${qualityVerification.heading.title} Our checks cover ${formatList(qualityVerification.items.map((item) => item.title.toLowerCase()))}.`,
    keywords: ["quality", "inspection", "check", "verify", "testing", "standards", "certificate", "certification", "certified", "control"],
    action: {
      label: "Quality & verification",
      href: anchorHref(routes.tradeProcess, sectionIds.tradeProcess.quality),
    },
  },
  {
    category: CATEGORY.trading,
    question: "How do I register as a buyer or supplier?",
    answer:
      "Visit Partner With Us, or send a Buyer or Supplier enquiry from the Contact page. Our trade desk will follow up with next steps.",
    keywords: ["register", "registration", "become", "join", "vendor", "seller", "purchase", "onboard", "sign"],
    action: { label: "Partner with us", href: routes.partner },
  },
  {
    category: CATEGORY.trading,
    question: "Who can become a Strategic Business Partner?",
    answer: `We work with ${formatList(strategicAudiences.map((audience) => audience.toLowerCase()))} as strategic business partners.`,
    keywords: ["partner", "partnership", "collaborate", "agent", "distributor", "logistics", "warehousing", "finance"],
    action: {
      label: "Strategic partnerships",
      href: anchorHref(routes.partner, sectionIds.partner.strategic),
    },
  },
  {
    category: CATEGORY.trading,
    question: "How can I contact BOSS Global EXIM?",
    answer: `Send an enquiry from the Contact page — choose ${formatList(enquiryTypes.map((type) => type.shortLabel))} and our trade desk will respond.`,
    keywords: ["contact", "email", "phone", "call", "reach", "address", "office", "talk", "person", "team"],
    action: { label: "Send an enquiry", href: contactHref() },
  },
  {
    category: CATEGORY.company,
    question: "How is BOSS Global EXIM connected to the BOSS Group?",
    answer: `BOSS Global EXIM is one of the BOSS Group's businesses, alongside ${names(otherGroupCompanies)}.`,
    keywords: ["group", "parent", "sister", "companies", "owner", "own", "behind"],
    action: { label: "Explore the BOSS Group", href: routes.group },
  },
  {
    category: CATEGORY.company,
    question: `What is ${containerLine.heading.title}?`,
    answer: `${containerLine.heading.title} is ${lowerFirst(containerLine.heading.description ?? "")} Its services are ${formatList(containerLine.services.map((service) => service.title))}.`,
    keywords: ["shipping", "logistics", "freight", "nvocc", "container", "forwarding", "break", "bulk", "vessel"],
    action: {
      label: containerLine.heading.title,
      href: anchorHref(routes.group, sectionIds.group.containerLine),
    },
  },
];
