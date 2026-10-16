import type { CollectionConfig } from "payload";
import { productCategories } from "@/config/products";
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
          admin: {
            description: `Products in the same category are shown together; more than three slide. Use one of: ${productCategories.map((category) => category.name).join(", ")} — or a new name for a new section.`,
          },
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
      label: "Overview",
      type: "textarea",
      required: true,
      admin: { description: "The overview on the product's page. Leave a blank line between paragraphs.", rows: 10 },
    },
    {
      name: "images",
      type: "upload",
      relationTo: "media",
      hasMany: true,
      admin: { description: "Product photos. The first is used on the product card and at the top of the page." },
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
      name: "packaging",
      type: "textarea",
      admin: { description: "Typical packaging, e.g. “5 kg to 50 kg in PP, BOPP or jute bags”." },
    },
    {
      name: "documentation",
      label: "Typical documentation",
      type: "text",
      hasMany: true,
      admin: { description: "Documents usually supplied, e.g. Certificate of origin. Press Enter after each." },
    },
    {
      name: "specifications",
      label: "Specification tables",
      type: "array",
      labels: { singular: "Table", plural: "Tables" },
      admin: {
        description: "Optional. One table per variety, e.g. “Basmati Rice” and “Non-Basmati Rice”.",
        initCollapsed: true,
      },
      fields: [
        {
          type: "row",
          fields: [
            { name: "title", type: "text", required: true, admin: { placeholder: "Basmati Rice" } },
            { name: "subtitle", type: "text", admin: { placeholder: "Premium Indian Basmati Rice" } },
          ],
        },
        {
          name: "rows",
          type: "array",
          labels: { singular: "Row", plural: "Rows" },
          fields: [
            {
              type: "row",
              fields: [
                { name: "label", type: "text", required: true, admin: { placeholder: "Moisture" } },
                { name: "value", type: "text", required: true, admin: { placeholder: "As per agreed specification" } },
              ],
            },
          ],
        },
        {
          name: "keyFeatures",
          type: "text",
          hasMany: true,
          admin: { description: "Short highlights, e.g. Long Grain. Press Enter after each." },
        },
      ],
    },
    {
      name: "hsCode",
      label: "HSN code",
      type: "text",
      admin: { position: "sidebar", description: "Shown on the product page, e.g. 10063020." },
    },
  ],
};
