import type { CollectionConfig } from "payload";
import { contentAccess } from "../access";
import { ADMIN_GROUPS, iconField, urlField } from "../fields";
import { revalidateHooks } from "../hooks/revalidate";

export const GroupCompanies: CollectionConfig = {
  slug: "group-companies",
  labels: { singular: "Group company", plural: "BOSS Group companies" },
  orderable: true,
  access: contentAccess,
  hooks: revalidateHooks,
  admin: {
    group: ADMIN_GROUPS.content,
    useAsTitle: "name",
    defaultColumns: ["name", "description", "isCurrent"],
    description: "The companies listed on the BOSS Group page. Drag rows to change the order.",
  },
  fields: [
    { name: "name", type: "text", required: true },
    { name: "description", type: "text", required: true },
    iconField("Shown on the company's card."),
    urlField("href", "Website", "Optional link to the company's own site."),
    {
      name: "isCurrent",
      label: "This is BOSS Global EXIM",
      type: "checkbox",
      admin: { description: "Highlights the card as “You are here”." },
    },
  ],
};
