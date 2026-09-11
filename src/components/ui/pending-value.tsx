import { cn } from "@/lib/cn";

interface PendingValueProps {
  value?: string;
  href?: string;
  /** Shown while the value hasn't been supplied in config yet. */
  fallback: string;
  className?: string;
}

/** Renders a config value, or a clearly-marked placeholder when it is missing. */
export function PendingValue({ value, href, fallback, className }: PendingValueProps) {
  if (!value) {
    return (
      <span className={cn("text-fg-mute underline decoration-border decoration-dashed underline-offset-4", className)}>
        {fallback}
      </span>
    );
  }

  return href ? (
    <a href={href} className={cn("underline-link", className)}>
      {value}
    </a>
  ) : (
    <span className={className}>{value}</span>
  );
}
