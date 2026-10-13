/**
 * Headings for the Resources page. The downloads are managed in the admin
 * (Website content → Downloads); only those with a file attached are shown.
 */
import type { SectionContent } from "@/types/content";

export const resourcesContent: {
  heading: SectionContent;
  labels: { download: string; comingSoon: string };
  emptyState: string;
  video: SectionContent & { playLabel: string; comingSoon: string };
  specifications: SectionContent & { cta: string };
} = {
  video: {
    eyebrow: "BOSS Group Video",
    title: "From Friendship to a Global Business Ecosystem",
    description:
      "BOSS Group’s corporate video presents the journey from friendship and entrepreneurship to a diversified global business ecosystem. It highlights the Group’s leadership, business verticals, achievements, international operations, logistics capabilities, community initiatives and commitment to trust, responsible growth, operational excellence and long-term relationships with customers and partners worldwide.",
    playLabel: "Play the BOSS Group video",
    comingSoon: "The BOSS Group video will be available here soon.",
  },
  heading: {
    eyebrow: "Brochures",
    title: "BOSS EXIM Corporate Brochure",
    description:
      "A concise introduction to BOSS EXIM Global — our business model, products, markets, trade process and capabilities — designed for buyers, suppliers, banks, strategic partners and other stakeholders who want a quick overview of the company.",
  },
  labels: { download: "Download", comingSoon: "Coming soon" },
  emptyState: "Our corporate brochure is being finalised and will be available to download here soon.",
  specifications: {
    eyebrow: "Product Specifications",
    title: "The Latest Specification, on Request",
    description:
      "Product specifications can be provided based on the buyer’s requirement and the latest supplier information. Buyers can request the latest product-wise specification directly from BOSS EXIM — typical export specifications are also shown on each product page.",
    cta: "Request a specification",
  },
};
