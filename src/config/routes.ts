import type { EnquiryTypeId, TradeDirection } from "@/types/content";

/** Every page on the site. Change a URL here and all links follow. */
export const routes = {
  home: "/",
  about: "/about",
  business: "/business",
  products: "/products",
  tradeProcess: "/trade-process",
  partner: "/partner",
  group: "/boss-group",
  media: "/media-events",
  resources: "/resources",
  faq: "/faq",
  contact: "/contact",
} as const;

/** In-page anchors, shared by the menus and the sections they point to. */
export const sectionIds = {
  about: {
    overview: "overview",
    group: "boss-group",
    vision: "vision-mission-values",
    leadership: "leadership",
    compliance: "compliance",
  },
  business: {
    model: "business-model",
    why: "why-boss-exim",
    focus: "current-focus",
    beyond: "beyond-current-focus",
  },
  tradeProcess: {
    howWeWork: "how-we-work",
    quality: "quality-verification",
    presence: "global-presence",
  },
  partner: {
    buyer: "buyer",
    supplier: "supplier",
    strategic: "strategic-partner",
    form: "register",
  },
  group: {
    containerLine: "boss-container-line",
    companies: "group-companies",
  },
  resources: {
    downloads: "downloads",
    specifications: "product-specifications",
  },
  contact: {
    form: "enquiry",
  },
} as const;

export function anchorHref(route: string, id: string): string {
  return `${route}#${id}`;
}

/** In-page anchor for a gallery or group company, from its name: "BOSS Retail" → "boss-retail". */
export function toAnchorId(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function productHref(slug: string): string {
  return `${routes.products}/${slug}`;
}

export function productsViewHref(direction: TradeDirection): string {
  return `${routes.products}?view=${direction}`;
}

/** The registration form on the Partner page, with an enquiry type pre-selected. */
export function partnerFormHref(type: EnquiryTypeId): string {
  return `${routes.partner}?type=${type}#${sectionIds.partner.form}`;
}

export function contactHref(options: { type?: EnquiryTypeId; product?: string } = {}): string {
  const params = new URLSearchParams();
  if (options.type) params.set("type", options.type);
  if (options.product) params.set("product", options.product);
  const query = params.toString();
  return `${routes.contact}${query ? `?${query}` : ""}#${sectionIds.contact.form}`;
}
