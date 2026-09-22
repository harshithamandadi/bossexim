/**
 * Delivers a validated enquiry. Server-only: reads environment variables.
 *
 * Set ENQUIRY_WEBHOOK_URL (see .env.example) to forward enquiries as JSON to any
 * inbox, CRM or automation tool. Swap this function's body to use an email API
 * instead — nothing else needs to change.
 */
import { enquiryTypes } from "@/config/contact";
import { siteConfig } from "@/config/site";
import { getCatalogue } from "@/lib/content/queries";
import type { Enquiry } from "./schema";

export class EnquiryDeliveryError extends Error {
  override name = "EnquiryDeliveryError";
}

async function toPayload(enquiry: Enquiry) {
  const catalogue = await getCatalogue();
  return {
    ...enquiry,
    typeLabel: enquiryTypes.find((type) => type.id === enquiry.type)?.label,
    productName: enquiry.product ? (catalogue.getProductBySlug(enquiry.product)?.name ?? enquiry.product) : undefined,
    submittedAt: new Date().toISOString(),
    source: siteConfig.url,
  };
}

export async function deliverEnquiry(enquiry: Enquiry): Promise<void> {
  const webhookUrl = process.env.ENQUIRY_WEBHOOK_URL;

  if (webhookUrl) {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(await toPayload(enquiry)),
    });
    if (!response.ok) throw new EnquiryDeliveryError(`Webhook responded with ${response.status}`);
    return;
  }

  if (process.env.NODE_ENV !== "production") {
    console.info("[enquiry] ENQUIRY_WEBHOOK_URL is not set — logging instead of delivering:", toPayload(enquiry));
    return;
  }

  throw new EnquiryDeliveryError("ENQUIRY_WEBHOOK_URL is not configured.");
}
