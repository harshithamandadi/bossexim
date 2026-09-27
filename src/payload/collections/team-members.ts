import type { CollectionConfig } from "payload";
import { contentAccess } from "../access";
import { ADMIN_GROUPS } from "../fields";
import { revalidateHooks } from "../hooks/revalidate";

export const TeamMembers: CollectionConfig = {
  slug: "team-members",
  labels: { singular: "Team member", plural: "Team / Leadership" },
  orderable: true,
  access: contentAccess,
  hooks: revalidateHooks,
  admin: {
    group: ADMIN_GROUPS.content,
    useAsTitle: "name",
    defaultColumns: ["name", "role"],
    description: "Leadership profiles on the About page. Drag rows to change the order.",
  },
  fields: [
    {
      type: "row",
      fields: [
        { name: "name", type: "text", required: true },
        { name: "role", label: "Designation", type: "text", required: true, admin: { placeholder: "Managing Director" } },
      ],
    },
    {
      name: "bio",
      label: "Profile",
      type: "textarea",
      maxLength: 3000,
      admin: { description: "Leave a blank line between paragraphs.", rows: 8 },
    },
    {
      name: "photo",
      type: "upload",
      relationTo: "media",
      admin: { description: "A square, high-resolution portrait works best." },
    },
  ],
};
