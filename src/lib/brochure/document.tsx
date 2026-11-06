/**
 * The PDF brochure's layout (react-pdf), following the client's mock-ups (Nov 2026): a cover
 * with the product wheel, About BOSS EXIM with the six trade steps, one page per selected
 * product, and a back cover with the trade-lanes map and the company's details. All facts
 * come from the admin and src/config, so the PDF always matches the website.
 */
import "server-only";
// react-pdf's Image is imported as Photo: it is not an HTML <img>, so it takes no alt text.
import { Document, Image as Photo, Link, Page, Path, StyleSheet, Svg, Text, View, type Styles } from "@react-pdf/renderer";
import { aboutOverview } from "@/config/about";
import { brochureContent } from "@/config/brochure";
import { closingCta, homeContent } from "@/config/pages";
import { howWeWork } from "@/config/process";
import { productLabels, tradeDirections } from "@/config/products";
import { productCategoryHref, productHref, routes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { formatStepNumber } from "@/lib/format";
import { LOCKUP, LOGO_MARK, lockupFontSize } from "@/lib/logo-mark";
import { SOCIAL_ICON_PATHS } from "@/lib/social-icons";
import { TRADE_MAP_SIZE, TRADE_ORIGIN, type TradeLane } from "@/lib/trade-lanes";
import type { CompanyDetails, LabelAnchor, Market, Product, SpecificationTable, Stat } from "@/types/content";
import { FONT_BODY, FONT_DISPLAY, type PdfImage } from "./assets";
import { PdfIcon } from "./icons";

const { document: copy } = brochureContent;
const { company } = siteConfig;

/** The website's colour tokens (src/app/globals.css). */
export const brochureColors = {
  navy: "#0e2f73",
  navyDeep: "#08214f",
  brand: "#1560bd",
  logo: LOGO_MARK.color,
  ink: "#142036",
  body: "#2f3c57",
  mute: "#5b6782",
  line: "#dbe3f0",
  mist: "#f2f6fc",
  accent: "#e8f0fb",
  sky: "#9cc8f5",
  tide: "#4fa8e8",
  gold: "#f2b34b",
  white: "#ffffff",
};
const color = brochureColors;

/** A4 in points. */
const PAGE_WIDTH = 595.28;
const MARGIN_X = 46;
/** The navy tagline band at the foot of every inner page. */
const BAND_HEIGHT = 40;
/** The cover's background (light at the top, fading to navy), drawn by artwork.ts at this size. */
// Shorter than the page (a page-tall picture breaks react-pdf's layout); it ends in the page's own navy, so no edge shows.
export const COVER_PANEL = { width: PAGE_WIDTH, height: 780 };
/** The back cover's trade map, full width. */
export const BACK_MAP = { top: 196, width: PAGE_WIDTH, height: (PAGE_WIDTH * TRADE_MAP_SIZE.height) / TRADE_MAP_SIZE.width };
/** The mark's proportions. */
const MARK_RATIO = LOGO_MARK.width / LOGO_MARK.height;
/** Product names listed on the cover before "and N more". */
const COVER_NAMES = 6;
/** Room kept for the "Other Products" button above the band. */
const PRODUCT_BUTTON_SPACE = 30;

/** A page of the website, as a link printed in the PDF. */
const siteLink = (path: string) => new URL(path, siteConfig.url).toString();
/** A product's page inside this PDF, for links from the cover. */
const productAnchor = (slug: string) => `product-${slug}`;

const styles = StyleSheet.create({
  page: {
    fontFamily: FONT_BODY,
    fontSize: 9,
    lineHeight: 1.45,
    color: color.ink,
    paddingTop: 64,
    paddingBottom: BAND_HEIGHT + 18,
    paddingHorizontal: MARGIN_X,
  },
  header: {
    position: "absolute",
    top: 24,
    left: MARGIN_X,
    right: MARGIN_X,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 7,
    borderBottomWidth: 0.75,
    borderBottomColor: color.line,
  },
  headerBrand: { flexDirection: "row", alignItems: "center" },
  headerMark: { width: 11 * MARK_RATIO, height: 11, marginRight: 5 },
  headerName: { fontSize: 8, color: color.logo },
  headerSection: { fontSize: 6.8, color: color.mute, letterSpacing: 1.2, textTransform: "uppercase" },
  band: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: BAND_HEIGHT,
    backgroundColor: color.navy,
    alignItems: "center",
    justifyContent: "center",
  },
  bandText: { fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 17, color: color.white, letterSpacing: 0.3 },
  bold: { fontWeight: 700 },

  eyebrow: { fontSize: 7, fontWeight: 700, letterSpacing: 1.4, textTransform: "uppercase", color: color.brand },
  eyebrowLight: { color: color.sky },
  h1: { fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 24, lineHeight: 1.12, color: color.navy, marginTop: 4, marginBottom: 8 },
  h2: { fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 12.5, color: color.navy, marginBottom: 5 },
  h3: { fontWeight: 700, fontSize: 9.5, color: color.navy, marginBottom: 2 },
  body: { fontSize: 9, color: color.body, marginBottom: 6 },
  small: { fontSize: 8, color: color.body },
  lead: { fontSize: 10.5, color: color.mute, marginBottom: 8 },
  note: { fontSize: 7.4, color: color.mute, marginTop: 6 },
  row: { flexDirection: "row", gap: 16 },
  section: { marginTop: 12 },
  productSection: { marginTop: 10 },

  // Buttons: links to the website, styled like its pills.
  buttonRow: { flexDirection: "row", gap: 10 },
  button: { flexDirection: "row", alignItems: "center", gap: 6, borderRadius: 20, textDecoration: "none" },
  buttonOutline: { borderWidth: 1, borderColor: color.line, backgroundColor: color.white, paddingVertical: 5, paddingHorizontal: 11 },
  buttonText: { fontSize: 7.6, fontWeight: 600, color: color.navy },

  // Cover and back cover
  coverPage: { fontFamily: FONT_BODY, backgroundColor: color.navyDeep, color: color.white },
  coverPanel: { position: "absolute", top: 0, left: 0, width: COVER_PANEL.width, height: COVER_PANEL.height },
  coverBrand: { position: "absolute", top: 28, left: MARGIN_X },
  coverText: { position: "absolute", left: MARGIN_X, right: MARGIN_X, bottom: 84 },
  coverTitle: { fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 48, lineHeight: 1.04, marginTop: 7, marginBottom: 10, maxWidth: 380 },
  coverLead: { fontSize: 11, lineHeight: 1.5, color: "#d9e6fa", maxWidth: 440 },
  roles: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 14 },
  role: { fontSize: 8.5, fontWeight: 600, borderWidth: 0.75, borderColor: "#6f86b3", borderRadius: 20, paddingVertical: 4, paddingHorizontal: 11 },
  featuring: { fontSize: 8.5, color: "#b9c9e6", marginTop: 14, lineHeight: 1.5 },
  featuringLink: { color: "#b9c9e6", textDecoration: "none" },
  coverFoot: {
    position: "absolute",
    left: MARGIN_X,
    right: MARGIN_X,
    bottom: 32,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: 7.6,
    color: "#9fb3d6",
    borderTopWidth: 0.75,
    borderTopColor: "#33507f",
    paddingTop: 9,
  },

  // About
  stats: { flexDirection: "row", flexWrap: "wrap", gap: 7 },
  aboutText: { fontSize: 8.6, lineHeight: 1.42, color: color.body, marginBottom: 5 },
  stat: { width: "47.5%", backgroundColor: color.navy, borderRadius: 7, padding: 9 },
  statValue: { fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 22, color: color.white, lineHeight: 1 },
  statLabel: { fontSize: 7.6, color: "#cfe0f7", marginTop: 4, lineHeight: 1.3 },
  pull: {
    fontFamily: FONT_DISPLAY,
    fontWeight: 800,
    fontSize: 11.5,
    lineHeight: 1.3,
    color: color.brand,
    borderLeftWidth: 2.5,
    borderLeftColor: color.brand,
    paddingLeft: 10,
    marginTop: 14,
  },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  tile: { width: "48.9%", backgroundColor: color.mist, borderRadius: 7, paddingVertical: 8, paddingHorizontal: 10 },
  tileText: { fontSize: 7.6, lineHeight: 1.4, color: color.body },
  steps: { backgroundColor: color.accent, borderRadius: 8, padding: 10 },
  stepsHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", gap: 16, marginBottom: 8 },
  stepsTitle: { fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 15, lineHeight: 1.15, color: color.navy },
  stepRow: { flexDirection: "row", gap: 6 },
  step: { flex: 1, backgroundColor: color.white, borderRadius: 6, padding: 7 },
  stepTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 5 },
  stepIcon: { width: 17, height: 17, borderRadius: 5, backgroundColor: color.accent, alignItems: "center", justifyContent: "center" },
  stepNumber: { fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 13, color: "#5f92d3" },
  stepTitle: { fontWeight: 700, fontSize: 8.4, color: color.navy, marginBottom: 2 },
  stepText: { fontSize: 6.5, lineHeight: 1.35, color: color.mute },

  // Product pages
  productPage: { paddingBottom: BAND_HEIGHT + PRODUCT_BUTTON_SPACE + 10 },
  productTop: { flexDirection: "row", gap: 16, marginBottom: 6 },
  productPhoto: { width: 220, height: 160, objectFit: "cover", borderRadius: 8 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 7, marginBottom: 2 },
  tag: {
    fontSize: 6.6,
    fontWeight: 700,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: color.white,
    backgroundColor: color.brand,
    borderRadius: 3,
    paddingVertical: 2,
    paddingHorizontal: 5,
  },
  tagImport: { backgroundColor: color.navy },
  hs: {
    fontSize: 7.6,
    fontWeight: 700,
    color: color.navy,
    backgroundColor: color.accent,
    borderRadius: 4,
    paddingVertical: 2.5,
    paddingHorizontal: 6,
  },
  label: { fontSize: 6.8, fontWeight: 700, letterSpacing: 1.1, textTransform: "uppercase", color: color.mute, marginBottom: 4 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 4 },
  chip: { fontSize: 7.6, fontWeight: 600, color: color.navy, backgroundColor: color.accent, borderRadius: 20, paddingVertical: 2.5, paddingHorizontal: 7 },
  docChip: { fontSize: 7, color: color.navy, backgroundColor: color.white, borderRadius: 20, paddingVertical: 2, paddingHorizontal: 6 },
  overview: { fontSize: 8.6, lineHeight: 1.4, color: color.body, marginBottom: 4 },
  specRow: { flexDirection: "row", paddingVertical: 2.2, paddingHorizontal: 6, borderBottomWidth: 0.5, borderBottomColor: color.line },
  specRowAlt: { backgroundColor: color.mist },
  specLabel: { width: "36%", fontSize: 7.8, fontWeight: 600, color: color.navy, paddingRight: 8 },
  specValue: { flex: 1, fontSize: 7.8, lineHeight: 1.35, color: color.body },
  sidebar: { flex: 1, alignSelf: "flex-start", backgroundColor: color.mist, borderRadius: 7, padding: 12 },
  /** Facts laid side by side when a product has no specification table. */
  factsRow: { flexDirection: "row", gap: 16, backgroundColor: color.mist, borderRadius: 7, padding: 12 },
  fact: { marginBottom: 10 },
  factColumn: { flex: 1 },
  bullet: { flexDirection: "row", marginBottom: 2 },
  bulletDot: { width: 9, fontSize: 8, color: color.brand },
  otherProducts: { position: "absolute", left: 0, right: 0, bottom: BAND_HEIGHT + 10, alignItems: "center" },
  otherProductsButton: { borderWidth: 1.6, borderColor: color.navy, borderRadius: 20, paddingVertical: 4, paddingHorizontal: 34, textDecoration: "none" },
  otherProductsText: { fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 12, color: color.navy },

  // Back cover
  back: { position: "absolute", left: MARGIN_X, right: MARGIN_X, top: 40 },
  backLegal: { fontSize: 9.5, color: "#b9c9e6", marginTop: 10 },
  explore: { position: "absolute", right: MARGIN_X, top: 146 },
  buttonGhost: { borderWidth: 0.75, borderColor: "#4a6aa3", backgroundColor: "#12306a", paddingVertical: 5, paddingHorizontal: 11 },
  buttonGhostText: { fontSize: 7.6, fontWeight: 600, color: color.white },
  map: { position: "absolute", left: 0, top: BACK_MAP.top, width: BACK_MAP.width, height: BACK_MAP.height },
  mapLabel: {
    position: "absolute",
    width: 20,
    height: 9,
    paddingTop: 1.6,
    fontSize: 5.4,
    fontWeight: 700,
    textAlign: "center",
    color: color.white,
    backgroundColor: "#10295c",
    borderWidth: 0.5,
    borderColor: "#3b5a92",
    borderRadius: 4.5,
  },
  mapOrigin: { position: "absolute", width: 30, fontSize: 7, fontWeight: 700, textAlign: "center", color: color.gold },
  /** Starts right under the map, so no gap opens above it (client request, 6 Nov 2026). */
  backBottom: { position: "absolute", left: MARGIN_X, right: MARGIN_X, top: BACK_MAP.top + BACK_MAP.height + 26 },
  backTitle: { fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 30, marginBottom: 6 },
  ctaRow: { flexDirection: "row", gap: 10, marginTop: 14 },
  ctaPrimary: { backgroundColor: "#3d8fe0", paddingVertical: 8, paddingHorizontal: 18 },
  ctaSecondary: { borderWidth: 1, borderColor: "#6f86b3", paddingVertical: 8, paddingHorizontal: 18 },
  ctaText: { fontSize: 10, fontWeight: 600, color: color.white },
  contactGrid: { flexDirection: "row", gap: 22, marginTop: 20, paddingTop: 14, borderTopWidth: 0.75, borderTopColor: "#33507f" },
  contactColumn: { flex: 1 },
  contactValue: { fontSize: 9.2, lineHeight: 1.5, color: color.white, marginTop: 3, marginBottom: 10 },
  socials: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 1 },
  socialIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 0.75,
    borderColor: "#6f86b3",
    alignItems: "center",
    justifyContent: "center",
    textDecoration: "none",
  },
  link: { color: color.white, textDecoration: "none" },
  /** A link that looks like the text around it: its colour comes from the style it is combined with. */
  plainLink: { textDecoration: "none" },
  hsRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 },
  viewOnline: { flexDirection: "row", alignItems: "center", gap: 3, textDecoration: "none" },
  viewOnlineText: { fontSize: 7.4, fontWeight: 600, color: color.brand },
  motto: { fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 16, color: color.sky, marginTop: 14 },
});

