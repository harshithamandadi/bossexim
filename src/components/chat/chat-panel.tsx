"use client";

import {
  AnimatePresence,
  motion,
  useDragControls,
  useIsPresent,
  useReducedMotion,
  type DragControls,
} from "framer-motion";
import { ArrowDown, ArrowRight, RotateCcw, X } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useId, useMemo, useRef, useState, useTransition, type PointerEvent, type ReactNode } from "react";
import { submitAssistantCallback, submitAssistantEnquiry } from "@/app/(site)/contact/actions";
import { LogoMark } from "@/components/ui/logo";
import { chatbotContent } from "@/config/chatbot";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/cn";
import type { BuyingAnswers, CallbackAnswers } from "@/lib/enquiry/assistant";
import { createFaqSearch } from "@/lib/faq-search";
import { EASE_SMOOTH, SPRING_PANEL } from "@/lib/motion";
import type { FaqItem } from "@/types/content";
import {
  INITIAL_FLOW,
  callbackReply,
  composerHints,
  greetingMessage,
  respond,
  submissionReply,
  type AssistantMessage,
  type AssistantProduct,
  type ChatChoice,
  type ChatMessage,
  type Flow,
  type Suggestions,
  type VisitorInput,
} from "./assistant-flow";
import { ChatBubble, TypingBubble } from "./chat-bubble";
import { StreamingText, streamDuration } from "./streaming-text";
import { ChatComposer } from "./chat-composer";

/** A question sent from elsewhere on the site; `id` lets the same question be asked twice. */
export interface ChatRequest {
  id: number;
  /** Asked as if typed… */
  question?: string;
  /** …or a menu option to start with, e.g. from the greeting teaser. */
  choice?: ChatChoice;
}

/** A short pause before each answer, so replies read as a conversation rather than a jump. */
const TYPING_DELAY_MS = 450;
const SHEET_CLOSE_DISTANCE_PX = 120;
/** Further than this from the bottom counts as "reading back", and shows the jump button. */
const JUMP_THRESHOLD_PX = 120;
const SHEET_CLOSE_VELOCITY = 500;
const content = chatbotContent;

interface ChatPanelProps {
  faqs: FaqItem[];
  /** Products Aira can talk about and take enquiries for. */
  products: AssistantProduct[];
  /** Server-signed token that lets the assistant submit an enquiry (see form-token.ts). */
  formToken: string;
  isOpen: boolean;
  onClose: () => void;
  request?: ChatRequest;
}

