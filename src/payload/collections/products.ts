import type { CollectionConfig } from "payload";
import { productHref } from "@/config/routes";
import { contentAccess } from "../access";
import { ADMIN_GROUPS, iconField, slugField } from "../fields";
import { revalidateHooks } from "../hooks/revalidate";

export const Products: CollectionConfig = {
  slug: "products",
  labels: { singular: "Product", plural: "Products" },
  orderable: true,
  access: contentAccess,
  hooks: revalidateHooks,
  admin: {
    group: ADMIN_GROUPS.catalogue,
    useAsTitle: "name",
    defaultColumns: ["name", "direction", "category", "markets"],
    listSearchableFields: ["name", "category"],
    description: "Every export and import line. Each product gets its own page; drag rows to change the order.",
    preview: (doc) => (typeof doc?.slug === "string" ? productHref(doc.slug) : null),
  },
  fields: [
    { name: "name", type: "text", required: true },
    {
      type: "row",
      fields: [
        {
          name: "direction",
          type: "select",
          required: true,
          defaultValue: "export",
          options: [
            { label: "Export (from India)", value: "export" },
            { label: "Import (into India)", value: "import" },
          ],
        },
        {
          name: "category",
          type: "text",
          required: true,
          admin: { description: "Products sharing a category are grouped together, e.g. Spices." },
        },
      ],
    },
    slugField("name", "/products"),
    iconField("Shown on the product's card, page and the home page wheel."),
    {
      name: "summary",
      type: "textarea",
      required: true,
      maxLength: 160,
      admin: { description: "One sentence for product cards (160 characters max)." },
    },
    {
      name: "description",
      type: "textarea",
      required: true,
      admin: { description: "The overview paragraph on the product's page." },
    },
    {
      name: "markets",
      type: "relationship",
      relationTo: "markets",
      hasMany: true,
      admin: {
        condition: (data) => data?.direction === "export",
        description: "Where this export line ships. Drives the trade-route map and market filters.",
      },
      validate: (value: unknown, { siblingData }: { siblingData: { direction?: string } }) =>
        siblingData.direction !== "export" || (Array.isArray(value) && value.length > 0)
          ? true
          : "Choose at least one market for an export product.",
    },
    {
      type: "row",
      fields: [
        {
          name: "variants",
          type: "text",
          hasMany: true,
          admin: { description: "Grades, forms or varieties, e.g. HDPE, LDPE. Press Enter after each." },
        },
        {
          name: "variantsLabel",
          label: "Variants heading",
          type: "text",
          admin: { placeholder: "Grades & forms" },
        },
      ],
    },
    {
      name: "hsCode",
      label: "HS heading",
      type: "text",
      admin: { position: "sidebar", description: "Leave empty until confirmed." },
    },
  ],
};
