import type { CollectionConfig } from "payload";
import { contentAccess } from "../access";
import { ADMIN_GROUPS } from "../fields";
import { revalidateHooks } from "../hooks/revalidate";

export const Markets: CollectionConfig = {
  slug: "markets",
  labels: { singular: "Market", plural: "Markets" },
  orderable: true,
  access: contentAccess,
  hooks: revalidateHooks,
  admin: {
    group: ADMIN_GROUPS.catalogue,
    useAsTitle: "name",
    defaultColumns: ["name", "code", "region"],
    description: "Destination countries for export lines. A market appears on the site once a product ships there.",
  },
  fields: [
    {
      type: "row",
      fields: [
        { name: "name", type: "text", required: true, admin: { placeholder: "United Arab Emirates" } },
        {
          name: "shortName",
          type: "text",
          required: true,
          admin: { placeholder: "UAE", description: "Used where space is tight, e.g. the map." },
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "code",
          type: "text",
          required: true,
          unique: true,
          maxLength: 3,
          admin: { placeholder: "AE", description: "Two-letter country code." },
          hooks: { beforeValidate: [({ value }) => (typeof value === "string" ? value.trim().toUpperCase() : value)] },
        },
        { name: "region", type: "text", required: true, admin: { placeholder: "Middle East" } },
      ],
    },
    {
      name: "coordinates",
      type: "group",
      admin: { description: "The main port city, used to draw the trade route on the map." },
      fields: [
        {
          type: "row",
          fields: [
            { name: "lat", label: "Latitude", type: "number", required: true, min: -90, max: 90 },
            { name: "lon", label: "Longitude", type: "number", required: true, min: -180, max: 180 },
          ],
        },
      ],
    },
    {
      name: "labelAnchor",
      label: "Map label position",
      type: "select",
      defaultValue: "right",
      options: ["top", "bottom", "left", "right"].map((value) => ({ label: value, value })),
      admin: { description: "Move the label if it overlaps a neighbouring market." },
    },
  ],
};
