"use client";

import { AnimatePresence, motion } from "framer-motion";
import { MessageCircleQuestion, X } from "lucide-react";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState, type Ref } from "react";
import { chatbotContent } from "@/config/chatbot";
import { onOpenChat } from "@/lib/chat-events";
import { cn } from "@/lib/cn";
import { EASE_SMOOTH } from "@/lib/motion";
import type { FaqItem } from "@/types/content";
import type { ChatRequest } from "./chat-panel";

const loadPanel = () => import("./chat-panel");
const ChatPanel = dynamic(() => loadPanel().then((module) => module.ChatPanel), { ssr: false });

/** Delay before the launcher appears, so it never competes with a page's own entrance. */
const LAUNCHER_DELAY_S = 1.2;

/**
 * The FAQ assistant: a floating launcher plus a panel whose code only loads
 * once a visitor shows intent (hover, focus or click). The panel stays mounted
 * after its first open, so the conversation survives closing and navigating.
 */
export function ChatWidget({ faqs }: { faqs: FaqItem[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const [request, setRequest] = useState<ChatRequest>();
  const launcherRef = useRef<HTMLButtonElement>(null);

  const open = useCallback((question?: string) => {
    setHasOpened(true);
    setIsOpen(true);
    if (question) setRequest({ id: Date.now(), question });
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    launcherRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => onOpenChat(open), [open]);

  return (
    <>
      <Launcher ref={launcherRef} isOpen={isOpen} onToggle={() => (isOpen ? close() : open())} />
      {hasOpened && <ChatPanel faqs={faqs} isOpen={isOpen} onClose={close} request={request} />}
    </>
  );
}

interface LauncherProps {
  ref: Ref<HTMLButtonElement>;
  isOpen: boolean;
  onToggle: () => void;
}

function Launcher({ ref, isOpen, onToggle }: LauncherProps) {
  const { launcher, close } = chatbotContent;

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
        "fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-[70] flex h-14 items-center gap-2.5 rounded-full bg-brand text-white shadow-lg shadow-brand/30",
        "transition-[background-color,scale] duration-150 ease-smooth hover:bg-brand-deep active:scale-[0.96]",
        "w-14 justify-center sm:right-6 sm:bottom-6 sm:w-auto sm:pr-5 sm:pl-4",
        isOpen && "max-sm:hidden",
      )}
    >
      <span className="relative grid size-6 place-items-center">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.span
            key={isOpen ? "close" : "open"}
            initial={{ opacity: 0, scale: 0.6, filter: "blur(4px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.6, filter: "blur(4px)" }}
            transition={{ duration: 0.2, ease: EASE_SMOOTH }}
            className="grid place-items-center"
          >
            {isOpen ? <X aria-hidden className="size-5" /> : <MessageCircleQuestion aria-hidden className="size-6" />}
          </motion.span>
        </AnimatePresence>
      </span>
      <span className="hidden text-[15px] font-semibold sm:inline">{isOpen ? close : launcher.label}</span>
    </motion.button>
  );
}
