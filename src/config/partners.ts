/** Partner With Us content. DRAFT copy — confirm with the client before launch. */
import type { PartnerTrack, SectionContent } from "@/types/content";
import { sectionIds } from "./routes";

export const partnerContent: { heading: SectionContent; tracks: PartnerTrack[] } = {
  heading: {
    eyebrow: "Partner With Us",
    title: "Let's build trade together.",
    description: "Whether you buy, supply or keep trade moving, there's a place for you in the BOSS EXIM network.",
  },
  tracks: [
    {
      id: sectionIds.partner.buyer,
      title: "Register as a Buyer",
      description:
        "For importers, distributors and wholesalers buying Indian agri-commodities — and Indian manufacturers buying polymers and metal scrap.",
      audiences: ["Importers & distributors", "Wholesalers & retail chains", "Manufacturers & recyclers in India"],
      cta: { label: "Register as a buyer", enquiryType: "buyer" },
    },
    {
      id: sectionIds.partner.supplier,
      title: "Register as a Supplier",
      description:
        "For Indian producers of our export lines, and international suppliers of polymers and metal scrap.",
      audiences: ["Farmers' groups & processors", "Mills & packers", "International polymer & scrap suppliers"],
      cta: { label: "Register as a supplier", enquiryType: "supplier" },
    },
    {
      id: sectionIds.partner.strategic,
      title: "Strategic Business Partner",
      description: "For companies that help trade move — shipped, stored, checked, financed or represented.",
      audiences: [
        "Logistics companies",
        "Warehouses",
        "Inspection agencies",
        "Financial / trade partners",
        "Overseas representatives",
      ],
      cta: { label: "Propose a partnership", enquiryType: "partnership" },
      featured: true,
    },
  ],
};
