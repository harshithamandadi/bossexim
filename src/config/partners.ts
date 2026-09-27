/** Partner With Us content — from the client's Partner With Us documents. */
import type { PartnerTrack, SectionContent } from "@/types/content";
import { sectionIds } from "./routes";

export const partnerContent: {
  heading: SectionContent;
  form: SectionContent & { notes: string[] };
  tracks: PartnerTrack[];
} = {
  heading: {
    eyebrow: "Partner With Us",
    title: "Buy, sell or partner with us.",
    description:
      "Our objective is to build a trusted international network that can support sourcing, trading, inspection, logistics, warehousing, finance and market development.",
  },
  form: {
    eyebrow: "Register",
    title: "Tell us about your business.",
    description:
      "Choose buyer, supplier or partnership. The details you share help our team carry out basic background work before responding.",
    notes: [
      "Every enquiry is reviewed by the BGEXIM team before further discussion.",
      "Submitting a form does not automatically create a commercial commitment, and registration does not guarantee business — we will contact you when there is a genuine, commercially viable match.",
    ],
  },
  tracks: [
    {
      id: sectionIds.partner.buyer,
      title: "Register as a Buyer",
      description:
        "Looking for a reliable product or international supplier? Our buyer registration helps us understand your company, product needs and commercial expectations before our team begins sourcing.",
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
        "We work with manufacturers, processors, exporters and reliable traders who can offer consistent quality, competitive commercial terms and dependable supply.",
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
        "International trade depends on more than buyers and suppliers. We welcome relationships with companies that strengthen the wider trade process. Strong partners help create stronger trade.",
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
