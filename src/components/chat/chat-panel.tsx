"use client";

import {
  AnimatePresence,
  motion,
  useDragControls,
  useIsPresent,
  useReducedMotion,
  type DragControls,
} from "framer-motion";
import { ArrowRight, RotateCcw, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useId, useMemo, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { LogoMark } from "@/components/ui/logo";
import { chatbotContent } from "@/config/chatbot";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/cn";
import { CONFIDENT_MATCH, createFaqSearch, pickAcrossCategories, relatedQuestions } from "@/lib/faq-search";
import { EASE_SMOOTH, SPRING_PANEL } from "@/lib/motion";
import type { FaqItem, LinkItem } from "@/types/content";
import { ChatBubble, TypingBubble } from "./chat-bubble";
import { ChatComposer } from "./chat-composer";

/** A question sent from elsewhere on the site; `id` lets the same question be asked twice. */
export interface ChatRequest {
  id: number;
  question: string;
}

interface Suggestions {
  label?: string;
  items: FaqItem[];
}

type ChatMessage =
  | { from: "visitor"; text: string }
  | { from: "assistant"; text: string; action?: LinkItem; suggestions?: Suggestions };

/** A short pause before each answer, so replies read as a conversation rather than a jump. */
const TYPING_DELAY_MS = 450;
const SHEET_CLOSE_DISTANCE_PX = 120;
const SHEET_CLOSE_VELOCITY = 500;
const GREETING_PATTERN = /^(hi|hello|hey|hiya|good (morning|afternoon|evening)|namaste)\b/i;
const THANKS_PATTERN = /^(thanks|thank you|thx|cheers|great|ok|okay)\b/i;
const content = chatbotContent;

interface ChatPanelProps {
  faqs: FaqItem[];
  isOpen: boolean;
  onClose: () => void;
  request?: ChatRequest;
}

export function ChatPanel({ faqs, isOpen, onClose, request }: ChatPanelProps) {
  const isDesktop = useMediaQuery("(min-width: 640px)");
  const reduceMotion = useReducedMotion();
  const dragControls = useDragControls();
  const titleId = useId();
  const logRef = useRef<HTMLDivElement>(null);

  const search = useMemo(() => createFaqSearch(faqs), [faqs]);
  const greeting = useMemo<ChatMessage>(
    () => ({
      from: "assistant",
      text: content.greeting,
      suggestions: { label: content.suggestionsLabel, items: pickAcrossCategories(faqs, content.suggestionCount) },
    }),
    [faqs],
  );

  const [messages, setMessages] = useState<ChatMessage[]>(() => [greeting]);
  const [pendingReply, setPendingReply] = useState<ChatMessage | null>(null);
  const [handledRequestId, setHandledRequestId] = useState<number>();

  function answerFor(item: FaqItem): ChatMessage {
    const related = relatedQuestions(faqs, item, content.relatedCount);
    return {
      from: "assistant",
      text: item.answer,
      action: item.action,
      suggestions: related.length > 0 ? { label: content.relatedLabel, items: related } : undefined,
    };
  }

  function replyTo(question: string): ChatMessage {
    const matches = search(question);
    const best = matches[0];
    if (best && best.score >= CONFIDENT_MATCH) return answerFor(best.item);
    if (GREETING_PATTERN.test(question)) return { ...greeting, text: content.smallTalk.greeting };
    if (THANKS_PATTERN.test(question)) return { from: "assistant", text: content.smallTalk.thanks };
    if (matches.length > 0) {
      return {
        from: "assistant",
        text: content.didYouMean,
        action: content.fallbackAction,
        suggestions: { items: matches.slice(0, 3).map((match) => match.item) },
      };
    }
    return { from: "assistant", text: content.fallback, action: content.fallbackAction };
  }

  /** Adds the visitor's message and queues the reply (delivering any reply still "typing" first). */
  function ask(question: string, item?: FaqItem) {
    const reply = item ? answerFor(item) : replyTo(question);
    setMessages((current) => [...current, ...(pendingReply ? [pendingReply] : []), { from: "visitor", text: question }]);
    setPendingReply(reply);
  }

  // A question sent from another page (e.g. the FAQ search) — handled once per request.
  if (request && request.id !== handledRequestId) {
    setHandledRequestId(request.id);
    ask(request.question);
  }

  useEffect(() => {
    if (!pendingReply) return;
    const timer = window.setTimeout(
      () => {
        setMessages((current) => [...current, pendingReply]);
        setPendingReply(null);
      },
      reduceMotion ? 0 : TYPING_DELAY_MS,
    );
    return () => window.clearTimeout(timer);
  }, [pendingReply, reduceMotion]);

  useEffect(() => {
    const log = logRef.current;
    if (!isOpen || !log) return;
    log.scrollTo({ top: log.scrollHeight, behavior: reduceMotion ? "auto" : "smooth" });
  }, [messages, pendingReply, isOpen, reduceMotion]);

  // The mobile sheet covers the page, so the page behind it shouldn't scroll.
  useEffect(() => {
    if (!isOpen || isDesktop) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen, isDesktop]);

  function restart() {
    setMessages([greeting]);
    setPendingReply(null);
  }

  /** On mobile the sheet covers the page, so following a link should reveal it. */
  function handleNavigate() {
    if (!isDesktop) onClose();
  }

  const lastIndex = messages.length - 1;

  return (
    <AnimatePresence>
      {isOpen && !isDesktop && (
        <motion.div
          key="backdrop"
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: EASE_SMOOTH }}
          onClick={onClose}
          className="fixed inset-0 z-[69] bg-navy-deep/35"
        />
      )}

      {isOpen && (
        <PanelSurface
          key="panel"
          isDesktop={isDesktop}
          titleId={titleId}
          dragControls={dragControls}
          onClose={onClose}
        >
          <PanelHeader
            titleId={titleId}
            showHandle={!isDesktop}
            canRestart={messages.length > 1}
            onRestart={restart}
            onClose={onClose}
            onDragStart={(event) => dragControls.start(event)}
          />

          <div
            ref={logRef}
            role="log"
            aria-live="polite"
            aria-label={content.dialogLabel}
            className="flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-5 sm:px-5"
          >
            {messages.map((message, index) => (
              <MessageView
                key={index}
                message={message}
                joinsPrevious={messages[index - 1]?.from === message.from}
                isLatest={index === lastIndex && !pendingReply}
                onAsk={ask}
                onNavigate={handleNavigate}
              />
            ))}
            {pendingReply && <TypingBubble label={content.typing} />}
          </div>

          <div className="border-t border-border px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-4">
            <ChatComposer onSend={(text) => ask(text)} autoFocus={isDesktop} />
            <p className="mt-2 text-center text-[11px] text-fg-mute">
              {content.disclaimer}{" "}
              <Link
                href={content.humanLink.href}
                onClick={handleNavigate}
                className="font-semibold text-brand underline-offset-2 hover:underline"
              >
                {content.humanLink.label}
              </Link>
            </p>
          </div>
        </PanelSurface>
      )}
    </AnimatePresence>
  );
}

