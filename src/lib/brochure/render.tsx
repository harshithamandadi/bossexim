import "server-only";
import { renderToBuffer } from "@react-pdf/renderer";
import { groupByCategory } from "@/lib/catalogue";
import { LOGO_MARK } from "@/lib/logo-mark";
import { tradeLanes } from "@/lib/trade-lanes";
import type { CompanyDetails, Market, Product, Stat } from "@/types/content";
import { coverPanel, tradeMapArtwork } from "./artwork";
import { loadPhoto, logoMark, registerFonts, type PdfImage } from "./assets";
import { BACK_MAP, BrochureDocument, COVER_PANEL, brochureColors } from "./document";

/** Pixels per PDF point for the illustrations: sharp in print, small enough to email. */
const ARTWORK_SCALE = 2.5;
/**
 * Photo widths in pixels. Product photos print 220pt wide, so 720px is ~235 dpi — and keeps a
 * brochure of every product well under Vercel's 4.5 MB response limit.
 */
const PRODUCT_PHOTO_PX = 720;
const WHEEL_PHOTO_PX = 220;

interface RenderOptions {
  /** Selected products, in catalogue order. */
  products: Product[];
  /** Every product: the cover's wheel shows one photo per category, as on the Home page. */
  allProducts: Product[];
  markets: Market[];
  details: CompanyDetails;
  stats: Stat[];
  /** Where to fetch photos from (see photoOrigin). */
  origin: string;
}

/** The last illustration made, reused while its inputs stay the same. */
function lastResult<T>() {
  let cached: { key: string; value: Promise<T> } | undefined;
  return (key: string, make: () => Promise<T>) => {
    if (cached?.key !== key) {
      const value = make();
      cached = { key, value };
      value.catch(() => (cached = undefined));
    }
    return cached.value;
  };
}
const cachedCover = lastResult<PdfImage>();
const cachedMap = lastResult<PdfImage>();

/** The wheel's photos: each category's first photo, in the Home page's order (trade-wheel.tsx). */
function wheelPhotoSources(products: Product[]): (string | undefined)[] {
  return groupByCategory(products).map(({ items }) => items.find((item) => item.images?.[0])?.images?.[0]?.src);
}

/** The brochure for these products, as PDF bytes. */
export async function renderBrochure({ products, allProducts, markets, details, stats, origin }: RenderOptions): Promise<Buffer> {
  const wheelSources = wheelPhotoSources(allProducts);
  const lanes = tradeLanes(markets);

  const [, markBlue, markWhite, panel, tradeMap, productPhotos] = await Promise.all([
    registerFonts(),
    logoMark(LOGO_MARK.color),
    logoMark(brochureColors.white),
    cachedCover(wheelSources.join("|"), async () =>
      coverPanel(
        Math.round(COVER_PANEL.width * ARTWORK_SCALE),
        Math.round(COVER_PANEL.height * ARTWORK_SCALE),
        await Promise.all(wheelSources.map((src) => (src ? loadPhoto(src, origin, WHEEL_PHOTO_PX) : undefined))),
      ),
    ),
    cachedMap(JSON.stringify(lanes), () => tradeMapArtwork(Math.round(BACK_MAP.width * ARTWORK_SCALE * 1.6), lanes)),
    Promise.all(
      products.map(async (product) => {
        const src = product.images?.[0]?.src;
        return [product.slug, src ? await loadPhoto(src, origin, PRODUCT_PHOTO_PX) : undefined] as const;
      }),
    ),
  ]);

  return renderToBuffer(
    <BrochureDocument
      products={products}
      markets={markets}
      details={details}
      stats={stats}
      assets={{
        markBlue,
        markWhite,
        coverPanel: panel,
        tradeMap,
        lanes,
        productPhotos: new Map(productPhotos),
      }}
      date={new Date()}
    />,
  );
}
