import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { groupVerticalHref, groupVerticals, type GroupVerticalSlug } from "@/config";
import { cn } from "@/lib/cn";

/** Links to the other BOSS Group verticals, shown at the foot of each vertical page. */
export function VerticalLinks({ current, title, className }: { current?: GroupVerticalSlug; title: string; className?: string }) {
  const others = groupVerticals.filter((vertical) => vertical.slug !== current);

  return (
    <div className={className}>
      <h2 className="type-h3">{title}</h2>
      <RevealGroup as="ul" className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {others.map((vertical) => (
          <RevealItem as="li" key={vertical.slug}>
            <Link
              href={groupVerticalHref(vertical.slug)}
              className={cn(
                "group flex h-full flex-col justify-between gap-6 card-gradient rounded-card bg-surface p-5 ring-1 ring-inset ring-border",
                "transition-[transform,box-shadow] duration-500 ease-smooth hover:-translate-y-1 hover:shadow-[0_24px_50px_-28px_rgb(8_33_79/0.35)]",
              )}
            >
              <ArrowUpRight aria-hidden className="size-4 self-end text-fg-mute transition-colors group-hover:text-brand" />
              <span>
                <span className="block font-display text-lg font-bold">{vertical.name}</span>
                <span className="mt-1 block text-[13px] leading-snug text-fg-mute">{vertical.menuDescription}</span>
              </span>
            </Link>
          </RevealItem>
        ))}
      </RevealGroup>
    </div>
  );
}
