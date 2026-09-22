import type { CollectionConfig } from "payload";
import { contentAccess } from "../access";
import { ADMIN_GROUPS, iconField } from "../fields";
import { revalidateHooks } from "../hooks/revalidate";

export const Galleries: CollectionConfig = {
  slug: "galleries",
  labels: { singular: "Gallery", plural: "Media & events" },
  orderable: true,
  access: contentAccess,
  hooks: revalidateHooks,
  admin: {
    group: ADMIN_GROUPS.content,
    useAsTitle: "title",
    defaultColumns: ["title", "images"],
    description: "Photo galleries on the BOSS Group page. A gallery without photos shows “Photos coming soon”.",
  },
  fields: [
    { name: "title", type: "text", required: true },
    iconField("Shown on the gallery tile."),
    {
      name: "images",
      type: "upload",
      relationTo: "media",
      hasMany: true,
      admin: { description: "The first photo is used as the gallery's cover." },
    },
  ],
};
