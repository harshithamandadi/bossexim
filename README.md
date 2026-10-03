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
| `SEED_RESET=true npm run seed` | Deletes all content (users and enquiries are kept) and loads the starting content again (PowerShell: `$env:SEED_RESET="true"; npm run seed`) |
| `npm run generate:types` | Regenerates `src/payload-types.ts` after changing a collection |
| `npm run generate:importmap` | Registers new custom admin components |

## Editing content

Everyday content is edited in the admin at **`/admin`** — no code, no redeploy. Saving
refreshes the website straight away. The dashboard lists what the site is still waiting for
(contact details, registration numbers, photos, downloads…).

| Admin section | What it controls |
| --- | --- |
| Inbox → **Enquiries** | Every enquiry sent from the website or by Aira, with its BGX reference and whether the email alert reached your team |
| Inbox → **Enquiry attachments** | Files visitors attached (private: staff only) |
| Catalogue → **Products** | Export and import lines. Each product gets its own page; drag rows to reorder |
| Catalogue → **Markets** | Destination countries, their map positions and destination ports |
| Website content → **FAQs** | FAQ page, FAQ sections and the website assistant's answers |
| Website content → **Team / Leadership** | Leadership profiles on the About page |
| Website content → **Media & events** | Photo galleries on the Media & Events page |
| Website content → **Downloads** | Brochures and specification sheets (PDF) |
| Website content → **BOSS Group companies** | Company cards (with optional logo) on the BOSS Group and About pages |
| Settings → **Company details** | Email, phone, office address, Indian loading ports, the corporate video (YouTube/Vimeo link), who receives enquiry emails, social links, registration numbers (CIN, PAN, GST…) |
| Settings → **Users** | Who can sign in. **Editors** manage content; **admins** also manage users |

Empty values show as **"To be added"** or **"Coming soon"** on the site. Counts such as
"7 export lines" are calculated from the products and markets, never typed by hand.

Page copy, navigation and labels stay in code, in **`src/config/`** — e.g. `pages.ts` (page
headings and SEO text), `about.ts`, `business.ts`, `process.ts`, `partners.ts`, `contact.ts`
(enquiry form wording), `chatbot.ts` (assistant wording) and `navigation.ts` (menus).

> Page and product copy comes from the client's documents in `requirements/` (git-ignored).
> Items the documents don't cover are marked "Details to be confirmed" or drafted for review.

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

## Enquiries

The enquiry form (Contact page, and the registration form on Partner With Us) asks each
enquiry type — general, buyer, supplier, partnership — for its own sections and fields,
set in `enquiryForms` in `src/config/contact.ts` (field kinds and wording in
`enquiryFieldDefinitions`). Buyer, supplier and partnership forms accept up to 3
attachments, 4 MB in total (`ATTACHMENT_LIMITS`). The server action
(`src/app/(site)/contact/actions.ts`) validates against the same config; fields without
their own admin column are kept as labelled **details**. `src/lib/enquiry/deliver.ts` then:

1. saves the enquiry (and its attachments) in the admin under **Inbox → Enquiries** and gives it a
   reference such as **BGX-00042**, shown to the visitor and quoted in both emails;
2. emails the team — recipients are set in **Settings → Company details → Enquiry emails**,
   with reply-to set to the enquirer;
