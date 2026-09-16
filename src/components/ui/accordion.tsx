"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useId, useState } from "react";
import { DURATION, EASE_SMOOTH } from "@/lib/motion";
import type { FaqItem } from "@/types/content";

interface AccordionProps {
  items: FaqItem[];
  /** Index open on first render; `null` starts fully collapsed. */
  defaultOpenIndex?: number | null;
}

export function Accordion({ items, defaultOpenIndex = 0 }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpenIndex);
  const baseId = useId();

  return (
    <ul className="divide-y divide-border border-y border-border">
      {items.map((item, index) => (
        <AccordionItem
          key={item.question}
          id={`${baseId}-${index}`}
          item={item}
          isOpen={openIndex === index}
          onToggle={() => setOpenIndex((current) => (current === index ? null : index))}
        />
      ))}
    </ul>
  );
}

interface AccordionItemProps {
  id: string;
  item: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
}

function AccordionItem({ id, item, isOpen, onToggle }: AccordionItemProps) {
  const triggerId = `${id}-trigger`;
  const panelId = `${id}-panel`;

  return (
    <li>
      <h3>
        <button
          id={triggerId}
          type="button"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={onToggle}
          className="group flex w-full items-center justify-between gap-6 py-6 text-left"
        >
          <span className="type-h4 transition-colors group-hover:text-fg-mute">{item.question}</span>
          <motion.span
            aria-hidden
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: DURATION.base, ease: EASE_SMOOTH }}
            className="grid size-9 shrink-0 place-items-center rounded-full bg-surface text-fg"
          >
            <Plus className="size-4" />
          </motion.span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={triggerId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: DURATION.base, ease: EASE_SMOOTH }}
            className="overflow-hidden"
          >
            <p className="type-body max-w-2xl pr-12 pb-7 text-fg-mute">{item.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}
