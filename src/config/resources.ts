/**
 * Downloadable resources. Put PDFs in /public/downloads and set `href`,
 * e.g. href: "/downloads/bgexim-corporate-brochure.pdf". Until then they show as "Coming soon".
 */
import type { Resource, SectionContent } from "@/types/content";

export const resourcesContent: {
  heading: SectionContent;
  items: Resource[];
  labels: { download: string; comingSoon: string };
} = {
  heading: {
    eyebrow: "Downloads",
    title: "Everything you need, in one place.",
    description: "Brochures and specification sheets to share with your team.",
  },
  labels: { download: "Download", comingSoon: "Coming soon" },
  items: [
    {
      title: "BGEXIM Corporate Brochure",
      description: "Company profile, product lines and markets.",
      format: "PDF",
      icon: "book-open",
      href: undefined,
    },
    {
      title: "BOSS Group Brochure",
      description: "An overview of every BOSS Group business.",
      format: "PDF",
      icon: "building",
      href: undefined,
    },
    {
      title: "Product Specifications",
      description: "Specification sheets for our export and import lines.",
      format: "PDF",
      icon: "file-text",
      href: undefined,
    },
  ],
};