interface PanelSurfaceProps {
  isDesktop: boolean;
  titleId: string;
  dragControls: DragControls;
  onClose: () => void;
  children: ReactNode;
}

/**
 * Desktop: a card that grows out of the launcher. Mobile: a sheet from the bottom
 * edge that can be dragged down to close. Once it starts leaving it turns inert,
 * so nobody can type into a panel that is already on its way out.
 */
function PanelSurface({ isDesktop, titleId, dragControls, onClose, children }: PanelSurfaceProps) {
  const isPresent = useIsPresent();

  const motionProps = isDesktop
    ? {
        initial: { opacity: 0, scale: 0.9, y: 16 },
        animate: { opacity: 1, scale: 1, y: 0, transition: SPRING_PANEL },
        exit: { opacity: 0, scale: 0.96, y: 8, transition: { duration: 0.18, ease: EASE_SMOOTH } },
      }
    : {
        initial: { y: "100%" },
        animate: { y: 0, transition: SPRING_PANEL },
        exit: { y: "100%", transition: { duration: 0.24, ease: EASE_SMOOTH } },
      };

  return (
    <motion.div
      role="dialog"
      aria-modal={!isDesktop}
      aria-labelledby={titleId}
      data-tone="light"
      inert={!isPresent}
      style={{ pointerEvents: isPresent ? "auto" : "none" }}
      onKeyDown={(event) => {
        if (event.key !== "Escape") return;
        event.stopPropagation();
        onClose();
      }}
      drag={isDesktop ? false : "y"}
      dragListener={false}
      dragControls={dragControls}
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={{ top: 0, bottom: 0.7 }}
      onDragEnd={(_, info) => {
        if (info.offset.y > SHEET_CLOSE_DISTANCE_PX || info.velocity.y > SHEET_CLOSE_VELOCITY) onClose();
      }}
      {...motionProps}
      className={cn(
        "fixed z-[70] flex flex-col overflow-hidden bg-canvas text-fg",
        isDesktop
          ? "right-6 bottom-24 h-[min(40rem,calc(100dvh-8.5rem))] w-[24rem] origin-bottom-right rounded-[1.75rem] shadow-[0_32px_80px_-24px_rgb(8_33_79/0.45)] ring-1 ring-border"
          : "inset-x-0 bottom-0 h-[88dvh] rounded-t-[1.75rem] shadow-[0_-12px_48px_-12px_rgb(8_33_79/0.35)]",
      )}
    >
      {children}
    </motion.div>
  );
}

