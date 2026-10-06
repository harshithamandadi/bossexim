# BOSS Global EXIM — Scope v2 Task Plan

Source: `BOSS_Global_EXIM_Developer_Scope_Document.docx` (Bestverse, received 22 Sep 2026).
This plan is updated as work lands: ticked tasks are built and tested. References like §3.2 point to sections of that document.

---

## 1. Key dates

| Milestone | Date | Note |
|---|---|---|
| Sprint 1 review | Mon 28 Sep 2026 | 4 working days from 22 Sep |
| Sprint 2 review | Fri 2 Oct 2026 | Gandhi Jayanti, a national holiday: confirm the date |
| Final delivery | 22–25 working days after all inputs arrive (§8) | If inputs arrived on 22 Sep: roughly 22–27 Oct 2026 |
| Post-launch support | 30 days from launch | Functional bugs in the delivered scope only (§12) |

---

## 2. Where we stand

The site built from the first brief already covers most of §2. The new work is the **CMS, the chatbot, the brochure and the video**, plus filling the content gaps.

| Scope item | Status | Notes |
|---|---|---|
| About, Business model, Vision / Mission / Values | Done | Copy drafted by us from the first brief. Needs client approval |
| Products and product pages | Partial | 14 product lines, each with a page. No specifications, HS headings or images |
| Trade process, Quality & verification | Done | Quality is a section of `/trade-process` |
| Global presence | Done | 8 markets, presence tiers and a trade-lane map. Port lists appear once entered in the admin |
| BOSS Group, Media | Partial | Structure done. No logos or photos |
| Resources | Partial | Download list exists. Every file is "coming soon" |
| Partner / business enquiries | Done | Registration form on `/partner` (buyer, supplier, partnership); the track buttons pre-select the type |
| Contact and enquiry form | Done | Fields per enquiry type, saved in the admin, email alert + confirmation, spam protection. Needs the client's SMTP mailbox to send email |
| FAQs | Done | Dedicated `/faq` page with search, topic filters and FAQ structured data. 13 questions drafted by us: need client approval |
| Chatbot (§3.4) | Done | FAQ-based assistant on every page; matching runs in the browser, no paid APIs. Answers come from the FAQs in the admin |
| CMS / Admin panel (§3.2) | Done | Payload CMS at `/admin`: products, markets, FAQs, team, galleries, downloads, group companies, company details. Runs locally on SQLite; production hosting still to decide (D1) |
| Digital brochure (§4) | Not started | |
| Video + voice-over (§5) | Not started | |
| Basic SEO (§9) | Done | Metadata, sitemap, robots, JSON-LD and a social share image |
| Responsive (§3.1) | Done | Checked at 390, 768, 1024 and 1440 px on every page: no overflow or errors |

---

## 3. Decisions needed before coding

D2–D5 are settled and built. D1 now only affects deployment; D6 affects tasks E and F.

### D1. Production hosting (§11: "deploy to the client's hosting") — still open
The CMS is built and runs locally. Where it goes live decides three concrete things:
- **Database:** a Turso database (hosted SQLite, free tier), a file on a server with a persistent disk, or Postgres if the host provides one (a one-line adapter change plus a re-seed).
- **Uploaded images and PDFs:** stored on disk today. Serverless hosts need a storage service (S3 or Vercel Blob).
- **Email:** the SMTP mailbox details (D4) go into the host's environment settings.

The earlier notes still apply:
- A Node.js host is required: the forms already run on the server, and an admin panel needs a server and a database.
- Vercel's free Hobby plan is for non-commercial use only. A company site needs Vercel Pro or another host. Hosting cost is the client's (§10).
- **Ask:** Which host? Can it run Node.js and a database?

### D2. CMS: ✅ decided — **Payload CMS 3.90.1**, embedded in this Next.js app at `/admin`
- Free and open source, so there's no subscription (§10). Login and roles are built in (§3.2). Its typed collections map directly onto our existing `src/types/content.ts`.
- It needs a database and file storage. Locally it runs on SQLite; production depends on D1.
- Confirmed: Payload 3.90.1 officially supports Next.js 16.3.3+, and the production build and tests pass on 16.3.4.
- Ruled out: building our own admin, because login, uploads and create/edit/delete screens would use up most of the 22–25 days.

