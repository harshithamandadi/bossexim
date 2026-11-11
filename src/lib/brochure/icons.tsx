/**
 * The website's lucide icons drawn as vectors in the PDF (react-pdf can't render the
 * React icon components). Only the icons the brochure uses are loaded.
 */
import "server-only";
import type { ComponentType } from "react";
import { Circle, Line, Path, Polygon, Polyline, Rect, Svg } from "@react-pdf/renderer";
import { __iconData as arrowRight } from "lucide-react/dist/esm/icons/arrow-right.mjs";
import { __iconData as arrowUpRight } from "lucide-react/dist/esm/icons/arrow-up-right.mjs";
import { __iconData as badgeCheck } from "lucide-react/dist/esm/icons/badge-check.mjs";
import { __iconData as building } from "lucide-react/dist/esm/icons/building.mjs";
import { __iconData as cpu } from "lucide-react/dist/esm/icons/cpu.mjs";
import { __iconData as fileText } from "lucide-react/dist/esm/icons/file-text.mjs";
import { __iconData as globe } from "lucide-react/dist/esm/icons/globe.mjs";
import { __iconData as handshake } from "lucide-react/dist/esm/icons/handshake.mjs";
import { __iconData as headset } from "lucide-react/dist/esm/icons/headset.mjs";
import { __iconData as hotel } from "lucide-react/dist/esm/icons/hotel.mjs";
import { __iconData as messagesSquare } from "lucide-react/dist/esm/icons/messages-square.mjs";
import { __iconData as searchCheck } from "lucide-react/dist/esm/icons/search-check.mjs";
import { __iconData as ship } from "lucide-react/dist/esm/icons/ship.mjs";
import { __iconData as store } from "lucide-react/dist/esm/icons/store.mjs";
import { __iconData as washingMachine } from "lucide-react/dist/esm/icons/washing-machine.mjs";

/** By the names used in src/config and the admin (see lib/icons.ts): trade steps, Group companies and buttons. */
const ICONS: Record<string, typeof ship> = {
  "arrow-right": arrowRight,
  "arrow-up-right": arrowUpRight,
  "badge-check": badgeCheck,
  building,
  cpu,
  "file-text": fileText,
  globe,
  handshake,
  headset,
  hotel,
  "messages-square": messagesSquare,
  "search-check": searchCheck,
  ship,
  store,
  "washing-machine": washingMachine,
};

/** lucide's SVG tags and react-pdf's shapes take the same attributes (d, cx, points…). */
const SHAPES: Record<string, ComponentType<Record<string, unknown>> | undefined> = {
  path: Path,
  circle: Circle,
  rect: Rect,
  line: Line,
  polyline: Polyline,
  polygon: Polygon,
} as unknown as Record<string, ComponentType<Record<string, unknown>>>;

/** A 24-unit lucide icon at `size` points; draws nothing for an icon not loaded above. */
export function PdfIcon({ name, size, color }: { name: string; size: number; color: string }) {
  const icon = ICONS[name];
  if (!icon) return null;
  const stroke = { stroke: color, strokeWidth: 2, fill: "none", strokeLinecap: "round", strokeLinejoin: "round" } as const;
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size}>
      {icon.node.map(([tag, { key, ...attributes }]) => {
        const Shape = SHAPES[tag];
        return Shape ? <Shape key={String(key)} {...stroke} {...attributes} /> : null;
      })}
    </Svg>
  );
}
