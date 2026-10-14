/** Partner With Us content — from the client's Partner With Us documents. */
import type { PartnerTrack, SectionContent } from "@/types/content";
import { sectionIds } from "./routes";

export const partnerContent: {
  heading: SectionContent;
  /** The client's "Partner With Us" document, for its section on Trade Process. */
  tradeProcessIntro: string;
  tradeProcessCta: string;
  form: SectionContent & { notes: string[] };
  tracks: PartnerTrack[];
} = {
  heading: {
    eyebrow: "Partner With Us",
    title: "Three Ways to Work with Us",
    description:
      "Our objective is to build a trusted international network supporting sourcing, trading, inspection, logistics, warehousing, finance and market development. Every enquiry is reviewed before further discussion and does not automatically create a commercial commitment.",
  },
  tradeProcessIntro:
    "BOSS EXIM welcomes long-term relationships with genuine buyers, reliable suppliers and experienced strategic partners. Buyers can share product requirements, specifications, quantities, destinations and preferred commercial terms. Suppliers can introduce their products, capacity, certifications, loading ports and business terms. Logistics providers, warehouses, inspection agencies, financial institutions, overseas representatives and trade-service partners are also welcome to connect. Every enquiry is reviewed before further discussion and does not automatically create a commercial commitment. Buy, Sell or Partner with BOSS EXIM.",
  tradeProcessCta: "Register with us",
  form: {
    eyebrow: "Register",
    title: "Tell Us About Your Business",
    description:
      "Choose buyer, supplier or partnership. The details you share help our team carry out basic background work before responding.",
    notes: [
      "Every enquiry is reviewed by the BOSS EXIM team before further discussion.",
      "Submitting a form does not automatically create a commercial commitment, and registration does not guarantee business — we will contact you when there is a genuine, commercially viable match.",
    ],
  },
  tracks: [
    {
      id: sectionIds.partner.buyer,
      title: "Register as a Buyer",
      description:
        "Registering as a buyer with BOSS EXIM helps us understand your business requirements and identify suitable sourcing opportunities more efficiently. Buyers can share company details, product specifications, quantity, purchase frequency, destination, delivery expectations, preferred Incoterm and payment method, and upload supporting documents such as product specifications or import licences where relevant.",
      benefits:
        "Benefits include faster enquiry evaluation, targeted supplier sourcing, better specification matching, structured quotation support, clearer communication, documentation coordination and improved follow-up — and a more efficient long-term sourcing relationship. All submitted information is used for internal business evaluation and enquiry processing.",
      image: { src: "/images/partner/buyer.webp", alt: "Buyer registration illustration with a container ship, cargo and a registration form", width: 1100, height: 825 },
      pointsLabel: "What we’ll ask",
      points: [
        "Company, registration & contact details",
        "Product, grade or specification & quantity",
        "Destination port & required delivery date",
        "Preferred Incoterm & payment method",
      ],
      cta: { label: "Register as a buyer", enquiryType: "buyer" },
    },
    {
      id: sectionIds.partner.supplier,
      title: "Register as a Supplier",
      description:
        "BOSS EXIM welcomes manufacturers, processors, exporters and reliable traders that can offer consistent quality, competitive terms and dependable supply. Suppliers can register company details, products, grades, origin, capacity, MOQ, packaging, loading port, pricing and payment terms, along with profiles, specifications, certificates, CoA or test reports and product photographs.",
      benefits:
        "Benefits include visibility for current and future buyer requirements, faster product matching, structured enquiry handling, improved communication, repeat-business opportunities and potential access to international markets. Business is pursued only when supplier capability matches a genuine and commercially viable requirement.",
      image: { src: "/images/partner/supplier.webp", alt: "Supplier registration illustration with a factory, certificates and a registration checklist", width: 1100, height: 825 },
      pointsLabel: "What we’ll ask",
      points: [
        "Company, registration & contact details",
        "Product, grade & country of origin",
        "Monthly capacity, MOQ & packaging",
        "Loading port, indicative price & payment terms",
      ],
      cta: { label: "Register as a supplier", enquiryType: "supplier" },
    },
    {
      id: sectionIds.partner.strategic,
      title: "Strategic Business Partner",
      description:
        "BOSS EXIM welcomes strategic relationships with logistics providers, freight forwarders, shipping companies, warehouses, inspection agencies, testing laboratories, financial institutions, trade-finance providers, customs-support companies and overseas representatives. Partners can share their company profile, markets covered, services, licences, certifications, experience and capabilities for evaluation.",
      benefits:
        "Benefits include access to suitable trade opportunities, stronger collaboration, repeat transaction potential, wider market connectivity, coordinated service delivery and long-term relationship development. Our objective is to build a dependable professional network that supports sourcing, quality, finance, logistics, documentation and destination coordination.",
      image: { src: "/images/partner/strategic.webp", alt: "Strategic partner network illustration linking shipping, air freight, warehousing, inspection and finance", width: 1100, height: 825 },
      pointsLabel: "Who we work with",
      points: [
        "Logistics providers, freight forwarders & shipping companies",
        "Warehouses, inspection agencies & testing laboratories",
        "Financial institutions & trade-finance providers",
        "Customs-support companies & overseas representatives",
      ],
      cta: { label: "Propose a partnership", enquiryType: "partnership" },
      featured: true,
    },
  ],
};
