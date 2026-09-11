/**
 * ════════════════════════════════════════════════════════════════════════════
 *  SITE CONFIGURATION — start here.
 *
 *  Company identity, contact details, social profiles and core services.
 *  Non-developers can safely edit any text between quotes.
 *
 *  • Anything set to `undefined` shows as "To be added" (or "coming soon") on the
 *    site. Replace it with a value in quotes, e.g.  email: "info@bgexim.com",
 *  • Other content lives next to this file: products.ts, markets.ts, about.ts,
 *    business.ts, process.ts, partners.ts, group.ts, resources.ts, faq.ts,
 *    contact.ts and pages.ts.
 *
 *  NOTE: The source brief supplied the site structure, product lines, markets and
 *  group companies. Longer descriptive copy throughout src/config is DRAFT copy
 *  written for review — please confirm it with the client before launch.
 * ════════════════════════════════════════════════════════════════════════════
 */
import type { SiteConfig } from "@/types/content";
import { routes, sectionIds, anchorHref } from "./routes";

export const siteConfig: SiteConfig = {
  company: {
    legalName: "BOSS Global EXIM Pvt. Ltd",
    name: "BOSS Global EXIM",
    shortName: "BGEXIM",
    descriptor: "Global Trading Company",
    tagline: "Trade Beyond Boundaries",
    focus: "Global Sourcing & International Trading",
    roles: ["Merchant Exporter", "Merchant Importer", "Supply Chain Solutions"],
    parentGroup: "BOSS Group",
    summary:
      "A global trading company of the BOSS Group — merchant exporter, merchant importer and supply chain solutions partner, trading from India to the world.",
    wordmark: { primary: "BOSS", secondary: "Global EXIM" },
  },

  url: "https://www.bgexim.com",

  contact: {
    website: "www.bgexim.com",
    email: undefined,
    phone: undefined,
    address: undefined,
  },

  social: [
    { platform: "LinkedIn", href: undefined },
    { platform: "Facebook", href: undefined },
    { platform: "Instagram", href: undefined },
    { platform: "X", href: undefined },
    { platform: "YouTube", href: undefined },
  ],

  seo: {
    description:
      "BOSS Global EXIM Pvt. Ltd is a global trading company — merchant exporter of Indian agri-commodities, merchant importer of polymers and metal scrap, and supply chain solutions partner.",
    keywords: [
      "BOSS Global EXIM",
      "BGEXIM",
      "merchant exporter India",
      "merchant importer India",
      "rice exporter",
      "spices exporter",
      "polymer import",
      "metal scrap import",
      "global sourcing",
      "international trading",
    ],
  },

  /** Core service offerings — shown in the bento grid on Home and Business. */
  services: [
    {
      id: "merchant-export",
      title: "Merchant Export",
      icon: "ship",
      summary:
        "We buy agri-commodities from Indian producers and sell them to overseas buyers in our own name.",
      points: [
        "Staple agri-commodities & food ingredients",
        "Buyers across the Middle East, South-East Asia & Australia",
        "Packed to the buyer's requirements",
      ],
      visual: "exports",
      href: anchorHref(routes.business, sectionIds.business.model),
    },
    {
      id: "merchant-import",
      title: "Merchant Import",
      icon: "factory",
      summary:
        "We source industrial raw materials internationally and supply them to manufacturers in India.",
      points: [
        "Polymers — PP, PE & polyester chips",
        "Aluminium, copper, iron & stainless steel scrap",
        "Graded to the buyer's specification",
      ],
      visual: "imports",
      href: anchorHref(routes.business, sectionIds.business.model),
    },
    {
      id: "supply-chain",
      title: "Supply Chain Solutions",
      icon: "route",
      summary:
        "Sourcing, documentation and shipping coordinated as one service, backed by the group's own container line.",
      points: ["Backed by BOSS Container Line", "NVOCC & freight forwarding", "Break-bulk capability"],
      visual: "logistics",
      href: anchorHref(routes.group, sectionIds.group.containerLine),
    },
    {
      id: "global-sourcing",
      title: "Global Sourcing",
      icon: "globe",
      summary:
        "Finding and qualifying the right producers for your specification — in India and abroad.",
      points: ["Supplier discovery & vetting", "Specification matching", "Consolidated procurement"],
      visual: "sourcing",
      href: routes.partner,
    },
  ],
};
