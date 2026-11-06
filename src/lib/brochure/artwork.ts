/**
 * The brochure's two illustrations, drawn from the same geometry as the website and
 * turned into images with sharp: the cover's product wheel (as on the Home hero) and the
 * back cover's trade-lanes map. Text is left to the PDF itself, so it prints in Inter.
 */
import "server-only";
import sharp from "sharp";
import { GLOBE_VIEW, orthographic } from "@/lib/geo";
import { LAND_PATH, LANE_COLORS, TRADE_MAP_SIZE, TRADE_ORIGIN, type TradeLane } from "@/lib/trade-lanes";
import { WHEEL, WHEEL_COLORS, polar, sectorPath } from "@/lib/trade-wheel";
import { WORLD_DOTS } from "@/lib/world-dots";
import type { PdfImage } from "./assets";

const GOLD = "#f2b34b";
const BRAND = "#1560bd";
const NAVY_DEEP = "#08214f";
const SKY = "#6fb6f0";

/** Pod size around the wheel, in wheel units (64px pods on the website's ~520px wheel). */
const POD_RADIUS = 31;
const POD_RING = 2;

const dataUri = ({ data, format }: PdfImage) => `data:image/${format === "png" ? "png" : "jpeg"};base64,${data.toString("base64")}`;

/** The dotted globe at rest (India facing), as in components/ui/dotted-globe.tsx. */
function globeMarkup(): string {
  const { center, globeRadius } = WHEEL;
  const radius = globeRadius * 0.96;
  const dot = (globeRadius * 2) / 150;
  const dots = WORLD_DOTS.flatMap(([lon, lat]) => {
    const point = orthographic(lon, lat, GLOBE_VIEW.startLongitude);
    if (point.depth <= 0) return [];
    const x = (center + point.x * radius).toFixed(1);
    const y = (center - point.y * radius).toFixed(1);
    return [`<circle cx="${x}" cy="${y}" r="${dot.toFixed(2)}" fill-opacity="${(0.45 + point.depth * 0.55).toFixed(2)}"/>`];
  }).join("");
  const home = orthographic(GLOBE_VIEW.highlight.lon, GLOBE_VIEW.highlight.lat, GLOBE_VIEW.startLongitude);
  const homeX = center + home.x * radius;
  const homeY = center - home.y * radius;
  return `<circle cx="${center}" cy="${center}" r="${globeRadius}" fill="url(#globe)"/>
<g fill="#ffffff">${dots}</g>
<circle cx="${homeX}" cy="${homeY}" r="${dot * 5}" fill="none" stroke="${GOLD}" stroke-opacity="0.45" stroke-width="${dot * 0.8}"/>
<circle cx="${homeX}" cy="${homeY}" r="${dot * 2}" fill="${GOLD}"/>
<circle cx="${center}" cy="${center}" r="${globeRadius}" fill="none" stroke="#ffffff" stroke-opacity="0.35" stroke-width="1.5"/>`;
}

/** The wheel in WHEEL.size units: one segment per category, each with its photo pod. */
function wheelMarkup(photos: (PdfImage | undefined)[]): string {
  const { center, outerRadius, podRadius } = WHEEL;
  const sectorDegrees = 360 / Math.max(photos.length, 1);
  const segments = photos
    .map((_, index) => `<path d="${sectorPath(index, sectorDegrees)}" fill="url(#${index % 2 === 0 ? "light" : "deep"})" stroke="#ffffff" stroke-width="3"/>`)
    .join("");
  const pods = photos
    .map((photo, index) => {
      const { x, y } = polar(podRadius, (index + 0.5) * sectorDegrees);
      const inner = POD_RADIUS - POD_RING;
      const image = photo
        ? `<clipPath id="pod${index}"><circle cx="${x}" cy="${y}" r="${inner}"/></clipPath>
<image href="${dataUri(photo)}" x="${x - inner}" y="${y - inner}" width="${inner * 2}" height="${inner * 2}" preserveAspectRatio="xMidYMid slice" clip-path="url(#pod${index})"/>`
        : "";
      return `<circle cx="${x}" cy="${y}" r="${POD_RADIUS}" fill="#ffffff" filter="url(#shadow)"/>${image}`;
    })
    .join("");
  const stop = (offset: string, color: string, opacity = 1) => `<stop offset="${offset}" stop-color="${color}" stop-opacity="${opacity}"/>`;
  const { light, deep, globe } = WHEEL_COLORS;
  return `<defs>
<linearGradient id="light" x1="0" y1="0" x2="1" y2="1">${stop("0%", light.from, light.fromOpacity)}${stop("100%", light.to, light.toOpacity)}</linearGradient>
<linearGradient id="deep" x1="0" y1="1" x2="1" y2="0">${stop("0%", deep.from, deep.fromOpacity)}${stop("100%", deep.to, deep.toOpacity)}</linearGradient>
<radialGradient id="globe" cx="35%" cy="30%" r="80%">${globe.map((s) => stop(s.offset, s.color)).join("")}</radialGradient>
<filter id="shadow" x="-30%" y="-30%" width="160%" height="170%"><feGaussianBlur in="SourceAlpha" stdDeviation="3"/><feOffset dy="3"/><feComponentTransfer><feFuncA type="linear" slope="0.3"/></feComponentTransfer><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>
</defs>
<circle cx="${center}" cy="${center}" r="${outerRadius + 12}" fill="none" stroke="${BRAND}" stroke-opacity="0.4" stroke-width="2" stroke-dasharray="3 11"/>
${segments}${pods}${globeMarkup()}`;
}

