"use client";

import { ArrowUp } from "lucide-react";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import { chatbotContent } from "@/config/chatbot";

const MAX_LENGTH = 300;
const MAX_HEIGHT_PX = 128;

interface ChatComposerProps {
  onSend: (text: string) => void;
  disabled?: boolean;
  autoFocus?: boolean;
}

/** Grows with its text. Enter sends; Shift+Enter adds a line; IME composition is never cut short. */
export function ChatComposer({ onSend, disabled = false, autoFocus = false }: ChatComposerProps) {
  const { composer } = chatbotContent;
  const inputId = useId();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = useState("");
  const canSend = value.trim().length > 0 && !disabled;

  function fitHeight() {
    const input = inputRef.current;
    if (!input) return;
    input.style.height = "auto";
    input.style.height = `${Math.min(input.scrollHeight, MAX_HEIGHT_PX)}px`;
  }

  function send() {
    if (!canSend) return;
    onSend(value.trim());
    setValue("");
    requestAnimationFrame(fitHeight);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key !== "Enter" || event.shiftKey || event.nativeEvent.isComposing) return;
    event.preventDefault();
    send();
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        send();
      }}
      className="flex items-end gap-2 rounded-2xl bg-surface p-1.5 pl-4 ring-1 ring-border transition-shadow duration-200 ring-inset focus-within:ring-brand/50"
    >
      <label htmlFor={inputId} className="sr-only">
        {composer.label}
      </label>
      <textarea
        id={inputId}
        ref={inputRef}
        value={value}
        rows={1}
        maxLength={MAX_LENGTH}
        placeholder={composer.placeholder}
        autoFocus={autoFocus}
        onChange={(event) => {
          setValue(event.target.value);
          fitHeight();
        }}
        onKeyDown={handleKeyDown}
        className="no-scrollbar flex-1 resize-none bg-transparent py-2 text-base leading-6 outline-none placeholder:text-fg-mute/70 sm:text-[15px]"
      />
      <button
        type="submit"
        disabled={!canSend}
        aria-label={composer.send}
        className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand text-white transition-[opacity,scale] duration-150 ease-smooth active:scale-95 disabled:opacity-35"
      >
        <ArrowUp aria-hidden className="size-5" />
      </button>
    </form>
  );
}
