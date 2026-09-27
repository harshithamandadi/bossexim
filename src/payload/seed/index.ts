/**
 * Loads the site's starting content into the CMS:   npm run seed
 *
 * Safe to run again — anything that already exists (matched by slug, code,
 * question, name or title) is left untouched, so editors' changes are kept.
 * Start over with:   npm run seed -- --reset   (deletes content, keeps users)
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

/** Seeding runs outside Next.js, so there are no pages to refresh. */
const context = { disableRevalidate: true };

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
  return payload.create({ collection, data, context });
}

async function reset(payload: Payload) {
  for (const collection of CONTENT) {
    await payload.delete({ collection, where: { id: { exists: true } }, context });
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
  await payload.create({ collection: "users", data: { email, password, name: "Site admin", role: "admin" }, context });
  payload.logger.info(`Created admin account ${email}.`);
}

async function uploadPhotos(payload: Payload, photos: { file: string; alt: string }[]): Promise<number[]> {
  const ids: number[] = [];
  for (const photo of photos) {
    const doc = await payload.create({
      collection: "media",
      data: { alt: photo.alt },
      filePath: path.join(IMAGES_DIR, photo.file),
      context,
    });
    ids.push(doc.id);
  }
  return ids;
}

/** Fills in contact details from the brief, without overwriting anything entered in the admin. */
async function fillCompanyDetails(payload: Payload) {
  const current = await payload.findGlobal({ slug: "company-details", depth: 0 });
  const contact = { ...seedCompanyDetails.contact, ...Object.fromEntries(Object.entries(current.contact ?? {}).filter(([, value]) => value)) };
  await payload.updateGlobal({ slug: "company-details", data: { contact }, context });
}

async function seed() {
  const payload = await getPayload({ config });
  if (process.argv.includes("--reset")) await reset(payload);

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

  for (const member of seedTeam) {
    await ensure(payload, "team-members", { name: { equals: member.name } }, member);
  }

  for (const faq of seedFaqs) {
    await ensure(payload, "faqs", { question: { equals: faq.question } }, faq);
  }
  for (const company of seedGroupCompanies) {
    await ensure(payload, "group-companies", { name: { equals: company.name } }, company);
  }
  for (const gallery of seedGalleries) {
    await ensure(payload, "galleries", { title: { equals: gallery.title } }, gallery);
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
