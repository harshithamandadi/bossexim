import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

const variantStyles = {
  neutral: "bg-surface text-fg ring-1 ring-inset ring-border",
  outline: "text-fg-mute ring-1 ring-inset ring-border",
  brand: "bg-brand/10 text-brand",
  solid: "bg-fg text-canvas",
} as const;

export type ChipVariant = keyof typeof variantStyles;

export function Chip({ variant = "neutral", className, ...props }: ComponentProps<"span"> & { variant?: ChipVariant }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap",
        variantStyles[variant],
        className,
      )}
      {...props}
    />
  );
}
