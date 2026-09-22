# BOSS Global EXIM — website

Marketing site and content admin for **BOSS Global EXIM Pvt. Ltd** (www.bgexim.com).
Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Framer Motion · Payload CMS 3 (SQLite / libSQL).

## Getting started

```bash
npm install
cp .env.example .env     # then set PAYLOAD_SECRET (see the comment in the file)
npm run seed             # creates the local database and loads the starting content
npm run dev              # site: http://localhost:3000 · admin: http://localhost:3000/admin
```

Sign in to `/admin` with `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` from `.env`. If you left
those empty, the admin asks you to create the first account — it becomes an admin automatically.

| Command | What it does |
| --- | --- |
| `npm run build` | Production build (also type-checks) |
| `npm run lint` / `npm run typecheck` | ESLint / TypeScript |
| `npm run seed` | Adds any missing starting content. Safe to re-run — never overwrites edits |
| `npm run seed -- --reset` | Deletes all content (users are kept) and loads the starting content again |
| `npm run generate:types` | Regenerates `src/payload-types.ts` after changing a collection |
| `npm run generate:importmap` | Registers new custom admin components |

## Editing content

Everyday content is edited in the admin at **`/admin`** — no code, no redeploy. Saving
refreshes the website straight away. The dashboard lists what the site is still waiting for
(contact details, registration numbers, photos, downloads…).

| Admin section | What it controls |
| --- | --- |
| Catalogue → **Products** | Export and import lines. Each product gets its own page; drag rows to reorder |
| Catalogue → **Markets** | Destination countries and their map positions |
| Website content → **FAQs** | FAQ page, FAQ sections and the website assistant's answers |
| Website content → **Team / Leadership** | Leadership profiles on the About page |
| Website content → **Media & events** | Photo galleries on the BOSS Group page |
| Website content → **Downloads** | Brochures and specification sheets (PDF) |
| Website content → **BOSS Group companies** | Company cards on the BOSS Group page |
| Settings → **Company details** | Email, phone, office address, social links, registration numbers (CIN, PAN, GST…) |
| Settings → **Users** | Who can sign in. **Editors** manage content; **admins** also manage users |

Empty values show as **"To be added"** or **"Coming soon"** on the site. Counts such as
"7 export lines" are calculated from the products and markets, never typed by hand.

Page copy, navigation and labels stay in code, in **`src/config/`** — e.g. `pages.ts` (page
headings and SEO text), `about.ts`, `business.ts`, `process.ts`, `partners.ts`, `contact.ts`
(enquiry form wording), `chatbot.ts` (assistant wording) and `navigation.ts` (menus).

> Longer descriptions and the FAQ answers are draft copy for client review.

## How content reaches the page

```
Admin (/admin) ──save──▶ Payload ──▶ SQLite / libSQL
                              │
                              └─ afterChange hook: revalidatePath("/", "layout")
                                                     │
Pages ◀── src/lib/content/queries.ts ◀── Payload Local API (no HTTP)
          (React cache — one query per render)
```

- `src/lib/content/mappers.ts` converts CMS documents into the site's own types
  (`src/types/content.ts`), so components never depend on the CMS's shapes.
- Pages are pre-rendered at build time. Any content change marks every page stale, and each
  one rebuilds on its next visit. Products added later render on their first visit.
- Client components (catalogue, trade map, contact form, hero wheel) receive content as props.

## Enquiry form

Submissions are validated on the server (`src/app/(site)/contact/actions.ts`) and delivered by
`src/lib/enquiry/deliver.ts`. Set `ENQUIRY_WEBHOOK_URL` to forward each enquiry as JSON to
Zapier, Make, Formspree, a Slack/Teams workflow or a CRM. Without it, enquiries are logged
in development and the form reports an error in production — leads are never silently lost.

## Production checklist

- `PAYLOAD_SECRET` — a long random string, unique to production.
- `DATABASE_URL` — a persistent database: a Turso URL (`libsql://…`, plus `DATABASE_AUTH_TOKEN`)
  or a file path on a server with persistent disk. Serverless hosts need Turso (or a switch to
  Postgres via `@payloadcms/db-postgres`).
- Uploaded images and PDFs are stored in `cms-data/` on disk. Serverless hosts need a storage
  adapter (e.g. `@payloadcms/storage-s3` or `@payloadcms/storage-vercel-blob`).
- Password-reset emails need an email adapter (e.g. `@payloadcms/email-nodemailer` with the
  company's SMTP mailbox); until then they are written to the server log.
- Run `npm run seed` once against the production database, then manage content in `/admin`.

## Project structure

```
src/
├── app/
│   ├── (site)/               Public website — pages compose sections
│   ├── (payload)/            Payload admin (/admin) and REST API (/api) — generated, plus custom.css
│   ├── global-not-found.tsx  404 for unmatched URLs (the site and admin have separate root layouts)
│   └── sitemap.ts robots.ts icon.svg globals.css
├── payload.config.ts         CMS configuration
├── payload/
│   ├── collections/ globals/ Content model shown in the admin
│   ├── access.ts             Roles: admin, editor, public read
│   ├── hooks/revalidate.ts   Refreshes the site when content changes
│   ├── admin/                Admin branding and dashboard checklist
│   └── seed/                 Starting content (data.ts) and the seed script
├── config/                   Content that stays in code (page copy, menus, labels)
├── lib/content/              CMS queries and mappers (server-only)
├── lib/                      Pure logic: catalogue, stats, geo, motion, FAQ search, metadata
├── types/content.ts          Content model shared by code config and CMS content
└── components/               ui/, motion/, layout/, chat/, sections/ (grouped by page)
```

### Design system

Colour tokens are defined once in `globals.css`. Semantic tokens (`canvas`, `surface`,
`fg`, `fg-mute`, `border`, `brand`) are re-mapped by `data-tone="light|mist|dark"`, so any
component placed in a dark section adapts automatically. Typography uses `type-hero`,
`type-h1`…`type-h4`, `type-lead`, `type-body`. All animation timing comes from
`src/lib/motion.ts`, and every animation respects the visitor's "reduce motion" setting.
