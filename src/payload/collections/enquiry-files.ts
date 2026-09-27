import path from "node:path";
import type { CollectionConfig } from "payload";
import { ATTACHMENT_LIMITS } from "@/config/contact";
import { isAdmin, isSignedIn } from "../access";
import { ADMIN_GROUPS } from "../fields";

/**
 * Files visitors attach to enquiries (specifications, licences, certificates).
 * Private: only signed-in staff can open them, and only the website can add them.
 */
export const EnquiryFiles: CollectionConfig = {
  slug: "enquiry-files",
  labels: { singular: "Enquiry attachment", plural: "Enquiry attachments" },
  access: {
    read: isSignedIn,
    create: () => false,
    update: () => false,
    delete: isAdmin,
  },
  admin: {
    group: ADMIN_GROUPS.inbox,
    description: "Files attached to website enquiries. Open them from the enquiry they belong to.",
  },
  upload: {
    staticDir: path.resolve(process.cwd(), "cms-data/enquiry-files"),
    mimeTypes: ATTACHMENT_LIMITS.mimeTypes,
  },
  fields: [],
};
