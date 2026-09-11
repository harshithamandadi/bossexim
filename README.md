# BOSS Global EXIM — website

Marketing site for **BOSS Global EXIM Pvt. Ltd** (www.bgexim.com).
Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Framer Motion.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (also type-checks)
npm run lint
npm run typecheck
```

## Editing content (no React knowledge needed)

All text, contact details, products and menus live in **`src/config/`**. The UI reads
from these files, so you never need to open a component to change content.

| File | What it controls |
| --- | --- |
| `site.ts` | **Start here.** Company name, tagline, email/phone/address, social links, core services, SEO |
| `products.ts` | Export & import product lines (add a product → a new product page appears automatically) |
| `markets.ts` | Destination markets and their map positions |
| `about.ts` | About page — overview, vision/mission/values, leadership, registrations (CIN, PAN, GST…) |
| `business.ts` | Why BOSS EXIM, current focus, beyond current focus |
| `process.ts` | How we work (6 steps), quality & verification, trade-lane labels |
| `partners.ts` | Buyer / supplier / strategic partner registration cards |
| `group.ts` | BOSS Group companies, BOSS Container Line services, Media & Events galleries |
| `resources.ts` | Brochure / specification downloads |
| `faq.ts` | FAQs (lists of products/markets are generated automatically) |
| `contact.ts` | Enquiry types and every label/message on the enquiry form |
| `pages.ts` | Page headings, SEO descriptions, home-page copy, closing call-to-action |
| `navigation.ts` | Header, footer and mobile menus |

Anything set to `undefined` (e.g. `email: undefined`) shows as **"To be added"** or
**"Coming soon"** on the site — replace it with a value in quotes when ready.
Counts such as "7 export lines" or "6 markets" are calculated from the config, never typed by hand.

> The source brief supplied the structure, product lines, markets and group companies.
> Longer descriptions are draft copy for client review.

### Images & files

- Team photos → `public/team/…`, then set `photo` in `about.ts`
- Gallery photos → `public/media/…`, then list them in `group.ts`
- Brochures (PDF) → `public/downloads/…`, then set `href` in `resources.ts`

## Enquiry form

Submissions are validated on the server (`src/app/contact/actions.ts`) and delivered by
`src/lib/enquiry/deliver.ts`. Set `ENQUIRY_WEBHOOK_URL` (see `.env.example`) to forward
each enquiry as JSON to Zapier, Make, Formspree, a Slack/Teams workflow or your CRM.
Without it, enquiries are logged in development and the form reports an error in
production — so leads are never silently lost.

## Project structure

```
src/
├── app/                      Routes (App Router) — thin pages that compose sections
│   ├── layout.tsx            Fonts, header, footer, motion provider, JSON-LD
│   ├── page.tsx              Home
│   ├── about/ business/ products/ products/[slug]/ trade-process/
│   ├── partner/ boss-group/ resources/ contact/ (+ actions.ts)
│   └── sitemap.ts robots.ts not-found.tsx icon.svg globals.css
├── config/                   ★ All content (see table above)
├── types/content.ts          Content model — config is type-checked against it
├── lib/                      Pure logic: catalogue selectors, stats, geo projection,
│                             motion tokens, metadata, enquiry schema & delivery
├── hooks/                    useScrollSpy, useIsScrolled, useDomId
└── components/
    ├── ui/                   Primitives: Button, Section, SectionHeader, Card, Chip,
    │                         Accordion, SegmentedControl, Marquee, Field, Logo…
    ├── motion/               Reveal / RevealGroup, AnimatedHeadline, AnimatedNumber
    ├── layout/               Dynamic-island header, footer, local "on this page" nav, PageHero
    └── sections/             Page sections grouped by domain (home, about, business,
                              products, trade, group, resources, contact, shared)
```

### Design system

Colour tokens are defined once in `globals.css`. Semantic tokens (`canvas`, `surface`,
`fg`, `fg-mute`, `border`, `brand`) are re-mapped by `data-tone="light|mist|dark"`, so any
component placed in a dark section (or a dark card) adapts automatically — no duplicated
dark-mode styles. Typography uses `type-hero`, `type-h1`…`type-h4`, `type-lead`, `type-body`.
All animation timing comes from `src/lib/motion.ts`, and every animation respects the
visitor's "reduce motion" setting.
