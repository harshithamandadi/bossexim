/**
 * Enquiry form contract — shared by the client form and the server action.
 * Pure functions only (no server APIs), so it is safe to import anywhere.
 * Each enquiry type is validated against its own fields (config/contact.ts);
 * values for fields a type doesn't ask for are dropped.
 */
import { contactContent, enquiryFormFields, enquiryTypes, partnershipAreas } from "@/config/contact";
import type { EnquiryField, EnquiryTypeId } from "@/types/content";

export const OTHER_PRODUCT_VALUE = "other";
/** Hidden field that real visitors never fill in; bots usually do. */
export const HONEYPOT_FIELD = "website";
/** Hidden, server-signed timestamp of when the form was shown (see form-token.ts). */
export const FORM_TOKEN_FIELD = "formToken";
/** Hidden field naming the page the form was sent from. */
export const SOURCE_FIELD = "source";

const MIN_MESSAGE_LENGTH = 10;
const MAX_FIELD_LENGTH = 200;
const MAX_MESSAGE_LENGTH = 5000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const FORM_FIELDS = [
  "type",
  "name",
  "company",
  "email",
  "phone",
  "country",
  "product",
  "quantity",
  "partnershipArea",
  "message",
] as const;

export type EnquiryFormField = (typeof FORM_FIELDS)[number];
export type EnquiryValues = Partial<Record<EnquiryFormField, string>>;
export type EnquiryErrors = Partial<Record<EnquiryFormField, string>>;

export type Enquiry = { type: EnquiryTypeId; name: string; email: string; message: string } & Partial<
  Record<Exclude<EnquiryField, "name" | "email" | "message">, string>
>;

export type EnquiryFormState =
  | { status: "idle" }
  | { status: "success" }
  | {
      status: "error";
      message: string;
      errors?: EnquiryErrors;
      values?: EnquiryValues;
      /** Shown with the error so the visitor still has a way to reach us. */
      fallbackEmail?: string;
    };

type ValidationResult = { ok: true; enquiry: Enquiry } | { ok: false; errors: EnquiryErrors };

const messages = contactContent.form.errors;

export function isEnquiryType(value: unknown): value is EnquiryTypeId {
  return enquiryTypes.some((type) => type.id === value);
}

function maxLengthFor(field: EnquiryFormField): number {
  return field === "message" ? MAX_MESSAGE_LENGTH : MAX_FIELD_LENGTH;
}

/** Safely read an enquiry type from a URL parameter. */
export function toEnquiryType(value: unknown): EnquiryTypeId | undefined {
  return isEnquiryType(value) ? value : undefined;
}

/** Safely read a product slug from a URL parameter. */
export function toProductSlug(value: unknown, productSlugs: readonly string[]): string | undefined {
  return typeof value === "string" && productSlugs.includes(value) ? value : undefined;
}

export function readEnquiryValues(formData: FormData): EnquiryValues {
  return Object.fromEntries(
    FORM_FIELDS.map((field) => [field, String(formData.get(field) ?? "").trim().slice(0, maxLengthFor(field))]),
  );
}

export function isHoneypotFilled(formData: FormData): boolean {
  return String(formData.get(HONEYPOT_FIELD) ?? "").length > 0;
}

/** The format rule for a filled-in field, or undefined when it passes. */
function formatError(field: EnquiryField, value: string, productSlugs: readonly string[]): string | undefined {
  switch (field) {
    case "email":
      return EMAIL_PATTERN.test(value) ? undefined : messages.email;
    case "message":
      return value.length >= MIN_MESSAGE_LENGTH ? undefined : messages.message;
    case "product":
      return value === OTHER_PRODUCT_VALUE || productSlugs.includes(value) ? undefined : messages.product;
    case "partnershipArea":
      return partnershipAreas.includes(value) ? undefined : messages.partnershipArea;
    default:
      return undefined;
  }
}

export function validateEnquiry(values: EnquiryValues, productSlugs: readonly string[]): ValidationResult {
  const { type } = values;
  if (!isEnquiryType(type)) return { ok: false, errors: { type: messages.required } };

  const errors: EnquiryErrors = {};
  const accepted: Partial<Record<EnquiryField, string>> = {};

  for (const field of enquiryFormFields[type]) {
    const value = values[field.name] ?? "";
    const error = value ? formatError(field.name, value, productSlugs) : field.required ? messages.required : undefined;
    if (error) errors[field.name] = error;
    else if (value) accepted[field.name] = value;
  }

  const { name, email, message, ...optional } = accepted;
  if (Object.keys(errors).length > 0 || !name || !email || !message) return { ok: false, errors };
  return { ok: true, enquiry: { type, name, email, message, ...optional } };
}
