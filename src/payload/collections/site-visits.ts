import type { CollectionConfig, PayloadRequest } from "payload";
import { isAdmin, isSignedIn } from "../access";
import { ADMIN_GROUPS } from "../fields";
import { beaconDone, countryName, readBeacon, sitePath, visitorCountry, visitorDevice } from "../visitor";

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
  const body = await readBeacon<{ page: string; referrer: string }>(req, "visit");
  if (!body) return beaconDone();

  const country = visitorCountry(req.headers);
  await req.payload.create({
    collection: "site-visits",
    overrideAccess: true,
    data: {
      country,
      countryName: countryName(country),
      page: sitePath(body.page),
      referrer: referrerHost(body.referrer, req.headers.get("host")),
      device: visitorDevice(req.headers),
    },
  });
  return beaconDone();
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
  defaultSort: "-createdAt",
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
