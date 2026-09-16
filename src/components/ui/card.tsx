import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

interface CardStyleOptions {
  interactive?: boolean;
  className?: string;
}

/** Shared by <Card> and link-cards so hover behaviour stays identical everywhere. */
export function cardStyles({ interactive = false, className }: CardStyleOptions = {}): string {
  return cn(
    "relative overflow-hidden rounded-card bg-surface p-7 sm:p-8",
    interactive &&
      "transition-[transform,box-shadow] duration-500 ease-smooth hover:-translate-y-1 hover:shadow-[0_28px_60px_-28px_rgb(0_0_0/0.28)]",
    className,
  );
}

export function Card({ interactive, className, ...props }: ComponentProps<"div"> & CardStyleOptions) {
  return <div className={cardStyles({ interactive, className })} {...props} />;
}
