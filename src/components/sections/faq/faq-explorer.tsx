"use client";

import { AnimatePresence, motion } from "framer-motion";
import { MessageCircleQuestion, Search, X } from "lucide-react";
import { useId, useMemo, useState } from "react";
import { Accordion } from "@/components/ui/accordion";
import { Button, ButtonLink } from "@/components/ui/button";
import type { faqPageLabels } from "@/config/faq";
import { openChat } from "@/lib/chat-events";
import { cn } from "@/lib/cn";
import { createFaqSearch } from "@/lib/faq-search";
import { pluralize } from "@/lib/format";
import { EASE_SMOOTH } from "@/lib/motion";
import type { FaqItem, LinkItem } from "@/types/content";

const ALL = "all";

interface FaqExplorerProps {
  items: FaqItem[];
  categories: string[];
  labels: typeof faqPageLabels;
  enquiry: LinkItem;
}

/** Live search (the chatbot's own matcher) plus topic filters over every FAQ. */
export function FaqExplorer({ items, categories, labels, enquiry }: FaqExplorerProps) {
  const inputId = useId();
  const search = useMemo(() => createFaqSearch(items), [items]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>(ALL);

  const trimmed = query.trim();
  const matches = trimmed ? search(trimmed).map((match) => match.item) : [];
  const visibleCategories = category === ALL ? categories : [category];

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-xl">
          <label htmlFor={inputId} className="sr-only">
            {labels.searchLabel}
          </label>
          <Search aria-hidden className="pointer-events-none absolute top-1/2 left-5 size-5 -translate-y-1/2 text-fg-mute" />
          <input
            id={inputId}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={labels.searchPlaceholder}
            autoComplete="off"
            className="h-14 w-full rounded-full bg-elevated pr-14 pl-13 text-base shadow-[0_12px_32px_-18px_rgb(8_33_79/0.35)] ring-1 ring-border transition-shadow duration-200 outline-none ring-inset placeholder:text-fg-mute/70 focus:ring-2 focus:ring-brand/50 [&::-webkit-search-cancel-button]:hidden"
          />
          {query && (
            <button
              type="button"
              aria-label={labels.clearSearch}
              onClick={() => setQuery("")}
              className="absolute top-1/2 right-3 grid size-9 -translate-y-1/2 place-items-center rounded-full text-fg-mute transition-colors hover:bg-fg/5 hover:text-fg"
            >
              <X aria-hidden className="size-4" />
            </button>
          )}
        </div>

        {!trimmed && (
          <div role="group" aria-label={labels.categoryFilter} className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 lg:mx-0 lg:px-0">
            {[ALL, ...categories].map((option) => {
              const isSelected = option === category;
              return (
                <button
                  key={option}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setCategory(option)}
                  className={cn(
                    "shrink-0 rounded-full px-4 py-2 text-sm font-medium ring-1 transition-colors duration-150 ring-inset",
                    isSelected ? "bg-navy text-white ring-navy" : "text-fg-mute ring-border hover:text-fg",
                  )}
                >
                  {option === ALL ? labels.allCategories : option}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <p aria-live="polite" className="mt-6 min-h-6 text-sm text-fg-mute">
        {trimmed && `${matches.length} ${pluralize(matches.length, labels.result, labels.results)} ${labels.for} “${trimmed}”`}
      </p>

      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={trimmed ? `search:${matches.map((item) => item.question).join("|")}` : `topic:${category}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, transition: { duration: 0.12 } }}
          transition={{ duration: 0.24, ease: EASE_SMOOTH }}
          className="mt-4"
        >
          {trimmed ? (
            matches.length > 0 ? (
              <Accordion items={matches} />
            ) : (
              <NoResults query={trimmed} labels={labels} enquiry={enquiry} />
            )
          ) : (
            <div className="space-y-14">
              {visibleCategories.map((name) => (
                <section key={name} aria-labelledby={`${inputId}-${name}`}>
                  <h2 id={`${inputId}-${name}`} className="type-h3">
                    {name}
                  </h2>
                  <div className="mt-4">
                    <Accordion items={items.filter((item) => item.category === name)} defaultOpenIndex={null} />
                  </div>
                </section>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function NoResults({ query, labels, enquiry }: { query: string; labels: typeof faqPageLabels; enquiry: LinkItem }) {
  return (
    <div className="flex flex-col items-center rounded-panel bg-surface px-6 py-14 text-center">
      <span className="grid size-14 place-items-center rounded-full bg-brand/10 text-brand">
        <MessageCircleQuestion aria-hidden className="size-7" />
      </span>
      <h2 className="type-h4 mt-6">{labels.noResultsTitle}</h2>
      <p className="type-body mt-2 max-w-md text-fg-mute">{labels.noResultsDescription}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button variant="brand" onClick={() => openChat(query)}>
          {labels.askAssistant}
        </Button>
        <ButtonLink href={enquiry.href} variant="secondary" withArrow>
          {enquiry.label}
        </ButtonLink>
      </div>
    </div>
  );
}
