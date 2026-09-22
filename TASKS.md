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
| Global presence | Partial | 6 markets and a trade-lane map. **No ports** |
| BOSS Group, Media | Partial | Structure done. No logos or photos |
| Resources | Partial | Download list exists. Every file is "coming soon" |
| Partner / business enquiries | Partial | `/partner` links to the contact form; there is no form on the page |
| Contact and enquiry form | Partial | Validation, success and error states work. Delivers to a webhook only; no email notification |
| FAQs | Done | Dedicated `/faq` page with search, topic filters and FAQ structured data. 13 questions drafted by us: need client approval |
| Chatbot (§3.4) | Done | FAQ-based assistant on every page; matching runs in the browser, no paid APIs. Will read FAQs from the CMS once it exists |
| CMS / Admin panel (§3.2) | Not started | All content lives in `src/config/*.ts` today |
| Digital brochure (§4) | Not started | |
| Video + voice-over (§5) | Not started | |
| Basic SEO (§9) | Mostly | Metadata, sitemap, robots, JSON-LD. No social share image |
| Responsive (§3.1) | Done | Checked at 390, 768, 1024 and 1440 px on every page: no overflow or errors |

---

## 3. Decisions needed before coding

These block the CMS work, so settle them first.

### D1. Production hosting (§11: "deploy to the client's hosting")
We don't know where the site will live, and that decides the CMS, the database and file storage.
- A Node.js host is required: the forms already run on the server, and an admin panel needs a server and a database.
- Vercel's free Hobby plan is for non-commercial use only. A company site needs Vercel Pro or another host. Hosting cost is the client's (§10).
- **Ask:** Which host? Can it run Node.js and a database?

### D2. CMS: recommendation is **Payload CMS 3**, embedded in this Next.js app at `/admin`
- Free and open source, so there's no subscription (§10). Login and roles are built in (§3.2). Its typed collections map directly onto our existing `src/types/content.ts`.
- It needs a Postgres database and file storage, which D1 decides.
- **We haven't yet confirmed that it supports Next.js 16.3**; task A2 checks this. Fallback: Sanity, which is hosted with a free tier but is a third-party service, so it needs approval.
- Ruled out: building our own admin, because login, uploads and create/edit/delete screens would use up most of the 22–25 days.

### D3. What becomes admin-editable
§3.2 names products, team/leadership, FAQs and media/resources, plus "other agreed repeatable content". Proposed split:
- **Editable in the admin:** products, product categories, markets, ports, team, FAQs, galleries, resources (files), BOSS Group companies, and company details (contact info, registrations, social links, enquiry recipients).
- **Stays in code:** page layouts, navigation, headings and long-form page copy. Changing these after launch counts as a change request.

### D4. How enquiry emails are sent
Recommendation: send through the client's own business mailbox over SMTP, which needs no extra subscription. Fallback: the Resend free tier (third-party, so it needs approval). The existing webhook can stay as an optional extra.

### D5. Keep a copy of each enquiry in the admin?
Recommended as a read-only log, so a failed email never loses a lead. It deliberately has no statuses, assignments or pipelines, because §3.2 rules out a CRM. Needs client agreement.

### D6. Who owns the brochure and the video?
§13 lists both as developer deliverables, but they are design and video-production work. Confirm whether we or Bestverse's creative team produce them, and what the budget is for voice-over and music.

### Already resolved
- The company name is **BOSS Global EXIM Pvt. Ltd.**, as confirmed by the scope document. The banner's "BOSS Group EXIM" was an inconsistency.

---

## 4. Tasks

IDs are for reference in reviews. Effort figures are rough working days for our side; time spent waiting on the client is extra.