export interface BrochureAssets {
  /** The BOSS mark in logo blue (header and cover) and in white (back cover). No ™ anywhere. */
  markBlue: PdfImage;
  markWhite: PdfImage;
  /** The cover's top panel with the product wheel (artwork.ts). */
  coverPanel?: PdfImage;
  /** The back cover's trade-lanes map (artwork.ts) and the lanes it shows, for their labels. */
  tradeMap?: PdfImage;
  lanes: TradeLane[];
  /** Each product's first photo, by slug. */
  productPhotos: Map<string, PdfImage | undefined>;
}

export interface BrochureProps {
  /** Selected products, in catalogue order. */
  products: Product[];
  markets: Market[];
  details: CompanyDetails;
  stats: Stat[];
  assets: BrochureAssets;
  date: Date;
}

export function BrochureDocument({ products, markets, details, stats, assets, date }: BrochureProps) {
  const marketNames = new Map(markets.map((market) => [market.code, market.name]));
  return (
    <Document
      title={`${company.name} — ${copy.title}`}
      author={company.legalName}
      subject={company.summary}
      creator={siteConfig.website}
      producer={siteConfig.website}
      language="en"
    >
      <CoverPage products={products} assets={assets} date={date} />
      <AboutPage stats={stats} assets={assets} />
      {products.map((product) => (
        <ProductPage
          key={product.slug}
          product={product}
          photo={assets.productPhotos.get(product.slug)}
          mark={assets.markBlue}
          marketNames={product.direction === "export" ? product.markets.flatMap((code) => marketNames.get(code) ?? []) : []}
        />
      ))}
      <BackCover details={details} assets={assets} />
    </Document>
  );
}

