/**
 * Email through the company's own mailbox (SMTP) — enquiry alerts,
 * acknowledgements and admin password resets. With SMTP_HOST unset, email is
 * off: enquiries are still saved in the admin, and Payload logs its own
 * emails (password resets) to the server console.
 */
import { nodemailerAdapter } from "@payloadcms/email-nodemailer";
import { siteConfig } from "@/config/site";
import { requiredEnv } from "@/lib/env";

const SMTPS_PORT = 465;

export function isEmailConfigured(): boolean {
  return Boolean(process.env.SMTP_HOST);
}

export function smtpEmailAdapter() {
  if (!isEmailConfigured()) return undefined;

  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  return nodemailerAdapter({
    defaultFromAddress: requiredEnv("EMAIL_FROM_ADDRESS"),
    defaultFromName: process.env.EMAIL_FROM_NAME || siteConfig.company.name,
    // Checking the connection at startup would slow every build; send failures
    // are recorded on each enquiry instead.
    skipVerify: true,
    transportOptions: {
      host: requiredEnv("SMTP_HOST"),
      port,
      secure: port === SMTPS_PORT,
      auth: user ? { user, pass: process.env.SMTP_PASS } : undefined,
    },
  });
}
