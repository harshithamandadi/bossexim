/**
 * ════════════════════════════════════════════════════════════════════════════
 *  SITE CONFIGURATION — start here.
 *
 *  Company identity and core services — the parts of the site that stay in code.
 *  Everyday content (products, markets, FAQs, team, galleries, downloads, BOSS
 *  Group companies, contact details, social links and registration numbers) is
 *  edited in the admin at /admin. Page copy lives next to this file.
 *
 *  NOTE: The source brief supplied the site structure, product lines, markets and
 *  group companies. Longer descriptive copy throughout src/config is DRAFT copy
 *  written for review — please confirm it with the client before launch.
 * ════════════════════════════════════════════════════════════════════════════
 */
import type { SiteConfig } from "@/types/content";
import { anchorHref, groupVerticalHref, routes, sectionIds } from "./routes";

export const siteConfig: SiteConfig = {
  company: {
    // Name per the client's final documents (Oct 2026): "BOSS EXIM (Global) Pvt. Ltd.", "BOSS EXIM" for short.
    legalName: "BOSS EXIM (Global) Pvt. Ltd.",
    name: "BOSS EXIM Global",
    shortName: "BOSS EXIM",
    descriptor: "Global Trading Company",
    tagline: "Trade Beyond Boundaries",
    focus: "Global Sourcing & International Trading",
    roles: ["Merchant Exporter", "Merchant Importer", "Supply Chain Solutions"],
    parentGroup: "BOSS Group",
    summary:
      "BOSS EXIM (Global) Pvt. Ltd. (BOSS EXIM) connects reliable suppliers, genuine buyers and international markets through structured sourcing, trading and supply-chain coordination.",
    motto: "Connecting Products. Markets. Opportunities.",
    wordmark: { primary: "BOSS", secondary: "EXIM Global" },
  },

  url: "https://www.bgexim.com",

  website: "www.bgexim.com",

  socialPlatforms: ["LinkedIn", "Facebook", "Instagram", "X", "YouTube"],

  seo: {
    description:
      "BOSS EXIM (Global) Pvt. Ltd. (BOSS EXIM) connects reliable suppliers, genuine buyers and international markets through structured sourcing, trading and supply-chain coordination. Part of the BOSS Group.",
    keywords: [
      "BOSS EXIM",
      "BOSS EXIM Global",
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
        "Selected products sourced from India for international buyers through a buyer-driven approach — planned around the product, quality, quantity, packaging, destination and documentation you need.",
      points: [
        "Rice, spices, pulses, fresh produce & seafood",
        "Dehydrated, manufactured & other food products",
        "Quality reports, certificates & inspection coordinated",
      ],
      visual: "exports",
      href: anchorHref(routes.business, sectionIds.business.model),
    },
    {
      id: "merchant-import",
      title: "Merchant Import",
      icon: "factory",
      summary:
        "Polymers and industrial raw materials sourced internationally for Indian buyers, based on confirmed grades, technical specifications and commercial requirements.",
      points: [
        "Polymers — PP, PE & polyester chips",
        "Copper, aluminium, UBC, iron & steel scrap",
        "Foil rolls, medical bottles & recycled plastic flakes",
      ],
      visual: "imports",
      href: anchorHref(routes.business, sectionIds.business.model),
    },
    {
      id: "supply-chain",
      title: "Supply Chain Solutions",
      icon: "route",
      summary:
        "Documentation, inspection, banking and logistics coordinated through our logistics partners and trusted external specialists.",
      points: ["Backed by an established logistics network", "NVOCC, freight forwarding & break bulk", "Customs & shipment coordination"],
      visual: "logistics",
      href: groupVerticalHref("container-line"),
    },
    {
      id: "global-sourcing",
      title: "Global Sourcing",
      icon: "globe",
      summary:
        "Understanding the requirement, identifying suitable sources and verifying commercial and quality details before a trade is structured.",
      points: ["Supplier identification & verification", "Specification matching", "Structured, transparent transactions"],
      visual: "sourcing",
      href: routes.partner,
    },
  ],
};
