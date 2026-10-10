import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildConfig } from "payload";
import sharp from "sharp";
import { requiredEnv } from "./lib/env";
import { Documents } from "./payload/collections/documents";
import { Enquiries } from "./payload/collections/enquiries";
import { EnquiryFiles } from "./payload/collections/enquiry-files";
import { Faqs } from "./payload/collections/faqs";
import { Galleries } from "./payload/collections/galleries";
import { GroupCompanies } from "./payload/collections/group-companies";
import { Markets } from "./payload/collections/markets";
import { Media } from "./payload/collections/media";
import { Products } from "./payload/collections/products";
import { Resources } from "./payload/collections/resources";
import { SiteVisits } from "./payload/collections/site-visits";
import { TeamMembers } from "./payload/collections/team-members";
import { Users } from "./payload/collections/users";
import { smtpEmailAdapter } from "./payload/email";
import { CompanyDetails } from "./payload/globals/company-details";

const dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * On Vercel nothing written to disk survives, so the database must be hosted
 * (Turso) and uploads must go to Vercel Blob. Failing the build here keeps a
 * misconfigured deploy from replacing a working site with an empty one.
 */
const onVercel = Boolean(process.env.VERCEL);
const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
if (onVercel && !blobToken) {
  throw new Error("BLOB_READ_WRITE_TOKEN is missing — connect a Vercel Blob store to this project (see README → Deploying to Vercel).");
}

/**
 * Turso's Vercel integration names its variables TURSO_DATABASE_URL / TURSO_AUTH_TOKEN,
 * with the prefix chosen when connecting (this project uses "DATABASE_").
 */
const firstEnv = (...names: string[]) => names.map((name) => process.env[name]).find(Boolean);
const DATABASE_URL_NAMES = ["DATABASE_URL", "DATABASE_TURSO_DATABASE_URL", "TURSO_DATABASE_URL"];
const DATABASE_TOKEN_NAMES = ["DATABASE_AUTH_TOKEN", "DATABASE_TURSO_AUTH_TOKEN", "TURSO_AUTH_TOKEN"];

/** SQLite creates the database file but not its folder, e.g. cms-data/ on a fresh clone. */
function databaseUrl(): string {
  const url = firstEnv(...DATABASE_URL_NAMES) || requiredEnv("DATABASE_URL");
  if (onVercel && url.startsWith("file:")) {
    throw new Error("DATABASE_URL must be a hosted libSQL database on Vercel (e.g. libsql://….turso.io), not a local file.");
  }
  if (url.startsWith("file:")) mkdirSync(path.dirname(path.resolve(url.slice("file:".length))), { recursive: true });
  return url;
}

export default buildConfig({
  admin: {
    user: Users.slug,
    theme: "light",
    importMap: { baseDir: dirname },
    meta: {
      titleSuffix: " · BOSS EXIM Admin",
      icons: [{ rel: "icon", type: "image/svg+xml", url: "/icon.svg" }],
    },
    components: {
      graphics: {
        Logo: "/payload/admin/brand#AdminLogo",
        Icon: "/payload/admin/brand#AdminIcon",
      },
      beforeDashboard: ["/payload/admin/dashboard-welcome#DashboardWelcome", "/payload/admin/visits-by-country#VisitsByCountry"],
    },
  },
  // Order sets the admin's sidebar groups: Inbox, Insights, Catalogue, Website content, Settings (with Company details), Files.
  collections: [
    Enquiries,
    EnquiryFiles,
    SiteVisits,
    Products,
    Markets,
    Faqs,
    TeamMembers,
    Galleries,
    Resources,
    GroupCompanies,
    Users,
    Media,
    Documents,
  ],
  globals: [CompanyDetails],
  secret: requiredEnv("PAYLOAD_SECRET"),
  db: sqliteAdapter({
    client: {
      url: databaseUrl(),
      authToken: firstEnv(...DATABASE_TOKEN_NAMES),
    },
    // Production schema changes ship as migrations (`npm run migrate:create`); locally the schema syncs itself.
    migrationDir: path.resolve(dirname, "migrations"),
  }),
  plugins: [
    // Uploads go to Vercel Blob when its token is set, and to cms-data/ on disk otherwise.
    vercelBlobStorage({
      enabled: Boolean(blobToken),
      token: blobToken,
      // Keeps the database schema identical with and without Blob, so one set of migrations fits both.
      alwaysInsertFields: true,
      // No random suffix: the adapter records the suffixed name for only one of an image's
      // resized copies, which breaks the others. Files are still served through Payload.
      addRandomSuffix: false,
      collections: { media: true, documents: true, "enquiry-files": true },
    }),
  ],
  email: smtpEmailAdapter(),
  sharp,
  graphQL: { disable: true },
  telemetry: false,
  typescript: { outputFile: path.resolve(dirname, "payload-types.ts") },
});
