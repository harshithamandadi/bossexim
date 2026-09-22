import type { MarketCode } from "@/types/content";

export type ActiveLaneChange = (code: MarketCode | null) => void;

/** Hover, focus and tap handlers shared by map labels and the lane list. */
export function laneInteractionProps(code: MarketCode, isActive: boolean, onActiveChange: ActiveLaneChange) {
  return {
    "aria-pressed": isActive,
    onMouseEnter: () => onActiveChange(code),
    onMouseLeave: () => onActiveChange(null),
    onFocus: () => onActiveChange(code),
    onBlur: () => onActiveChange(null),
    onClick: () => onActiveChange(code),
  };
}
