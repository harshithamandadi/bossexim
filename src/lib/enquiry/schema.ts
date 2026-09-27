/**
 * Enquiry form contract — shared by the client form, the chatbot and the server
 * action. Pure functions only (no server APIs), so it is safe to import anywhere.
 * Each enquiry type is validated against its own fields (config/contact.ts);
 * values for fields a type doesn't ask for are dropped.
 */
import { ATTACHMENT_LIMITS, contactContent, enquiryFieldDefinitions, enquiryForms, enquiryTypes } from "@/config/contact";
import type { EnquiryField, EnquiryFieldConfig, EnquiryTypeId } from "@/types/content";

export const OTHER_PRODUCT_VALUE = "other";
/** Hidden field that real visitors never fill in; bots usually do. */
export const HONEYPOT_FIELD = "website_confirm";
/** Hidden, server-signed timestamp of when the form was shown (see form-token.ts). */
export const FORM_TOKEN_FIELD = "formToken";
/** Hidden field naming the page the form was sent from. */
export const SOURCE_FIELD = "source";

const MIN_MESSAGE_LENGTH = 10;
const MAX_FIELD_LENGTH = 200;
const MAX_TEXTAREA_LENGTH = 5000;
const BYTES_PER_MEGABYTE = 1024 * 1024;

export const PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  tel: /^\+?[\d\s().-]{6,24}$/,
  url: /^(https?:\/\/)?([\w-]+\.)+[a-z]{2,}(\/\S*)?$/i,
  date: /^\d{4}-\d{2}-\d{2}$/,
};

/** Stored in their own columns in the admin; everything else is kept as labelled details. */
const CORE_FIELDS = ["name", "email", "company", "phone", "country", "website", "product", "message"] as const;
type CoreField = (typeof CORE_FIELDS)[number];

const TEXT_FIELDS = (Object.keys(enquiryFieldDefinitions) as EnquiryField[]).filter(
  (field) => enquiryFieldDefinitions[field].kind !== "files",
);

export type EnquiryValues = Partial<Record<"type" | EnquiryField, string>>;
export type EnquiryErrors = Partial<Record<"type" | EnquiryField, string>>;

export interface EnquiryDetail {
  label: string;
  value: string;
}

export type Enquiry = { type: EnquiryTypeId; name: string; email: string; details: EnquiryDetail[] } & Partial<
  Record<Exclude<CoreField, "name" | "email">, string>
>;

export type EnquiryFormState =
  | { status: "idle" }
  | { status: "success"; reference?: string }
  | {
      status: "error";
      message: string;
      errors?: EnquiryErrors;
      values?: EnquiryValues;
      /** Shown with the error so the visitor still has a way to reach us. */
      fallbackEmail?: string;
    };

type ValidationResult =
  | { ok: true; enquiry: Enquiry; files: File[] }
  | { ok: false; errors: EnquiryErrors };

const messages = contactContent.form.errors;

export function isEnquiryType(value: unknown): value is EnquiryTypeId {
  return enquiryTypes.some((type) => type.id === value);
}

/** Every field the type asks for, across its sections. */
export function formFields(type: EnquiryTypeId): EnquiryFieldConfig[] {
  return enquiryForms[type].flatMap((section) => section.fields);
}

export function fieldLabel(field: EnquiryFieldConfig): string {
  return field.label ?? enquiryFieldDefinitions[field.name].label;
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
  const entries = (["type", ...TEXT_FIELDS] as const).map((field) => {
    const limit = field !== "type" && enquiryFieldDefinitions[field].kind === "textarea" ? MAX_TEXTAREA_LENGTH : MAX_FIELD_LENGTH;
    return [field, String(formData.get(field) ?? "").trim().slice(0, limit)];
  });
  return Object.fromEntries(entries);
}

export function readAttachments(formData: FormData): File[] {
  return formData.getAll("attachments").filter((value): value is File => value instanceof File && value.size > 0);
}

export function isHoneypotFilled(formData: FormData): boolean {
  return String(formData.get(HONEYPOT_FIELD) ?? "").length > 0;
}

/** Count and total size — also checked in the browser before sending (see contact-form.tsx). */
export function exceedsAttachmentLimits(files: { size: number }[]): boolean {
  const { maxFiles, maxTotalMegabytes } = ATTACHMENT_LIMITS;
  const totalBytes = files.reduce((sum, file) => sum + file.size, 0);
  return files.length > maxFiles || totalBytes > maxTotalMegabytes * BYTES_PER_MEGABYTE;
}

function attachmentsError(files: File[]): string | undefined {
  const valid = !exceedsAttachmentLimits(files) && files.every((file) => ATTACHMENT_LIMITS.mimeTypes.includes(file.type));
  return valid ? undefined : messages.files;
}

/** The format rule for a filled-in field, or undefined when it passes. */
function formatError(field: EnquiryFieldConfig, value: string, productSlugs: readonly string[]): string | undefined {
  const definition = enquiryFieldDefinitions[field.name];
  switch (definition.kind) {
    case "email":
      return PATTERNS.email.test(value) ? undefined : messages.email;
    case "tel":
      return PATTERNS.tel.test(value) ? undefined : messages.phone;
    case "url":
      return PATTERNS.url.test(value) ? undefined : messages.url;
    case "date":
      return PATTERNS.date.test(value) && !Number.isNaN(Date.parse(value)) ? undefined : messages.date;
    case "select":
      return definition.options?.includes(value) ? undefined : messages.option;
    case "product":
      return value === OTHER_PRODUCT_VALUE || productSlugs.includes(value) ? undefined : messages.product;
    case "textarea":
      return field.name === "message" && field.required && value.length < MIN_MESSAGE_LENGTH ? messages.message : undefined;
    default:
      return undefined;
  }
}

function isCoreField(field: EnquiryField): field is CoreField {
  return (CORE_FIELDS as readonly string[]).includes(field);
}

export function validateEnquiry(values: EnquiryValues, files: File[], productSlugs: readonly string[]): ValidationResult {
  const { type } = values;
  if (!isEnquiryType(type)) return { ok: false, errors: { type: messages.required } };

  const errors: EnquiryErrors = {};
  const core: Partial<Record<CoreField, string>> = {};
  const details: EnquiryDetail[] = [];
  let acceptedFiles: File[] = [];

  for (const field of formFields(type)) {
    if (enquiryFieldDefinitions[field.name].kind === "files") {
      const error = files.length === 0 ? (field.required ? messages.required : undefined) : attachmentsError(files);
      if (error) errors[field.name] = error;
      else acceptedFiles = files;
      continue;
    }

    const value = values[field.name] ?? "";
    const error = value ? formatError(field, value, productSlugs) : field.required ? messages.required : undefined;
    if (error) errors[field.name] = error;
    else if (value && isCoreField(field.name)) core[field.name] = value;
    else if (value) details.push({ label: fieldLabel(field), value });
  }

  const { name, email, ...optional } = core;
  if (Object.keys(errors).length > 0 || !name || !email) return { ok: false, errors };
  return { ok: true, enquiry: { type, name, email, ...optional, details }, files: acceptedFiles };
}
