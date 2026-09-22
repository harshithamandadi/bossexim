import type { CollectionConfig } from "payload";
import { faqCategories } from "@/config/faq";
import { contentAccess } from "../access";
import { ADMIN_GROUPS } from "../fields";
import { revalidateHooks } from "../hooks/revalidate";

export const Faqs: CollectionConfig = {
  slug: "faqs",
  labels: { singular: "FAQ", plural: "FAQs" },
  orderable: true,
  access: contentAccess,
  hooks: revalidateHooks,
  admin: {
    group: ADMIN_GROUPS.content,
    useAsTitle: "question",
    defaultColumns: ["question", "category"],
    description:
      "Shown on the FAQ page and answered by the website's assistant. The first six appear on the home and partner pages.",
  },
  fields: [
    { name: "question", type: "text", required: true },
    { name: "answer", type: "textarea", required: true },
    {
      name: "category",
      type: "select",
      required: true,
      options: faqCategories.map((category) => ({ label: category, value: category })),
    },
    {
      name: "keywords",
      type: "text",
      hasMany: true,
      admin: {
        description:
          "Other words visitors might type, e.g. price, quote, MOQ. They help the assistant find this answer. Press Enter after each.",
      },
    },
    {
      name: "action",
      label: "Next step (optional)",
      type: "group",
      admin: { description: "A link shown under the answer, e.g. “Request a quote” → /contact." },
      fields: [
        {
          type: "row",
          fields: [
            { name: "label", type: "text" },
            {
              name: "href",
              label: "Link",
              type: "text",
              admin: { placeholder: "/contact" },
              validate: (value: string | null | undefined, { siblingData }: { siblingData: { label?: string } }) =>
                Boolean(value) === Boolean(siblingData.label) ? true : "Fill in both the label and the link, or neither.",
            },
          ],
        },
      ],
    },
  ],
};