interface PanelHeaderProps {
  titleId: string;
  showHandle: boolean;
  canRestart: boolean;
  onRestart: () => void;
  onClose: () => void;
  onDragStart: (event: PointerEvent) => void;
}

function PanelHeader({ titleId, showHandle, canRestart, onRestart, onClose, onDragStart }: PanelHeaderProps) {
  return (
    <div
      onPointerDown={showHandle ? onDragStart : undefined}
      className={cn(
        "relative flex shrink-0 items-center gap-3 border-b border-border px-4 pb-3 sm:px-5",
        showHandle ? "touch-none pt-6" : "pt-4",
      )}
    >
      {showHandle && (
        <span aria-hidden title={content.dragHandle} className="absolute top-2 left-1/2 h-1 w-10 -translate-x-1/2 rounded-full bg-fg/15" />
      )}
      <LogoMark className="size-9 shrink-0" />
      <div className="min-w-0 flex-1">
        <p id={titleId} className="font-display text-[15px] leading-tight font-bold">
          {content.title}
        </p>
        <p className="mt-0.5 flex items-center gap-1.5 text-xs text-fg-mute">
          <span aria-hidden className="size-1.5 rounded-full bg-brand" />
          {content.subtitle}
        </p>
      </div>
      {canRestart && (
        <HeaderButton label={content.restart} onClick={onRestart}>
          <RotateCcw className="size-4" />
        </HeaderButton>
      )}
      <HeaderButton label={content.close} onClick={onClose}>
        <X className="size-4" />
      </HeaderButton>
    </div>
  );
}

function HeaderButton({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      onPointerDown={(event) => event.stopPropagation()}
      className="grid size-9 shrink-0 place-items-center rounded-full text-fg-mute transition-colors duration-150 hover:bg-fg/5 hover:text-fg"
    >
      {children}
    </button>
  );
}

interface MessageViewProps {
  message: ChatMessage;
  joinsPrevious: boolean;
  /** Suggestions are only offered on the newest reply, so the thread stays calm. */
  isLatest: boolean;
  onAsk: (question: string, item?: FaqItem) => void;
  onNavigate: () => void;
}

function MessageView({ message, joinsPrevious, isLatest, onAsk, onNavigate }: MessageViewProps) {
  if (message.from === "visitor") {
    return (
      <ChatBubble from="visitor" joinsPrevious={joinsPrevious}>
        {message.text}
      </ChatBubble>
    );
  }

  return (
    <div>
      <ChatBubble from="assistant" joinsPrevious={joinsPrevious}>
        {message.text}
      </ChatBubble>
      {message.action && (
        <Link
          href={message.action.href}
          onClick={onNavigate}
          className="group mt-2 inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-3 py-1.5 text-[13px] font-semibold text-brand transition-colors duration-150 hover:bg-brand/15"
        >
          {message.action.label}
          <ArrowRight aria-hidden className="size-3.5 transition-transform duration-200 ease-smooth group-hover:translate-x-0.5" />
        </Link>
      )}
      {isLatest && message.suggestions && <SuggestionList suggestions={message.suggestions} onAsk={onAsk} />}
    </div>
  );
}

function SuggestionList({ suggestions, onAsk }: { suggestions: Suggestions; onAsk: MessageViewProps["onAsk"] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.12, duration: 0.24, ease: EASE_SMOOTH }}
      className="mt-3"
    >
      {suggestions.label && <p className="type-eyebrow text-[10px] text-fg-mute">{suggestions.label}</p>}
      <ul className="mt-2 flex flex-wrap gap-1.5">
        {suggestions.items.map((item) => (
          <li key={item.question}>
            <button
              type="button"
              onClick={() => onAsk(item.question, item)}
              className="rounded-2xl bg-canvas px-3 py-1.5 text-left text-[13px] leading-snug font-medium text-brand ring-1 ring-brand/25 transition-colors duration-150 ring-inset hover:bg-brand hover:text-white"
            >
              {item.question}
            </button>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
