/**
 * Who may do what in the admin. Two roles:
 *  • Admin  — everything, including managing users.
 *  • Editor — edits website content; cannot manage users.
 * Visitors can only read published content (through the website).
 */
import type { Access, FieldAccess } from "payload";

export const ROLES = [
  { label: "Admin", value: "admin" },
  { label: "Editor", value: "editor" },
] as const;

export type Role = (typeof ROLES)[number]["value"];

export const anyone: Access = () => true;

export const isSignedIn: Access = ({ req }) => Boolean(req.user);

export const isAdmin: Access = ({ req }) => req.user?.role === "admin";

export const isAdminField: FieldAccess = ({ req }) => req.user?.role === "admin";

/** Admins see every user; everyone else only their own account. */
export const isAdminOrSelf: Access = ({ req }) => {
  if (!req.user) return false;
  if (req.user.role === "admin") return true;
  return { id: { equals: req.user.id } };
};

/** Public website content: anyone reads, signed-in staff edit. */
export const contentAccess = {
  read: anyone,
  create: isSignedIn,
  update: isSignedIn,
  delete: isSignedIn,
};
