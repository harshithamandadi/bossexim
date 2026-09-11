import { siteConfig } from "@/config/site";
import { cn } from "@/lib/cn";

/** Globe monogram. Colours follow the section tone via semantic tokens. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden className={className}>
      <rect width="32" height="32" rx="9" className="fill-fg" />
      <g fill="none" strokeWidth="1.6" className="stroke-canvas">
        <circle cx="16" cy="16" r="8" />
        <ellipse cx="16" cy="16" rx="3.4" ry="8" />
        <path d="M8 16h16" />
      </g>
      <circle cx="24.4" cy="8.6" r="2.8" strokeWidth="1.6" className="fill-brand stroke-fg" />
    </svg>
  );
}

export function Logo({ className, showDescriptor = false }: { className?: string; showDescriptor?: boolean }) {
  const { wordmark, descriptor } = siteConfig.company;

  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className="size-8 shrink-0" />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[15px] font-semibold tracking-tight whitespace-nowrap">
          {wordmark.primary} <span className="font-medium text-fg-mute">{wordmark.secondary}</span>
        </span>
        {showDescriptor && (
          <span className="mt-1.5 text-[10px] font-medium tracking-[0.16em] text-fg-mute uppercase">{descriptor}</span>
        )}
      </span>
    </span>
  );
}
