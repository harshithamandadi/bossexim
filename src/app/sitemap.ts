import type { MetadataRoute } from "next";
import { containerLineServiceHref, containerLineServices, groupVerticalHref, groupVerticals, productHref, routes, siteConfig } from "@/config";
import { getProducts } from "@/lib/content/queries";

const absolute = (path: string) => new URL(path, siteConfig.url).toString();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = Object.values(routes).map((path) => ({
    url: absolute(path),
    changeFrequency: "monthly" as const,
    priority: path === routes.home ? 1 : 0.8,
  }));

  const productPages = (await getProducts()).map((product) => ({
    url: absolute(productHref(product.slug)),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const groupPages = [
    ...groupVerticals.map((vertical) => groupVerticalHref(vertical.slug)),
    ...containerLineServices.map((service) => containerLineServiceHref(service.slug)),
  ].map((path) => ({ url: absolute(path), changeFrequency: "monthly" as const, priority: 0.6 }));

  return [...pages, ...productPages, ...groupPages];
}