3. emails the enquirer a confirmation (it repeats none of their free text, so the form
   can't be used to spam other people);
4. optionally posts it as JSON to `ENQUIRY_WEBHOOK_URL`.

A failed email never loses a lead: the entry is still saved, shows **Failed** with the
reason, and the admin dashboard lists alerts to review. Only if nothing works does the
visitor see an error, with the company email as a fallback; the server log keeps the
enquiry so it can be recovered.

Spam protection: a hidden honeypot field, a signed form token with a 3-second minimum
fill time, and at most 5 enquiries per 10 minutes per IP address (kept in memory, so
per server instance).

### Aira, the website assistant

The chat launcher on every page opens **Aira**, scripted from the client's chatbot workflow
(`src/config/chatbot.ts`; logic in `src/components/chat/assistant-flow.ts`). No AI service
or paid API is involved:

- **Products** — pick an export line, then specifications, grades, packaging, MOQ,
  documentation or a quote. Answers come from the product's data in the admin.
- **Buying Enquiry** — up to 20 short questions (`buyingSteps`), a summary to confirm or
  edit, then it is submitted as a buyer enquiry (source "Website assistant") and the visitor
  gets a BGX reference.
- **Company Information** — five short answers, then an offer to start an enquiry.
- **Request a Call Back** — name, email, optional phone and topic; saved as a general enquiry.
  Offered whenever Aira can't answer. On larger screens a greeting teaser appears once per visit.
- Anything typed outside a flow is answered from the FAQs.

Email goes through the company's mailbox over SMTP (`SMTP_*` in `.env`). With
`SMTP_HOST` empty, email is off and enquiries are only saved in the admin.

## Deploying to Vercel

Vercel keeps nothing written to disk, so production needs a hosted database (Turso, free
tier available) and Vercel Blob for uploaded images and files. The build refuses to run on
Vercel without them, so a half-configured deploy never replaces a working site.

> Vercel's free **Hobby** plan is for non-commercial use. It is fine for a client preview;
> the live company site needs **Pro** or the client's own hosting (TASKS.md, D1).

**One-time setup**

1. **Vercel project** — import the GitHub repo (Add New → Project).
2. **Storage** (Project → Storage), both free on Hobby:
   - **Blob** → Create → connect to the project. Adds `BLOB_READ_WRITE_TOKEN`.
   - **Turso** (from the Marketplace) → free Starter plan → create a database and connect it,
     with **database branching off** (so every deploy shares one database) and the prefix
     `DATABASE`. That adds `DATABASE_TURSO_DATABASE_URL` and `DATABASE_TURSO_AUTH_TOKEN`, which
     the site reads directly. (A database made on turso.tech works too: set `DATABASE_URL` and
     `DATABASE_AUTH_TOKEN` instead.)
3. **Environment variables** (Project → Settings → Environment Variables):

   | Variable | Value |
   | --- | --- |
   | `PAYLOAD_SECRET` | A long random string, different from your local one |
   | `SEED_ON_BUILD` | `true` for the first deploy — loads the starting content and product photos |
   | `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD` | The first admin login, created by the seed |
   | `SITE_URL` | The site's public address, used for links in emails |
   | `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM_ADDRESS` | Optional — the company mailbox. Without them, enquiries are only saved in the admin |
   | `ENQUIRY_WEBHOOK_URL` | Optional — also post each enquiry as JSON |

4. **Deploy** (Deployments → Redeploy, or push to `main`). Vercel runs `npm run vercel-build`:
   it applies migrations, seeds when `SEED_ON_BUILD=true`, then builds the site.
5. After the first successful deploy, **delete `SEED_ON_BUILD`** so later deploys never bring
   back content an editor deleted. (The seed only adds what's missing, so leaving it on is
   harmless for a short demo.)

To start the content over on Vercel (e.g. after a failed seed), set `SEED_RESET=true` together
with `SEED_ON_BUILD=true` and redeploy: the build deletes the content (users and enquiries are
kept) and seeds it again. Remove `SEED_RESET` straight afterwards, or every deploy will wipe
the editors' changes.

**Changing a collection later**: run `npm run migrate:create <name>` locally and commit the new
file in `src/migrations/`; the next deploy applies it. Locally, Payload keeps syncing the
schema by itself — if the dev server stops on a schema prompt or an "index already exists"
error, move `cms-data/` aside and run `npm run seed` for a fresh local database.

**Limits on Vercel**: requests are capped at 4.5 MB, so enquiry attachments are limited to
4 MB in total (checked in the browser before sending). The enquiry rate limit is kept in
memory, so it applies per server instance.

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
├── lib/enquiry/              Form rules, spam checks, delivery and email templates
├── lib/world-dots.ts          Land dots for the world map and globe (generated: node scripts/generate-world-dots.mjs)
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
