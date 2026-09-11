"use client";

import { motion } from "framer-motion";
import { useId, useRef, type KeyboardEvent } from "react";
import { cn } from "@/lib/cn";
import { SPRING_SNAPPY } from "@/lib/motion";

export interface SegmentOption<T extends string> {
  value: T;
  label: string;
  count?: number;
}

interface SegmentedControlProps<T extends string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  label: string;
  className?: string;
}

const KEY_STEPS: Partial<Record<string, number>> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };

/** Apple-style segmented control with a sliding selection pill (ARIA radio group). */
export function SegmentedControl<T extends string>({ options, value, onChange, label, className }: SegmentedControlProps<T>) {
  const pillId = useId();
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const step = KEY_STEPS[event.key];
    if (!step) return;
    event.preventDefault();
    const currentIndex = options.findIndex((option) => option.value === value);
    const nextIndex = (currentIndex + step + options.length) % options.length;
    const next = options[nextIndex];
    if (!next) return;
    onChange(next.value);
    buttonsRef.current[nextIndex]?.focus();
  }

  return (
    <div
      role="radiogroup"
      aria-label={label}
      onKeyDown={handleKeyDown}
      className={cn("inline-flex flex-wrap gap-1 rounded-[1.4rem] bg-surface p-1 ring-1 ring-inset ring-border", className)}
    >
      {options.map((option, index) => {
        const isSelected = option.value === value;
        return (
          <button
            key={option.value}
            ref={(node) => {
              buttonsRef.current[index] = node;
            }}
            type="button"
            role="radio"
            aria-checked={isSelected}
            tabIndex={isSelected ? 0 : -1}
            onClick={() => onChange(option.value)}
            className={cn(
              "relative rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300",
              isSelected ? "text-canvas" : "text-fg-mute hover:text-fg",
            )}
          >
            {isSelected && (
              <motion.span layoutId={pillId} transition={SPRING_SNAPPY} className="absolute inset-0 rounded-full bg-fg" />
            )}
            <span className="relative">
              {option.label}
              {option.count !== undefined && <span className="ml-1.5 tabular-nums opacity-60">{option.count}</span>}
            </span>
          </button>
        );
      })}
    </div>
  );
}
