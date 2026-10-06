import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { SiteShell } from "@/components/layout/site-shell";
import { rootMetadata } from "@/lib/metadata";
import "../globals.css";

export const metadata: Metadata = rootMetadata;

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3f8fe" },
    { media: "(prefers-color-scheme: dark)", color: "#061936" },
  ],
  colorScheme: "light dark",
};

export default function SiteLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <SiteShell>{children}</SiteShell>;
}
