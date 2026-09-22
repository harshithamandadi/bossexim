/**
 * Enquiry form contract — shared by the client form and the server action.
 * Pure functions only (no server APIs), so it is safe to import anywhere.
 */
import { contactContent, enquiryTypes } from "@/config/contact";
import type { EnquiryTypeId } from "@/types/content";

export const OTHER_PRODUCT_VALUE = "other";
/** Hidden field that real visitors never fill in; bots usually do. */
export const HONEYPOT_FIELD = "website";

const MIN_MESSAGE_LENGTH = 10;
const MAX_FIELD_LENGTH = 200;
const MAX_MESSAGE_LENGTH = 5000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ENQUIRY_FIELDS = ["type", "name", "company", "email", "phone", "country", "product", "message"] as const;

export type EnquiryField = (typeof ENQUIRY_FIELDS)[number];
export type EnquiryValues = Partial<Record<EnquiryField, string>>;
export type EnquiryErrors = Partial<Record<EnquiryField, string>>;

export interface Enquiry {
  type: EnquiryTypeId;
  name: string;
  email: string;
  message: string;
  company?: string;
  phone?: string;
  country?: string;
  product?: string;
}

export type EnquiryFormState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; message: string; errors?: EnquiryErrors; values?: EnquiryValues };

type ValidationResult = { ok: true; enquiry: Enquiry } | { ok: false; errors: EnquiryErrors };

const messages = contactContent.form.errors;

function isEnquiryType(value: string): value is EnquiryTypeId {
  return enquiryTypes.some((type) => type.id === value);
}

function isKnownProduct(value: string, productSlugs: readonly string[]): boolean {
  return value === OTHER_PRODUCT_VALUE || productSlugs.includes(value);
}

function maxLengthFor(field: EnquiryField): number {
  return field === "message" ? MAX_MESSAGE_LENGTH : MAX_FIELD_LENGTH;
}

/** Safely read an enquiry type from a URL parameter. */
export function toEnquiryType(value: unknown): EnquiryTypeId | undefined {
  return typeof value === "string" && isEnquiryType(value) ? value : undefined;
}

/** Safely read a product slug from a URL parameter. */
export function toProductSlug(value: unknown, productSlugs: readonly string[]): string | undefined {
  return typeof value === "string" && productSlugs.includes(value) ? value : undefined;
}

export function readEnquiryValues(formData: FormData): EnquiryValues {
  return Object.fromEntries(
    ENQUIRY_FIELDS.map((field) => [field, String(formData.get(field) ?? "").trim().slice(0, maxLengthFor(field))]),
  );
}

export function isHoneypotFilled(formData: FormData): boolean {
  return String(formData.get(HONEYPOT_FIELD) ?? "").length > 0;
}

export function validateEnquiry(values: EnquiryValues, productSlugs: readonly string[]): ValidationResult {
  const { type = "", name = "", email = "", message = "", company, phone, country, product } = values;
  const errors: EnquiryErrors = {};

  if (!isEnquiryType(type)) errors.type = messages.required;
  if (!name) errors.name = messages.required;
  if (!EMAIL_PATTERN.test(email)) errors.email = email ? messages.email : messages.required;
  if (message.length < MIN_MESSAGE_LENGTH) errors.message = message ? messages.message : messages.required;
  if (product && !isKnownProduct(product, productSlugs)) errors.product = messages.product;

  if (Object.keys(errors).length > 0 || !isEnquiryType(type)) return { ok: false, errors };

  return {
    ok: true,
    enquiry: {
      type,
      name,
      email,
      message,
      company: company || undefined,
      phone: phone || undefined,
      country: country || undefined,
      product: product || undefined,
    },
  };
}
