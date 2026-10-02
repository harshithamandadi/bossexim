/**
 * Site menus, following the client's Website Structure document. Used by the
 * header, the footer, the mobile menu and each page's "on this page" bar.
 */
import type { LinkItem, NavGroup } from "@/types/content";
import { enquiryTypes } from "./contact";
import { anchorHref, contactHref, partnerFormHref, productsViewHref, routes, sectionIds, toAnchorId } from "./routes";

const { about, business, tradeProcess, group, resources } = sectionIds;

/** Group companies with their own section on the BOSS Group page (see seed data). */
const GROUP_COMPANY_LINKS = [
  { name: "BOSS Retail", description: "45+ fuel and convenience stores in Australia." },
  { name: "BOSS Constructions", description: "Commercial and residential construction." },
  { name: "BOSS Hospitality", description: "Hotels and motels in Australia, India and Italy." },
  { name: "BOSS IT", description: "Digital systems and IT-enabled solutions." },
  { name: "BOSS BPO", description: "HR and finance operations outsourcing." },
];

/** Photo categories on the Media & Events page (see seed data). */
const MEDIA_CATEGORIES = [
  "Leadership",
  "Business Meetings",
  "Supplier Visits",
  "Trade Events",
  "International Business",
  "Group Activities",
];

export const mainNavigation: NavGroup[] = [
  {
    label: "About Us",
    href: routes.about,
    items: [
      {
        label: "About BOSS EXIM",
        href: anchorHref(routes.about, about.overview),
        description: "Our role in international trade.",
      },
      {
        label: "About BOSS Group",
        href: anchorHref(routes.about, about.group),
        description: "The diversified group behind us.",
      },
      {
        label: "Vision, Mission & Values",
        href: anchorHref(routes.about, about.vision),
        description: "How we conduct every transaction.",
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
        description: "A flexible B2B trading model.",
      },
      {
        label: "Why BOSS EXIM",
        href: anchorHref(routes.business, business.why),
        description: "One dependable point of contact.",
      },
      {
        label: "Our Current Focus",
        href: anchorHref(routes.business, business.focus),
        description: "The products and markets we serve today.",
      },
      {
        label: "Beyond Our Current Focus",
        href: anchorHref(routes.business, business.beyond),
        description: "Focused today, flexible for tomorrow.",
      },
    ],
  },
  {
    label: "Products",
    href: routes.products,
    items: [
      {
        label: "Exports from India",
        href: productsViewHref("export"),
        description: "Rice, spices, pulses, dehydrated foods and more.",
      },
      {
        label: "Imports",
        href: productsViewHref("import"),
        description: "Polymers and recyclable metals for Indian industry.",
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
        description: "Understand, source, verify, structure, execute, complete.",
      },
      {
        label: "Quality & Verification",
        href: anchorHref(routes.tradeProcess, tradeProcess.quality),
        description: "Verify the product, the parties and the documents.",
      },
      {
        label: "Our Global Presence",
        href: anchorHref(routes.tradeProcess, tradeProcess.presence),
        description: "Our base, core markets and wider network.",
      },
      {
        label: "Register as a Buyer",
        href: partnerFormHref("buyer"),
        description: "Tell us the product you need.",
      },
      {
        label: "Register as a Supplier",
        href: partnerFormHref("supplier"),
        description: "Introduce your company and products.",
      },
      {
        label: "Strategic Business Partner",
        href: partnerFormHref("partnership"),
        description: "Logistics, inspection, finance & representation.",
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
        description: "NVOCC, freight forwarding, container trading & 3PL.",
      },
      {
        label: "Network & Offices",
        href: anchorHref(routes.group, group.network),
        description: "31 agency agreements and offices in SG, MY & India.",
      },
      ...GROUP_COMPANY_LINKS.map(({ name, description }) => ({
        label: name,
        href: anchorHref(routes.group, toAnchorId(name)),
        description,
      })),
      {
        label: "Journey & Recognition",
        href: anchorHref(routes.group, group.journey),
        description: "Milestones since 2000, leadership and awards.",
      },
    ],
  },
  {
    label: "Media & Events",
    href: routes.media,
    items: MEDIA_CATEGORIES.map((category) => ({
      label: category,
      href: anchorHref(routes.media, toAnchorId(category)),
    })),
  },
  {
    label: "Resources",
    href: routes.resources,
    items: [
      {
        label: "BGEXIM Corporate Brochure",
        href: anchorHref(routes.resources, resources.downloads),
        description: "Company, products, markets and capabilities.",
      },
      {
        label: "BOSS Group Brochure",
        href: anchorHref(routes.resources, resources.downloads),
        description: "An overview of the wider BOSS ecosystem.",
      },
      {
        label: "Product Specifications",
        href: anchorHref(routes.resources, resources.specifications),
        description: "The latest specification, on request.",
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
