import type { CollectionConfig } from "payload";
import { contentAccess } from "../access";
import { ADMIN_GROUPS, iconField } from "../fields";
import { revalidateHooks } from "../hooks/revalidate";

export const Resources: CollectionConfig = {
  slug: "resources",
  labels: { singular: "Download", plural: "Downloads" },
  orderable: true,
  access: contentAccess,
  hooks: revalidateHooks,
  admin: {
    group: ADMIN_GROUPS.content,
    useAsTitle: "title",
    defaultColumns: ["title", "format", "file"],
    description: "Brochures and specification sheets on the Resources page. Without a file, it shows “Coming soon”.",
  },
  fields: [
    { name: "title", type: "text", required: true },
    { name: "description", type: "text", required: true },
    {
      type: "row",
      fields: [
        { name: "format", type: "text", required: true, defaultValue: "PDF" },
        iconField("Shown next to the download."),
      ],
    },
    { name: "file", type: "upload", relationTo: "documents" },
  ],
};
