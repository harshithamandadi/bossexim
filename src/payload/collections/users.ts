import type { CollectionConfig } from "payload";
import { ROLES, isAdmin, isAdminField, isAdminOrSelf } from "../access";
import { ADMIN_GROUPS } from "../fields";

const MINUTE_MS = 60 * 1000;
const HOUR_S = 60 * 60;

export const Users: CollectionConfig = {
  slug: "users",
  labels: { singular: "User", plural: "Users" },
  auth: {
    maxLoginAttempts: 5,
    lockTime: 15 * MINUTE_MS,
    tokenExpiration: 8 * HOUR_S,
  },
  access: {
    create: isAdmin,
    delete: isAdmin,
    read: isAdminOrSelf,
    update: isAdminOrSelf,
  },
  admin: {
    group: ADMIN_GROUPS.settings,
    useAsTitle: "name",
    defaultColumns: ["name", "email", "role"],
    description: "People who can sign in to this admin. Only admins can add users or change roles.",
  },
  hooks: {
    // The very first account (created on the admin's welcome screen) must be able to manage users.
    beforeChange: [
      async ({ data, operation, req }) => {
        if (operation !== "create") return data;
        const { totalDocs } = await req.payload.count({ collection: "users", req });
        return totalDocs === 0 ? { ...data, role: "admin" } : data;
      },
    ],
  },
  fields: [
    { name: "name", type: "text", required: true },
    {
      name: "role",
      type: "select",
      required: true,
      defaultValue: "editor",
      saveToJWT: true,
      options: [...ROLES],
      access: { update: isAdminField },
      admin: { description: "Editors manage website content. Admins can also manage users." },
    },
  ],
};
