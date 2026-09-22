/** Headings for the Resources page; the downloads are managed in the admin (Website content → Downloads). */
import type { SectionContent } from "@/types/content";

export const resourcesContent: {
  heading: SectionContent;
  labels: { download: string; comingSoon: string };
} = {
  heading: {
    eyebrow: "Downloads",
    title: "Everything you need, in one place.",
    description: "Brochures and specification sheets to share with your team.",
  },
  labels: { download: "Download", comingSoon: "Coming soon" },
};
