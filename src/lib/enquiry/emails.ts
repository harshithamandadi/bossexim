/**
 * The two emails an enquiry triggers: an alert to the team and a confirmation
 * to the enquirer. Everything from the form is HTML-escaped. The confirmation
 * deliberately repeats none of the visitor's free text, so the form can't be
 * used to send someone else a message of an attacker's choosing.
 */
import { contactContent, enquiryEmails, enquiryFormFields } from "@/config/contact";
import { siteConfig } from "@/config/site";
import type { Enquiry } from "./schema";

/** An enquiry with its display names filled in. */
export interface ResolvedEnquiry extends Enquiry {
  typeLabel: string;
  /** The product's name, or "Other / not listed". */
  productName?: string;
}

export interface EmailContent {
  subject: string;
  html: string;
  text: string;
}

const BRAND_BLUE = "#1560bd";
const NAVY = "#0e2f73";
const MUTED = "#5a7196";
const FONT = "-apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
const MAX_SUBJECT_LENGTH = 160;

const HTML_ESCAPES: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => HTML_ESCAPES[character] ?? character);
}

function toSubject(text: string): string {
  return text.replace(/\s+/g, " ").trim().slice(0, MAX_SUBJECT_LENGTH);
}

/** The enquiry's answers as label/value rows, in the form's order and with its labels. */
function answerRows(enquiry: ResolvedEnquiry): [string, string][] {
  const defaults = contactContent.form.fields;
  return enquiryFormFields[enquiry.type].flatMap((field) => {
    if (field.name === "message") return [];
    const value = field.name === "product" ? enquiry.productName : enquiry[field.name];
    return value ? [[field.label ?? defaults[field.name].label, value] as [string, string]] : [];
  });
}

function layout(title: string, body: string): string {
  return `<!doctype html>
<html><body style="margin:0;padding:24px;background:#eef4fc;font-family:${FONT};color:${NAVY};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;">
<tr><td style="background:${BRAND_BLUE};padding:20px 28px;color:#ffffff;font-size:15px;font-weight:700;">${escapeHtml(siteConfig.company.name)}</td></tr>
<tr><td style="padding:28px;">
<h1 style="margin:0 0 16px;font-size:20px;line-height:1.3;">${title}</h1>
${body}
</td></tr>
</table>
</body></html>`;
}

const paragraph = (html: string) => `<p style="margin:0 0 14px;font-size:15px;line-height:1.6;">${html}</p>`;
const note = (html: string) => `<p style="margin:16px 0 0;font-size:13px;line-height:1.5;color:${MUTED};">${html}</p>`;

interface NotificationContext {
  /** Link to this enquiry in the admin, when it was saved. */
  adminUrl?: string;
  sourceLabel?: string;
  submittedAt: Date;
}

export function notificationEmail(enquiry: ResolvedEnquiry, { adminUrl, sourceLabel, submittedAt }: NotificationContext): EmailContent {
  const copy = enquiryEmails.notification;
  const rows = answerRows(enquiry);
  const who = enquiry.company ? `${enquiry.name} (${enquiry.company})` : enquiry.name;
  const topic = enquiry.productName ? `: ${enquiry.productName}` : "";
  const subject = toSubject(`${copy.subjectPrefix} ${enquiry.typeLabel.toLowerCase()}${topic} — ${who}`);
  const submitted = submittedAt.toUTCString();

  const tableRows = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:8px 16px 8px 0;font-size:13px;color:${MUTED};white-space:nowrap;vertical-align:top;">${escapeHtml(label)}</td>` +
        `<td style="padding:8px 0;font-size:15px;">${escapeHtml(value)}</td></tr>`,
    )
    .join("");

  const html = layout(
    escapeHtml(`${copy.subjectPrefix} ${enquiry.typeLabel.toLowerCase()}`),
    [
      paragraph(escapeHtml(copy.intro)),
      `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 16px;border-collapse:collapse;">${tableRows}</table>`,
      `<div style="padding:16px;border-radius:12px;background:#eef4fc;font-size:15px;line-height:1.6;white-space:pre-wrap;">${escapeHtml(enquiry.message)}</div>`,
      note(escapeHtml(copy.replyHint)),
      adminUrl
        ? `<p style="margin:20px 0 0;"><a href="${escapeHtml(adminUrl)}" style="display:inline-block;padding:10px 18px;border-radius:999px;background:${BRAND_BLUE};color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;">${escapeHtml(copy.viewInAdmin)}</a></p>`
        : "",
      note(escapeHtml(`${copy.submitted}: ${submitted}${sourceLabel ? ` · ${copy.sentFrom}: ${sourceLabel}` : ""}`)),
    ].join("\n"),
  );

  const text = [
    copy.intro,
    "",
    ...rows.map(([label, value]) => `${label}: ${value}`),
    "",
    enquiry.message,
    "",
    copy.replyHint,
    ...(adminUrl ? [`${copy.viewInAdmin}: ${adminUrl}`] : []),
    `${copy.submitted}: ${submitted}${sourceLabel ? ` · ${copy.sentFrom}: ${sourceLabel}` : ""}`,
  ].join("\n");

  return { subject, html, text };
}

/** Letters, spaces and common name punctuation only — never links or other free text. */
function greetingName(name: string): string {
  return name
    .replace(/[^\p{L}\p{M}\s.'-]/gu, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 60);
}

export function acknowledgementEmail(enquiry: ResolvedEnquiry): EmailContent {
  const copy = enquiryEmails.acknowledgement;
  const { name: companyName, legalName } = siteConfig.company;
  const person = greetingName(enquiry.name);
  const greeting = person ? `${copy.greeting} ${person},` : `${copy.greeting},`;
  const topic = `${enquiry.typeLabel.toLowerCase()}${enquiry.productName ? ` ${copy.about} ${enquiry.productName}` : ""}`;
  const received = `${copy.body} ${topic}.`;

  const html = layout(
    escapeHtml(copy.subject),
    [
      paragraph(escapeHtml(greeting)),
      paragraph(escapeHtml(received)),
      paragraph(escapeHtml(copy.closing)),
      paragraph(`${escapeHtml(copy.signOff)}<br><strong>${escapeHtml(companyName)}</strong>`),
      note(`${escapeHtml(legalName)} · <a href="${escapeHtml(siteConfig.url)}" style="color:${MUTED};">${escapeHtml(siteConfig.website)}</a>`),
    ].join("\n"),
  );

  const text = [greeting, "", received, "", copy.closing, "", copy.signOff, companyName, "", `${legalName} · ${siteConfig.url}`].join("\n");

  return { subject: toSubject(`${copy.subject} — ${companyName}`), html, text };
}
