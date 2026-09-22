import path from "node:path";
import type { CollectionConfig } from "payload";
import { contentAccess } from "../access";
import { ADMIN_GROUPS } from "../fields";
import { revalidateHooks } from "../hooks/revalidate";

export const Media: CollectionConfig = {
  slug: "media",
  labels: { singular: "Image", plural: "Images" },
  access: contentAccess,
  hooks: revalidateHooks,
  admin: {
    group: ADMIN_GROUPS.files,
    description: "Photos used across the site. Every image needs a short description for screen readers.",
  },
  upload: {
    staticDir: path.resolve(process.cwd(), "cms-data/media"),
    mimeTypes: ["image/*"],
    focalPoint: true,
    imageSizes: [
      { name: "thumbnail", width: 480 },
      { name: "card", width: 960 },
      { name: "large", width: 1920 },
    ],
    adminThumbnail: "thumbnail",
  },
  fields: [
    {
      name: "alt",
      label: "Description",
      type: "text",
      required: true,
      admin: { description: "What the image shows, e.g. “Rice being packed at the mill”." },
    },
  ],
};
