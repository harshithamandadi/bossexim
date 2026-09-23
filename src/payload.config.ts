import { sqliteAdapter } from "@payloadcms/db-sqlite";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildConfig } from "payload";
import sharp from "sharp";
import { requiredEnv } from "./lib/env";
import { Documents } from "./payload/collections/documents";
import { Enquiries } from "./payload/collections/enquiries";
import { Faqs } from "./payload/collections/faqs";
import { Galleries } from "./payload/collections/galleries";
import { GroupCompanies } from "./payload/collections/group-companies";
import { Markets } from "./payload/collections/markets";
import { Media } from "./payload/collections/media";
import { Products } from "./payload/collections/products";
import { Resources } from "./payload/collections/resources";
import { TeamMembers } from "./payload/collections/team-members";
import { Users } from "./payload/collections/users";
import { smtpEmailAdapter } from "./payload/email";
import { CompanyDetails } from "./payload/globals/company-details";

const dirname = path.dirname(fileURLToPath(import.meta.url));

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
  // Order sets the admin's sidebar groups: Inbox, Catalogue, Website content, Settings (with Company details), Files.
  collections: [
    Enquiries,
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
      url: requiredEnv("DATABASE_URL"),
      authToken: process.env.DATABASE_AUTH_TOKEN,
    },
  }),
  email: smtpEmailAdapter(),
  sharp,
  graphQL: { disable: true },
  telemetry: false,
  typescript: { outputFile: path.resolve(dirname, "payload-types.ts") },
});
