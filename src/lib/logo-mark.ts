/**
 * The BOSS mark, measured from the client's official artwork ("BO LOGO", Nov 2026): a "B" —
 * a smaller upper and a larger lower round lobe on a block, cut by two rounded slots — beside
 * a disc that keeps an even gap around the B. These numbers drive the site's logo
 * (components/ui/logo.tsx), the favicon (app/icon.svg), the share image and the PDF brochure.
 */
export const LOGO_MARK = {
  width: 840,
  height: 563,
  /** Official logo colour, on light backgrounds. */
  color: "#394285",
  /** The B: a block from the left edge to each lobe's centre, ending in a half circle. */
  lobes: [
    { cx: 286.5, cy: 134.5, r: 121.5 },
    { cx: 301, cy: 403.5, r: 147.5 },
  ],
  disc: { cx: 558, cy: 281.5, r: 281.5 },
  /** Width of the cut around the B, half of it on each side of the B's edge. */
  gap: 39,
  /** Slots cut into the B from its left edge, with rounded inner ends. */
  slots: { centres: [146.5, 389.5], length: 175.5, thickness: 20 },
} as const;

/** How far each lower block reaches up under the lobe above, so no hairline shows where they meet. */
const SEAM_OVERLAP = 2;

/** One lobe of the B as a block plus a circle; overlapping shapes, so always used as a mask. */
export function lobeShapes({ cx, cy, r }: (typeof LOGO_MARK.lobes)[number], index: number) {
  const overlap = index > 0 ? SEAM_OVERLAP : 0;
  return { block: { x: 0, y: cy - r - overlap, width: cx, height: 2 * r + overlap }, circle: { cx, cy, r } };
}

/** A slot as a rounded bar that starts left of the B, so only its rounded end shows. */
export function slotShape(centre: number) {
  const { length, thickness } = LOGO_MARK.slots;
  return { x: -thickness, y: centre - thickness / 2, width: length + thickness, height: thickness, rx: thickness / 2 };
}

/**
 * The mark with a name set beneath it at exactly the mark's width, like the BOSS Group logo
 * (client request, 6 Nov 2026: "aligned proportionally", never squeezed). The name is in
 * Inter Tight ExtraBold; its width in ems was measured with fontkit, so the font size alone
 * makes it fit (no letter stretching). No ™ anywhere (same request).
 */
export const LOCKUP = {
  /** Space between the mark and the name, in mark units. */
  gap: 64,
  /** The name's cap height, as a share of its font size (Inter Tight). */
  capHeight: 0.728,
  nameEms: { "BOSS EXIM": 5.301, "BOSS Group": 5.76 } as Readonly<Record<string, number>>,
};

/** Font size, in mark units, at which `name` is exactly as wide as the mark. */
export function lockupFontSize(name: string): number {
  // Unmeasured names: about 0.6em a character in Inter Tight ExtraBold.
  return LOGO_MARK.width / (LOCKUP.nameEms[name] ?? name.length * 0.6);
}

const attributes = (shape: Record<string, number>) =>
  Object.entries(shape)
    .map(([name, value]) => `${name}="${value}"`)
    .join(" ");

function bMarkup(extra: string): string {
  const shapes = LOGO_MARK.lobes
    .map(lobeShapes)
    .map(({ block, circle }) => `<rect ${attributes(block)}/><circle ${attributes(circle)}/>`)
    .join("");
  return `<g ${extra}>${shapes}</g>`;
}

/** The mark as a standalone SVG, for places that can't render the React component. */
export function logoMarkSvg(fill: string): string {
  const { width, height, disc, gap } = LOGO_MARK;
  const box = `x="0" y="0" width="${width}" height="${height}"`;
  const slots = LOGO_MARK.slots.centres.map((centre) => `<rect ${attributes(slotShape(centre))}/>`).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" fill="${fill}">
<defs>
<mask id="gap" maskUnits="userSpaceOnUse" ${box}><rect ${box} fill="#fff"/>${bMarkup(`fill="#000" stroke="#000" stroke-width="${gap}"`)}</mask>
<mask id="slots" maskUnits="userSpaceOnUse" ${box}><rect ${box} fill="#fff"/><g fill="#000">${slots}</g></mask>
</defs>
<circle cx="${disc.cx}" cy="${disc.cy}" r="${disc.r}" mask="url(#gap)"/>
${bMarkup('mask="url(#slots)"')}
</svg>`;
}
