import { siteConfig } from "@/config/site";
import { cn } from "@/lib/cn";

/** Brand blues are fixed here: a logo keeps its colour in every section tone. */
const BRAND_BLUE = "#1560bd";
const DEEP_BLUE = "#0e4a95";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden className={className}>
      <rect width="32" height="32" rx="9" fill={BRAND_BLUE} />
      <path d="M32 18c0 7.7-6.3 14-14 14h14V18Z" fill={DEEP_BLUE} opacity="0.55" />
      <g fill="none" stroke="#ffffff" strokeWidth="1.7">
        <circle cx="16" cy="16" r="8" />
        <ellipse cx="16" cy="16" rx="3.4" ry="8" />
        <path d="M8 16h16" />
      </g>
      <circle cx="24.6" cy="8.4" r="2.9" fill="#ffffff" stroke={BRAND_BLUE} strokeWidth="1.5" />
    </svg>
  );
}

export function Logo({ className, showDescriptor = false }: { className?: string; showDescriptor?: boolean }) {
  const { wordmark, descriptor } = siteConfig.company;

  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className="size-8 shrink-0" />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[15px] font-extrabold tracking-tight whitespace-nowrap">
          {wordmark.primary} <span className="font-semibold text-fg-mute">{wordmark.secondary}</span>
        </span>
        {showDescriptor && (
          <span className="mt-1.5 text-[10px] font-semibold tracking-[0.16em] text-fg-mute uppercase">{descriptor}</span>
        )}
      </span>
    </span>
  );
}
