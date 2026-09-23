/**
 * Delivers a validated enquiry through every channel that is set up:
 *  1. saves it in the admin (Inbox → Enquiries) — the safety net;
 *  2. emails the team (Company details → Enquiry emails), with reply-to set to the enquirer;
 *  3. emails the enquirer a confirmation;
 *  4. optionally posts it as JSON to ENQUIRY_WEBHOOK_URL.
 * It counts as delivered when it was saved, emailed to the team or posted, so
 * a failed email alone never loses a lead — it shows as "Failed" in the admin.
 */
import "server-only";
import type { Payload, SendEmailOptions } from "payload";
import { contactContent, enquiryTypes } from "@/config/contact";
import { pageContent } from "@/config/pages";
import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import type { Catalogue } from "@/lib/catalogue";
import { getPayloadClient } from "@/lib/content/payload-client";
import { getCatalogue, getCompanyDetails, getEnquiryRecipients } from "@/lib/content/queries";
import type { DeliveryStatus } from "@/payload/collections/enquiries";
import { isEmailConfigured } from "@/payload/email";
import { acknowledgementEmail, notificationEmail, type ResolvedEnquiry } from "./emails";
import { OTHER_PRODUCT_VALUE, type Enquiry } from "./schema";

interface ChannelResult {
  status: DeliveryStatus;
  detail?: string;
}

type WebhookResult = "sent" | "failed" | "off";

const MAX_DETAIL_LENGTH = 200;

/** Pages that host the enquiry form, and how they're named in the admin and emails. */
const SOURCE_LABELS: Record<string, string> = {
  [routes.contact]: pageContent.contact.metaTitle,
  [routes.partner]: pageContent.partner.metaTitle,
};

const DETAILS = {
  notConfigured: "Email isn't set up on the server yet (SMTP) — ask your developer.",
  noRecipients: "Nobody to notify — add recipients in Settings → Company details → Enquiry emails.",
  sentTo: "Sent to",
};

function describeError(error: unknown): string {
  return (error instanceof Error ? error.message : String(error)).slice(0, MAX_DETAIL_LENGTH);
}

/** Where links in emails point, e.g. the enquiry in the admin. */
function siteUrl(): string {
  return (process.env.SITE_URL || siteConfig.url).replace(/\/+$/, "");
}

function resolve(enquiry: Enquiry, catalogue: Catalogue): ResolvedEnquiry {
  const typeLabel = enquiryTypes.find((type) => type.id === enquiry.type)?.label ?? enquiry.type;
  const productName =
    enquiry.product === OTHER_PRODUCT_VALUE
      ? contactContent.form.fields.product.other
      : enquiry.product && catalogue.getProductBySlug(enquiry.product)?.name;
  return { ...enquiry, typeLabel, productName: productName || undefined };
}

async function saveEnquiry(payload: Payload, enquiry: ResolvedEnquiry, source?: string): Promise<number | undefined> {
  try {
    const doc = await payload.create({
      collection: "enquiries",
      data: {
        type: enquiry.type,
        name: enquiry.name,
        company: enquiry.company,
        email: enquiry.email,
        phone: enquiry.phone,
        country: enquiry.country,
        product: enquiry.productName,
        quantity: enquiry.quantity,
        partnershipArea: enquiry.partnershipArea,
        message: enquiry.message,
        source,
      },
    });
    return doc.id;
  } catch (error) {
    payload.logger.error({ err: error, msg: "[enquiry] Could not save the enquiry in the admin." });
    return undefined;
  }
}

async function sendEmail(payload: Payload, message: SendEmailOptions): Promise<ChannelResult> {
  try {
    await payload.sendEmail(message);
    return { status: "sent" };
  } catch (error) {
    payload.logger.error({ err: error, msg: "[enquiry] Email could not be sent." });
    return { status: "failed", detail: describeError(error) };
  }
}

async function notifyTeam(
  payload: Payload,
  enquiry: ResolvedEnquiry,
  recipients: string[],
  context: Parameters<typeof notificationEmail>[1],
): Promise<ChannelResult> {
  if (!isEmailConfigured()) return { status: "not-configured", detail: DETAILS.notConfigured };
  if (recipients.length === 0) return { status: "no-recipients", detail: DETAILS.noRecipients };

  const result = await sendEmail(payload, {
    to: recipients,
    replyTo: { name: enquiry.name, address: enquiry.email },
    ...notificationEmail(enquiry, context),
  });
  return result.status === "sent" ? { status: "sent", detail: `${DETAILS.sentTo} ${recipients.join(", ")}` } : result;
}

async function acknowledge(payload: Payload, enquiry: ResolvedEnquiry, replyTo?: string): Promise<ChannelResult> {
  if (!isEmailConfigured()) return { status: "not-configured" };
  return sendEmail(payload, {
    to: enquiry.email,
    ...(replyTo ? { replyTo } : {}),
    ...acknowledgementEmail(enquiry),
  });
}

async function postToWebhook(payload: Payload, enquiry: ResolvedEnquiry, submittedAt: Date, source?: string): Promise<WebhookResult> {
  const webhookUrl = process.env.ENQUIRY_WEBHOOK_URL;
  if (!webhookUrl) return "off";
  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...enquiry, submittedAt: submittedAt.toISOString(), source, site: siteConfig.url }),
    });
    if (!response.ok) throw new Error(`Webhook responded with ${response.status}`);
    return "sent";
  } catch (error) {
    payload.logger.error({ err: error, msg: "[enquiry] Webhook delivery failed." });
    return "failed";
  }
}

async function recordOutcome(payload: Payload, id: number, notification: ChannelResult, acknowledgement: ChannelResult) {
  try {
    await payload.update({
      collection: "enquiries",
      id,
      data: {
        notificationStatus: notification.status,
        notificationDetail: notification.detail,
        acknowledgementStatus: acknowledgement.status,
      },
    });
  } catch (error) {
    payload.logger.error({ err: error, msg: `[enquiry] Could not record delivery status for enquiry ${id}.` });
  }
}

/** Returns true when the enquiry reached the business through at least one channel. */
export async function deliverEnquiry(enquiry: Enquiry, sourcePath?: string): Promise<boolean> {
  const payload = await getPayloadClient();
  const [catalogue, recipients, company] = await Promise.all([
    getCatalogue(),
    getEnquiryRecipients(enquiry.type),
    getCompanyDetails(),
  ]);
  const resolved = resolve(enquiry, catalogue);
  const source = sourcePath ? SOURCE_LABELS[sourcePath] : undefined;
  const submittedAt = new Date();

  const id = await saveEnquiry(payload, resolved, source);
  const notification = await notifyTeam(payload, resolved, recipients, {
    adminUrl: id === undefined ? undefined : `${siteUrl()}/admin/collections/enquiries/${id}`,
    sourceLabel: source,
    submittedAt,
  });
  const acknowledgement = await acknowledge(payload, resolved, company.contact.email);
  const webhook = await postToWebhook(payload, resolved, submittedAt, source);
  if (id !== undefined) await recordOutcome(payload, id, notification, acknowledgement);

  const delivered = id !== undefined || notification.status === "sent" || webhook === "sent";
  if (delivered) {
    payload.logger.info(`[enquiry] ${resolved.typeLabel} #${id ?? "unsaved"} — email alert: ${notification.status}.`);
  } else {
    // Every channel failed: keep the enquiry in the server log so it can still be recovered.
    payload.logger.error({ enquiry: resolved, msg: "[enquiry] NOT DELIVERED — every channel failed." });
  }
  return delivered;
}
