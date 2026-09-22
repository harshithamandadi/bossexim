import path from "node:path";
import type { CollectionConfig } from "payload";
import { contentAccess } from "../access";
import { ADMIN_GROUPS } from "../fields";
import { revalidateHooks } from "../hooks/revalidate";

export const Documents: CollectionConfig = {
  slug: "documents",
  labels: { singular: "Document", plural: "Documents" },
  access: contentAccess,
  hooks: revalidateHooks,
  admin: {
    group: ADMIN_GROUPS.files,
    description: "PDF files offered as downloads, such as brochures and specification sheets.",
  },
  upload: {
    staticDir: path.resolve(process.cwd(), "cms-data/documents"),
    mimeTypes: ["application/pdf"],
  },
  fields: [],
};
