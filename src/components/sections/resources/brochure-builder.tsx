"use client";

import { Download, LoaderCircle } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cardStyles } from "@/components/ui/card";
import { brochureContent } from "@/config/brochure";
import { tradeDirections } from "@/config/products";
import { brochureHref } from "@/config/routes";
import { groupByDirection } from "@/lib/catalogue";
import { cn } from "@/lib/cn";
import type { Product } from "@/types/content";

/** What the picker needs to know about a product (the rest stays on the server). */
export type BrochureOption = Pick<Product, "slug" | "name" | "category" | "direction">;

const { builder, document: pdf, fixedPages, productsPerPage } = brochureContent;

/** Pages in a brochure of `count` products: the fixed pages plus twelve products a page. */
const pageCount = (count: number) => fixedPages + Math.ceil(count / productsPerPage);

/**
 * Lists every product by trade direction and category; the visitor ticks the ones they
 * want and downloads a brochure of just those (built by src/app/brochure.pdf).
 */
export function BrochureBuilder({ products, className }: { products: BrochureOption[]; className?: string }) {
  const sections = useMemo(() => groupByDirection(products), [products]);
  const [selected, setSelected] = useState<ReadonlySet<string>>(() => new Set());
  const [status, setStatus] = useState<"idle" | "preparing" | "error">("idle");

  const count = selected.size;
  const preparing = status === "preparing";

  function setMany(slugs: string[], checked: boolean) {
    setStatus((current) => (current === "error" ? "idle" : current));
    setSelected((current) => {
      const next = new Set(current);
      for (const slug of slugs) {
        if (checked) next.add(slug);
        else next.delete(slug);
      }
      return next;
    });
  }

  async function download() {
    setStatus("preparing");
    try {
      const response = await fetch(brochureHref(products.filter((product) => selected.has(product.slug)).map((product) => product.slug)));
      if (!response.ok) throw new Error(`Brochure request failed (${response.status})`);
      const url = URL.createObjectURL(await response.blob());
      const link = document.createElement("a");
      link.href = url;
      link.download = pdf.fileName;
      link.click();
      // Give the browser time to start the download before the file is released.
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  }

  return (
    // overflow-clip, not the card's overflow-hidden: a hidden overflow would stop the download bar sticking.
    <div className={cardStyles({ className: cn("overflow-clip", className) })}>
      <div className="max-w-2xl">
        <h3 className="type-h3">{builder.title}</h3>
        <p className="mt-2 text-[15px] text-fg-mute">{builder.description}</p>
      </div>

      {/* Sticks under the site header while the list scrolls, like the "on this page" bar (layout/local-nav.tsx). */}
      <div className="glass sticky top-[4.75rem] z-30 mt-8 flex flex-col gap-3 rounded-[1.4rem] p-2 shadow-[0_10px_30px_-14px_rgb(0_0_0/0.3)] ring-1 ring-border sm:flex-row sm:items-center sm:justify-between sm:rounded-full sm:pl-5">
        <p aria-live="polite" className={cn("px-2 text-sm sm:px-0", status === "error" ? "text-danger" : "text-fg-mute")}>
          {status === "error"
            ? builder.error
            : count === 0
              ? builder.emptyHint
              : `${count} ${builder.selectedOf} ${products.length} ${builder.selected} · ${pageCount(count)}${builder.pages}`}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            disabled={count === products.length}
            onClick={() => setMany(products.map((product) => product.slug), true)}
          >
            {builder.selectAll}
          </Button>
          <Button size="sm" variant="ghost" disabled={count === 0} onClick={() => setMany([...selected], false)}>
            {builder.clear}
          </Button>
          <Button variant="brand" size="sm" disabled={count === 0 || preparing} onClick={download} className="grow sm:grow-0">
            {preparing ? <LoaderCircle aria-hidden className="size-4 animate-spin" /> : <Download aria-hidden className="size-4" />}
            {preparing ? builder.preparing : builder.download}
          </Button>
        </div>
      </div>

      {sections.map(({ direction, groups }) => (
        <div key={direction} className="mt-10">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-border pb-3">
            <h4 className="type-h4">{tradeDirections[direction].label}</h4>
            <p className="text-sm text-fg-mute">{tradeDirections[direction].tagline}</p>
          </div>
          <div className="mt-6 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {groups.map(({ category, items }) => (
              <CategoryOptions key={category} category={category} items={items} selected={selected} onChange={setMany} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

interface CategoryOptionsProps {
  category: string;
  items: BrochureOption[];
  selected: ReadonlySet<string>;
  onChange: (slugs: string[], checked: boolean) => void;
}

/** One category: a checkbox for the whole category, then one per product. */
function CategoryOptions({ category, items, selected, onChange }: CategoryOptionsProps) {
  const slugs = items.map((item) => item.slug);
  const checkedCount = slugs.filter((slug) => selected.has(slug)).length;
  const allChecked = checkedCount === slugs.length;
  const categoryBox = useRef<HTMLInputElement>(null);

  // "Some selected" can only be set from script.
  useEffect(() => {
    if (categoryBox.current) categoryBox.current.indeterminate = checkedCount > 0 && !allChecked;
  }, [checkedCount, allChecked]);

  return (
    <fieldset>
      <legend className="w-full">
        <label className="flex cursor-pointer items-center gap-2.5 text-[15px] font-semibold">
          <input
            ref={categoryBox}
            type="checkbox"
            checked={allChecked}
            onChange={(event) => onChange(slugs, event.target.checked)}
            className="size-4 shrink-0 cursor-pointer accent-brand"
          />
          {category}
          <span className="ml-auto text-xs font-normal tabular-nums text-fg-mute">
            {checkedCount}/{slugs.length}
          </span>
        </label>
      </legend>
      <ul className="mt-3 grid gap-1.5">
        {items.map((item) => (
          <li key={item.slug}>
            <label className="flex cursor-pointer items-center gap-2.5 rounded-xl bg-elevated px-3 py-2 text-sm ring-1 ring-border ring-inset transition-colors duration-200 hover:ring-fg/25 has-checked:bg-brand/8 has-checked:ring-brand/45">
              <input
                type="checkbox"
                checked={selected.has(item.slug)}
                onChange={(event) => onChange([item.slug], event.target.checked)}
                className="size-4 shrink-0 cursor-pointer accent-brand"
              />
              {item.name}
            </label>
          </li>
        ))}
      </ul>
    </fieldset>
  );
}
