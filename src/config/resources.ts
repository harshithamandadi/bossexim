/**
 * Headings for the Resources page. The brochure is built from the products a
 * visitor picks (config/brochure.ts). Other downloads are managed in the admin
 * (Website content → Downloads); only those with a file attached are shown.
 */
import type { SectionContent } from "@/types/content";

export const resourcesContent: {
  heading: SectionContent;
  labels: { download: string; comingSoon: string };
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
      "A concise introduction to BOSS EXIM Global and the products that matter to you — designed for buyers, suppliers, banks, strategic partners and other stakeholders. Choose your products below and download a brochure made for them.",
  },
  labels: { download: "Download", comingSoon: "Coming soon" },
  specifications: {
    eyebrow: "Product Specifications",
    title: "The Latest Specification, on Request",
    description:
      "Product specifications can be provided based on the buyer’s requirement and the latest supplier information. Buyers can request the latest product-wise specification directly from BOSS EXIM — typical export specifications are also shown on each product page.",
    cta: "Request a specification",
  },
};
