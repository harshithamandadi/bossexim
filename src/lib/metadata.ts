import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import type { ImageAsset } from "@/types/content";

const { company, seo, url } = siteConfig;

/** The share image served by app/og-image.png/route.tsx. */
export const SHARE_IMAGE = {
  url: "/og-image.png",
  width: 1200,
  height: 630,
  alt: `${company.legalName} — ${company.tagline}`,
  type: "image/png",
};

const baseOpenGraph = {
  type: "website" as const,
  siteName: company.legalName,
  locale: "en_IN",
  images: [SHARE_IMAGE],
};

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
  twitter: { card: "summary_large_image", title: company.name, description: seo.description, images: [SHARE_IMAGE] },
  robots: { index: true, follow: true },
};

interface PageMetadataInput {
  title: string;
  description: string;
  path: string;
  /** Shared instead of the default image, e.g. a product photo. */
  image?: ImageAsset;
}

export function createPageMetadata({ title, description, path, image }: PageMetadataInput): Metadata {
  const images = image ? [{ url: image.src, width: image.width, height: image.height, alt: image.alt }] : [SHARE_IMAGE];
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { ...baseOpenGraph, title, description, url: path, images },
    twitter: { card: "summary_large_image", title, description, images },
  };
}
