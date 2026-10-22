"use server";

import { headers } from "next/headers";
import { contactContent } from "@/config/contact";
import { getCatalogue, getCompanyDetails } from "@/lib/content/queries";
import { AIRA_SOURCE, toAssistantEnquiry, toCallbackEnquiry } from "@/lib/enquiry/assistant";
import { deliverEnquiry } from "@/lib/enquiry/deliver";
import { checkFormToken } from "@/lib/enquiry/form-token";
import { isRateLimited } from "@/lib/enquiry/rate-limit";
import {
  FORM_TOKEN_FIELD,
  SOURCE_FIELD,
  isHoneypotFilled,
  readAttachments,
  readEnquiryValues,
  validateEnquiry,
  type Enquiry,
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
    readAttachments(formData),
    products.map((product) => product.slug),
  );
  if (!result.ok) return { status: "error", message: errors.invalid, errors: result.errors, values };
  if (token === "too-fast") return { status: "error", message: errors.tooFast, values };
  if (isRateLimited(await clientAddress())) {
    return { status: "error", message: errors.rateLimited, values, fallbackEmail };
  }

  const { delivered, reference } = await deliverEnquiry(result.enquiry, {
    source: String(formData.get(SOURCE_FIELD) ?? ""),
    files: result.files,
  });
  return delivered ? { status: "success", reference } : { status: "error", message: errors.delivery, values, fallbackEmail };
}

export type AssistantSubmission = { ok: true; reference?: string } | { ok: false; fallbackEmail?: string };

/** A buying enquiry put together in the chat with Aira (see config/chatbot.ts). */
const MAX_TRANSCRIPT_LENGTH = 6000;

/** Adds AIRA's chat to the enquiry as a "Chat summary" detail, so it reaches the sales team's email. */
function withTranscript(enquiry: Enquiry, transcript: unknown): Enquiry {
  if (typeof transcript !== "string" || !transcript.trim()) return enquiry;
  return { ...enquiry, details: [...enquiry.details, { label: "Chat summary", value: transcript.trim().slice(-MAX_TRANSCRIPT_LENGTH) }] };
}

export async function submitAssistantEnquiry(answers: unknown, formToken: unknown, transcript?: unknown): Promise<AssistantSubmission> {
  const [{ products }, { contact }] = await Promise.all([getCatalogue(), getCompanyDetails()]);
  const fallbackEmail = contact.email;

  if (checkFormToken(formToken) !== "valid") return { ok: false, fallbackEmail };
  const enquiry = toAssistantEnquiry(
    answers,
    products.map((product) => product.slug),
  );
  if (!enquiry || isRateLimited(await clientAddress())) return { ok: false, fallbackEmail };

  const { delivered, reference } = await deliverEnquiry(withTranscript(enquiry, transcript), { source: AIRA_SOURCE });
  return delivered ? { ok: true, reference } : { ok: false, fallbackEmail };
}

/** A call-back request from Aira: name, email and optionally phone and topic. */
export async function submitAssistantCallback(answers: unknown, formToken: unknown, transcript?: unknown): Promise<AssistantSubmission> {
  const { contact } = await getCompanyDetails();
  const fallbackEmail = contact.email;
  if (checkFormToken(formToken) !== "valid") return { ok: false, fallbackEmail };
  const enquiry = toCallbackEnquiry(answers);
  if (!enquiry || isRateLimited(await clientAddress())) return { ok: false, fallbackEmail };
  const { delivered, reference } = await deliverEnquiry(withTranscript(enquiry, transcript), { source: AIRA_SOURCE });
  return delivered ? { ok: true, reference } : { ok: false, fallbackEmail };
}
