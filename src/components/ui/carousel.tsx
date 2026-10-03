"use client";

import { useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Children, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Seconds between automatic steps. */
const AUTOPLAY_SECONDS = 4;
/** After a click, swipe or scroll, sliding waits this long before carrying on. */
const RESUME_AFTER_SECONDS = 8;

interface CarouselProps {
  children: ReactNode;
  /** Accessible name, e.g. "Products". */
  label: string;
  previousLabel: string;
  nextLabel: string;
  /** Width of each slide, e.g. "18rem". */
  slideWidth?: string;
  className?: string;
}

/**
 * A swipeable row of cards with previous/next arrows that keeps sliding on its
 * own. It pauses while hovered or keyboard-focused, and for a few seconds after
 * the visitor clicks an arrow, swipes or scrolls. No autoplay for reduced-motion visitors.
 */
export function Carousel({ children, label, previousLabel, nextLabel, slideWidth = "18rem", className }: CarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [canPrevious, setCanPrevious] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [isHolding, setIsHolding] = useState(false);
  const [interaction, setInteraction] = useState(0);

  /** Holds the sliding briefly after the visitor interacts. */
  const hold = useCallback(() => {
    setIsHolding(true);
    setInteraction((count) => count + 1);
  }, []);

  useEffect(() => {
    if (interaction === 0) return;
    const timer = window.setTimeout(() => setIsHolding(false), RESUME_AFTER_SECONDS * 1000);
    return () => window.clearTimeout(timer);
  }, [interaction]);

  const updateEdges = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    setCanPrevious(track.scrollLeft > 4);
    setCanNext(track.scrollLeft + track.clientWidth < track.scrollWidth - 4);
  }, []);

  /** Scrolls by one card (the first slide's width plus the gap). */
  const step = useCallback((direction: 1 | -1) => {
    const track = trackRef.current;
    const slide = track?.firstElementChild as HTMLElement | null;
    if (!track || !slide) return;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
    // Autoplay wraps around to the start; the arrows simply stop at the ends.
    if (direction === 1 && atEnd) track.scrollTo({ left: 0, behavior: "smooth" });
    else track.scrollBy({ left: direction * (slide.offsetWidth + gap), behavior: "smooth" });
  }, []);

  useEffect(() => {
    updateEdges();
    window.addEventListener("resize", updateEdges);
    return () => window.removeEventListener("resize", updateEdges);
  }, [updateEdges]);

  useEffect(() => {
    if (reduceMotion || isPaused || isHolding) return;
    const timer = window.setInterval(() => step(1), AUTOPLAY_SECONDS * 1000);
    return () => window.clearInterval(timer);
  }, [reduceMotion, isPaused, isHolding, step]);

  const manual = (direction: 1 | -1) => {
    hold();
    step(direction);
  };

  const arrowStyles = cn(
    "grid size-11 place-items-center rounded-full bg-elevated text-fg shadow-[0_10px_30px_-12px_rgb(8_33_79/0.35)] ring-1 ring-border",
    "transition-[opacity,background-color,color,transform] duration-200 ease-smooth hover:bg-brand hover:text-white active:scale-95",
    "disabled:pointer-events-none disabled:opacity-0",
  );

  return (
    <section
      aria-roledescription="carousel"
      aria-label={label}
      className={cn("relative", className)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      // Keyboard focus pauses; a mouse click on an arrow only holds briefly.
      onFocusCapture={(event) => event.target.matches(":focus-visible") && setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
    >
      <div
        ref={trackRef}
        onScroll={updateEdges}
        onPointerDown={hold}
        onWheel={(event) => Math.abs(event.deltaX) > Math.abs(event.deltaY) && hold()}
        className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth py-3"
      >
        {Children.map(children, (child) => (
          <div className="shrink-0 snap-start" style={{ width: slideWidth }}>
            {child}
          </div>
        ))}
      </div>
      {/* Arrows sit on the row's edges (clear of the chat button in the corner). */}
      <button
        type="button"
        onClick={() => manual(-1)}
        disabled={!canPrevious}
        aria-label={previousLabel}
        className={cn(arrowStyles, "absolute top-1/2 left-1 -translate-y-1/2 sm:-left-5")}
      >
        <ArrowLeft aria-hidden className="size-5" />
      </button>
      <button
        type="button"
        onClick={() => manual(1)}
        disabled={!canNext}
        aria-label={nextLabel}
        className={cn(arrowStyles, "absolute top-1/2 right-1 -translate-y-1/2 sm:-right-5")}
      >
        <ArrowRight aria-hidden className="size-5" />
      </button>
    </section>
  );
}
