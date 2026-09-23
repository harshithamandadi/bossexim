"use server";

import { headers } from "next/headers";
import { contactContent } from "@/config/contact";
import { getCatalogue, getCompanyDetails } from "@/lib/content/queries";
import { deliverEnquiry } from "@/lib/enquiry/deliver";
import { checkFormToken } from "@/lib/enquiry/form-token";
import { isRateLimited } from "@/lib/enquiry/rate-limit";
import {
  FORM_TOKEN_FIELD,
  SOURCE_FIELD,
  isHoneypotFilled,
  readEnquiryValues,
  validateEnquiry,
  type EnquiryFormState,
} from "@/lib/enquiry/schema";

const { errors } = contactContent.form;

/** Best-effort visitor address for rate limiting; set by the hosting platform's proxy. */
async function clientAddress(): Promise<string> {
  const requestHeaders = await headers();
  return requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() || requestHeaders.get("x-real-ip") || "unknown";
}

export async function submitEnquiry(_previous: EnquiryFormState, formData: FormData): Promise<EnquiryFormState> {
  // Pretend success for bots so they don't retry.
  if (isHoneypotFilled(formData)) return { status: "success" };

  const values = readEnquiryValues(formData);
  const [{ products }, { contact }] = await Promise.all([getCatalogue(), getCompanyDetails()]);
  const fallbackEmail = contact.email;

  const token = checkFormToken(formData.get(FORM_TOKEN_FIELD));
  if (token === "invalid") return { status: "error", message: errors.expired, values, fallbackEmail };

  const result = validateEnquiry(
    values,
    products.map((product) => product.slug),
  );
  if (!result.ok) return { status: "error", message: errors.invalid, errors: result.errors, values };
  if (token === "too-fast") return { status: "error", message: errors.tooFast, values };
  if (isRateLimited(await clientAddress())) {
    return { status: "error", message: errors.rateLimited, values, fallbackEmail };
  }

  const delivered = await deliverEnquiry(result.enquiry, String(formData.get(SOURCE_FIELD) ?? ""));
  return delivered ? { status: "success" } : { status: "error", message: errors.delivery, values, fallbackEmail };
}
