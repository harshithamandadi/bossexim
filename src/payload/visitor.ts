/**
 * Helpers for the anonymous website beacons (visits, Aira questions): bot
 * filtering, a small rate limit and the visitor's country. No IP address or
 * other personal data is ever stored.
 */
import type { PayloadRequest } from "payload";

/** Country of a visitor whose location the host couldn't tell (e.g. local development). */
export const UNKNOWN_COUNTRY = "ZZ";

const BOT_PATTERN = /bot|crawl|spider|slurp|preview|lighthouse|headless|monitor|curl|wget|python|axios|httpclient/i;
const MOBILE_PATTERN = /mobi|android|iphone|ipad/i;

/** At most this many beacon writes per address per hour, per kind — a speed bump against scripted hits (in memory, per instance). */
const MAX_PER_HOUR = 30;
const HOUR_MS = 60 * 60 * 1000;
const recent = new Map<string, number[]>();

function isRateLimited(key: string, now = Date.now()): boolean {
  const times = (recent.get(key) ?? []).filter((time) => now - time < HOUR_MS);
  const limited = times.length >= MAX_PER_HOUR;
  if (!limited) times.push(now);
  recent.set(key, times);
  if (recent.size > 5000) recent.clear();
  return limited;
}

const regionNames = new Intl.DisplayNames(["en"], { type: "region" });

export function countryName(code: string): string {
  if (code === UNKNOWN_COUNTRY) return "Unknown";
  try {
    return regionNames.of(code) ?? code;
  } catch {
    return code;
  }
}

/** The visitor's country, from the hosting platform's geo header (Vercel, or Cloudflare in front). */
export function visitorCountry(headers: Headers): string {
  const code = (headers.get("x-vercel-ip-country") || headers.get("cf-ipcountry") || "").toUpperCase();
  return /^[A-Z]{2}$/.test(code) && code !== "XX" ? code : UNKNOWN_COUNTRY;
}

export function visitorDevice(headers: Headers): "mobile" | "desktop" {
  return MOBILE_PATTERN.test(headers.get("user-agent") ?? "") ? "mobile" : "desktop";
}

/**
 * Reads a beacon's JSON body, or returns null when the request should be
 * ignored (a bot, too many hits from one address, or a malformed body).
 */
export async function readBeacon<T extends object>(req: PayloadRequest, kind: string): Promise<Partial<T> | null> {
  const userAgent = req.headers.get("user-agent") ?? "";
  if (!userAgent || BOT_PATTERN.test(userAgent)) return null;
  const address = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
  if (isRateLimited(`${kind}:${address}`)) return null;
  try {
    const body: unknown = JSON.parse((await req.text?.()) || "{}");
    return body && typeof body === "object" ? (body as Partial<T>) : null;
  } catch {
    return null;
  }
}

/** A site path from a beacon, e.g. "/products" — anything else becomes "/". */
export function sitePath(value: unknown, maxLength = 200): string {
  return typeof value === "string" && value.startsWith("/") ? value.slice(0, maxLength) : "/";
}

export const beaconDone = () => new Response(null, { status: 204 });
