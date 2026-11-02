import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";
import { logoMarkSvg } from "@/lib/logo-mark";
import { SHARE_IMAGE } from "@/lib/metadata";

/*
 * /og-image.png — the picture shown when a page is shared on LinkedIn,
 * WhatsApp, X and others. Every page links to it (see lib/metadata.ts).
 * A fixed URL rather than an opengraph-image file, because each page sets its
 * own Open Graph details, which would otherwise drop an inherited image.
 */

export const dynamic = "force-static";

const { company } = siteConfig;

/** The BOSS mark in white — the same shapes as components/ui/logo.tsx. */
const LOGO_MARK_SRC = `data:image/svg+xml;base64,${Buffer.from(logoMarkSvg("#fff")).toString("base64")}`;

export function GET() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 80px",
        color: "#ffffff",
        backgroundColor: "#0b2a66",
        backgroundImage:
          "radial-gradient(circle at 85% 20%, rgba(79,168,232,0.55), transparent 55%), linear-gradient(135deg, #0b2a66 0%, #1560bd 100%)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders plain <img> only */}
        <img src={LOGO_MARK_SRC} width={125} height={80} alt="" />
        <div style={{ display: "flex", fontSize: 40, fontWeight: 700, letterSpacing: -1 }}>
          {company.wordmark.primary}&nbsp;<span style={{ opacity: 0.75 }}>{company.wordmark.secondary}</span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 96, fontWeight: 800, letterSpacing: -4, lineHeight: 1 }}>{company.tagline}</div>
        <div style={{ marginTop: 28, fontSize: 30, opacity: 0.85 }}>{company.focus}</div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, opacity: 0.7 }}>
        <span>{company.legalName}</span>
        <span>{siteConfig.website}</span>
      </div>
    </div>,
    { width: SHARE_IMAGE.width, height: SHARE_IMAGE.height },
  );
}
