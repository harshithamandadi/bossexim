/**
 * Fonts, photos and the logo for the PDF brochure. Photos are fetched from the
 * site itself, so uploads served by Payload (on disk or Vercel Blob) and the
 * photos shipped in public/ load the same way, then resized with sharp.
 */
import "server-only";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { Font } from "@react-pdf/renderer";
import sharp from "sharp";
import { siteConfig } from "@/config/site";
import { logoMarkSvg } from "@/lib/logo-mark";

export const FONT_BODY = "Inter";
export const FONT_DISPLAY = "Inter Tight";

export interface PdfImage {
  data: Buffer;
  format: "jpg" | "png";
}

let fontsReady: Promise<void> | undefined;

/** Registers Inter (OFL, see fonts/OFL.txt) once per server instance. */
export function registerFonts(): Promise<void> {
  fontsReady ??= (async () => {
    // Literal paths, so the files are traced into the deployment.
    const [regular, semiBold, bold, display] = await Promise.all([
      readFile(join(process.cwd(), "src/lib/brochure/fonts/Inter-Regular.ttf")),
      readFile(join(process.cwd(), "src/lib/brochure/fonts/Inter-SemiBold.ttf")),
      readFile(join(process.cwd(), "src/lib/brochure/fonts/Inter-Bold.ttf")),
      readFile(join(process.cwd(), "src/lib/brochure/fonts/InterTight-ExtraBold.ttf")),
    ]);
    const src = (file: Buffer) => `data:font/ttf;base64,${file.toString("base64")}`;
    Font.register({
      family: FONT_BODY,
      fonts: [
        { src: src(regular), fontWeight: 400 },
        { src: src(semiBold), fontWeight: 600 },
        { src: src(bold), fontWeight: 700 },
      ],
    });
    Font.register({ family: FONT_DISPLAY, src: src(display), fontWeight: 800 });
    // Never split words with hyphens.
    Font.registerHyphenationCallback((word) => [word]);
  })().catch((error: unknown) => {
    fontsReady = undefined;
    throw error;
  });
  return fontsReady;
}

/** The BOSS mark as a crisp PNG in the given colour; `trademark` adds the ™ for large uses. */
export async function logoMark(fill: string, trademark = false): Promise<PdfImage> {
  const data = await sharp(Buffer.from(logoMarkSvg(fill, { trademark }))).resize({ width: 900 }).png().toBuffer();
  return { data, format: "png" };
}

/**
 * Where photos are fetched from: the address the visitor used when it is one of this
 * site's own (or local development), otherwise the configured site address — so a
 * forged Host header can't point the server at someone else's machine.
 */
export function photoOrigin(requestUrl: URL): string {
  const configured = new URL(process.env.SITE_URL || siteConfig.url);
  const ownHosts = new Set(
    [
      configured.hostname,
      new URL(siteConfig.url).hostname,
      "localhost",
      "127.0.0.1",
      process.env.VERCEL_URL,
      process.env.VERCEL_BRANCH_URL,
      process.env.VERCEL_PROJECT_PRODUCTION_URL,
    ].filter(Boolean),
  );
  return ownHosts.has(requestUrl.hostname) ? requestUrl.origin : configured.origin;
}

const CACHE_LIMIT = 150;
/** Resized photos by size and address. Uploads get a new address when replaced, so entries never go stale. */
const photoCache = new Map<string, Promise<PdfImage | undefined>>();

/**
 * A photo resized to `width` pixels: JPEG, or PNG to keep transparency (logos).
 * Resolves to undefined when it can't be loaded, and the page is laid out without it.
 */
export function loadPhoto(src: string, origin: string, width: number, format: PdfImage["format"] = "jpg"): Promise<PdfImage | undefined> {
  const url = new URL(src, origin);
  const key = `${width}:${format}:${url}`;
  const cached = photoCache.get(key);
  if (cached) return cached;

  const photo = fetchPhoto(url, width, format).catch((error: unknown) => {
    photoCache.delete(key);
    console.error(`[brochure] Photo unavailable: ${url}`, error);
    return undefined;
  });
  if (photoCache.size >= CACHE_LIMIT) photoCache.delete(photoCache.keys().next().value ?? "");
  photoCache.set(key, photo);
  return photo;
}

async function fetchPhoto(url: URL, width: number, format: PdfImage["format"]): Promise<PdfImage> {
  const response = await fetch(url, { signal: AbortSignal.timeout(15_000) });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const image = sharp(Buffer.from(await response.arrayBuffer()))
    .rotate()
    .resize({ width, withoutEnlargement: true });
  const data =
    format === "png"
      ? await image.png().toBuffer()
      : await image.flatten({ background: "#ffffff" }).jpeg({ quality: 80, mozjpeg: true }).toBuffer();
  return { data, format };
}
