import { Inter, Inter_Tight } from "next/font/google";
import type { ReactNode } from "react";
import { VisitBeacon } from "@/components/analytics/visit-beacon";
import { ImageZoom } from "@/components/ui/image-zoom";
import { ChatWidget } from "@/components/chat/chat-widget";
import { SiteHeader } from "@/components/layout/header/site-header";
import { THEME_INIT_SCRIPT } from "@/components/layout/header/theme-toggle";
import { SiteFooter } from "@/components/layout/site-footer";
import { MotionProvider } from "@/components/motion/motion-provider";
import { assistantProductSlugs, uiLabels } from "@/config";
import { cn } from "@/lib/cn";
import { getCatalogue, getCompanyDetails, getFaqs } from "@/lib/content/queries";
import { createFormToken } from "@/lib/enquiry/form-token";
import { getOrganizationJsonLd, serializeJsonLd } from "@/lib/structured-data";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const interTight = Inter_Tight({ subsets: ["latin"], variable: "--font-inter-tight", display: "swap" });

/**
 * The public site's document: fonts, header, footer, assistant and organisation
 * markup. Shared by the site layout and the app-wide 404 page.
 */
export async function SiteShell({ children }: { children: ReactNode }) {
  const [faqs, company, catalogue] = await Promise.all([getFaqs(), getCompanyDetails(), getCatalogue()]);
  // Aira talks about the products we export: she helps overseas buyers source from India.
  // The buttons follow the client's chatbot workflow (assistantProductSlugs), in that order.
  const assistantProducts = assistantProductSlugs
    .flatMap((slug) => catalogue.products.filter((product) => product.slug === slug && product.direction === "export"))
    .map(({ slug, name, variants, variantsLabel, packaging, documentation, specifications }) => ({
      slug,
      name,
      variants,
      variantsLabel,
      packaging,
      documentation,
      specifications,
    }));

  return (
    // suppressHydrationWarning: the theme script may set data-theme before React hydrates.
    <html lang="en" className={cn(inter.variable, interTight.variable)} suppressHydrationWarning>
      <body data-tone="light" className="bg-canvas font-sans text-fg antialiased">
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(getOrganizationJsonLd(company)) }}
        />
        <MotionProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:rounded-full focus:bg-fg focus:px-4 focus:py-2 focus:text-canvas"
          >
            {uiLabels.skipToContent}
          </a>
          <SiteHeader />
          <main id="main">{children}</main>
          <SiteFooter />
          <ChatWidget faqs={faqs} products={assistantProducts} formToken={createFormToken()} />
          <VisitBeacon />
          <ImageZoom />
        </MotionProvider>
      </body>
    </html>
  );
}