### D3. What becomes admin-editable — ✅ built as proposed
§3.2 names products, team/leadership, FAQs and media/resources, plus "other agreed repeatable content". Proposed split:
- **Editable in the admin (built):** products (with their category), markets, team, FAQs, galleries, downloads, BOSS Group companies, and company details (contact info, registration numbers, social links). Enquiry recipients were added with C3; ports arrive with B4.
- **Stays in code:** page layouts, navigation, headings and long-form page copy. Changing these after launch counts as a change request.

### D4. How enquiry emails are sent — ✅ built as recommended (SMTP)
Needs the client's mailbox details (host, user, password) to switch on. Original note: send through the client's own business mailbox over SMTP, which needs no extra subscription. The same mailbox would also send the admin's password-reset emails, which currently only appear in the server log. Fallback: the Resend free tier (third-party, so it needs approval). The existing webhook can stay as an optional extra.

### D5. Keep a copy of each enquiry in the admin? — ✅ built as recommended; confirm with the client
Removing it later is simple if the client prefers. Original note: recommended as a read-only log, so a failed email never loses a lead. It deliberately has no statuses, assignments or pipelines, because §3.2 rules out a CRM. Needs client agreement.

### D6. Who owns the brochure and the video?
§13 lists both as developer deliverables, but they are design and video-production work. Confirm whether we or Bestverse's creative team produce them, and what the budget is for voice-over and music.

### Already resolved
- The company name is **BOSS Global EXIM Pvt. Ltd.**, as confirmed by the scope document. The banner's "BOSS Group EXIM" was an inconsistency.

---

## 4. Tasks

IDs are for reference in reviews. Effort figures are rough working days for our side; time spent waiting on the client is extra.

### A. CMS and architecture (~7 days) — ✅ done
Built and tested: 20 automated checks cover editing, new products, company details, role permissions and login lockout, and every public page was re-checked on desktop and mobile. FAQ answers that list products are now ordinary editable text: when products change, update those answers in the admin.
- [x] **A1** Settle D1–D3. (D2 and D3 settled; D1 hosting is still open and only affects deployment.)
- [x] **A2** Confirm Payload works on Next.js 16.3: `/admin` login, a database (SQLite locally) and a passing production build.
- [x] **A3** Content model: products, markets, team, FAQs, galleries, downloads, group companies, images and PDFs, plus a single "Company details" record. Alt text required on every image. (Ports come with B4; an enquiries log only if D5 is approved.)
- [x] **A4** Access control: Admin and Editor roles, no public sign-up, lockout after repeated failed logins, `/admin` hidden from search engines.
- [x] **A5** Data layer in `src/lib/content/`: server functions that read from the CMS with caching. Publishing in the admin refreshes the affected pages without a redeploy.
- [x] **A6** Refactor the 59 files that import `@/config`. The 10 client components that use it (header, trade map, product catalogue, contact form, trade wheel and others) receive their data as props instead.
- [x] **A7** Seed script: copy today's config content into the CMS so the site looks identical on day one.
- [x] **A8** New products get their page and sitemap entry without a rebuild.
- [x] **A9** Admin usability: help text on fields, drag-to-reorder, "View on site" links, brand styling, and a dashboard checklist of content the site is still waiting for.
- [x] **A10** Rewrite `README.md`, which currently tells non-developers to edit `src/config` files.