/**
 * The mark with a name beneath it at the mark's width, like the BOSS Group logo (client request,
 * 6 Nov 2026): the font size is chosen so the name fits exactly, never squeezed.
 */
function Lockup({ mark, name, width, color: textColor }: { mark: PdfImage; name: string; width: number; color: string }) {
  const scale = width / LOGO_MARK.width;
  const fontSize = lockupFontSize(name) * scale;
  return (
    <View style={{ width, alignItems: "center" }}>
      <Photo src={mark} style={{ width, height: width / MARK_RATIO }} />
      <Text
        style={{
          fontFamily: FONT_DISPLAY,
          fontWeight: 800,
          fontSize,
          lineHeight: 1,
          color: textColor,
          // Inter's line box sits a little above the capitals; this keeps the visible gap at LOCKUP.gap.
          marginTop: LOCKUP.gap * scale - fontSize * 0.18,
        }}
      >
        {name}
      </Text>
    </View>
  );
}

function Wordmark({ style, short = false }: { style: Styles[string]; short?: boolean }) {
  const { primary, secondary } = company.wordmark;
  // The short form drops "Global" (client mark-up, Nov 2026): "BOSS EXIM".
  const rest = short ? company.shortName.slice(primary.length).trim() : secondary;
  return (
    <Text style={style}>
      <Text style={styles.bold}>{primary}</Text> {rest}
    </Text>
  );
}

