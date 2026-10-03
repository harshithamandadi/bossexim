"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { MessageCircleMore, X } from "lucide-react";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState, type Ref } from "react";
import { chatbotContent } from "@/config/chatbot";
import { onOpenChat } from "@/lib/chat-events";
import { cn } from "@/lib/cn";
import { EASE_SMOOTH } from "@/lib/motion";
import type { FaqItem } from "@/types/content";
import type { AssistantProduct, ChatChoice } from "./assistant-flow";
import type { ChatRequest } from "./chat-panel";

const loadPanel = () => import("./chat-panel");
const ChatPanel = dynamic(() => loadPanel().then((module) => module.ChatPanel), { ssr: false });

/** Delay before the launcher appears, so it never competes with a page's own entrance. */
const LAUNCHER_DELAY_S = 1.2;
const TEASER_DISMISSED_KEY = "aira-teaser-dismissed";
/** Phones get no teaser: the client asked for less disturbance on mobile. */
const TEASER_MEDIA = "(min-width: 768px)";
/** Same ids as Aira's main menu (assistant-flow.ts), listed here so the panel's code can stay lazy-loaded. */
const TEASER_CHOICES: ChatChoice[] = [
  { id: "menu:products", label: chatbotContent.menu.products },
  { id: "menu:buying", label: chatbotContent.menu.buying },
  { id: "callback", label: chatbotContent.menu.callback },
];

/**
 * Aira, the website assistant: a floating launcher plus a panel whose code only loads
 * once a visitor shows intent (hover, focus or click). The panel stays mounted
 * after its first open, so the conversation survives closing and navigating.
 */
interface ChatWidgetProps {
  faqs: FaqItem[];
  products: AssistantProduct[];
  formToken: string;
}

