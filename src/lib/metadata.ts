import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

const { company, seo, url } = siteConfig;

const baseOpenGraph = {
  type: "website",
  siteName: company.legalName,
  locale: "en_IN",
} as const;

export const rootMetadata: Metadata = {
  metadataBase: new URL(url),
  title: {
    default: `${company.name} — ${company.tagline}`,
    template: `%s · ${company.name}`,
  },
  description: seo.description,
  keywords: seo.keywords,
  applicationName: company.name,
  openGraph: { ...baseOpenGraph, url, title: company.name, description: seo.description },
  twitter: { card: "summary_large_image", title: company.name, description: seo.description },
  robots: { index: true, follow: true },
};

interface PageMetadataInput {
  title: string;
  description: string;
  path: string;
}

export function createPageMetadata({ title, description, path }: PageMetadataInput): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { ...baseOpenGraph, title, description, url: path },
    twitter: { card: "summary_large_image", title, description },
  };
}
