/**
 * Content model for the site. Code config (`src/config`) and CMS content
 * (mapped in `src/lib/content`) are both checked against these shapes, so the
 * components never care where a piece of content came from.
 */
import type { FAQ_CATEGORY } from "@/config/faq";
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

/** A heading with the client's paragraphs of copy. */
export interface ProseContent {
  heading: SectionContent;
  paragraphs: string[];
}

/** A short labelled point with an icon, e.g. a strength or a business model. */
export interface Highlight {
  title: string;
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
  /** Closing line used across the site, e.g. under the hero. */
  motto: string;
  wordmark: { primary: string; secondary: string };
}

export interface ContactInfo {
  website: string;
  /** Undefined shows "To be added". */
  email?: string;
  phone?: string;
  address?: string;
}

export type SocialPlatform = "LinkedIn" | "Facebook" | "Instagram" | "X" | "YouTube";

export interface SocialLink {
  platform: SocialPlatform;
  /** Undefined until the profile is live — it renders as "coming soon". */
  href?: string;
}

export type RegistrationKey = "cin" | "pan" | "gst" | "iec" | "rcmc" | "iso" | "adCode";

/** Managed in the admin under Settings → Company details. */
export interface CorporateVideo {
  /** A YouTube or Vimeo link, as entered in the admin. */
  url: string;
  title?: string;
  poster?: ImageAsset;
}

export interface CompanyDetails {
  contact: ContactInfo;
  social: SocialLink[];
  registrations: Partial<Record<RegistrationKey, string>>;
  /** Indian ports we usually ship from. */
  originPorts: string[];
  video?: CorporateVideo;
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
  /** Shown as the website contact; email, phone and address come from the admin. */
  website: string;
  /** Profiles offered in the admin, in display order. */
  socialPlatforms: SocialPlatform[];
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

export type MarketCode = string;

export interface Market {
  code: MarketCode;
  name: string;
  shortName: string;
  region: string;
  coordinates: GeoPoint;
  labelAnchor?: LabelAnchor;
  /** Destination ports we ship to in this market. */
  ports?: string[];
}

export type TradeDirection = "export" | "import";

export interface SpecificationTable {
  title: string;
  subtitle?: string;
  rows: { label: string; value: string }[];
  keyFeatures?: string[];
}

interface ProductBase {
  slug: string;
  name: string;
  category: string;
  icon: IconName;
  summary: string;
  /** Overview paragraphs, separated by blank lines. */
  description: string;
  images?: ImageAsset[];
  packaging?: string;
  documentation?: string[];
  specifications?: SpecificationTable[];
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

export interface ImageAsset {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface TeamMember {
  name: string;
  role: string;
  bio?: string;
  photo?: ImageAsset;
}

/** A statutory registration; its number is entered in the admin. */
export interface ComplianceItem {
  key: RegistrationKey;
  code: string;
  name: string;
  issuer: string;
}

export interface GroupCompany {
  name: string;
  description: string;
  icon: IconName;
  logo?: ImageAsset;
  href?: string;
  isCurrent?: boolean;
}

export interface Gallery {
  title: string;
  icon: IconName;
  images: ImageAsset[];
}

export interface Resource {
  title: string;
  description: string;
  format: string;
  icon: IconName;
  /** Download link; undefined shows "Coming soon". */
  href?: string;
}

/* ─────────────────────────── Partners & enquiries ────────────────────────── */

export type EnquiryTypeId = "general" | "buyer" | "supplier" | "partnership";

/** Every field the enquiry forms can show; each enquiry type picks its own set. */
export type EnquiryField =
  | "name"
  | "company"
  | "email"
  | "phone"
  | "country"
  | "website"
  | "registration"
  | "designation"
  | "product"
  | "grade"
  | "quantity"
  | "frequency"
  | "destinationCountry"
  | "destinationPort"
  | "deliveryDate"
  | "incoterm"
  | "paymentMethod"
  | "originCountry"
  | "capacity"
  | "moq"
  | "packaging"
  | "loadingPort"
  | "indicativePrice"
  | "paymentTerms"
  | "partnershipArea"
  | "marketsCovered"
  | "services"
  | "licences"
  | "experience"
  | "message"
  | "attachments";

/** How a field is shown and checked. */
export type EnquiryFieldKind = "text" | "email" | "tel" | "url" | "date" | "textarea" | "select" | "product" | "files";

export interface EnquiryFieldDefinition {
  kind: EnquiryFieldKind;
  label: string;
  placeholder?: string;
  /** Choices for "select" fields. */
  options?: string[];
  autoComplete?: string;
}

export interface EnquiryFieldConfig {
  name: EnquiryField;
  required?: boolean;
  /** Overrides the field's default label or placeholder for this enquiry type. */
  label?: string;
  placeholder?: string;
}

export interface EnquiryFormSection {
  title: string;
  fields: EnquiryFieldConfig[];
}

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
  pointsLabel: string;
  points: string[];
  cta: { label: string; enquiryType: EnquiryTypeId };
  featured?: boolean;
}

export type FaqCategory = (typeof FAQ_CATEGORY)[keyof typeof FAQ_CATEGORY];

export interface FaqItem {
  question: string;
  answer: string;
  /** Groups questions on the FAQ page and in the chatbot. */
  category: FaqCategory;
  /** Other words visitors might type; they help the chatbot find this answer. */
  keywords?: string[];
  /** Optional next step shown under the answer. */
  action?: LinkItem;
}
