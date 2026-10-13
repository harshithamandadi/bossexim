import type { GlobalConfig } from "payload";
import { compliance } from "@/config/about";
import { enquiryTypes } from "@/config/contact";
import { siteConfig } from "@/config/site";
import type { SocialPlatform } from "@/types/content";
import { anyone, isSignedIn } from "../access";
import { ADMIN_GROUPS, emailListField, urlField } from "../fields";
import { revalidateGlobal } from "../hooks/revalidate";

const VIDEO_URL = /^https:\/\/(www\.)?(youtube\.com|youtu\.be|vimeo\.com|player\.vimeo\.com)\//i;

/** Field name used to store a platform's profile link, e.g. "linkedin". */
export const socialFieldName = (platform: SocialPlatform) => platform.toLowerCase();

export const CompanyDetails: GlobalConfig = {
  slug: "company-details",
  label: "Company details",
  access: { read: anyone, update: isSignedIn },
  hooks: { afterChange: [revalidateGlobal] },
  admin: {
    group: ADMIN_GROUPS.settings,
    description:
      "Contact details, who receives enquiry emails, social profiles and registration numbers. Empty fields show “To be added” on the site.",
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
          name: "trade",
          label: "Ports & video",
          description: "Optional extras. Anything left empty is simply not shown on the site.",
          fields: [
            {
              name: "originPorts",
              label: "Indian loading ports",
              type: "text",
              hasMany: true,
              admin: {
                description: "Ports in India you usually ship from, e.g. Mundra. Press Enter after each one. Listed under Global Presence.",
              },
            },
            {
              name: "video",
              label: "Corporate video",
              type: "group",
              admin: { description: "Shown on the About page. The video only loads when a visitor presses play, so it doesn't slow the page." },
              fields: [
                {
                  name: "url",
                  label: "YouTube or Vimeo link",
                  type: "text",
                  validate: (value: string | null | undefined) =>
                    !value || VIDEO_URL.test(value) || "Paste a YouTube or Vimeo link, e.g. https://www.youtube.com/watch?v=…",
                  admin: { placeholder: "https://www.youtube.com/watch?v=…" },
                },
                { name: "title", type: "text", admin: { placeholder: "BOSS EXIM Global — corporate film" } },
                {
                  name: "poster",
                  label: "Cover image",
                  type: "upload",
                  relationTo: "media",
                  admin: { description: "Optional. Shown before the video plays; YouTube's own thumbnail is used otherwise." },
                },
              ],
            },
          ],
        },
        {
          name: "enquiryEmails",
          label: "Enquiry emails",
          description:
            "Who is emailed when someone sends an enquiry from the website. If nobody is listed, alerts go to the contact email. Every enquiry is also kept under Inbox → Enquiries.",
          fields: [
            emailListField("all", "All enquiries", "These people receive every enquiry. Press Enter after each address."),
            ...enquiryTypes.map((type) =>
              emailListField(type.id, `${type.label} — also send to`, `Extra recipients for ${type.label.toLowerCase()} only.`),
            ),
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
