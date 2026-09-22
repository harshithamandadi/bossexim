import type { Metadata, Viewport } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import type { ReactNode } from "react";
import { SiteHeader } from "@/components/layout/header/site-header";
import { ChatWidget } from "@/components/chat/chat-widget";
import { SiteFooter } from "@/components/layout/site-footer";
import { MotionProvider } from "@/components/motion/motion-provider";
import { faqContent, uiLabels } from "@/config";
import { cn } from "@/lib/cn";
import { rootMetadata } from "@/lib/metadata";
import { getOrganizationJsonLd, serializeJsonLd } from "@/lib/structured-data";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const interTight = Inter_Tight({ subsets: ["latin"], variable: "--font-inter-tight", display: "swap" });

export const metadata: Metadata = rootMetadata;

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={cn(inter.variable, interTight.variable)}>
      <body data-tone="light" className="bg-canvas font-sans text-fg antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(getOrganizationJsonLd()) }}
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
          <ChatWidget faqs={faqContent.items} />
        </MotionProvider>
      </body>
    </html>
  );
}
