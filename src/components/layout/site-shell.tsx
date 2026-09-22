import { Inter, Inter_Tight } from "next/font/google";
import type { ReactNode } from "react";
import { ChatWidget } from "@/components/chat/chat-widget";
import { SiteHeader } from "@/components/layout/header/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { MotionProvider } from "@/components/motion/motion-provider";
import { uiLabels } from "@/config";
import { cn } from "@/lib/cn";
import { getCompanyDetails, getFaqs } from "@/lib/content/queries";
import { getOrganizationJsonLd, serializeJsonLd } from "@/lib/structured-data";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const interTight = Inter_Tight({ subsets: ["latin"], variable: "--font-inter-tight", display: "swap" });

/**
 * The public site's document: fonts, header, footer, assistant and organisation
 * markup. Shared by the site layout and the app-wide 404 page.
 */
export async function SiteShell({ children }: { children: ReactNode }) {
  const [faqs, company] = await Promise.all([getFaqs(), getCompanyDetails()]);

  return (
    <html lang="en" className={cn(inter.variable, interTight.variable)}>
      <body data-tone="light" className="bg-canvas font-sans text-fg antialiased">
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
          <ChatWidget faqs={faqs} />
        </MotionProvider>
      </body>
    </html>
  );
}