### B. Website gaps (~3 days) — ✅ done (B8 waits on client inputs)
- [x] **B1** Official BOSS logo mark in the header, footer, favicon, admin and chat (E3). Social share image at `/og-image.png` (logo, tagline, focus line); every page links to it, and product pages with a photo share that photo instead.
- [x] **B2** Images with icon fallbacks: product cards and pages (E2), leadership photos, gallery photos, **group company logos** (new "Logo" field), and **hero wheel segments** (each shows its category's first product photo).
- [x] **B3** Product pages: specification tables, grades/varieties, packaging and documentation (E2). HS codes: the field exists in the admin and shows in the product facts once filled; the client's documents give none (the Content Note says HS classification varies), so they are left for the client.
- [x] **B4** Global presence stays a section of `/trade-process`, as the client's Website Structure places it there (this supersedes our `/global-presence` recommendation). Ports: new "Destination ports" per market and "Indian loading ports" in Company details → Ports & video; they appear under Global Presence once entered. The documents name no ports, so none are filled in.
- [x] **B5** A dedicated `/faq` page with FAQ structured data (an easy SEO win). Home and partner pages keep their short FAQ section.
- [x] **B6** Corporate video slot on the About page: paste a YouTube or Vimeo link (plus optional cover image) in Company details → Ports & video. Only the cover loads with the page; the player (youtube-nocookie / Vimeo with do-not-track) loads when the visitor presses play. Hidden until a link is set.
- [x] **B7** Tablet pass at 768 px and 1024 px, since §3.1 names tablets.
- [x] **B9** Trade wheel orbits the globe; pointing at (or tabbing to) a segment glides it to a stop, enlarges that segment and names it on the globe. Pauses off-screen and for reduced-motion users.
- [ ] **B8** Replace every "To be added" once inputs arrive. Done from the documents: email, office address, leadership profiles. Still waiting on the client: phone/WhatsApp, office hours, map, registration numbers (CIN, PAN, GST, IEC, RCMC, ISO, AD Code), social profile links, photos, logos, ports, video. The admin dashboard's "Still to add" list tracks each of these.

### C. Forms and notifications (~2 days) — ✅ done
Built and tested: 78 automated checks (every type on both pages, both emails, the webhook, every spam defence, email-server-down and total-failure cases), plus desktop and mobile screenshots.
- [x] **C1** Fields per enquiry type, shown as the visitor switches type and validated on the server. Now `enquiryForms` (`src/config/contact.ts`), rebuilt from the Contact Us document in E5.
  - General: name, email, company, phone, country, message.
  - Buyer: name, company, email, phone, product, quantity, destination country/port, message.
  - Supplier: name, company, email, phone, product supplied, supply capacity, country of origin, message.
  - Partnership: name, company, email, phone, partnership area, country, message.
- [x] **C2** Registration form on `/partner` (buyer, supplier, partnership); the track buttons open it with the type pre-selected.
- [x] **C3** Email alert per enquiry, reply-to the enquirer, with a "View in the admin" link. Recipients are set in the admin (Company details → Enquiry emails): "All enquiries" plus extra people per type, falling back to the contact email. Sent over SMTP (D4).
- [x] **C4** Confirmation email to the enquirer. It deliberately repeats none of their free text, so the form can't be abused to send spam.
- [x] **C5** Every enquiry saved under Inbox → Enquiries (read-only, admins can delete), with the email outcome recorded (D5).
- [x] **C6** Spam protection: honeypot kept; signed form token with a 3-second minimum; 5 enquiries per 10 minutes per IP address. The rate limit is in memory, so on serverless hosts it is per instance.
- [x] **C7** A failed email still counts as delivered (the enquiry is saved) and shows as "Failed" in the admin and on the dashboard. If every channel fails, the visitor sees an error with the company email, and the server log keeps the enquiry.
- [x] **C8** Tested every type: validation, success, email down, total failure, and each spam defence.

### D. FAQ chatbot (~3 days)
No AI or paid APIs (§3.4). Answers come only from client-approved FAQs.
- [x] **D1** One FAQ collection feeds both the FAQ page and the chatbot. Fields: question, answer, category, keywords/synonyms, show on page, show in chat, order.
- [x] **D2** Matching runs in the visitor's browser: score their question against the FAQ questions and keywords. Below a confidence threshold, offer the three closest questions instead of guessing.
- [x] **D3** Widget: launcher button, greeting, suggested questions, category chips, and answers that can link to pages. When there's no answer, point to the enquiry form, email, or a WhatsApp click-to-chat link (free; no API).
- [x] **D4** Accessibility: proper dialog behaviour, focus handling, Esc to close, screen-reader announcements for new messages, and reduced motion respected. The panel opens from the launcher.
- [x] **D5** Load the chatbot only after the page is idle or on first click, so it never slows the first paint.
- [x] **D6** Mobile: full-height panel that respects screen notches and doesn't cover the menu.
- [ ] **D7** Tune keywords against the client's real FAQ set. (Tuned against our 13 drafted FAQs: 19/19 test questions answered correctly.)

### E. Digital brochure (~3 days)
- [ ] **E1** Confirm the owner (D6), the format (proposed: A4 portrait PDF, 8–12 pages), and whether a print-ready version is also wanted. Printing itself is out of scope.
- [ ] **E2** Outline: cover · about & group · vision, mission, values · services · export products (with specs and HS headings) · import products · global presence and ports · trade process and quality · registrations · contact.
- [ ] **E3** Recommended build: a print-styled page generated from the same CMS data and exported to PDF with headless Chrome. It stays consistent with the site and can be regenerated when content changes.
- [ ] **E4** Keep the file size small and the links clickable; publish it through Resources.

### F. Corporate video + voice-over (~4 days, plus approval rounds)
- [ ] **F1** Confirm the owner (D6), length (typically 60–90 s), language and accent, human or AI voice, and budget (§5).
- [ ] **F2** Collect footage, photos, logos and text points.
- [ ] **F3** Script (the client's or ours), then approval.
- [ ] **F4** Storyboard: match footage to each script line.
- [ ] **F5** Record the voice-over.
- [ ] **F6** Edit: rough cut → review → final. Music must be royalty-free or licensed.
- [ ] **F7** Export a 1080p MP4 (16:9) plus a captions file. Extra social-media formats need approval.
- [ ] **F8** Upload to the client's YouTube channel and embed it on the site (B6).

### G. QA, SEO, deployment and handover (~3 days)
- [ ] **G1** SEO: social share image, canonical domain, Google Search Console verification on the client's account.
- [ ] **G2** Test matrix: 360, 390, 768, 1024, 1280 and 1440 px; Chrome, Safari, Firefox and Edge; iOS Safari and Android Chrome.
- [ ] **G3** Functional tests: navigation, every form type, the chatbot, creating/editing/deleting in each admin collection, image upload, publishing updating the site, login/logout, and protected admin routes.
- [ ] **G4** Accessibility and performance pass (Lighthouse).
- [ ] **G5** Security: secrets only in server environment variables, `/admin` not indexed (done in robots.txt), security headers, dependency audit, database backups. Audit status: 7 moderate/low advisories, all in Payload's own dependencies — `dompurify` (admin code editor, not used by our fields) and `esbuild` inside `drizzle-kit` (database tooling). Neither has a safe fix yet; recheck when upgrading Payload.
- [ ] **G6** Production deploy: domain, SSL, environment variables (including SMTP), database migrations (`payload migrate`), first admin accounts.
- [ ] **G7** Handover pack: repo and admin access, list of environment variables, deployment steps, a short admin guide with screenshots, and the support start date.

### Budget check
A 7 + B 3 + C 2 + D 3 + E 3 + F 4 + G 3 ≈ **25 days**. That's the top of the 22–25-day estimate before any waiting on inputs. If the brochure and video go to Bestverse's creative team (D6), the website work is about **18 days**.

---

## 4b. UI sources used

We checked each library the client suggested and took components and patterns only where they suit a corporate trade site. Everything was adapted to our blue tokens, Framer Motion and Lucide icons, so no new dependencies were added.

| Source | Taken for | What we used |
|---|---|---|
| [kobra.systems](https://kobra.systems) | Chatbot bubbles | Conversation component (free): 18px bubbles with a tightened "tail" corner, grouped corners for runs of messages, 85% max width. Kobra's Message, Chat Input, Question Card, Empty and Table are Pro (paid), so not used |
| [beui.dev](https://beui.dev) | Chat panel motion, composer | Morphing Modal: panel spring (stiffness 420 / damping 40), faster exit, content goes inert while leaving. Prompt Input: Enter sends, Shift+Enter new line, IME-safe |
| [ui.halaska.com](https://ui.halaska.com) | Chat UX | Text launcher pill instead of a bare icon; being upfront that answers come from FAQs |
| uimaxx, beautifului, aicss, easyui | Chat UX reference | Suggested-question chips, typing state, composer layout |
| shadcnblocks, 21st.dev, vantaui, xiod | Section patterns | Search-first FAQ layout with topic chips |
| libraries.dev, niblet, bencho | Reviewed | AI-product effects and app screens; not a fit for a corporate site |
| builtbydesigners, placen | Reviewed | A directory of apps and a bookmark board; not component sources |

**Admin panel picks (for when D1–D3 are settled):** Kobra Input OTP (two-step admin login), beUI Animated Sidebar (admin navigation), beUI Stateful Button (Save → Saving → Saved), beUI Animated Toast Stack (save confirmations), beUI Combobox / Multi-select (choosing a product's markets), easyui Advanced Data Table and the shadcnblocks Admin Kit as layout references. If Payload is chosen (D2), these theme its admin with our logo, colours, login page and dashboard; if a custom admin is chosen, we build it from them.

## 5. Sprint plan

### Sprint 1: Mon 28 Sep (4 working days)
Show the rethemed site on a preview link, plus:
- ~~Hosting and CMS decided (D1–D3), and the A2 trial running locally with an admin login.~~ Done and beyond: the full CMS is built (hosting D1 still open).
- ~~Partnership form on `/partner` (C2).~~ Done.
- ~~Chatbot prototype running on the current FAQs (D2–D4).~~ Done: the full chatbot is built and tested.
- Port and product-specification fields on the site, with placeholder data clearly marked (B3, B4).
- ~~Tablet fixes (B7).~~ Done: tablet widths checked, no fixes needed.
- Client inputs checklist (section 6) sent to the client.

### Sprint 2: Fri 2 Oct (4 working days; confirm the date)
- ~~CMS live for products, FAQs, team, media, resources and company details, with today's content copied in (A3–A8).~~ Done.
- ~~Enquiry emails reaching test recipients (C3–C7).~~ Done, tested against a local mail server.
- Chatbot reading its FAQs from the CMS.
- If they're ours: brochure outline and first pages, and the video script and storyboard (E2, F3–F4).

### After Sprint 2, through to handover
Client content loaded, brochure and video review rounds, full QA, production deploy and handover (B8, E3–E4, F5–F8, G1–G7).

---

## 6. Client inputs tracker

The 22–25-day clock starts when these arrive (§8).

| Input (§6) | Status | Used in |
|---|---|---|
| Final company information | Partial, from the first brief | All pages, brochure |
| Product specifications, HS headings, markets | Names and markets only | Products, brochure, chatbot |
| CIN, PAN, GSTIN, IEC, RCMC, ISO, AD Code | Missing | About › Compliance, brochure |
| Leadership names, roles, profiles, photos | Missing | About, brochure |
| BOSS Group descriptions and logos | Names and one-liners only | BOSS Group page |
| Ports and trade lanes | Markets only | Global presence, brochure |
| Trade process and quality details | Drafted by us; needs approval | Trade process |
| Emails, phones, office address, enquiry recipients | Missing | Contact page, footer, form emails |
| SMTP mailbox for sending email (host, user, password) | Missing | Enquiry alerts, confirmations, admin password resets |
| FAQs with approved answers | Drafted by us; needs the client's set | FAQ page, chatbot |
| Photos: website, product, team, facility, events | Missing | Across the site |
| Social links (LinkedIn, Facebook, Instagram, X, YouTube) | Missing | Footer, contact page |
| Brochure content or existing brochure | Missing | Brochure |
| Video footage, logos, text points | Missing | Video |
| Voice-over script, language, accent | Missing | Video |
| Logo (SVG, AI, EPS or high-res PNG) | Missing; only the banner image so far | Whole site |

---

## 7. Out of scope: don't build

- CRM/ERP features, customer portals, payments.
- AI or paid chatbot services; paid plugins, themes or APIs.
- Email, SMS or WhatsApp provider charges (the click-to-chat link is free).
- Hosting and domain costs.
- Printing; video shoots, actors, studios, travel.
- Extra voice-over languages or voice artists without approval.

Anything new is written down and approved before it's built (§10).

---

## 8. Risks

- **Late inputs.** The clock starts only when inputs arrive, and sprint reviews will show placeholders until then.
- **Unknown hosting.** This blocks the CMS. Resolve D1 this week.
- **Brochure and video** depend on assets and approval rounds, and their owner is unclear (D6).
- **Scope creep.** The enquiry log (D5) and editable page copy (D3) can drift towards a CRM or a page builder. Keep them to what's agreed.
- **2 Oct is a national holiday**, so the Sprint 2 review may move.

### E. Client content from `requirements/` (September 2026) — ✅ done

- [x] **E1** Every page rewritten from the client's page documents (Home, About ×5, Business ×4, Products, Trade Process ×4, Partner ×4, BOSS Group + Container Line, Media & Events, Resources, Contact). The Website Structure document drives the menus; new `/media-events` page.
- [x] **E2** 14 product pages from the product documents; export lines gain the PRODUCT PORTFOLIO specification tables and photos; packaging and documentation lists.
- [x] **E3** Official BOSS logo mark (traced SVG) in the header, footer, favicon, admin and chat.
- [x] **E4** Leadership profiles (Prasad Kalla, Sudhakar C, Sekhar C), office address and email from the documents.
- [x] **E5** Contact Us forms per the document: sectioned forms per enquiry type, attachments (private in the admin), BGX reference numbers in the success message and emails.
- [x] **E6** Chatbot workflow: "Aira" with Products, Buying Enquiry (Q1–Q20, summary, edit, submit) and Company Information paths.
- [ ] **E7** Confirm with the client: portfolio products not in the Website Structure (pomegranate, fresh onion, shrimp, dehydrated fruits, ginger/moringa/amla, mangoes) were **not** added; Project Cargo and Warehouse copy; payment-method and designation option lists; phone/WhatsApp, office hours and map; Media & Events photos; brochures.

### F. Second resource pack (`requirements/2nd resources/`, October 2026) — ✅ done

- [x] **F1** BOSS Container Line: brochure copy for the intro and all six services (3PL & Warehousing replaces the placeholder; **Project Cargo is our draft** — the client's document says "You only write"); port/ship artwork from the brochure.
- [x] **F2** New "Network & Offices" section: 31 agency agreements (+1 in progress, from the footprint map), the brochure's six sector regions, six offices (Singapore, Klang, Hyderabad, Navi Mumbai, Gandhidham, Chennai) and three partner testimonials. Global Presence tiers updated to match.
- [x] **F3** BOSS Group: intro (founded 2000, India land bank), company-card facts (45+ stores, Elite Construction & Projects, hotels in Australia/India/Italy, HR & finance BPO), "Our Journey" timeline, group leadership (Prasad Kalla, Kris Bodla), and a Recognition section with award photos and the Forbes Australia feature.
- [x] **F4** Media & Events: "Group Activities" gallery with the BP Brackenridge EV-site launch and McGrath Foundation photos, viewable in a photo viewer.
- [ ] **F5** Confirm with the client: founding year (brochure 2000 vs "in 2002" on the BOSS Australia site); store count (45+ in the brochure, 26 in the chairman's bio); hotel count (brochure 4 AU / 2 IN / 1 IT vs six Australian properties listed online); Shell award year (2021 photo, 2022 text); listing Iran in the network; Project Cargo copy; higher-resolution originals of the website photos (they are ~240–340 px wide). Personal phone numbers and emails from the brochure were deliberately not published.

### R3. Client feedback round 3 (`requirements/3rd changes/`, 3 Oct 2026) — ✅ done

- [x] **Home** cut from ~13,600 px to ~7,000 px tall: short sections, each with an "Explore" button. Removed from Home: the intro prose, Why Us, partner tracks and FAQs (all still on their own pages). How We Work is a compact 6-step strip linking to Trade Process — no arrow heading anywhere.
- [x] **Worldwide**: dotted world map with trade lanes (core markets, the Container Line network and dashed "worldwide, on request" lanes to Europe, the Americas, West Africa and East Asia); the hero wheel's centre is now a rotating dotted globe; wording says worldwide; product markets read "… and worldwide on request" with a "+ Worldwide" tag. Land data: Natural Earth via `scripts/generate-world-dots.mjs` → `src/lib/world-dots.ts`.
- [x] **Type and spacing**: heading sizes and section spacing reduced site-wide; every heading in Title Case without trailing full stops.
- [x] **Products**: uniform cards (photo or gradient picture area), sticky Exports/Imports bar, spec tables with a shaded label column, equal-height spec cards.
- [x] **Business**: services grid rebalanced to four equal cards; Global Sourcing shows a world map instead of seven country bubbles.
- [x] **Buyer / supplier forms**: searchable product picker (type to filter, arrows + Enter).
- [x] **BOSS Group**: overview page is about the Group only; each vertical has its own page (`/boss-group/container-line`, `/retail`, `/constructions`, `/hospitality`, `/it`, `/bpo`); "BOSS" dropped from vertical headings; store counts and hotel names removed, as the original BOSS Retail/Hospitality documents ask.
- [x] **About**: only about BGEXIM — the BOSS Group section and group references removed; the "BOSS Group businesses" figure replaced by "Countries in our trade network".
- [x] **Footer**: main links only.
- [x] **Product photos**: all 14 products now have a photo. The 10 new ones are stock images (8 public domain CC0 from rawpixel, StockSnap and Wikimedia; jaggery and polyethylene are CC BY-SA 4.0 from Wikimedia Commons, credited on their product pages via `photoCredits`). Sources in `src/payload/seed/images/SOURCES.json`. Replace with the client’s own photos when available.
- [x] **Aira animations** (inspired by kobra.systems; our own code): replies stream in word by word with a blur-to-sharp fade, extra content and option chips spring in one by one after the text, visitor messages pop with a spring, the chat follows new content with a jump-to-latest button when you scroll up, a live online dot, and an invitation pulse ring plus icon wiggle on the launcher until first opened. All off for reduced-motion visitors.
- [x] **Card sliders**: endless, smooth gliding rows with ← → arrows and drag/swipe (pause on hover; static when the cards already fit; still for reduced motion) — Home products, related products and key markets on product pages, Trade Process markets, BOSS Group awards, Container Line testimonials, "More from BOSS Group".
- [x] **Hero (client markup, 6 Oct)**: flat dotted world map across the whole hero background, no trade lines, faded out behind the text column for readability; wheel back to white icons (no photos); globe land dots larger and brighter so the world map reads clearly; BOSS logo + "BOSS Group" badge with "Merchant Exporter | Merchant Importer" above the headline; "Supply Chain Solutions" removed from the roles.
- [x] **Market flags**: flags on the market tiles, the Core Markets column (Business), the trade-lane list and map labels; each market tile shows its flag (flag-icons, MIT, all ISO flags in `public/flags` so markets added in the admin get theirs), plus a "Worldwide" tile closing the grid.
- [x] **Less white**: light sections tinted blue with soft gradient glows; gradient cards everywhere; more dark navy sections (Quality & Verification, Why BGEXIM); gradient panels (world map, spinning globe or BOSS mark) fill the empty column under split headings on large screens.
- [x] **Home products row**: superseded by the endless card sliders below.
- [x] **Colours**: brand gradient on primary buttons, icon tiles and product placeholders; deep navy gradient on dark sections, panels and footer. Theme unchanged.
- [x] **Aira**: greeting teaser with quick-start buttons (desktop, once per visit, never on phones); compact launcher on phones; new "📞 Request a Call Back" path collects name, email, phone and topic and saves a general enquiry with a BGX reference; offered whenever Aira can't answer.
- [ ] **Confirm with the client**: the dashed "worldwide, on request" lanes (illustrative, not current trade); the "Countries in our trade network" figure (core markets + the Container Line network); the vertical-page copy (from their documents and the BOSS Australia site); whether the BGEXIM card should stay on the BOSS Group page.

### R4. Client review round 4 (6 Oct 2026) — built, awaiting client review

Final review with the client: **Monday 12 Oct, around 9–10 a.m. (time to confirm).**

**Can start now (no client input needed)**
- [x] **R4.1** Replace two-letter country codes with three-letter codes (UAE → ARE, SA → SAU, SG → SGP…) on tiles, lists, chips and map labels. Flags keep working from the two-letter code behind the scenes.
- [x] **R4.2** Home: separate Export and Import products into two scrolling rows.
- [x] **R4.3** Home: smaller product cards — photo and name only, no description.
- [x] **R4.4** Use the approved tagline "Trade Beyond Boundaries" consistently (same wording and capitalisation everywhere: hero, CTA, footer, share image, page titles).
- [x] **R4.5** Fix the logo looking half white / half blue (the mark and "Global EXIM" render in different colours on the dark header). Use one consistent treatment; use the client's official logo files when they arrive.
- [x] **R4.6** Show the BOSS logo consistently on the left of every page header (desktop and phone).
- [x] **R4.7** Reduce excess empty space and tighten alignment across all pages.
- [x] **R4.8** Product specifications: compact, consistent layout. **Proposal to confirm:** spec cards in rows — 4 per row on desktop, 3 on laptop/tablet (the "four-by-three" arrangement).
- [x] **R4.9** Aira: show the greeting prompt again when the visitor moves to a new page.
- [x] **R4.10** Aira: if the prompt is dismissed, bring it back after about 20–30 seconds.
- [x] **R4.11** Aira: after two or three questions, ask for phone number and email (skippable), so the team can follow up.
- [x] **R4.12** Visible dark / light mode switch in the header.
- [x] **R4.13** Keep the other business verticals (Retail, Constructions, Hospitality, IT, BPO) to one page each — already the case.

**Built from existing material (confirm with the client)**
- [x] **R4.14** Add the new products to the product list and menu — needs the product list and content (see resource checklist).
  - Done from the PRODUCT PORTFOLIO: Pomegranate, Fresh Onions, Indian Mangoes, Dehydrated Fruits, Ginger/Moringa/Amla, Frozen Shrimp — with spec tables and portfolio photos; menu lists categories.
- [x] **R4.15** Organise products under the correct categories — needs the approved category list.
  - Done with our own category list (Rice & Grains, Spices, Pulses, Fresh Fruits & Vegetables, Dehydrated & Herbal, Seafood, Nuts & Oilseeds, Natural Sweeteners; imports: Polymers, Metal Scrap). Products page is grouped by category; menu links jump to each group.
- [x] **R4.16** Replace the dotted world-map / Global Sourcing graphic with the client's own image.
  - Done with the BOSS Footprint map (2nd resources): placeholder text painted out, legend cropped. Used on the Global Sourcing card and the BOSS Group intro panel.
- [x] **R4.17** Six Container Line service pages: NVOCC, Freight Forwarding, Container Trading, Break Bulk Cargo, Project Cargo, 3PL & Warehousing. We can build them from the brochure text, but each needs approved copy and photos; Project Cargo has no client copy yet.
  - Done at /boss-group/container-line/<service>, from the client's service docs, Container Line website and brochure (brochure cut-out photos for 4 services; Project Cargo and 3PL show an icon until photos arrive). **Project Cargo copy is our draft** — confirm with the client.
- [x] **R4.18** Profiles and photos for the three founders / leaders.
  - Done as profile cards with a branded monogram until photos are uploaded in the admin (Team / Leadership → photo); long bios fold under "Read full profile".
- [x] **R4.19** Correct the BOSS Group timeline once the client confirms the year groupings.
  - Done: milestones grouped into eras — Foundations 2000–05, Growth 2009–16, Development 2017–19, Diversification 2022–24. Confirm the groupings with the client.

**Client coordination**
- [ ] Send the missing-content checklist (products/categories, founder profiles/photos, logo/tagline, replacement map, corrected timeline, six service pages' content/images).
- [ ] Confirm the Monday final-review date and start time (around 9–10 a.m. was discussed).
