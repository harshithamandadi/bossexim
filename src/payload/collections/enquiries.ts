import type { CollectionConfig } from "payload";
import { enquiryTypes } from "@/config/contact";
import { isAdmin, isSignedIn } from "../access";
import { ADMIN_GROUPS } from "../fields";

export const DELIVERY_STATUSES = [
  { label: "Sending…", value: "pending" },
  { label: "Sent", value: "sent" },
  { label: "Failed", value: "failed" },
  { label: "Email not set up", value: "not-configured" },
  { label: "No recipients set", value: "no-recipients" },
] as const;

export type DeliveryStatus = (typeof DELIVERY_STATUSES)[number]["value"];

const readOnly = { readOnly: true } as const;

/**
 * Every enquiry sent from the website — a safety net so a failed email never
 * loses a lead. Read-only by design: replies happen by email, and there are no
 * statuses or assignments (the admin is not a CRM). Admins can delete entries.
 */
export const Enquiries: CollectionConfig = {
  slug: "enquiries",
  labels: { singular: "Enquiry", plural: "Enquiries" },
  access: {
    read: isSignedIn,
    create: () => false,
    update: () => false,
    delete: isAdmin,
  },
  admin: {
    group: ADMIN_GROUPS.inbox,
    useAsTitle: "name",
    defaultColumns: ["name", "type", "company", "email", "notificationStatus", "createdAt"],
    listSearchableFields: ["name", "email", "company", "message"],
    description:
      "Every enquiry sent from the website, newest first. Reply by email; “Email alert” shows whether your team was notified.",
  },
  defaultSort: "-createdAt",
  fields: [
    {
      name: "type",
      type: "select",
      required: true,
      options: enquiryTypes.map((type) => ({ label: type.label, value: type.id })),
      admin: readOnly,
    },
    {
      type: "row",
      fields: [
        { name: "name", type: "text", required: true, admin: readOnly },
        { name: "company", type: "text", admin: readOnly },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "email", type: "text", required: true, admin: readOnly },
        { name: "phone", type: "text", admin: readOnly },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "product", type: "text", admin: readOnly },
        { name: "quantity", type: "text", admin: readOnly },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "country", label: "Country / port", type: "text", admin: readOnly },
        { name: "partnershipArea", type: "text", admin: readOnly },
      ],
    },
    { name: "message", type: "textarea", required: true, admin: readOnly },
    {
      name: "notificationStatus",
      label: "Email alert",
      type: "select",
      defaultValue: "pending",
      options: [...DELIVERY_STATUSES],
      admin: { ...readOnly, position: "sidebar", description: "The email to your team about this enquiry." },
    },
    {
      name: "notificationDetail",
      label: "Alert detail",
      type: "text",
      admin: { ...readOnly, position: "sidebar" },
    },
    {
      name: "acknowledgementStatus",
      label: "Confirmation to enquirer",
      type: "select",
      defaultValue: "pending",
      options: [...DELIVERY_STATUSES],
      admin: { ...readOnly, position: "sidebar" },
    },
    { name: "source", label: "Sent from", type: "text", admin: { ...readOnly, position: "sidebar" } },
  ],
};
