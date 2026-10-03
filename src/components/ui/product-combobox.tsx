"use client";

import { Check, ChevronDown, Search } from "lucide-react";
import { useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { cn } from "@/lib/cn";

export interface ComboboxOption {
  value: string;
  label: string;
  group: string;
}

interface ProductComboboxProps {
  name: string;
  label: string;
  options: ComboboxOption[];
  placeholder: string;
  defaultValue?: string;
  error?: string;
  required?: boolean;
  optionalLabel?: string;
  noResults: string;
}

/**
 * A searchable select (ARIA combobox): type to filter products, arrows to move,
 * Enter to pick. The chosen value travels in a hidden input, like a <select>.
 */
export function ProductCombobox({
  name,
  label,
  options,
  placeholder,
  defaultValue = "",
  error,
  required,
  optionalLabel,
  noResults,
}: ProductComboboxProps) {
  const id = useId();
  const listId = `${id}-list`;
  const errorId = `${id}-error`;
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(defaultValue);
  const selected = options.find((option) => option.value === value);
  const [query, setQuery] = useState(selected?.label ?? "");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    // Show everything when the box still shows the chosen product's name.
    if (!term || term === selected?.label.toLowerCase()) return options;
    return options.filter((option) => option.label.toLowerCase().includes(term) || option.group.toLowerCase().includes(term));
  }, [options, query, selected]);

  function choose(option: ComboboxOption) {
    setValue(option.value);
    setQuery(option.label);
    setIsOpen(false);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      setIsOpen(true);
      const step = event.key === "ArrowDown" ? 1 : -1;
      setActiveIndex((index) => (filtered.length ? (index + step + filtered.length) % filtered.length : 0));
    } else if (event.key === "Enter" && isOpen) {
      event.preventDefault();
      const option = filtered[activeIndex];
      if (option) choose(option);
    } else if (event.key === "Escape") {
      setIsOpen(false);
      setQuery(selected?.label ?? "");
    }
  }

  return (
    <div className="relative flex flex-col gap-2">
      <label htmlFor={id} className="flex items-baseline justify-between gap-4 text-sm font-medium">
        {label}
        {optionalLabel && <span className="text-xs font-normal text-fg-mute">{optionalLabel}</span>}
      </label>
      <div className="relative">
        <Search aria-hidden className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-fg-mute" />
        <input
          ref={inputRef}
          id={id}
          type="text"
          role="combobox"
          autoComplete="off"
          aria-expanded={isOpen}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={isOpen && filtered[activeIndex] ? `${id}-${filtered[activeIndex].value}` : undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          aria-required={required}
          placeholder={placeholder}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setValue("");
            setIsOpen(true);
            setActiveIndex(0);
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => {
            // Let a click on an option land before closing; restore the chosen name if the text was abandoned.
            window.setTimeout(() => {
              setIsOpen(false);
              setQuery((current) => (value ? (selected?.label ?? current) : current));
            }, 120);
          }}
          onKeyDown={handleKeyDown}
          className={cn(
            "w-full rounded-2xl bg-surface py-3.5 pr-11 pl-10 text-[15px] text-fg ring-1 ring-border ring-inset",
            "placeholder:text-fg-mute/70 transition-shadow duration-300 ease-smooth focus:ring-2 focus:ring-brand focus:outline-none",
            "aria-[invalid=true]:ring-danger",
          )}
        />
        <ChevronDown aria-hidden className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-fg-mute" />
      </div>
      <input type="hidden" name={name} value={value} />

      {isOpen && (
        <ul
          id={listId}
          role="listbox"
          aria-label={label}
          className="absolute top-full right-0 left-0 z-20 mt-2 max-h-72 overflow-y-auto rounded-2xl bg-elevated p-1.5 shadow-[0_24px_60px_-20px_rgb(8_33_79/0.35)] ring-1 ring-border"
        >
          {filtered.length === 0 && <li className="px-3 py-2.5 text-sm text-fg-mute">{noResults}</li>}
          {filtered.map((option, index) => {
            const showGroup = filtered[index - 1]?.group !== option.group;
            return (
              <li key={option.value} role="presentation">
                {showGroup && (
                  <p className="type-eyebrow px-3 pt-2 pb-1 text-[10px] text-fg-mute" aria-hidden>
                    {option.group}
                  </p>
                )}
                <div
                  id={`${id}-${option.value}`}
                  role="option"
                  aria-selected={option.value === value}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => choose(option)}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={cn(
                    "flex cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2 text-[15px]",
                    index === activeIndex && "bg-brand/10",
                  )}
                >
                  {option.label}
                  {option.value === value && <Check aria-hidden className="size-4 text-brand" />}
                </div>
              </li>
            );
          })}
        </ul>
      )}
      {error && (
        <p id={errorId} className="text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
