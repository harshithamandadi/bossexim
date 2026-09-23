/**
 * A signed timestamp placed in the enquiry form when the page is rendered.
 * Bots that post straight to the form have no valid token, and bots that fill
 * the form instantly fail the minimum time. Tokens never expire, so a tab left
 * open for days still works.
 */
import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { requiredEnv } from "@/lib/env";

/** A person needs longer than this to fill in the form. */
const MIN_FILL_MS = 3000;

function sign(issuedAt: string): Buffer {
  return createHmac("sha256", requiredEnv("PAYLOAD_SECRET")).update(`enquiry-form:${issuedAt}`).digest();
}

export function createFormToken(): string {
  const issuedAt = String(Date.now());
  return `${issuedAt}.${sign(issuedAt).toString("base64url")}`;
}

export type FormTokenCheck = "valid" | "too-fast" | "invalid";

export function checkFormToken(token: unknown, now = Date.now()): FormTokenCheck {
  if (typeof token !== "string") return "invalid";
  const [issuedAt = "", signature = ""] = token.split(".");
  if (!/^\d+$/.test(issuedAt)) return "invalid";
  const expected = sign(issuedAt);
  const given = Buffer.from(signature, "base64url");
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return "invalid";
  return now - Number(issuedAt) < MIN_FILL_MS ? "too-fast" : "valid";
}
