import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/site-shell";
import { NotFoundContent } from "@/components/sections/shared/not-found-content";
import { siteConfig, uiLabels } from "@/config";
import "./globals.css";

export const metadata: Metadata = {
  title: `${uiLabels.notFound.title} · ${siteConfig.company.name}`,
  robots: { index: false },
};

/** App-wide 404 for URLs that match no route (the site and admin have separate root layouts). */
export default function GlobalNotFound() {
  return (
    <SiteShell>
      <NotFoundContent />
    </SiteShell>
  );
}
