import "server-only";
import { renderToBuffer } from "@react-pdf/renderer";
import type { CompanyDetails, Market, Product, Stat } from "@/types/content";
import { fadedPhoto, loadPhoto, logoMark, registerFonts } from "./assets";
import { BACK_FADE, BrochureDocument, COVER_FADE, COVER_PHOTO_ASPECT, brochureColors } from "./document";

/** Photos shipped with the site (public/images). */
const COVER_PHOTO = "/images/group/container-line/main.webp";
const BACK_PHOTO = "/images/group/container-line/freight-forwarding-2.webp";
const GROUP_LOGO = "/images/group/boss-group-logo-white.png";

/** Photo widths in pixels: sharp enough for print at their size on the page, small enough to email. */
const FULL_WIDTH_PX = 1400;
const PRODUCT_PHOTO_PX = 900;
const LOGO_PX = 400;

interface RenderOptions {
  products: Product[];
  markets: Market[];
  details: CompanyDetails;
  stats: Stat[];
  /** Where to fetch photos from (see photoOrigin). */
  origin: string;
}

/** The brochure for these products, as PDF bytes. */
export async function renderBrochure({ products, markets, details, stats, origin }: RenderOptions): Promise<Buffer> {
  const [, markWhite, markBlue, coverPhoto, backPhoto, groupLogo, productPhotos] = await Promise.all([
    registerFonts(),
    logoMark(brochureColors.white),
    logoMark(brochureColors.logo),
    loadPhoto(COVER_PHOTO, origin, FULL_WIDTH_PX).then((photo) => fadedPhoto(photo, COVER_PHOTO_ASPECT, brochureColors.navyDeep, COVER_FADE)),
    loadPhoto(BACK_PHOTO, origin, FULL_WIDTH_PX).then((photo) => fadedPhoto(photo, COVER_PHOTO_ASPECT, brochureColors.navyDeep, BACK_FADE)),
    loadPhoto(GROUP_LOGO, origin, LOGO_PX, "png"),
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
      assets={{ markWhite, markBlue, coverPhoto, backPhoto, groupLogo, productPhotos: new Map(productPhotos) }}
      date={new Date()}
    />,
  );
}
