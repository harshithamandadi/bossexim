import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
import { Container, type ContainerSize } from "./container";

export type SectionTone = "light" | "mist" | "dark";

const spacingStyles = {
  default: "py-20 sm:py-24",
  compact: "py-14 sm:py-16",
  none: "",
} as const;

interface SectionProps extends ComponentProps<"section"> {
  tone?: SectionTone;
  spacing?: keyof typeof spacingStyles;
  containerSize?: ContainerSize;
  /** Skip the inner Container for full-bleed content. */
  bleed?: boolean;
}

/** A page band. Its tone remaps colour tokens for everything inside it. */
export function Section({
  tone = "light",
  spacing = "default",
  containerSize,
  bleed = false,
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <section
      data-tone={tone}
      className={cn(
        "relative scroll-mt-32 bg-canvas text-fg",
        tone === "dark" ? "deep-gradient" : "tone-wash",
        spacingStyles[spacing],
        className,
      )}
      {...props}
    >
      {bleed ? children : <Container size={containerSize}>{children}</Container>}
    </section>
  );
}
