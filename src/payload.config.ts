import { sqliteAdapter } from "@payloadcms/db-sqlite";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildConfig } from "payload";
import sharp from "sharp";
import { Documents } from "./payload/collections/documents";
import { Faqs } from "./payload/collections/faqs";
import { Galleries } from "./payload/collections/galleries";
import { GroupCompanies } from "./payload/collections/group-companies";
import { Markets } from "./payload/collections/markets";
import { Media } from "./payload/collections/media";
import { Products } from "./payload/collections/products";
import { Resources } from "./payload/collections/resources";
import { TeamMembers } from "./payload/collections/team-members";
import { Users } from "./payload/collections/users";
import { CompanyDetails } from "./payload/globals/company-details";

const dirname = path.dirname(fileURLToPath(import.meta.url));

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable ${name} — see .env.example.`);
  return value;
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
      beforeDashboard: ["/payload/admin/dashboard-welcome#DashboardWelcome"],
    },
  },
  // Order sets the admin's sidebar groups: Catalogue, Website content, Settings (with Company details), Files.
  collections: [Products, Markets, Faqs, TeamMembers, Galleries, Resources, GroupCompanies, Users, Media, Documents],
  globals: [CompanyDetails],
  secret: requiredEnv("PAYLOAD_SECRET"),
  db: sqliteAdapter({
    client: {
      url: requiredEnv("DATABASE_URL"),
      authToken: process.env.DATABASE_AUTH_TOKEN,
    },
  }),
  sharp,
  graphQL: { disable: true },
  telemetry: false,
  typescript: { outputFile: path.resolve(dirname, "payload-types.ts") },
});
