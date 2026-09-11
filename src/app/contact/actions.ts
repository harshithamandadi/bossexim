"use server";

import { contactContent } from "@/config/contact";
import { deliverEnquiry } from "@/lib/enquiry/deliver";
import { isHoneypotFilled, readEnquiryValues, validateEnquiry, type EnquiryFormState } from "@/lib/enquiry/schema";

const { errors } = contactContent.form;

export async function submitEnquiry(_previous: EnquiryFormState, formData: FormData): Promise<EnquiryFormState> {
  // Pretend success for bots so they don't retry.
  if (isHoneypotFilled(formData)) return { status: "success" };

  const values = readEnquiryValues(formData);
  const result = validateEnquiry(values);
  if (!result.ok) return { status: "error", message: errors.invalid, errors: result.errors, values };

  try {
    await deliverEnquiry(result.enquiry);
  } catch (error) {
    console.error("[enquiry] delivery failed", error);
    return { status: "error", message: errors.delivery, values };
  }

  return { status: "success" };
}
