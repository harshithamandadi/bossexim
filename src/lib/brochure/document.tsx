/**
 * The PDF brochure's layout (react-pdf): a cover, About BOSS EXIM, one page per
 * selected product and a back cover with the company's details. All facts come
 * from the admin and src/config, so the PDF always matches the website.
 */
import "server-only";
// react-pdf's Image is imported as Photo: it is not an HTML <img>, so it takes no alt text.
import { Document, Image as Photo, Link, Page, StyleSheet, Text, View, type Styles } from "@react-pdf/renderer";
import { aboutOverview, visionMissionValues } from "@/config/about";
import { brochureContent } from "@/config/brochure";
import { productLabels, tradeDirections } from "@/config/products";
import { siteConfig } from "@/config/site";
import type { CompanyDetails, Market, Product, SpecificationTable, Stat } from "@/types/content";
import { FONT_BODY, FONT_DISPLAY, type PdfImage } from "./assets";

const { document: copy } = brochureContent;
const { company } = siteConfig;

/** The website's colour tokens (src/app/globals.css). */
export const brochureColors = {
  navy: "#0e2f73",
  navyDeep: "#08214f",
  brand: "#1560bd",
  logo: "#264796",
  ink: "#142036",
  body: "#2f3c57",
  mute: "#5b6782",
  line: "#dbe3f0",
  mist: "#f2f6fc",
  accent: "#e8f0fb",
  sky: "#9cc8f5",
  white: "#ffffff",
};
const color = brochureColors;

/** A4 in points. */
const PAGE_WIDTH = 595.28;
const MARGIN_X = 46;
const COVER_PHOTO_HEIGHT = 500;
/** Cover photos are cropped to this width ÷ height and faded into the page (see fadedPhoto). */
export const COVER_PHOTO_ASPECT = PAGE_WIDTH / COVER_PHOTO_HEIGHT;
/** [offset, opacity] from the top: dark behind the logo, clear in the middle, solid at the bottom. */
export const COVER_FADE: [number, number][] = [[0, 0.7], [0.22, 0.05], [0.62, 0.2], [1, 1]];
/** The back cover's photo stays in the background, behind the company's name. */
export const BACK_FADE: [number, number][] = [[0, 0.82], [0.5, 0.88], [1, 1]];
/** Product names listed on the cover before "and N more". */
const COVER_NAMES = 6;