/** A pill button linking to the website. */
function SiteButton({ href, label, style, textStyle, arrow = true }: { href: string; label: string; style: Styles[string]; textStyle: Styles[string]; arrow?: boolean }) {
  const iconColor = (textStyle as { color?: string }).color ?? color.navy;
  return (
    <Link src={siteLink(href)} style={[styles.button, style]}>
      <Text style={textStyle}>{label}</Text>
      {arrow && <PdfIcon name="arrow-right" size={8} color={iconColor} />}
    </Link>
  );
}

/** The header and the tagline band, repeated on every inner page. */
function RunningChrome({ section, mark }: { section: string; mark: PdfImage }) {
  return (
    <>
      <View style={styles.header} fixed>
        <Link src={siteConfig.url} style={[styles.headerBrand, styles.plainLink]}>
          <Photo src={mark} style={styles.headerMark} />
          <Wordmark style={styles.headerName} short />
        </Link>
        <Text style={styles.headerSection}>{section}</Text>
      </View>
      <View style={styles.band} fixed>
        <Text style={styles.bandText}>{company.tagline}</Text>
      </View>
    </>
  );
}

function CoverPage({ products, assets, date }: { products: Product[]; assets: BrochureAssets; date: Date }) {
  const featured = products.slice(0, COVER_NAMES);
  const more = products.length - featured.length;
  const edition = new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" }).format(date);

  return (
    <Page size="A4" style={styles.coverPage}>
      {assets.coverPanel && <Photo src={assets.coverPanel} style={styles.coverPanel} />}
      <Link src={siteConfig.url} style={[styles.coverBrand, styles.plainLink]}>
        <Lockup mark={assets.markBlue} name={company.shortName} width={72} color={color.logo} />
      </Link>
      <View style={styles.coverText}>
        <Text style={[styles.eyebrow, styles.eyebrowLight]}>
          {copy.title} · {edition}
        </Text>
        <Text style={styles.coverTitle}>{company.tagline}</Text>
        <Text style={styles.coverLead}>{company.summary}</Text>
        <View style={styles.roles}>
          {company.roles.map((role) => (
            <Text key={role} style={styles.role}>
              {role}
            </Text>
          ))}
        </View>
        {/* Each name jumps to its page in this PDF. */}
        <Text style={styles.featuring}>
          <Text style={styles.bold}>{copy.featuring}: </Text>
          {featured.map((product, index) => (
            <Text key={product.slug}>
              {index > 0 && " · "}
              <Link src={`#${productAnchor(product.slug)}`} style={styles.featuringLink}>
                {product.name}
              </Link>
            </Text>
          ))}
          {more > 0 && ` ${copy.andMore(more)}`}
        </Text>
      </View>
      <View style={styles.coverFoot}>
        <Text>
          {company.legalName} · {copy.backCover.group}
        </Text>
        <Link src={siteConfig.url} style={[styles.plainLink, { color: "#9fb3d6" }]}>
          {siteConfig.website}
        </Link>
      </View>
    </Page>
  );
}