/** Cover background stops, top to bottom: pale sky behind the wheel, easing into navy for the text (client request, 6 Nov 2026: no hard split). */
const COVER_STOPS: [number, string][] = [
  [0, "#f7faff"],
  [0.44, "#e2ecf9"],
  [0.56, "#9dbbe3"],
  [0.66, "#2a5598"],
  [0.76, "#0d2d68"],
  [0.86, NAVY_DEEP],
  [1, NAVY_DEEP],
];

/**
 * The whole cover's background, `width` × `height` pixels (an A4 page): a pale sky with the
 * dotted world map and the product wheel (`photos`: one per category, in wheel order) below
 * the logo, fading gradually into navy where the cover's text sits.
 */
export async function coverPanel(width: number, height: number, photos: (PdfImage | undefined)[]): Promise<PdfImage> {
  const mapHeight = (width * TRADE_MAP_SIZE.height) / TRADE_MAP_SIZE.width;
  const wheelSize = height * 0.41;
  const wheelX = (width - wheelSize) / 2;
  const wheelY = height * 0.125;
  const stops = COVER_STOPS.map(([offset, color]) => `<stop offset="${offset}" stop-color="${color}"/>`).join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">${stops}</linearGradient></defs>
<rect width="${width}" height="${height}" fill="url(#sky)"/>
<svg y="${height * 0.15}" width="${width}" height="${mapHeight}" viewBox="0 0 ${TRADE_MAP_SIZE.width} ${TRADE_MAP_SIZE.height}">
<path d="${LAND_PATH}" stroke="${NAVY_DEEP}" stroke-opacity="0.16" stroke-width="2.3" stroke-linecap="round"/>
</svg>
<svg x="${wheelX}" y="${wheelY}" width="${wheelSize}" height="${wheelSize}" viewBox="-20 -20 ${WHEEL.size + 40} ${WHEEL.size + 40}">${wheelMarkup(photos)}</svg>
</svg>`;
  const data = await sharp(Buffer.from(svg)).jpeg({ quality: 86, mozjpeg: true }).toBuffer();
  return { data, format: "jpg" };
}

/** The trade-lanes map for a dark page, `width` pixels wide, on a transparent background. */
export async function tradeMapArtwork(width: number, lanes: TradeLane[]): Promise<PdfImage> {
  const { width: mapWidth, height: mapHeight } = TRADE_MAP_SIZE;
  const height = Math.round((width * mapHeight) / mapWidth);
  const origin = TRADE_ORIGIN.point;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${mapWidth} ${mapHeight}">
<defs><linearGradient id="lane" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${LANE_COLORS.from}"/><stop offset="1" stop-color="${LANE_COLORS.to}"/></linearGradient></defs>
<path d="${LAND_PATH}" stroke="#ffffff" stroke-opacity="0.25" stroke-width="2.3" stroke-linecap="round"/>
${lanes.map((lane) => `<path d="${lane.path}" fill="none" stroke="url(#lane)" stroke-width="1.5"/><path d="${lane.path}" fill="none" stroke="#ffffff" stroke-opacity="0.7" stroke-width="1.5" stroke-linecap="round" stroke-dasharray="2 14"/>`).join("")}
${lanes.map((lane) => `<circle cx="${lane.point.x}" cy="${lane.point.y}" r="3.4" fill="${SKY}" stroke="${NAVY_DEEP}" stroke-width="1.5"/>`).join("")}
<circle cx="${origin.x}" cy="${origin.y}" r="9" fill="${GOLD}" fill-opacity="0.4"/>
<circle cx="${origin.x}" cy="${origin.y}" r="5" fill="${GOLD}" stroke="${NAVY_DEEP}" stroke-width="2"/>
</svg>`;
  const data = await sharp(Buffer.from(svg)).png().toBuffer();
  return { data, format: "png" };
}