const styles = StyleSheet.create({
  page: {
    fontFamily: FONT_BODY,
    fontSize: 9,
    lineHeight: 1.45,
    color: color.ink,
    paddingTop: 64,
    paddingBottom: 54,
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
  headerMark: { width: 17, height: 11, marginRight: 5 },
  headerName: { fontSize: 8, color: color.logo },
  headerSection: { fontSize: 6.8, color: color.mute, letterSpacing: 1.2, textTransform: "uppercase" },
  footer: {
    position: "absolute",
    bottom: 22,
    left: MARGIN_X,
    right: MARGIN_X,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 7,
    color: color.mute,
  },
  pageNumber: { fontWeight: 700, color: color.navy },
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
  section: { marginTop: 14 },
  productSection: { marginTop: 10 },

  // Cover and back cover
  coverPage: { fontFamily: FONT_BODY, backgroundColor: color.navyDeep, color: color.white },
  coverPhoto: { position: "absolute", top: 0, left: 0, width: PAGE_WIDTH, height: COVER_PHOTO_HEIGHT, objectFit: "cover" },
  coverBrand: { position: "absolute", top: 40, left: MARGIN_X, flexDirection: "row", alignItems: "center" },
  coverMark: { width: 44, height: 28, marginRight: 9 },
  coverWordmark: { fontSize: 15, color: color.white },
  coverText: { position: "absolute", left: MARGIN_X, right: MARGIN_X, bottom: 92 },
  coverTitle: { fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 44, lineHeight: 1.04, marginTop: 8, marginBottom: 12 },
  coverLead: { fontSize: 11.5, lineHeight: 1.5, color: "#d9e6fa", maxWidth: 440 },
  roles: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 16 },
  role: { fontSize: 8.5, fontWeight: 600, borderWidth: 0.75, borderColor: "#6f86b3", borderRadius: 20, paddingVertical: 4, paddingHorizontal: 11 },
  featuring: { fontSize: 8.5, color: "#b9c9e6", marginTop: 16, lineHeight: 1.5 },
  coverFoot: {
    position: "absolute",
    left: MARGIN_X,
    right: MARGIN_X,
    bottom: 34,
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
  stat: { width: "47.5%", backgroundColor: color.navy, borderRadius: 7, padding: 10 },
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
  statement: { flex: 1, backgroundColor: color.mist, borderRadius: 7, padding: 12 },
  statementText: { fontSize: 9.6, fontWeight: 600, color: color.ink, marginTop: 4, lineHeight: 1.45 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  tile: { width: "48.9%", backgroundColor: color.mist, borderRadius: 7, padding: 11 },

  // Product pages
  productTop: { flexDirection: "row", gap: 16, marginBottom: 6 },
  productPhoto: { width: 220, height: 165, objectFit: "cover", borderRadius: 8 },
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
    alignSelf: "flex-start",
    fontSize: 7.6,
    fontWeight: 700,
    color: color.navy,
    backgroundColor: color.accent,
    borderRadius: 4,
    paddingVertical: 2.5,
    paddingHorizontal: 6,
    marginBottom: 8,
  },
  label: { fontSize: 6.8, fontWeight: 700, letterSpacing: 1.1, textTransform: "uppercase", color: color.mute, marginBottom: 4 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 4 },
  chip: { fontSize: 7.6, fontWeight: 600, color: color.navy, backgroundColor: color.accent, borderRadius: 20, paddingVertical: 2.5, paddingHorizontal: 7 },
  docChip: { fontSize: 7, color: color.navy, backgroundColor: color.white, borderRadius: 20, paddingVertical: 2, paddingHorizontal: 6 },
  overview: { fontSize: 8.6, lineHeight: 1.4, color: color.body, marginBottom: 4 },
  specRow: { flexDirection: "row", paddingVertical: 2.4, paddingHorizontal: 6, borderBottomWidth: 0.5, borderBottomColor: color.line },
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

  // Back cover
  back: { position: "absolute", left: MARGIN_X, right: MARGIN_X, top: 64 },
  backBottom: { position: "absolute", left: MARGIN_X, right: MARGIN_X, bottom: 84 },
  backMark: { width: 88, height: 56 },
  backWordmark: { fontSize: 26, marginTop: 14 },
  backLegal: { fontSize: 9.5, color: "#b9c9e6", marginTop: 4 },
  backTitle: { fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 32, marginBottom: 8 },
  contactGrid: { flexDirection: "row", gap: 22, marginTop: 26, paddingTop: 16, borderTopWidth: 0.75, borderTopColor: "#33507f" },
  contactColumn: { flex: 1 },
  contactValue: { fontSize: 9.4, lineHeight: 1.5, color: color.white, marginTop: 3, marginBottom: 11 },
  social: { fontSize: 7.8, color: "#c9d8f0", marginTop: 2, marginBottom: 5 },
  link: { color: color.white, textDecoration: "none" },
  motto: { fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 16, color: color.sky, marginTop: 18 },
  groupLogo: { height: 22, width: 64, objectFit: "contain" },
});

export interface BrochureAssets {
  /** The BOSS mark in white (covers) and in logo blue (inner pages). Cover photos come faded (COVER_FADE, BACK_FADE). */
  markWhite: PdfImage;
  markBlue: PdfImage;
  coverPhoto?: PdfImage;
  backPhoto?: PdfImage;
  groupLogo?: PdfImage;
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

function Wordmark({ style }: { style: Styles[string] }) {
  return (
    <Text style={style}>
      <Text style={styles.bold}>{company.wordmark.primary}</Text> {company.wordmark.secondary}
    </Text>
  );
}

/** Header and footer repeated on every inner page. */
function RunningChrome({ section, mark }: { section: string; mark: PdfImage }) {
  return (
    <>
      <View style={styles.header} fixed>
        <View style={styles.headerBrand}>
          <Photo src={mark} style={styles.headerMark} />
          <Wordmark style={styles.headerName} />
        </View>
        <Text style={styles.headerSection}>{section}</Text>
      </View>
      <View style={styles.footer} fixed>
        <Text>{siteConfig.website}</Text>
        <Text style={styles.pageNumber} render={({ pageNumber }) => String(pageNumber).padStart(2, "0")} />
      </View>
    </>
  );
}

function CoverPage({ products, assets, date }: { products: Product[]; assets: BrochureAssets; date: Date }) {
  const names = products.map((product) => product.name);
  const featured =
    names.length > COVER_NAMES
      ? `${names.slice(0, COVER_NAMES).join(" · ")} ${copy.andMore(names.length - COVER_NAMES)}`
      : names.join(" · ");
  const edition = new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" }).format(date);

  return (
    <Page size="A4" style={styles.coverPage}>
      {assets.coverPhoto && <Photo src={assets.coverPhoto} style={styles.coverPhoto} />}
      <View style={styles.coverBrand}>
        <Photo src={assets.markWhite} style={styles.coverMark} />
        <Wordmark style={styles.coverWordmark} />
      </View>
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
        <Text style={styles.featuring}>
          <Text style={styles.bold}>{copy.featuring}: </Text>
          {featured}
        </Text>
      </View>
      <View style={styles.coverFoot}>
        <Text>
          {company.legalName} · {copy.backCover.group}
        </Text>
        <Text>{siteConfig.website}</Text>
      </View>
    </Page>
  );
}

function AboutPage({ stats, assets }: { stats: Stat[]; assets: BrochureAssets }) {
  const paragraphs = aboutOverview.paragraphs.slice(0, -1);
  const closing = aboutOverview.paragraphs.at(-1);

  return (
    <Page size="A4" style={styles.page}>
      <RunningChrome section={copy.aboutSection} mark={assets.markBlue} />
      <Text style={styles.eyebrow}>{aboutOverview.heading.eyebrow}</Text>
      <Text style={styles.h1}>{aboutOverview.heading.title}</Text>
      <View style={styles.row}>
        <View style={{ flex: 1.35 }}>
          {paragraphs.map((paragraph) => (
            <Text key={paragraph} style={styles.body}>
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

      <View style={[styles.row, styles.section]}>
        {visionMissionValues.statements.map((statement) => (
          <View key={statement.label} style={styles.statement}>
            <Text style={styles.eyebrow}>{statement.label}</Text>
            <Text style={styles.statementText}>{statement.text}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section} wrap={false}>
        <Text style={styles.h2}>{copy.whatWeDo}</Text>
        <View style={styles.grid}>
          {siteConfig.services.map((service) => (
            <View key={service.id} style={styles.tile}>
              <Text style={styles.h3}>{service.title}</Text>
              <Text style={styles.small}>{service.summary}</Text>
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
    <Page size="A4" style={styles.page}>
      <RunningChrome section={`${direction.singular} ${copy.productsSection}`} mark={mark} />
      <View style={styles.productTop}>
        {photo && <Photo src={photo} style={styles.productPhoto} />}
        <View style={{ flex: 1 }}>
          <View style={styles.metaRow}>
            <Text style={product.direction === "import" ? [styles.tag, styles.tagImport] : styles.tag}>{direction.singular}</Text>
            <Text style={styles.eyebrow}>{product.category}</Text>
          </View>
          <Text style={styles.h1}>{product.name}</Text>
          {product.hsCode && (
            <Text style={styles.hs}>
              {productLabels.facts.hsCode} {product.hsCode}
            </Text>
          )}
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
        <>
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
        </>
      ) : (
        <View style={[styles.factsRow, styles.productSection]}>{facts}</View>
      )}
    </Page>
  );
}

function BackCover({ details, assets }: { details: CompanyDetails; assets: BrochureAssets }) {
  const { contact } = details;
  const { backCover } = copy;
  const socials = details.social.filter(({ platform, href }) => href && href !== siteConfig.socialPlaceholders[platform]);
  const website = `https://${contact.website}`;

  return (
    <Page size="A4" style={styles.coverPage}>
      {assets.backPhoto && <Photo src={assets.backPhoto} style={styles.coverPhoto} />}
      <View style={styles.back}>
        <Photo src={assets.markWhite} style={styles.backMark} />
        <Wordmark style={styles.backWordmark} />
        <Text style={styles.backLegal}>
          {company.legalName} · {company.descriptor}
        </Text>
      </View>

      <View style={styles.backBottom}>
        <Text style={styles.backTitle}>{backCover.title}</Text>
        <Text style={styles.coverLead}>{backCover.lead}</Text>

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
                <Text style={styles.contactValue}>{contact.phone}</Text>
              </>
            )}
          </View>
          <View style={styles.contactColumn}>
            <Text style={[styles.eyebrow, styles.eyebrowLight]}>{backCover.online}</Text>
            <Link src={website} style={[styles.contactValue, styles.link]}>
              {contact.website}
            </Link>
            {socials.map(({ platform, href }) => (
              <Link key={platform} src={href ?? website} style={[styles.social, styles.link]}>
                <Text style={styles.bold}>{platform}</Text>
              </Link>
            ))}
          </View>
        </View>

        <Text style={styles.motto}>{company.motto}</Text>
      </View>
      <View style={styles.coverFoot}>
        {assets.groupLogo ? <Photo src={assets.groupLogo} style={styles.groupLogo} /> : <Text />}
        <Text>
          {company.legalName} · {backCover.group}
        </Text>
      </View>
    </Page>
  );
}