function AboutPage({ stats, assets }: { stats: Stat[]; assets: BrochureAssets }) {
  const paragraphs = aboutOverview.paragraphs.slice(0, -1);
  const closing = aboutOverview.paragraphs.at(-1);
  const { process } = homeContent;

  return (
    <Page size="A4" style={styles.page}>
      <RunningChrome section={copy.aboutSection} mark={assets.markBlue} />
      <Text style={styles.eyebrow}>{copy.aboutEyebrow}</Text>
      <Text style={styles.h1}>{aboutOverview.heading.title}</Text>
      <View style={styles.row}>
        <View style={{ flex: 1.35 }}>
          {paragraphs.map((paragraph) => (
            <Text key={paragraph} style={styles.aboutText}>
              {paragraph}
            </Text>
          ))}
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.stats}>
            {stats.map((stat) => (
              <View key={stat.label} style={styles.stat}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
          {closing && <Text style={styles.pull}>{closing}</Text>}
        </View>
      </View>

      <View style={styles.section} wrap={false}>
        <Text style={styles.h2}>{copy.whatWeDo}</Text>
        <View style={styles.grid}>
          {siteConfig.services.map((service) => (
            <Link key={service.id} src={siteLink(service.href)} style={[styles.tile, styles.plainLink]}>
              <Text style={styles.h3}>{service.title}</Text>
              <Text style={styles.tileText}>{service.summary}</Text>
            </Link>
          ))}
        </View>
      </View>

      {/* The six trade steps, as on the website's Home page (client mark-up, Nov 2026). */}
      <View style={[styles.steps, styles.section]} wrap={false}>
        <View style={styles.stepsHead}>
          <View style={{ flex: 1 }}>
            <Text style={styles.stepsTitle}>{process.title}</Text>
            {process.description && <Text style={[styles.small, { marginTop: 3 }]}>{process.description}</Text>}
          </View>
          <SiteButton href={process.cta.href} label={process.cta.label} style={styles.buttonOutline} textStyle={styles.buttonText} />
        </View>
        <View style={styles.stepRow}>
          {howWeWork.steps.map((step, index) => (
            <View key={step.title} style={styles.step}>
              <View style={styles.stepTop}>
                <View style={styles.stepIcon}>
                  <PdfIcon name={step.icon} size={9} color={color.brand} />
                </View>
                <Text style={styles.stepNumber}>{formatStepNumber(index + 1)}</Text>
              </View>
              <Text style={styles.stepTitle}>{step.title}</Text>
              <Text style={styles.stepText}>{step.description}</Text>
            </View>
          ))}
        </View>
      </View>
    </Page>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <View>
      {items.map((item) => (
        <View key={item} style={styles.bullet}>
          <Text style={styles.bulletDot}>•</Text>
          <Text style={[styles.small, { flex: 1 }]}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

function SpecificationsTable({ table }: { table: SpecificationTable }) {
  return (
    <View style={{ marginBottom: 2 }} wrap={false}>
      <Text style={styles.h2}>{productLabels.specificationsTitle}</Text>
      {table.subtitle && <Text style={styles.label}>{table.subtitle}</Text>}
      {table.rows.map((row, index) => (
        <View key={row.label} style={index % 2 === 0 ? [styles.specRow, styles.specRowAlt] : styles.specRow}>
          <Text style={styles.specLabel}>{row.label}</Text>
          <Text style={styles.specValue}>{row.value}</Text>
        </View>
      ))}
      {table.keyFeatures && (
        <View style={{ marginTop: 8 }}>
          <Text style={styles.h3}>{productLabels.keyFeatures}</Text>
          <Bullets items={table.keyFeatures} />
        </View>
      )}
    </View>
  );
}

function ProductPage({ product, photo, mark, marketNames }: { product: Product; photo?: PdfImage; mark: PdfImage; marketNames: string[] }) {
  const direction = tradeDirections[product.direction];
  const pageLink = siteLink(productHref(product.slug));
  const paragraphs = product.description
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  const factStyle = product.specifications ? styles.fact : styles.factColumn;
  const facts = [
    product.packaging && (
      <View key="packaging" style={factStyle}>
        <Text style={styles.label}>{productLabels.packaging}</Text>
        <Text style={styles.small}>{product.packaging}</Text>
      </View>
    ),
    <View key="markets" style={factStyle}>
      <Text style={styles.label}>{product.direction === "export" ? copy.marketsTitle : productLabels.facts.origin}</Text>
      <Text style={styles.small}>
        {product.direction === "export"
          ? [marketNames.join(", "), productLabels.worldwideSuffix].filter(Boolean).join(" ")
          : productLabels.facts.originValue}
      </Text>
    </View>,
    product.documentation && (
      <View key="documentation" style={factStyle}>
        <Text style={styles.label}>{productLabels.documentationTitle}</Text>
        <View style={styles.chips}>
          {product.documentation.map((document) => (
            <Text key={document} style={styles.docChip}>
              {document}
            </Text>
          ))}
        </View>
      </View>
    ),
  ];

  return (
    <Page size="A4" style={[styles.page, styles.productPage]}>
      <RunningChrome section={`${direction.singular} ${copy.productsSection}`} mark={mark} />
      <View id={productAnchor(product.slug)} style={styles.productTop}>
        {photo && (
          <Link src={pageLink}>
            <Photo src={photo} style={styles.productPhoto} />
          </Link>
        )}
        <View style={{ flex: 1 }}>
          <View style={styles.metaRow}>
            <Text style={product.direction === "import" ? [styles.tag, styles.tagImport] : styles.tag}>{direction.singular}</Text>
            <Link src={siteLink(productCategoryHref(product.direction, product.category))} style={[styles.eyebrow, styles.plainLink]}>
              {product.category}
            </Link>
          </View>
          <Link src={pageLink} style={[styles.h1, styles.plainLink]}>
            {product.name}
          </Link>
          <View style={styles.hsRow}>
            {product.hsCode && (
              <Text style={styles.hs}>
                {productLabels.facts.hsCode} {product.hsCode}
              </Text>
            )}
            <Link src={pageLink} style={styles.viewOnline}>
              <Text style={styles.viewOnlineText}>{copy.viewOnline}</Text>
              <PdfIcon name="arrow-right" size={7} color={color.brand} />
            </Link>
          </View>
          <Text style={styles.lead}>{product.summary}</Text>
          {product.variants && (
            <View>
              <Text style={styles.label}>{product.variantsLabel ?? productLabels.defaultVariantsLabel}</Text>
              <View style={styles.chips}>
                {product.variants.map((variant) => (
                  <Text key={variant} style={styles.chip}>
                    {variant}
                  </Text>
                ))}
              </View>
            </View>
          )}
        </View>
      </View>

      <View style={styles.productSection}>
        <Text style={styles.h2}>{copy.overview}</Text>
        {paragraphs.map((paragraph) => (
          <Text key={paragraph} style={styles.overview}>
            {paragraph}
          </Text>
        ))}
      </View>

      {product.specifications ? (
        <View style={[styles.row, styles.productSection]}>
          <View style={{ flex: 1.85 }}>
            {product.specifications.map((table) => (
              <SpecificationsTable key={table.title} table={table} />
            ))}
            <Text style={styles.note}>{productLabels.specificationsNote}</Text>
          </View>
          {/* Kept whole: split across pages, it would leave its box on one page and the facts on the next. */}
          <View style={styles.sidebar} wrap={false}>
            {facts}
          </View>
        </View>
      ) : (
        <View style={[styles.factsRow, styles.productSection]}>{facts}</View>
      )}

      <View style={styles.otherProducts} fixed>
        <Link src={siteLink(routes.products)} style={styles.otherProductsButton}>
          <Text style={styles.otherProductsText}>{copy.otherProducts}</Text>
        </Link>
      </View>
    </Page>
  );
}

/** Where a lane's code sits beside its point, as on the website's map (LABEL_TRANSFORMS). */
const LABEL_GAP = 4;
function labelPosition(x: number, y: number, anchor: LabelAnchor, width: number, height: number) {
  switch (anchor) {
    case "top":
      return { left: x - width / 2, top: y - height - LABEL_GAP };
    case "bottom":
      return { left: x - width / 2, top: y + LABEL_GAP };
    case "left":
      return { left: x - width - LABEL_GAP, top: y - height / 2 };
    default:
      return { left: x + LABEL_GAP, top: y - height / 2 };
  }
}

function TradeMap({ map, lanes }: { map: PdfImage; lanes: TradeLane[] }) {
  const scale = BACK_MAP.width / TRADE_MAP_SIZE.width;
  const { width, height } = styles.mapLabel as { width: number; height: number };
  return (
    <View style={styles.map}>
      <Photo src={map} style={{ width: BACK_MAP.width, height: BACK_MAP.height }} />
      {lanes.map((lane) => (
        <Text key={lane.code} style={[styles.mapLabel, labelPosition(lane.point.x * scale, lane.point.y * scale, lane.labelAnchor, width, height)]}>
          {lane.code}
        </Text>
      ))}
      <Text style={[styles.mapOrigin, { left: TRADE_ORIGIN.point.x * scale - 15, top: TRADE_ORIGIN.point.y * scale + 6 }]}>{TRADE_ORIGIN.code}</Text>
    </View>
  );
}

function BackCover({ details, assets }: { details: CompanyDetails; assets: BrochureAssets }) {
  const { contact } = details;
  const { backCover } = copy;
  const website = `https://${contact.website}`;

  return (
    <Page size="A4" style={styles.coverPage}>
      <View style={styles.back}>
        <Link src={siteConfig.url} style={styles.plainLink}>
          <Lockup mark={assets.markWhite} name={company.shortName} width={96} color={color.white} />
        </Link>
        <Text style={styles.backLegal}>
          {company.legalName} · {company.descriptor}
        </Text>
      </View>
      <View style={styles.explore}>
        <SiteButton href={homeContent.world.cta.href} label={homeContent.world.cta.label} style={styles.buttonGhost} textStyle={styles.buttonGhostText} />
      </View>

      {assets.tradeMap && <TradeMap map={assets.tradeMap} lanes={assets.lanes} />}

      <View style={styles.backBottom}>
        <Text style={styles.backTitle}>{backCover.title}</Text>
        <Text style={styles.coverLead}>{backCover.lead}</Text>
        <View style={styles.ctaRow}>
          <SiteButton href={closingCta.primary.href} label={closingCta.primary.label} style={styles.ctaPrimary} textStyle={styles.ctaText} />
          {closingCta.secondary && (
            <SiteButton href={closingCta.secondary.href} label={closingCta.secondary.label} style={styles.ctaSecondary} textStyle={styles.ctaText} arrow={false} />
          )}
        </View>

        <View style={styles.contactGrid}>
          <View style={styles.contactColumn}>
            {contact.address && (
              <>
                <Text style={[styles.eyebrow, styles.eyebrowLight]}>{backCover.office}</Text>
                <Text style={styles.contactValue}>{contact.address}</Text>
              </>
            )}
          </View>
          <View style={styles.contactColumn}>
            {contact.email && (
              <>
                <Text style={[styles.eyebrow, styles.eyebrowLight]}>{backCover.email}</Text>
                <Link src={`mailto:${contact.email}`} style={[styles.contactValue, styles.link]}>
                  {contact.email}
                </Link>
              </>
            )}
            {contact.phone && (
              <>
                <Text style={[styles.eyebrow, styles.eyebrowLight]}>{backCover.phone}</Text>
                <Link src={`tel:${contact.phone.replace(/[^\d+]/g, "")}`} style={[styles.contactValue, styles.link]}>
                  {contact.phone}
                </Link>
              </>
            )}
          </View>
          <View style={styles.contactColumn}>
            <Text style={[styles.eyebrow, styles.eyebrowLight]}>{backCover.online}</Text>
            <Link src={website} style={[styles.contactValue, styles.link]}>
              {contact.website}
            </Link>
            {/* Round icons in one row (client request, 6 Nov 2026). X links to x.com until its profile is entered. */}
            <View style={styles.socials}>
              {details.social.map(({ platform, href }) => (
                <Link key={platform} src={href ?? website} style={styles.socialIcon}>
                  <Svg viewBox="0 0 24 24" width={9} height={9}>
                    <Path d={SOCIAL_ICON_PATHS[platform] ?? ""} fill={color.white} />
                  </Svg>
                </Link>
              ))}
            </View>
          </View>
        </View>

        <Text style={styles.motto}>{company.motto}</Text>
      </View>
      <View style={styles.coverFoot}>
        <Link src={siteLink(routes.group)} style={styles.plainLink}>
          <Lockup mark={assets.markWhite} name={company.parentGroup} width={34} color={color.white} />
        </Link>
        <Text>
          {company.legalName} · {backCover.group}
        </Text>
      </View>
    </Page>
  );
}
