/**
 * Headings for the Resources page. The downloads are managed in the admin
 * (Website content → Downloads); only those with a file attached are shown.
 */
import type { SectionContent } from "@/types/content";

export const resourcesContent: {
  heading: SectionContent;
  labels: { download: string; comingSoon: string };
  emptyState: string;
  specifications: SectionContent & { cta: string };
} = {
  heading: {
    eyebrow: "Downloads",
    title: "Brochures",
    description:
      "Our corporate brochure introduces BOSS Global EXIM — our business model, products, markets, trade process and capabilities — for buyers, suppliers, banks and partners. The BOSS Group brochure gives a short overview of the wider business ecosystem.",
  },
  labels: { download: "Download", comingSoon: "Coming soon" },
  emptyState: "Our brochures are being finalised and will be available to download here soon.",
  specifications: {
    eyebrow: "Product Specifications",
    title: "The Latest Specification, on Request",
    description:
      "Specifications vary by grade, supplier and transaction — particularly for polymers and scrap — so we share them based on your requirement and the latest supplier information, rather than publishing sheets that may be out of date.",
    cta: "Request a specification",
  },
};
