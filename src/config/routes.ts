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
  },
  group: {
    containerLine: "boss-container-line",
    companies: "group-companies",
    media: "media-events",
  },
  resources: {
    downloads: "downloads",
  },
  contact: {
    form: "enquiry",
  },
} as const;

export function anchorHref(route: string, id: string): string {
  return `${route}#${id}`;
}

export function productHref(slug: string): string {
  return `${routes.products}/${slug}`;
}

export function productsViewHref(direction: TradeDirection): string {
  return `${routes.products}?view=${direction}`;
}

export function contactHref(options: { type?: EnquiryTypeId; product?: string } = {}): string {
  const params = new URLSearchParams();
  if (options.type) params.set("type", options.type);
  if (options.product) params.set("product", options.product);
  const query = params.toString();
  return `${routes.contact}${query ? `?${query}` : ""}#${sectionIds.contact.form}`;
}