### A. CMS and architecture (~7 days)
- [ ] **A1** Settle D1–D3.
- [ ] **A2** Trial run of Payload on Next.js 16.3 in a branch: `/admin` login, one collection, a Postgres database, and a passing production build. First read the caching guide in `node_modules/next/dist/docs`, because Next 16 changed the caching APIs.
- [ ] **A3** Content model: collections for products, categories, markets, ports, team, FAQs, galleries, resources, group companies and enquiries (if D5 is approved), plus a single "Company details" record. Alt text required on every image.
- [ ] **A4** Access control: Admin and Editor roles, no public sign-up, lockout after repeated failed logins, `/admin` hidden from search engines.
- [ ] **A5** Data layer in `src/lib/content/`: server functions that read from the CMS with caching. Publishing in the admin refreshes the affected pages without a redeploy.
- [ ] **A6** Refactor the 59 files that import `@/config`. The 10 client components that use it (header, trade map, product catalogue, contact form, trade wheel and others) receive their data as props instead.
- [ ] **A7** Seed script: copy today's config content into the CMS so the site looks identical on day one.
- [ ] **A8** New products get their page and sitemap entry without a rebuild.
- [ ] **A9** Admin usability: help text on fields, sensible ordering, "View on site" links.
- [ ] **A10** Rewrite `README.md`, which currently tells non-developers to edit `src/config` files.

### B. Website gaps (~3 days)
- [ ] **B1** Replace our placeholder logo with the official logo in the header, footer, favicon and social share image.
- [ ] **B2** Support images, falling back to the current icons when none is uploaded: product cards and pages, team, group company logos, galleries, and the hero wheel segments (the banner uses photos there).
- [ ] **B3** Product pages: specifications table, HS headings, grades/varieties and packaging.
- [ ] **B4** Global presence: add Indian origin ports and destination ports to the map and lists. Recommend a dedicated `/global-presence` page, because §2 lists it as its own section; keep the teaser on the home page.
- [x] **B5** A dedicated `/faq` page with FAQ structured data (an easy SEO win). Home and partner pages keep their short FAQ section.
- [ ] **B6** A slot for the video on the About or home page that loads only when clicked, so it doesn't slow the page.
- [x] **B7** Tablet pass at 768 px and 1024 px, since §3.1 names tablets.
- [x] **B9** Trade wheel orbits the globe; pointing at (or tabbing to) a segment glides it to a stop, enlarges that segment and names it on the globe. Pauses off-screen and for reduced-motion users.
- [ ] **B8** Replace every "To be added" once inputs arrive: contact details, registrations, social links, leadership.

### C. Forms and notifications (~2 days)
- [ ] **C1** Agree the fields for each enquiry type (general, buyer, supplier, partnership), and have the form show the right fields for the chosen type.
- [ ] **C2** Put the partnership form on `/partner` itself, with the type preselected (§3.3).
- [ ] **C3** Email notification for each type to the agreed recipients, with reply-to set to the enquirer (D4).
- [ ] **C4** Acknowledgement email to the enquirer (recommended).
- [ ] **C5** Save each enquiry to the admin log (if D5 is approved).
- [ ] **C6** Spam protection: keep the existing hidden trap field; add a minimum fill time and a per-IP rate limit.
- [ ] **C7** If delivery fails, show a clear error with the company's email address as a fallback, and log the failure on the server.
- [ ] **C8** Test every type: validation errors, success and failure.

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
- [ ] **G5** Security: secrets only in server environment variables, `/admin` not indexed, security headers, dependency audit, database backups.
- [ ] **G6** Production deploy: domain, SSL, environment variables, first admin accounts.
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
- Hosting and CMS decided (D1–D3), and the A2 trial running locally with an admin login.
- Partnership form on `/partner` (C2).
- ~~Chatbot prototype running on the current FAQs (D2–D4).~~ Done: the full chatbot is built and tested.
- Port and product-specification fields on the site, with placeholder data clearly marked (B3, B4).
- ~~Tablet fixes (B7).~~ Done: tablet widths checked, no fixes needed.
- Client inputs checklist (section 6) sent to the client.

### Sprint 2: Fri 2 Oct (4 working days; confirm the date)
- CMS live for products, FAQs, team, media, resources and company details, with today's content copied in (A3–A8).
- Enquiry emails reaching test recipients (C3–C7).
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
- **Payload on Next.js 16.3 is unverified.** The A2 trial settles this before Sprint 1.
- **Brochure and video** depend on assets and approval rounds, and their owner is unclear (D6).
- **Scope creep.** The enquiry log (D5) and editable page copy (D3) can drift towards a CRM or a page builder. Keep them to what's agreed.
- **2 Oct is a national holiday**, so the Sprint 2 review may move.
