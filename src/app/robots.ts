import type { MetadataRoute } from "next";
import { BROCHURE_PATH, siteConfig } from "@/config";

export default function robots(): MetadataRoute.Robots {
  return {
    // The content admin and its API are private; brochures are built on request, not for crawling.
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api", BROCHURE_PATH] },
    sitemap: new URL("/sitemap.xml", siteConfig.url).toString(),
  };
}
