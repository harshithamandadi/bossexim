import type { NextRequest } from "next/server";
import { brochureContent } from "@/config/brochure";
import { BROCHURE_SLUG_SEPARATOR } from "@/config/routes";
import { photoOrigin } from "@/lib/brochure/assets";
import { renderBrochure } from "@/lib/brochure/render";
import { groupByDirection } from "@/lib/catalogue";
import { getCatalogue, getCompanyDetails } from "@/lib/content/queries";
import { clientAddress, isRateLimited } from "@/lib/enquiry/rate-limit";
import { getHighlightStats } from "@/lib/stats";

/*
 * /brochure.pdf?products=basmati-rice,turmeric — the brochure a visitor builds on the
 * Resources page: cover, About BOSS EXIM, the chosen products and the back cover.
 * Made on request from the current admin content, so it is never out of date.
 */

/** Brochures one visitor can download per 10 minutes; each one takes real server work. */
const MAX_BROCHURES = 15;

/** Room for a brochure of every product on a cold start. */
export const maxDuration = 60;

const { document: pdf, errors } = brochureContent;

export async function GET(request: NextRequest) {
  const wanted = new Set(request.nextUrl.searchParams.get("products")?.split(BROCHURE_SLUG_SEPARATOR));
  const [catalogue, details] = await Promise.all([getCatalogue(), getCompanyDetails()]);

  // Catalogue order whatever order the link lists them in; unknown slugs are ignored.
  const products = groupByDirection(catalogue.products.filter((product) => wanted.has(product.slug))).flatMap((section) =>
    section.groups.flatMap((group) => group.items),
  );
  if (products.length === 0) return new Response(errors.noProducts, { status: 400 });

  if (isRateLimited(`brochure:${clientAddress(request.headers)}`, MAX_BROCHURES)) {
    return new Response(errors.rateLimited, { status: 429, headers: { "Retry-After": "600" } });
  }

  const file = await renderBrochure({
    products,
    markets: catalogue.markets,
    details,
    stats: getHighlightStats(catalogue),
    origin: photoOrigin(request.nextUrl),
  });

  return new Response(new Uint8Array(file), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${pdf.fileName}"`,
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex",
    },
  });
}
