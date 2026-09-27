import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dirname = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // Files uploaded in the admin are served through Payload's API.
    localPatterns: [{ pathname: "/api/media/file/**" }, { pathname: "/api/documents/file/**" }],
    // YouTube's thumbnail for the corporate video when no cover image is uploaded.
    remotePatterns: [{ protocol: "https", hostname: "i.ytimg.com", pathname: "/vi/**" }],
  },
  experimental: {
    // The site and the admin each have their own root layout, so unmatched URLs
    // need an app-wide 404 (app/global-not-found.tsx).
    globalNotFound: true,
    // Enquiry forms accept up to 3 attachments of 5 MB each (see ATTACHMENT_LIMITS).
    serverActions: { bodySizeLimit: "16mb" },
  },
  turbopack: {
    root: path.resolve(dirname),
  },
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
