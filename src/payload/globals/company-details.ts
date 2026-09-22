import type { GlobalConfig } from "payload";
import { compliance } from "@/config/about";
import { siteConfig } from "@/config/site";
import type { SocialPlatform } from "@/types/content";
import { anyone, isSignedIn } from "../access";
import { ADMIN_GROUPS, urlField } from "../fields";
import { revalidateGlobal } from "../hooks/revalidate";

/** Field name used to store a platform's profile link, e.g. "linkedin". */
export const socialFieldName = (platform: SocialPlatform) => platform.toLowerCase();

export const CompanyDetails: GlobalConfig = {
  slug: "company-details",
  label: "Company details",
  access: { read: anyone, update: isSignedIn },
  hooks: { afterChange: [revalidateGlobal] },
  admin: {
    group: ADMIN_GROUPS.settings,
    description: "Contact details, social profiles and registration numbers. Empty fields show “To be added” on the site.",
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          name: "contact",
          label: "Contact",
          description: "Shown on the Contact page, in the footer and to search engines.",
          fields: [
            {
              type: "row",
              fields: [
                { name: "email", type: "email", admin: { placeholder: "info@bgexim.com" } },
                { name: "phone", type: "text", admin: { placeholder: "+91 …" } },
              ],
            },
            { name: "address", label: "Registered office", type: "textarea" },
          ],
        },
        {
          name: "social",
          label: "Social profiles",
          description: "Profiles without a link show as “coming soon”.",
          fields: siteConfig.socialPlatforms.map((platform) => urlField(socialFieldName(platform), platform)),
        },
        {
          name: "registrations",
          label: "Registrations",
          description: "Listed on the About page under Registrations & Compliance.",
          fields: compliance.items.map((item) => ({
            name: item.key,
            label: `${item.code} — ${item.name}`,
            type: "text" as const,
            admin: { description: `Issued by ${item.issuer}.` },
          })),
        },
      ],
    },
  ],
};
