import type { CollectionConfig, PayloadRequest } from "payload";
import { isAdmin, isSignedIn } from "../access";
import { ADMIN_GROUPS } from "../fields";

/** Country of a visitor whose location the host couldn't tell (e.g. local development). */
export const UNKNOWN_COUNTRY = "ZZ";

const BOT_PATTERN = /bot|crawl|spider|slurp|preview|lighthouse|headless|monitor|curl|wget|python|axios|httpclient/i;
const MOBILE_PATTERN = /mobi|android|iphone|ipad/i;
const MAX_PAGE_LENGTH = 200;

/** At most this many visits per address per hour — a speed bump against scripted hits (in memory, per instance). */
const MAX_VISITS_PER_HOUR = 20;
const HOUR_MS = 60 * 60 * 1000;
const recentVisits = new Map<string, number[]>();

function isRateLimited(address: string, now = Date.now()): boolean {
  const recent = (recentVisits.get(address) ?? []).filter((time) => now - time < HOUR_MS);
  const limited = recent.length >= MAX_VISITS_PER_HOUR;
  if (!limited) recent.push(now);
  recentVisits.set(address, recent);
  if (recentVisits.size > 5000) recentVisits.clear();
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
function visitorCountry(headers: Headers): string {
  const code = (headers.get("x-vercel-ip-country") || headers.get("cf-ipcountry") || "").toUpperCase();
  return /^[A-Z]{2}$/.test(code) && code !== "XX" ? code : UNKNOWN_COUNTRY;
}

function referrerHost(value: unknown, ownHost: string | null): string | undefined {
  if (typeof value !== "string" || !value) return undefined;
  try {
    const host = new URL(value).hostname.replace(/^www\./, "");
    return host && host !== ownHost?.replace(/^www\./, "").split(":")[0] ? host : undefined;
  } catch {
    return undefined;
  }
}

/**
 * POST /api/site-visits/track — called once per browser session by the website's
 * visit beacon. Stores no IP address or other personal data: only the country,
 * landing page, referring site and device type.
 */
async function track(req: PayloadRequest): Promise<Response> {
  const done = () => new Response(null, { status: 204 });
  const userAgent = req.headers.get("user-agent") ?? "";
  if (!userAgent || BOT_PATTERN.test(userAgent)) return done();

  const address = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
  if (isRateLimited(address)) return done();

  let body: { page?: unknown; referrer?: unknown } = {};
  try {
    body = JSON.parse((await req.text?.()) || "{}");
  } catch {
    return new Response(null, { status: 400 });
  }
  const page = typeof body.page === "string" && body.page.startsWith("/") ? body.page.slice(0, MAX_PAGE_LENGTH) : "/";
  const country = visitorCountry(req.headers);

  await req.payload.create({
    collection: "site-visits",
    overrideAccess: true,
    data: {
      country,
      countryName: countryName(country),
      page,
      referrer: referrerHost(body.referrer, req.headers.get("host")),
      device: MOBILE_PATTERN.test(userAgent) ? "mobile" : "desktop",
    },
  });
  return done();
}

/** Website visits (one per browser session), summarised by country on the dashboard. */
export const SiteVisits: CollectionConfig = {
  slug: "site-visits",
  labels: { singular: "Website visit", plural: "Website visits" },
  access: {
    read: isSignedIn,
    create: () => false,
    update: () => false,
    delete: isAdmin,
  },
  admin: {
    group: ADMIN_GROUPS.insights,
    useAsTitle: "countryName",
    defaultColumns: ["countryName", "page", "referrer", "device", "createdAt"],
    description:
      "One row per visit (a browser session), recorded by the website. No IP addresses or personal details are stored. The dashboard shows the totals by country.",
  },
  endpoints: [{ path: "/track", method: "post", handler: track }],
  fields: [
    { name: "country", label: "Country code", type: "text", required: true, index: true },
    { name: "countryName", label: "Country", type: "text" },
    { name: "page", label: "Landing page", type: "text" },
    { name: "referrer", label: "Came from", type: "text" },
    {
      name: "device",
      type: "select",
      options: [
        { label: "Desktop", value: "desktop" },
        { label: "Mobile", value: "mobile" },
      ],
    },
  ],
};
