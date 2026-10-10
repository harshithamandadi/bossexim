import { useId } from "react";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/cn";

/* The BOSS mark, traced from the official artwork: a "B" (a block with two
   round lobes and two slots) beside a disc that keeps an even gap around it. */
const B_LOBE_X = 92.3;
const B_LOBE_RADIUS = 46.7;
const GAP = 16; // stroke width of the cut-out, i.e. an 8-unit gap each side

function BShape(props: React.SVGProps<SVGGElement>) {
  return (
    <g {...props}>
      <rect x="1" y="2" width={B_LOBE_X} height="170" />
      <circle cx={B_LOBE_X} cy="45" r={B_LOBE_RADIUS} />
      <circle cx={B_LOBE_X} cy="129" r={B_LOBE_RADIUS} />
    </g>
  );
}

/** Draws in `currentColor`: brand blue on light sections, white on dark ones. */
export function LogoMark({ className }: { className?: string }) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");

  return (
    <svg viewBox="0 0 272 174" aria-hidden className={className} fill="currentColor">
      <defs>
        <clipPath id={`${id}-bounds`}>
          <rect x="1" y="2" width="270" height="170" />
        </clipPath>
        <mask id={`${id}-gap`}>
          <rect width="272" height="174" fill="#fff" />
          <BShape fill="#000" stroke="#000" strokeWidth={GAP} />
        </mask>
        <mask id={`${id}-slots`}>
          <rect width="272" height="174" fill="#fff" />
          <rect x="0" y="39" width="58" height="14" fill="#000" />
          <rect x="0" y="118" width="58" height="13" fill="#000" />
        </mask>
      </defs>
      <circle cx="185" cy="87" r="85" mask={`url(#${id}-gap)`} />
      <g clipPath={`url(#${id}-bounds)`} mask={`url(#${id}-slots)`}>
        <BShape />
      </g>
    </svg>
  );
}

export function Logo({ className, showDescriptor = false }: { className?: string; showDescriptor?: boolean }) {
  const { wordmark, descriptor } = siteConfig.company;

  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className="h-6 w-auto shrink-0 text-logo" />
      <span className="flex flex-col leading-none">
        {/* The display face sits high in its line box; the nudge centres it on the mark. */}
        <span className="translate-y-[1.5px] font-display text-[15px] font-extrabold tracking-tight whitespace-nowrap">
          {/* One colour throughout (not half white, half blue); the weight sets the two words apart. */}
          {wordmark.primary} <span className="font-medium">{wordmark.secondary}</span>
        </span>
        {showDescriptor && (
          <span className="mt-1.5 text-[10px] font-semibold tracking-[0.16em] text-fg-mute uppercase">{descriptor}</span>
        )}
      </span>
    </span>
  );
}
