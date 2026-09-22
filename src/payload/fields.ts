import type { SelectField, TextField } from "payload";
import { iconNames } from "@/lib/icons";

/** Sidebar groups in the admin navigation. */
export const ADMIN_GROUPS = {
  catalogue: "Catalogue",
  content: "Website content",
  settings: "Settings",
  files: "Files",
} as const;

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** "Dehydrated Onion & Garlic" → "dehydrated-onion-and-garlic" */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** URL slug, filled in from `sourceField` when left empty. */
export function slugField(sourceField: string, urlPrefix: string): TextField {
  return {
    name: "slug",
    type: "text",
    required: true,
    unique: true,
    index: true,
    admin: {
      position: "sidebar",
      description: `The page address, e.g. ${urlPrefix}/rice. Filled in from the name if left empty.`,
    },
    hooks: {
      beforeValidate: [({ value, data }) => slugify(String(value || data?.[sourceField] || ""))],
    },
    validate: (value: string | null | undefined) =>
      value && SLUG_PATTERN.test(value) ? true : "Use lowercase letters, numbers and dashes only.",
  };
}

const humanize = (name: string) => name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, " ");

export function iconField(description: string): SelectField {
  return {
    name: "icon",
    type: "select",
    required: true,
    options: iconNames.map((name) => ({ label: humanize(name), value: name })),
    admin: { description },
  };
}

/** Optional web address; must be a full https:// link when filled in. */
export function urlField(name: string, label: string, description?: string): TextField {
  return {
    name,
    label,
    type: "text",
    admin: { description, placeholder: "https://" },
    validate: (value: string | null | undefined) =>
      !value || /^https?:\/\/\S+$/.test(value) ? true : "Enter a full web address starting with https://",
  };
}