export function ChatPanel({ faqs, products, formToken, isOpen, onClose, request }: ChatPanelProps) {
  const isDesktop = useMediaQuery("(min-width: 640px)");
  const reduceMotion = useReducedMotion();
  const dragControls = useDragControls();
  const titleId = useId();
  const logRef = useRef<HTMLDivElement>(null);

  const search = useMemo(() => createFaqSearch(faqs), [faqs]);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [greetingMessage]);
  const [pendingReplies, setPendingReplies] = useState<AssistantMessage[]>([]);
  const [flow, setFlow] = useState<Flow>(INITIAL_FLOW);
  const [isSubmitting, startSubmitting] = useTransition();
  const [handledRequestId, setHandledRequestId] = useState<number>();

  function submit(answers: BuyingAnswers) {
    startSubmitting(async () => {
      const result = await submitAssistantEnquiry(answers, formToken).catch(() => ({ ok: false as const }));
      setMessages((current) => [...current, submissionReply(result)]);
      setFlow(result.ok ? INITIAL_FLOW : { kind: "confirm", answers });
    });
  }

  function requestCallback(answers: CallbackAnswers) {
    startSubmitting(async () => {
      const result = await submitAssistantCallback(answers, formToken).catch(() => ({ ok: false as const }));
      setMessages((current) => [...current, callbackReply(result)]);
      setFlow(INITIAL_FLOW);
    });
  }

  /** Echoes the visitor's message and queues Aira's replies (delivering any still "typing" first). */
  // Questions answered so far, and whether Aira has already offered a follow-up.
  const [questionCount, setQuestionCount] = useState(0);
  const [askedForContact, setAskedForContact] = useState(false);

  function send(input: VisitorInput, echo: string) {
    if (isSubmitting) return;
    const response = respond(flow, input, { faqs, products, search });
    const startsCapture = response.flow.kind === "callback" || response.flow.kind === "buying";
    if (startsCapture) setAskedForContact(true);

    // A question answered outside the buying and call-back flows counts towards the follow-up offer.
    const isQuestion = (input.kind === "text" || input.kind === "faq") && response.flow.kind === "browse";
    const answered = isQuestion ? questionCount + 1 : questionCount;
    setQuestionCount(answered);
    const offerFollowUp = !askedForContact && !startsCapture && isQuestion && answered >= content.contactAsk.afterQuestions;
    if (offerFollowUp) setAskedForContact(true);
    const replies: AssistantMessage[] = offerFollowUp
      ? [
          ...response.replies,
          {
            from: "assistant",
            text: content.contactAsk.text,
            choices: [
              { id: "callback", label: content.contactAsk.yes },
              { id: "menu", label: content.contactAsk.no },
            ],
          },
        ]
      : response.replies;

    setMessages((current) => [...current, ...pendingReplies, { from: "visitor", text: echo }]);
    setPendingReplies(replies);
    setFlow(response.flow);
    if (response.submit) submit(response.submit);
    if (response.callback) requestCallback(response.callback);
  }

  const ask = (question: string, item?: FaqItem) =>
    send(item ? { kind: "faq", item } : { kind: "text", text: question }, question);
  const choose = (choice: ChatChoice) => send({ kind: "choice", choice }, choice.label);

  // A question sent from another page (e.g. the FAQ search) — handled once per request.
  if (request && request.id !== handledRequestId) {
    setHandledRequestId(request.id);
    if (request.choice) choose(request.choice);
    else if (request.question) ask(request.question);
  }

  useEffect(() => {
    if (pendingReplies.length === 0) return;
    const timer = window.setTimeout(
      () => {
        setMessages((current) => [...current, ...pendingReplies]);
        setPendingReplies([]);
      },
      reduceMotion ? 0 : TYPING_DELAY_MS,
    );
    return () => window.clearTimeout(timer);
  }, [pendingReplies, reduceMotion]);

  const isTyping = pendingReplies.length > 0 || isSubmitting;

  // Follow the conversation while it grows (streamed words, chips popping in),
  // unless the visitor has scrolled up to reread something.
  const contentRef = useRef<HTMLDivElement>(null);
  const followRef = useRef(true);
  const [showJump, setShowJump] = useState(false);

  const scrollToLatest = useCallback(
    (smooth: boolean) => {
      const log = logRef.current;
      if (log) log.scrollTo({ top: log.scrollHeight, behavior: smooth && !reduceMotion ? "smooth" : "auto" });
    },
    [reduceMotion],
  );

  // A new message always brings the view down (the scroll handler then hides the jump button).
  useEffect(() => {
    followRef.current = true;
    scrollToLatest(true);
  }, [messages.length, isTyping, scrollToLatest]);

  useEffect(() => {
    const content = contentRef.current;
    if (!isOpen || !content) return;
    const observer = new ResizeObserver(() => {
      if (followRef.current) scrollToLatest(false);
    });
    observer.observe(content);
    return () => observer.disconnect();
  }, [isOpen, scrollToLatest]);

  function handleLogScroll() {
    const log = logRef.current;
    if (!log) return;
    const away = log.scrollHeight - log.scrollTop - log.clientHeight > JUMP_THRESHOLD_PX;
    followRef.current = !away;
    setShowJump(away);
  }

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
    setMessages([greetingMessage]);
    setPendingReplies([]);
    setFlow(INITIAL_FLOW);
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
            canRestart={messages.length > 1 && !isSubmitting}
            onRestart={restart}
            onClose={onClose}
            onDragStart={(event) => dragControls.start(event)}
          />

          <div className="relative flex min-h-0 flex-1 flex-col">
          <div
            ref={logRef}
            role="log"
            aria-live="polite"
            aria-label={content.dialogLabel}
            onScroll={handleLogScroll}
            className="flex-1 overflow-y-auto overscroll-contain px-4 py-5 sm:px-5"
          >
            <div ref={contentRef} className="space-y-3">
            {messages.map((message, index) => (
              <MessageView
                key={index}
                message={message}
                joinsPrevious={messages[index - 1]?.from === message.from}
                isLatest={index === lastIndex && !isTyping}
                onAsk={ask}
                onChoose={choose}
                onNavigate={handleNavigate}
              />
            ))}
            {isTyping && <TypingBubble label={isSubmitting ? content.buying.submitting : content.typing} />}
            </div>
          </div>
          <AnimatePresence>
            {showJump && (
              <motion.button
                type="button"
                aria-label={content.jumpToLatest}
                onClick={() => {
                  followRef.current = true;
                  setShowJump(false);
                  scrollToLatest(true);
                }}
                initial={{ opacity: 0, y: 8, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.8 }}
                transition={SPRING_PANEL}
                className="absolute bottom-3 left-1/2 grid size-9 -translate-x-1/2 place-items-center rounded-full bg-elevated text-fg shadow-[0_10px_24px_-8px_rgb(8_33_79/0.4)] ring-1 ring-border hover:text-brand"
              >
                <ArrowDown aria-hidden className="size-4" />
              </motion.button>
            )}
          </AnimatePresence>
          </div>

          <div className="border-t border-border px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-4">
            <ChatComposer onSend={(text) => ask(text)} autoFocus={isDesktop} disabled={isSubmitting} {...composerHints(flow)} />
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
          ? "right-6 bottom-24 h-[min(42rem,calc(100dvh-8.5rem))] w-[25rem] origin-bottom-right rounded-[1.75rem] shadow-[0_32px_80px_-24px_rgb(8_33_79/0.45)] ring-1 ring-border"
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
      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-logo text-white">
        <LogoMark className="h-3.5 w-auto" />
      </span>
      <div className="min-w-0 flex-1">
        <p id={titleId} className="font-display text-[15px] leading-tight font-bold">
          {content.title}
        </p>
        <p className="mt-0.5 flex items-center gap-1.5 text-xs text-fg-mute">
          <span aria-hidden className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-success/60 motion-reduce:animate-none" />
            <span className="relative inline-flex size-2 rounded-full bg-success" />
          </span>
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

