/**
 * Reads content from the CMS (Payload's Local API — no HTTP round trip).
 * Each query is wrapped in React `cache`, so a page hits the database once per
 * render however many components ask. Pages are rebuilt when content changes
 * (see src/payload/hooks/revalidate.ts).
 */
import "server-only";
import { cache } from "react";
import { createCatalogue } from "@/lib/catalogue";
import { getHighlightStats } from "@/lib/stats";
import type { EnquiryTypeId } from "@/types/content";
import { getPayloadClient as getClient } from "./payload-client";
import {
  toCompanyDetails,
  toEnquiryRecipients,
  toFaq,
  toGallery,
  toGroupCompany,
  toMarket,
  toProduct,
  toResource,
  toTeamMember,
} from "./mappers";

/** Every document, in the order editors arranged them in the admin. */
const ALL_IN_ORDER = { pagination: false, sort: "_order" } as const;

const getMarketDocs = cache(async () => {
  const payload = await getClient();
  const { docs } = await payload.find({ collection: "markets", depth: 0, ...ALL_IN_ORDER });
  return docs;
});

export const getMarkets = cache(async () => (await getMarketDocs()).map(toMarket));

export const getProducts = cache(async () => {
  const [payload, marketDocs] = await Promise.all([getClient(), getMarketDocs()]);
  const marketCodes = new Map(marketDocs.map((market) => [market.id, market.code]));
  const { docs } = await payload.find({ collection: "products", depth: 0, ...ALL_IN_ORDER });
  return docs.map((doc) => toProduct(doc, marketCodes));
});

export const getCatalogue = cache(async () => {
  const [products, markets] = await Promise.all([getProducts(), getMarkets()]);
  return createCatalogue(products, markets);
});

export const getFaqs = cache(async () => {
  const payload = await getClient();
  const { docs } = await payload.find({ collection: "faqs", depth: 0, ...ALL_IN_ORDER });
  return docs.map(toFaq);
});

export const getTeamMembers = cache(async () => {
  const payload = await getClient();
  const { docs } = await payload.find({ collection: "team-members", depth: 1, ...ALL_IN_ORDER });
  return docs.map(toTeamMember);
});

export const getGalleries = cache(async () => {
  const payload = await getClient();
  const { docs } = await payload.find({ collection: "galleries", depth: 1, ...ALL_IN_ORDER });
  return docs.map(toGallery);
});

export const getResources = cache(async () => {
  const payload = await getClient();
  const { docs } = await payload.find({ collection: "resources", depth: 1, ...ALL_IN_ORDER });
  return docs.map(toResource);
});

export const getGroupCompanies = cache(async () => {
  const payload = await getClient();
  const { docs } = await payload.find({ collection: "group-companies", depth: 0, ...ALL_IN_ORDER });
  return docs.map(toGroupCompany);
});

const getCompanyDetailsDoc = cache(async () => {
  const payload = await getClient();
  return payload.findGlobal({ slug: "company-details", depth: 0 });
});

export const getCompanyDetails = cache(async () => toCompanyDetails(await getCompanyDetailsDoc()));

/** Who is emailed about a new enquiry of this type (set in Company details → Enquiry emails). */
export async function getEnquiryRecipients(type: EnquiryTypeId): Promise<string[]> {
  return toEnquiryRecipients(await getCompanyDetailsDoc(), type);
}

/** Headline figures shown on the home and About pages. */
export const getSiteStats = cache(async () => {
  const [catalogue, groupCompanies] = await Promise.all([getCatalogue(), getGroupCompanies()]);
  return getHighlightStats(catalogue, groupCompanies);
});
