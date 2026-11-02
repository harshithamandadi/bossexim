/**
 * The BOSS mark as a standalone SVG, for places that can't render the React
 * component (components/ui/logo.tsx): the share image and the PDF brochure.
 */
export function logoMarkSvg(fill: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 272 174" fill="${fill}">
<defs>
<clipPath id="b"><rect x="1" y="2" width="270" height="170"/></clipPath>
<mask id="g"><rect width="272" height="174" fill="#fff"/><g fill="#000" stroke="#000" stroke-width="16"><rect x="1" y="2" width="92.3" height="170"/><circle cx="92.3" cy="45" r="46.7"/><circle cx="92.3" cy="129" r="46.7"/></g></mask>
<mask id="s"><rect width="272" height="174" fill="#fff"/><rect x="0" y="39" width="58" height="14" fill="#000"/><rect x="0" y="118" width="58" height="13" fill="#000"/></mask>
</defs>
<circle cx="185" cy="87" r="85" mask="url(#g)"/>
<g clip-path="url(#b)" mask="url(#s)"><rect x="1" y="2" width="92.3" height="170"/><circle cx="92.3" cy="45" r="46.7"/><circle cx="92.3" cy="129" r="46.7"/></g>
</svg>`;
}
