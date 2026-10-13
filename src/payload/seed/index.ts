/**
 * Loads the site's starting content into the CMS:   npm run seed
 *
 * Safe to run again — anything that already exists (matched by slug, code,
 * question, name or title) is left untouched, so editors' changes are kept.
 * Start over with:   SEED_RESET=true npm run seed   (deletes content, keeps users and enquiries)
 */
import config from "@payload-config";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  getPayload,
  type CollectionSlug,
  type Payload,
  type RequiredDataFromCollectionSlug,
  type Where,
} from "payload";
import {
  seedCompanyDetails,
  seedFaqs,
  seedGalleries,
  seedGroupCompanies,
  seedMarkets,
  seedProducts,
  seedResources,
  seedTeam,
} from "./data";

const IMAGES_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), "images");

/**
 * Seeding runs outside Next.js, so there are no pages to refresh. Each call gets its own
 * object: Payload writes per-request state into `context` (the cloud-storage plugin keeps the
 * uploaded file there), so a shared object makes every upload after the first one fail.
 */
const seedContext = () => ({ disableRevalidate: true });

const CONTENT: CollectionSlug[] = [
  "products",
  "markets",
  "faqs",
  "team-members",
  "galleries",
  "resources",
  "group-companies",
  "media",
];

const created: Partial<Record<CollectionSlug, number>> = {};

/** Finds a document matching `where`, creating it from `data` if there is none. */
async function ensure<T extends CollectionSlug>(
  payload: Payload,
  collection: T,
  where: Where,
  data: RequiredDataFromCollectionSlug<T>,
) {
  const { docs } = await payload.find({ collection, where, limit: 1, depth: 0 });
  if (docs[0]) return docs[0];
  created[collection] = (created[collection] ?? 0) + 1;
  return payload.create({ collection, data, context: seedContext() });
}

async function reset(payload: Payload) {
  for (const collection of CONTENT) {
    await payload.delete({ collection, where: { id: { exists: true } }, context: seedContext() });
  }
  payload.logger.info("Removed existing content (users kept).");
}

async function seedAdmin(payload: Payload) {
  const { SEED_ADMIN_EMAIL: email, SEED_ADMIN_PASSWORD: password } = process.env;
  const { totalDocs } = await payload.count({ collection: "users" });
  if (totalDocs > 0) return;
  if (!email || !password) {
    payload.logger.info("No users yet — create the first admin account at /admin.");
    return;
  }
  await payload.create({ collection: "users", data: { email, password, name: "Site admin", role: "admin" }, context: seedContext() });
  payload.logger.info(`Created admin account ${email}.`);
}

async function uploadPhotos(payload: Payload, photos: { file: string; alt: string }[]): Promise<number[]> {
  const ids: number[] = [];
  for (const photo of photos) {
    const doc = await payload.create({
      collection: "media",
      data: { alt: photo.alt },
      filePath: path.join(IMAGES_DIR, photo.file),
      context: seedContext(),
    });
    ids.push(doc.id);
  }
  return ids;
}

/** The general email before the company's final documents (Oct 2026) — replaced by the new one. */
const RETIRED_EMAILS = ["bgexim@bossgrp.com"];

/** Fills in contact details from the brief, without overwriting anything entered in the admin. */
async function fillCompanyDetails(payload: Payload) {
  const current = await payload.findGlobal({ slug: "company-details", depth: 0 });
  const kept = Object.entries(current.contact ?? {}).filter(([, value]) => value && !RETIRED_EMAILS.includes(String(value)));
  const contact = { ...seedCompanyDetails.contact, ...Object.fromEntries(kept) };
  await payload.updateGlobal({ slug: "company-details", data: { contact }, context: seedContext() });
}

async function seed() {
  // Vercel runs this on every build; it only seeds when SEED_ON_BUILD=true, so a later
  // deploy never brings back content an editor deleted.
  if (process.env.VERCEL && process.env.SEED_ON_BUILD !== "true") {
    console.log("Seed skipped (set SEED_ON_BUILD=true to load the starting content).");
    return;
  }

  const payload = await getPayload({ config });
  // SEED_RESET=true starts the content over (on Vercel: for one deploy, then remove the variable).
  const resetRequested = process.argv.includes("--reset") || process.env.SEED_RESET === "true";
  if (resetRequested) await reset(payload);

  const marketIds = new Map<string, number>();
  for (const market of seedMarkets) {
    const doc = await ensure(payload, "markets", { code: { equals: market.code } }, market);
    marketIds.set(market.code, doc.id);
  }

  for (const { photos = [], ...product } of seedProducts) {
    const markets = product.direction === "export" ? product.markets.flatMap((code) => marketIds.get(code) ?? []) : [];
    const exists = await payload.count({ collection: "products", where: { slug: { equals: product.slug } } });
    const images = exists.totalDocs > 0 ? [] : await uploadPhotos(payload, photos);
    await ensure(payload, "products", { slug: { equals: product.slug } }, { ...product, markets, images });
  }

  for (const { photo, ...member } of seedTeam) {
    const exists = await payload.count({ collection: "team-members", where: { name: { equals: member.name } } });
    const [photoId] = exists.totalDocs > 0 || !photo ? [] : await uploadPhotos(payload, [photo]);
    await ensure(payload, "team-members", { name: { equals: member.name } }, { ...member, photo: photoId });
  }

  for (const faq of seedFaqs) {
    await ensure(payload, "faqs", { question: { equals: faq.question } }, faq);
  }
  for (const company of seedGroupCompanies) {
    await ensure(payload, "group-companies", { name: { equals: company.name } }, company);
  }
  for (const { photos = [], ...gallery } of seedGalleries) {
    const exists = await payload.count({ collection: "galleries", where: { title: { equals: gallery.title } } });
    const images = exists.totalDocs > 0 ? [] : await uploadPhotos(payload, photos);
    await ensure(payload, "galleries", { title: { equals: gallery.title } }, { ...gallery, images });
  }
  for (const resource of seedResources) {
    await ensure(payload, "resources", { title: { equals: resource.title } }, resource);
  }

  await fillCompanyDetails(payload);
  await seedAdmin(payload);

  const summary = Object.entries(created).map(([collection, count]) => `${count} ${collection}`);
  payload.logger.info(summary.length ? `Seeded ${summary.join(", ")}.` : "Nothing to add — content already exists.");
}

await seed();
process.exit(0);
