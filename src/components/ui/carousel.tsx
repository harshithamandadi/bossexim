"use client";

import { animate, motion, useAnimationFrame, useInView, useMotionValue, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Gliding speed in pixels per second. */
const SPEED_PX_PER_S = 38;
/** Further than this counts as a drag, not a click on a card. */
const DRAG_CLICK_THRESHOLD_PX = 6;
const GAP_PX = 16;

interface CarouselProps {
  /** The cards; each becomes one slide. */
  items: ReactNode[];
  /** Accessible name, e.g. "Products". */
  label: string;
  previousLabel: string;
  nextLabel: string;
  /** Width of each slide, e.g. "18rem". */
  slideWidth?: string;
  /** Glide speed multiplier, e.g. 0.7 for slower rows. */
  speed?: number;
  className?: string;
}

/**
 * An endless, smoothly gliding row of cards with previous/next arrows and
 * drag/swipe. It glides continuously (pausing on hover, when off-screen and for
 * reduced-motion visitors); the arrows glide one card at a time and it carries
 * on afterwards. When the cards already fit, it's a plain static row.
 */
export function Carousel({ items, label, previousLabel, nextLabel, slideWidth = "18rem", speed = 1, className }: CarouselProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const setRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const isOnScreen = useInView(viewportRef);
  const x = useMotionValue(0);
  const [setWidth, setSetWidth] = useState(0);
  const [loops, setLoops] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const isBusy = useRef(false);
  const dragDistance = useRef(0);

  // Measure one set of cards: it only loops when the set is wider than the row.
  useEffect(() => {
    const viewport = viewportRef.current;
    const set = setRef.current;
    if (!viewport || !set) return;
    const measure = () => {
      const width = set.scrollWidth + GAP_PX;
      setSetWidth(width);
      setLoops(width > viewport.clientWidth + GAP_PX);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    observer.observe(set);
    return () => observer.disconnect();
  }, [items.length]);

  // The copies on either side are for looks only: keep them out of the tab order.
  useEffect(() => {
    trackRef.current
      ?.querySelectorAll("[data-copy] a, [data-copy] button")
      .forEach((element) => element.setAttribute("tabindex", "-1"));
  }, [loops, items.length]);

  // Three copies, kept within the middle one, so there are always cards on both sides.
  const wrap = useCallback(
    (value: number) => {
      if (!setWidth) return value;
      let next = value;
      while (next > -setWidth) next -= setWidth;
      while (next <= -2 * setWidth) next += setWidth;
      return next;
    },
    [setWidth],
  );

  useEffect(() => {
    x.set(loops ? -setWidth : 0);
  }, [loops, setWidth, x]);

  useAnimationFrame((_, deltaMs) => {
    if (!loops || reduceMotion || isHovered || !isOnScreen || isBusy.current) return;
    x.set(wrap(x.get() - (SPEED_PX_PER_S * speed * Math.min(deltaMs, 64)) / 1000));
  });

  /** Glides exactly one card along, then normalises back into the middle copy. */
  const step = (direction: 1 | -1) => {
    const slide = setRef.current?.firstElementChild as HTMLElement | null;
    if (!slide) return;
    isBusy.current = true;
    animate(x, x.get() - direction * (slide.offsetWidth + GAP_PX), {
      type: "spring",
      stiffness: 140,
      damping: 24,
      onComplete: () => {
        x.set(wrap(x.get()));
        isBusy.current = false;
      },
    });
  };

  const arrowStyles = cn(
    "absolute top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-elevated text-fg shadow-[0_10px_30px_-12px_rgb(8_33_79/0.35)] ring-1 ring-border",
    "transition-[background-color,color,transform] duration-200 ease-smooth hover:bg-brand hover:text-white active:scale-95",
  );

  const slides = (copy: number) =>
    items.map((item, index) => (
      <div key={`${copy}-${index}`} className="shrink-0" style={{ width: slideWidth }}>
        {item}
      </div>
    ));

  return (
    <section
      aria-roledescription="carousel"
      aria-label={label}
      className={cn("relative", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div ref={viewportRef} className={cn("overflow-hidden py-3", loops && "edge-fade-x")}>
        <motion.div
          ref={trackRef}
          className={cn("flex w-max items-stretch", loops && "cursor-grab active:cursor-grabbing")}
          style={{ x, gap: GAP_PX }}
          drag={loops ? "x" : false}
          dragMomentum
          onDragStart={() => {
            isBusy.current = true;
            dragDistance.current = 0;
          }}
          onDrag={(_, info) => {
            dragDistance.current = Math.max(dragDistance.current, Math.abs(info.offset.x));
          }}
          onDragTransitionEnd={() => {
            x.set(wrap(x.get()));
            isBusy.current = false;
          }}
          // A drag shouldn't also open the card under the pointer.
          onClickCapture={(event: MouseEvent) => {
            if (dragDistance.current > DRAG_CLICK_THRESHOLD_PX) {
              event.preventDefault();
              event.stopPropagation();
              dragDistance.current = 0;
            }
          }}
        >
          {loops && (
            <div aria-hidden data-copy className="flex shrink-0 items-stretch" style={{ gap: GAP_PX }}>
              {slides(0)}
            </div>
          )}
          <div ref={setRef} className="flex shrink-0 items-stretch" style={{ gap: GAP_PX }}>
            {slides(1)}
          </div>
          {loops && (
            <div aria-hidden data-copy className="flex shrink-0 items-stretch" style={{ gap: GAP_PX }}>
              {slides(2)}
            </div>
          )}
        </motion.div>
      </div>

      {loops && (
        <>
          <button type="button" onClick={() => step(-1)} aria-label={previousLabel} className={cn(arrowStyles, "left-1 sm:-left-5")}>
            <ArrowLeft aria-hidden className="size-5" />
          </button>
          <button type="button" onClick={() => step(1)} aria-label={nextLabel} className={cn(arrowStyles, "right-1 sm:-right-5")}>
            <ArrowRight aria-hidden className="size-5" />
          </button>
        </>
      )}
    </section>
  );
}
