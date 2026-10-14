/**
 * Site menus, following the client's Website Structure document. Used by the
 * header, the footer, the mobile menu and each page's "on this page" bar.
 */
import type { LinkItem, NavGroup } from "@/types/content";
import { enquiryTypes } from "./contact";
import { groupVerticals } from "./group";
import { productCategories } from "./products";
import {
  anchorHref,
  contactHref,
  groupVerticalHref,
  partnerFormHref,
  productCategoryHref,
  routes,
  sectionIds,
  toAnchorId,
} from "./routes";

const { about, business, tradeProcess, resources } = sectionIds;

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
        label: "Vision, Mission & Values",
        href: anchorHref(routes.about, about.vision),
        description: "How we conduct every transaction.",
      },
      {
        label: "Our Team",
        href: anchorHref(routes.about, about.leadership),
        description: "The team that runs BOSS EXIM.",
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
    // One link per category (exports first, then imports), straight to its section.
    items: productCategories.map((category) => ({
      label: category.name,
      href: productCategoryHref(category.direction, category.name),
      description: category.description,
    })),
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
        label: "Partner With Us",
        href: anchorHref(routes.tradeProcess, tradeProcess.partner),
        description: "Buy, sell or partner with BOSS EXIM.",
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
    // Following the client's final structure: Our Businesses, each vertical, Founders, Our Journey, Recognition.
    items: [
      { label: "Our Businesses", href: anchorHref(routes.group, sectionIds.group.companies), description: "The BOSS Group at a glance." },
      ...groupVerticals.map((vertical) => ({
        label: vertical.name,
        href: groupVerticalHref(vertical.slug),
        description: vertical.menuDescription,
      })),
      { label: "Founders", href: anchorHref(routes.group, sectionIds.group.founders), description: "The friends who built BOSS Group." },
      { label: "Our Journey", href: anchorHref(routes.group, sectionIds.group.journey), description: "From 2000 to BOSS EXIM in 2026." },
      { label: "Recognition", href: anchorHref(routes.group, sectionIds.group.recognition), description: "Awards and media features." },
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
        label: "BOSS Group Video",
        href: anchorHref(routes.resources, resources.video),
        description: "From friendship to a global business ecosystem.",
      },
      {
        label: "BOSS EXIM Corporate Brochure",
        href: anchorHref(routes.resources, resources.downloads),
        description: "Company, products, markets and capabilities.",
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
