import type { LucideProps } from "lucide-react";
import { icons, type IconName } from "@/lib/icons";
import { cn } from "@/lib/cn";

export function Icon({ name, strokeWidth = 1.75, ...props }: LucideProps & { name: IconName }) {
  const Glyph = icons[name];
  return <Glyph aria-hidden strokeWidth={strokeWidth} {...props} />;
}

const tileVariants = {
  solid: "bg-fg text-canvas",
  soft: "bg-canvas text-fg ring-1 ring-inset ring-border",
  brand: "bg-brand text-white",
} as const;

const tileSizes = {
  sm: "size-9 rounded-xl [&>svg]:size-4",
  md: "size-11 rounded-2xl [&>svg]:size-5",
  lg: "size-14 rounded-[1.1rem] [&>svg]:size-6",
} as const;

interface IconTileProps {
  icon: IconName;
  variant?: keyof typeof tileVariants;
  size?: keyof typeof tileSizes;
  className?: string;
}

export function IconTile({ icon, variant = "solid", size = "md", className }: IconTileProps) {
  return (
    <span className={cn("inline-flex shrink-0 items-center justify-center", tileVariants[variant], tileSizes[size], className)}>
      <Icon name={icon} />
    </span>
  );
}
