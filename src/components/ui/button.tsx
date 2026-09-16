import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

const variantStyles = {
  /** Solid, inverts automatically on dark sections. */
  primary: "bg-fg text-canvas hover:bg-fg/85",
  brand: "bg-brand text-white shadow-lg shadow-brand/25 hover:bg-brand-deep",
  secondary: "bg-elevated text-fg ring-1 ring-inset ring-border hover:ring-fg/25",
  ghost: "text-fg hover:bg-fg/5",
} as const;

const sizeStyles = {
  sm: "h-9 px-4 text-[13px]",
  md: "h-11 px-5 text-[15px]",
  lg: "h-13 px-7 text-base",
} as const;

export interface ButtonStyleOptions {
  variant?: keyof typeof variantStyles;
  size?: keyof typeof sizeStyles;
  className?: string;
}

export function buttonStyles({ variant = "primary", size = "md", className }: ButtonStyleOptions = {}): string {
  return cn(
    "group inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-medium tracking-[-0.01em]",
    "transition-[background-color,color,box-shadow,transform] duration-200 ease-smooth active:scale-[0.97]",
    "disabled:pointer-events-none disabled:opacity-50",
    variantStyles[variant],
    sizeStyles[size],
    className,
  );
}

function ButtonContent({ children, withArrow }: { children: ReactNode; withArrow?: boolean }) {
  return (
    <>
      {children}
      {withArrow && (
        <ArrowRight
          aria-hidden
          className="size-4 transition-transform duration-300 ease-smooth group-hover:translate-x-0.5"
        />
      )}
    </>
  );
}

type ButtonProps = ComponentProps<"button"> & ButtonStyleOptions & { withArrow?: boolean };

export function Button({ variant, size, className, withArrow, children, type = "button", ...props }: ButtonProps) {
  return (
    <button type={type} className={buttonStyles({ variant, size, className })} {...props}>
      <ButtonContent withArrow={withArrow}>{children}</ButtonContent>
    </button>
  );
}

type ButtonLinkProps = ComponentProps<typeof Link> & ButtonStyleOptions & { withArrow?: boolean };

export function ButtonLink({ variant, size, className, withArrow, children, ...props }: ButtonLinkProps) {
  return (
    <Link className={buttonStyles({ variant, size, className })} {...props}>
      <ButtonContent withArrow={withArrow}>{children}</ButtonContent>
    </Link>
  );
}
