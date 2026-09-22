/**
 * Content model for the site. Every file in `src/config` is type-checked against
 * these shapes, so a typo in the content is caught at build time rather than on
 * the live site.
 */
import type { MarketCode } from "@/config/markets";
import type { IconName } from "@/lib/icons";

/* ───────────────────────── Shared building blocks ───────────────────────── */

export interface SectionContent {
  eyebrow?: string;
  title: string;
  description?: string;
}

export interface LinkItem {
  label: string;
  href: string;
}

export interface CallToAction {
  title: string;
  description: string;
  primary: LinkItem;
  secondary?: LinkItem;
}

export interface Feature {
  title: string;
  description: string;
  icon: IconName;
}

export interface FeatureSection {
  heading: SectionContent;
  items: Feature[];
}

export interface ProcessContent {
  heading: SectionContent;
  stepLabel: string;
  steps: Feature[];
}

export interface PageContent extends SectionContent {
  /** Used for the browser tab and search results. */
  metaTitle: string;
  metaDescription: string;
}

export interface Stat {
  value: number;
  label: string;
}

/* ───────────────────────────── Company & site ───────────────────────────── */

export interface CompanyInfo {
  legalName: string;
  name: string;
  shortName: string;
  descriptor: string;
  tagline: string;
  focus: string;
  roles: string[];
  parentGroup: string;
  summary: string;
  wordmark: { primary: string; secondary: string };
}

export interface ContactInfo {
  website: string;
  /** Leave undefined to show "To be added". */
  email?: string;
  phone?: string;
  address?: string;
}

export type SocialPlatform = "LinkedIn" | "Facebook" | "Instagram" | "X" | "YouTube";

export interface SocialLink {
  platform: SocialPlatform;
  /** Leave undefined until the profile is live — it renders as "coming soon". */
  href?: string;
}

/** Selects the illustration shown inside a service's bento card. */
export type ServiceVisual = "exports" | "imports" | "logistics" | "sourcing";

export interface Service {
  id: string;
  title: string;
  icon: IconName;
  summary: string;
  points: string[];
  visual: ServiceVisual;
  href: string;
}

export interface SiteConfig {
  company: CompanyInfo;
  url: string;
  contact: ContactInfo;
  social: SocialLink[];
  seo: { description: string; keywords: string[] };
  services: Service[];
}

/* ─────────────────────────────── Navigation ─────────────────────────────── */

export interface NavItem extends LinkItem {
  description?: string;
}

export interface NavGroup extends LinkItem {
  items: NavItem[];
}

/* ──────────────────────────── Markets & products ─────────────────────────── */

export interface GeoPoint {
  lat: number;
  lon: number;
}

/** Which side of its map marker a market's label sits on. */
export type LabelAnchor = "top" | "bottom" | "left" | "right";

export interface Market {
  code: string;
  name: string;
  shortName: string;
  region: string;
  coordinates: GeoPoint;
  labelAnchor?: LabelAnchor;
}

export type TradeDirection = "export" | "import";

interface ProductBase {
  slug: string;
  name: string;
  category: string;
  icon: IconName;
  summary: string;
  description: string;
  /** Grades, forms or varieties, e.g. HDPE / LDPE / LLDPE. */
  variants?: string[];
  variantsLabel?: string;
  /** Indicative HS heading — shown only once confirmed. */
  hsCode?: string;
}

export interface ExportProduct extends ProductBase {
  direction: "export";
  markets: MarketCode[];
}

export interface ImportProduct extends ProductBase {
  direction: "import";
}

export type Product = ExportProduct | ImportProduct;

/* ─────────────────────────────── About & group ────────────────────────────── */

export interface Statement {
  label: string;
  text: string;
}

export interface TeamMember {
  name: string;
  role: string;
  bio?: string;
  /** Path under /public, e.g. "/team/managing-director.jpg". */
  photo?: string;
}

export interface ComplianceItem {
  code: string;
  name: string;
  issuer: string;
  /** Registration number — leave undefined to show "To be added". */
  value?: string;
}

export interface GroupCompany {
  name: string;
  description: string;
  icon: IconName;
  href?: string;
  isCurrent?: boolean;
}

export interface GalleryImage {
  src: string;
  alt: string;
}

export interface Gallery {
  title: string;
  icon: IconName;
  images: GalleryImage[];
}

export interface Resource {
  title: string;
  description: string;
  format: string;
  icon: IconName;
  /** File path under /public or an external URL. Undefined = "coming soon". */
  href?: string;
}

/* ─────────────────────────── Partners & enquiries ────────────────────────── */

export type EnquiryTypeId = "general" | "buyer" | "supplier" | "partnership";

export interface EnquiryType {
  id: EnquiryTypeId;
  label: string;
  shortLabel: string;
  description: string;
}

export interface PartnerTrack {
  id: string;
  title: string;
  description: string;
  audiences: string[];
  cta: { label: string; enquiryType: EnquiryTypeId };
  featured?: boolean;
}

export interface FaqItem {
  question: string;
  answer: string;
  /** Groups questions on the FAQ page and in the chatbot. */
  category: string;
  /** Other words visitors might type; they help the chatbot find this answer. */
  keywords?: string[];
  /** Optional next step shown under the answer. */
  action?: LinkItem;
}
