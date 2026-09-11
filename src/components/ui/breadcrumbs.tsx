import { ChevronRight } from "lucide-react";
import Link from "next/link";
import type { LinkItem } from "@/types/content";

export function Breadcrumbs({ items, current }: { items: LinkItem[]; current: string }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-fg-mute">
        {items.map((item) => (
          <li key={item.href} className="flex items-center gap-1.5">
            <Link href={item.href} className="transition-colors hover:text-fg">
              {item.label}
            </Link>
            <ChevronRight aria-hidden className="size-3.5" />
          </li>
        ))}
        <li aria-current="page" className="font-medium text-fg">
          {current}
        </li>
      </ol>
    </nav>
  );
}