const ACTION_STYLES =
  "mt-2 inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-3 py-1.5 text-[13px] font-semibold text-brand transition-colors duration-150 hover:bg-brand/15";

const CHIP_STYLES =
  "rounded-2xl bg-canvas px-3 py-1.5 text-left text-[13px] leading-snug font-medium text-brand ring-1 ring-brand/25 transition-colors duration-150 ring-inset hover:bg-brand hover:text-white";

interface MessageViewProps {
  message: ChatMessage;
  joinsPrevious: boolean;
  /** Options and suggestions are only offered on the newest reply, so the thread stays calm. */
  isLatest: boolean;
  onAsk: (question: string, item?: FaqItem) => void;
  onChoose: (choice: ChatChoice) => void;
  onNavigate: () => void;
}

function MessageView({ message, joinsPrevious, isLatest, onAsk, onChoose, onNavigate }: MessageViewProps) {
  const reduceMotion = useReducedMotion();
  if (message.from === "visitor") {
    return (
      <ChatBubble from="visitor" joinsPrevious={joinsPrevious}>
        {message.text}
      </ChatBubble>
    );
  }

  const { action } = message;
  const after = streamDuration(message.text, reduceMotion);
  const reveal = (extra = 0) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 6, filter: "blur(4px)" },
          animate: { opacity: 1, y: 0, filter: "blur(0px)" },
          transition: { delay: after + extra, duration: 0.3, ease: EASE_SMOOTH },
        };

  return (
    <div>
      <ChatBubble from="assistant" joinsPrevious={joinsPrevious}>
        <StreamingText text={message.text} />
        <motion.div {...reveal()}>
        {message.tables?.map((table, index) => (
          <div key={table.title ?? index} className="mt-3">
            {table.title && <p className="mb-1 text-[13px] font-semibold">{table.title}</p>}
            <dl className="divide-y divide-border rounded-xl bg-canvas px-3 text-[13px]">
              {table.rows.map(([label, value]) => (
                <div key={label} className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-3 py-1.5">
                  <dt className="text-fg-mute">{label}</dt>
                  <dd className="font-medium break-words">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
        {message.list && (
          <ul className="mt-2 list-disc space-y-0.5 pl-5 text-[14px]">
            {message.list.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}
        {message.footer && <p className="mt-3">{message.footer}</p>}
        {message.reference && (
          <p className="mt-3 rounded-xl bg-canvas px-3 py-2 text-[13px]">
            {message.reference.label}: <strong className="font-semibold tracking-wide">{message.reference.value}</strong>
          </p>
        )}
        </motion.div>
      </ChatBubble>
      {action && (
        <motion.div {...reveal(0.05)}>
        {action.href.startsWith("mailto:") ? (
          <a href={action.href} className={ACTION_STYLES}>
            {action.label}
          </a>
        ) : (
          <Link href={action.href} onClick={onNavigate} className={cn("group", ACTION_STYLES)}>
            {action.label}
            <ArrowRight aria-hidden className="size-3.5 transition-transform duration-200 ease-smooth group-hover:translate-x-0.5" />
          </Link>
        )}
        </motion.div>
      )}
      {isLatest && message.choices && <ChoiceList choices={message.choices} onChoose={onChoose} delay={after} />}
      {isLatest && message.suggestions && (
        <SuggestionList suggestions={message.suggestions} onAsk={onAsk} delay={after + (message.choices?.length ?? 0) * CHIP_STAGGER_S} />
      )}
    </div>
  );
}

/** Each chip springs up a beat after the one before it. */
const CHIP_STAGGER_S = 0.06;

function chipMotion(index: number, delay: number) {
  return {
    initial: { opacity: 0, y: 10, scale: 0.92 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: { delay: delay + index * CHIP_STAGGER_S, type: "spring" as const, stiffness: 420, damping: 26 },
  };
}

function ChoiceList({ choices, onChoose, delay }: { choices: ChatChoice[]; onChoose: (choice: ChatChoice) => void; delay: number }) {
  return (
    <ul className="mt-3 flex flex-wrap gap-1.5">
      {choices.map((choice, index) => (
        <motion.li key={choice.id} {...chipMotion(index, delay)}>
          <motion.button
            type="button"
            onClick={() => onChoose(choice)}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            className={CHIP_STYLES}
          >
            {choice.label}
          </motion.button>
        </motion.li>
      ))}
    </ul>
  );
}

function SuggestionList({ suggestions, onAsk, delay }: { suggestions: Suggestions; onAsk: MessageViewProps["onAsk"]; delay: number }) {
  return (
    <div className="mt-3">
      {suggestions.label && (
        <motion.p {...chipMotion(0, delay)} className="type-eyebrow text-[10px] text-fg-mute">
          {suggestions.label}
        </motion.p>
      )}
      <ul className="mt-2 flex flex-wrap gap-1.5">
        {suggestions.items.map((item, index) => (
          <motion.li key={item.question} {...chipMotion(index + 1, delay)}>
            <motion.button
              type="button"
              onClick={() => onAsk(item.question, item)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={CHIP_STYLES}
            >
              {item.question}
            </motion.button>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
