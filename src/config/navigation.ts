/**
 * Site menus. Mirrors the sitemap in the brief; used by the header, the footer,
 * the mobile menu, the sitemap.xml and each page's "on this page" bar.
 */
import type { LinkItem, NavGroup } from "@/types/content";
import { enquiryTypes } from "./contact";
import { anchorHref, contactHref, productsViewHref, routes, sectionIds } from "./routes";

const { about, business, tradeProcess, partner, group, resources } = sectionIds;

export const mainNavigation: NavGroup[] = [
  {
    label: "About Us",
    href: routes.about,
    items: [
      {
        label: "About BOSS EXIM",
        href: anchorHref(routes.about, about.overview),
        description: "Who we are and how we trade.",
      },
      {
        label: "About BOSS Group",
        href: anchorHref(routes.about, about.group),
        description: "The diversified group behind us.",
      },
      {
        label: "Vision, Mission & Values",
        href: anchorHref(routes.about, about.vision),
        description: "The principles behind every contract.",
      },
      {
        label: "Our Team / Leadership",
        href: anchorHref(routes.about, about.leadership),
        description: "The people who lead BOSS EXIM.",
      },
      {
        label: "Registrations & Compliance",
        href: anchorHref(routes.about, about.compliance),
        description: "CIN, PAN, GST, IEC, RCMC, ISO & AD Code.",
      },
    ],
  },
  {
    label: "Business",
    href: routes.business,
    items: [
      {
        label: "Our Business Model",
        href: anchorHref(routes.business, business.model),
        description: "Merchant export, import & supply chain.",
      },
      {
        label: "Why BOSS EXIM",
        href: anchorHref(routes.business, business.why),
        description: "What sets us apart as a partner.",
      },
      {
        label: "Our Current Focus",
        href: anchorHref(routes.business, business.focus),
        description: "The products and markets we serve today.",
      },
      {
        label: "Beyond Our Current Focus",
        href: anchorHref(routes.business, business.beyond),
        description: "Where we're ready to grow next.",
      },
    ],
  },
  {
    label: "Products",
    href: routes.products,
    items: [
      {
        label: "Exports",
        href: productsViewHref("export"),
        description: "Rice, spices, pulses and more from India.",
      },
      {
        label: "Imports",
        href: productsViewHref("import"),
        description: "Polymers and metal scrap for Indian industry.",
      },
    ],
  },
  {
    label: "Trade Process",
    href: routes.tradeProcess,
    items: [
      {
        label: "How We Work",
        href: anchorHref(routes.tradeProcess, tradeProcess.howWeWork),
        description: "From first enquiry to final delivery.",
      },
      {
        label: "Quality & Verification",
        href: anchorHref(routes.tradeProcess, tradeProcess.quality),
        description: "How every consignment is checked.",
      },
      {
        label: "Our Global Presence",
        href: anchorHref(routes.tradeProcess, tradeProcess.presence),
        description: "Where our export lines ship.",
      },
    ],
  },
  {
    label: "Partner With Us",
    href: routes.partner,
    items: [
      {
        label: "Register as a Buyer",
        href: anchorHref(routes.partner, partner.buyer),
        description: "Buy Indian agri-commodities or industrial inputs.",
      },
      {
        label: "Register as a Supplier",
        href: anchorHref(routes.partner, partner.supplier),
        description: "Supply our export or import lines.",
      },
      {
        label: "Strategic Business Partner",
        href: anchorHref(routes.partner, partner.strategic),
        description: "Logistics, warehousing, inspection, finance & representation.",
      },
    ],
  },
  {
    label: "BOSS Group",
    href: routes.group,
    items: [
      {
        label: "BOSS Container Line",
        href: anchorHref(routes.group, group.containerLine),
        description: "NVOCC, freight forwarding, trading & break bulk.",
      },
      {
        label: "Group Companies",
        href: anchorHref(routes.group, group.companies),
        description: "Retail, constructions, hospitality, IT & BPO.",
      },
      {
        label: "Media & Events",
        href: anchorHref(routes.group, group.media),
        description: "Meetings, supplier visits, trade events & more.",
      },
    ],
  },
  {
    label: "Resources",
    href: routes.resources,
    items: [
      {
        label: "BGEXIM Corporate Brochure",
        href: anchorHref(routes.resources, resources.downloads),
        description: "Company profile, products and markets.",
      },
      {
        label: "BOSS Group Brochure",
        href: anchorHref(routes.resources, resources.downloads),
        description: "An overview of every group business.",
      },
      {
        label: "Product Specifications",
        href: anchorHref(routes.resources, resources.downloads),
        description: "Specification sheets for each product line.",
      },
      {
        label: "FAQs",
        href: routes.faq,
        description: "Answers to the questions we hear most.",
      },
    ],
  },
];

export const contactLink: LinkItem = { label: "Contact Us", href: routes.contact };

/** Footer column: one link per enquiry type. */
export const contactNavGroup: NavGroup = {
  ...contactLink,
  items: enquiryTypes.map((type) => ({ label: type.label, href: contactHref({ type: type.id }) })),
};
