import { useId } from "react";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/cn";
import { LOCKUP, LOGO_MARK, lobeShapes, lockupFontSize, slotShape } from "@/lib/logo-mark";

const { width, height, disc, gap, slots } = LOGO_MARK;

function BShape(props: React.SVGProps<SVGGElement>) {
  return (
    <g {...props}>
      {LOGO_MARK.lobes.map(lobeShapes).map(({ block, circle }) => (
        <g key={circle.cy}>
          <rect {...block} />
          <circle {...circle} />
        </g>
      ))}
    </g>
  );
}

/**
 * The BOSS mark (shapes in lib/logo-mark.ts). Draws in `currentColor`: logo blue on
 * light sections, white on dark ones. The shapes overlap, so they form a mask that is
 * filled once — a see-through colour (e.g. `text-white/90`) then stays even instead of
 * doubling up where the block and lobes of the "B" meet.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox={`0 0 ${width} ${height}`} aria-hidden className={className}>
      <MarkShapes />
    </svg>
  );
}

/**
 * The mark with a name beneath it at exactly the mark's width (lib/logo-mark.ts → LOCKUP),
 * like the official BOSS Group logo. Draws in `currentColor`.
 */
export function LogoLockup({ name, className }: { name: string; className?: string }) {
  const fontSize = lockupFontSize(name);
  const baseline = height + LOCKUP.gap + fontSize * LOCKUP.capHeight;
  // Room below the baseline for descenders (the "p" in "Group").
  const total = baseline + fontSize * 0.24;
  return (
    <svg viewBox={`0 0 ${width} ${total}`} role="img" aria-label={name} className={className}>
      <MarkShapes />
      <text
        x={width / 2}
        y={baseline}
        textAnchor="middle"
        fontSize={fontSize}
        fontWeight={800}
        fill="currentColor"
        textLength={width}
        lengthAdjust="spacing"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {name}
      </text>
    </svg>
  );
}

function MarkShapes() {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const box = { x: 0, y: 0, width, height };

  return (
    <>
      <defs>
        <mask id={`${id}-gap`} maskUnits="userSpaceOnUse" {...box}>
          <rect {...box} fill="#fff" />
          <BShape fill="#000" stroke="#000" strokeWidth={gap} />
        </mask>
        <mask id={`${id}-slots`} maskUnits="userSpaceOnUse" {...box}>
          <rect {...box} fill="#fff" />
          {slots.centres.map((centre) => (
            <rect key={centre} {...slotShape(centre)} fill="#000" />
          ))}
        </mask>
        <mask id={`${id}-mark`} maskUnits="userSpaceOnUse" {...box}>
          <circle {...disc} fill="#fff" mask={`url(#${id}-gap)`} />
          <BShape fill="#fff" mask={`url(#${id}-slots)`} />
        </mask>
      </defs>
      <rect {...box} fill="currentColor" mask={`url(#${id}-mark)`} />
    </>
  );
}

export function Logo({ className, showDescriptor = false }: { className?: string; showDescriptor?: boolean }) {
  const { wordmark, descriptor } = siteConfig.company;

  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className="h-6 w-auto shrink-0 text-logo" />
      <span className="flex flex-col leading-none">
        {/* Inter (not the tight display face) at normal spacing, so the S keeps its proper shape
            and the words are clearly separated (client request). One colour throughout. */}
        <span className="font-sans text-[15px] font-bold whitespace-nowrap">
          {wordmark.primary}
          <span className="ml-1.5 font-semibold">{wordmark.secondary}</span>
        </span>
        {showDescriptor && (
          <span className="mt-1.5 text-[11px] font-medium text-fg-mute">{descriptor}</span>
        )}
      </span>
    </span>
  );
}