export function ChatWidget({ faqs, products, formToken }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const [request, setRequest] = useState<ChatRequest>();
  const launcherRef = useRef<HTMLButtonElement>(null);

  const [showTeaser, setShowTeaser] = useState(false);

  const dismissTeaser = useCallback(() => {
    setShowTeaser(false);
    try {
      sessionStorage.setItem(TEASER_DISMISSED_KEY, "1");
    } catch {
      // Storage can be blocked; the teaser simply shows again next visit.
    }
  }, []);

  const open = useCallback(
    (question?: string, choice?: ChatChoice) => {
      dismissTeaser();
      setHasOpened(true);
      setIsOpen(true);
      if (question || choice) setRequest({ id: Date.now(), question, choice });
    },
    [dismissTeaser],
  );

  // Once per visit, on larger screens, Aira says hello after a few seconds.
  useEffect(() => {
    let dismissed = false;
    try {
      dismissed = sessionStorage.getItem(TEASER_DISMISSED_KEY) === "1";
    } catch {
      dismissed = false;
    }
    if (dismissed || !window.matchMedia(TEASER_MEDIA).matches) return;
    const timer = window.setTimeout(() => setShowTeaser(true), chatbotContent.teaser.delaySeconds * 1000);
    return () => window.clearTimeout(timer);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    launcherRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => onOpenChat(open), [open]);

  return (
    <>
      <AnimatePresence>
        {showTeaser && !isOpen && (
          <Teaser key="teaser" onChoose={(choice) => open(undefined, choice)} onDismiss={dismissTeaser} />
        )}
      </AnimatePresence>
      <Launcher ref={launcherRef} isOpen={isOpen} invite={!hasOpened} onToggle={() => (isOpen ? close() : open())} />
      {hasOpened && <ChatPanel faqs={faqs} products={products} formToken={formToken} isOpen={isOpen} onClose={close} request={request} />}
    </>
  );
}

interface LauncherProps {
  ref: Ref<HTMLButtonElement>;
  isOpen: boolean;
  /** Until the chat has been opened once: a soft pulse ring and an occasional wiggle. */
  invite: boolean;
  onToggle: () => void;
}

function Launcher({ ref, isOpen, invite, onToggle }: LauncherProps) {
  const { launcher, close } = chatbotContent;
  const reduceMotion = useReducedMotion();
  const beckon = invite && !isOpen && !reduceMotion;

  return (
    <motion.button
      ref={ref}
      type="button"
      aria-label={isOpen ? launcher.close : launcher.open}
      aria-expanded={isOpen}
      aria-haspopup="dialog"
      onClick={onToggle}
      onPointerEnter={() => void loadPanel()}
      onFocus={() => void loadPanel()}
      initial={{ opacity: 0, y: 16, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: LAUNCHER_DELAY_S, duration: 0.4, ease: EASE_SMOOTH }}
      className={cn(
        "brand-gradient fixed right-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-[70] flex items-center gap-2.5 rounded-full text-white shadow-lg shadow-brand/30",
        "transition-[box-shadow,scale] duration-150 ease-smooth hover:shadow-xl hover:shadow-brand/40 active:scale-[0.96]",
        // Phones: a compact, quiet button. Larger screens: a labelled pill.
        "size-12 justify-center sm:right-6 sm:bottom-6 sm:h-14 sm:w-auto sm:pr-5 sm:pl-4",
        isOpen && "max-sm:hidden",
      )}
    >
      {beckon && (
        <>
          <span aria-hidden className="pointer-events-none absolute inset-0 animate-[launcher-ring_2.8s_ease-out_infinite] rounded-full ring-2 ring-brand/60" />
          <span aria-hidden className="pointer-events-none absolute inset-0 animate-[launcher-ring_2.8s_ease-out_1.4s_infinite] rounded-full ring-2 ring-tide/50" />
        </>
      )}
      <motion.span
        className="relative grid size-6 place-items-center"
        animate={beckon ? { rotate: [0, -14, 12, -8, 6, 0] } : { rotate: 0 }}
        transition={beckon ? { duration: 0.9, delay: 3, repeat: Infinity, repeatDelay: 5, ease: "easeInOut" } : { duration: 0.2 }}
      >
        <AnimatePresence initial={false} mode="popLayout">
          <motion.span
            key={isOpen ? "close" : "open"}
            initial={{ opacity: 0, scale: 0.6, filter: "blur(4px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.6, filter: "blur(4px)" }}
            transition={{ duration: 0.2, ease: EASE_SMOOTH }}
            className="grid place-items-center"
          >
            {isOpen ? <X aria-hidden className="size-5" /> : <MessageCircleMore aria-hidden className="size-6" />}
          </motion.span>
        </AnimatePresence>
      </motion.span>
      <span className="hidden text-[15px] font-semibold sm:inline">{isOpen ? close : launcher.label}</span>
    </motion.button>
  );
}

/** The greeting bubble beside the launcher, with quick ways to start. */
function Teaser({ onChoose, onDismiss }: { onChoose: (choice: ChatChoice) => void; onDismiss: () => void }) {
  const { teaser } = chatbotContent;

  return (
    <motion.div
      role="status"
      initial={{ opacity: 0, y: 12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.98, transition: { duration: 0.15 } }}
      transition={{ duration: 0.35, ease: EASE_SMOOTH }}
      style={{ transformOrigin: "bottom right" }}
      data-tone="light"
      className="fixed right-6 bottom-24 z-[70] w-[19rem] rounded-[1.5rem] rounded-br-md bg-canvas p-4 text-fg shadow-[0_24px_60px_-20px_rgb(8_33_79/0.45)] ring-1 ring-border"
    >
      <button
        type="button"
        onClick={onDismiss}
        aria-label={teaser.dismiss}
        className="absolute top-2.5 right-2.5 grid size-7 place-items-center rounded-full text-fg-mute transition-colors hover:bg-fg/5 hover:text-fg"
      >
        <X aria-hidden className="size-3.5" />
      </button>
      <p className="pr-6 text-[15px] leading-snug font-medium">{teaser.text}</p>
      <ul className="mt-3 flex flex-wrap gap-1.5">
        {TEASER_CHOICES.map((choice, index) => (
          <motion.li
            key={choice.id}
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.25 + index * 0.08, type: "spring", stiffness: 420, damping: 26 }}
          >
            <button
              type="button"
              onClick={() => onChoose(choice)}
              className="rounded-full bg-brand/10 px-3 py-1.5 text-[13px] font-semibold text-brand transition-colors hover:bg-brand hover:text-white"
            >
              {choice.label}
            </button>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}
