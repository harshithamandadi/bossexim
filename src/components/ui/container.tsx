import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

const widthStyles = {
  narrow: "max-w-4xl",
  default: "max-w-7xl",
  wide: "max-w-[90rem]",
} as const;

export type ContainerSize = keyof typeof widthStyles;

export function Container({ size = "default", className, ...props }: ComponentProps<"div"> & { size?: ContainerSize }) {
  return <div className={cn("mx-auto w-full px-5 sm:px-8", widthStyles[size], className)} {...props} />;
}
