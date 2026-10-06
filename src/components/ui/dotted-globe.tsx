"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";
import { WORLD_DOTS } from "@/lib/world-dots";

/** Degrees per second: one turn every 40 seconds. */
const SPIN_SPEED = 9;
/** Starts with India facing the viewer. */
const START_LONGITUDE = 78;
const TILT_DEGREES = 12;
const HIGHLIGHT = { lon: 78.5, lat: 17.4 };
const RADIANS = Math.PI / 180;

interface DottedGlobeProps {
  /** Pauses the spin, e.g. while the globe is off-screen. */
  paused?: boolean;
  className?: string;
}

/**
 * A slowly rotating globe drawn as land dots on a canvas (orthographic
 * projection). Dots on the far side are hidden, and dots fade towards the edge
 * so the sphere reads as round. Static for visitors who prefer reduced motion.
 */
export function DottedGlobe({ paused = false, className }: DottedGlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotationRef = useRef(START_LONGITUDE);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const tiltSin = Math.sin(TILT_DEGREES * RADIANS);
    const tiltCos = Math.cos(TILT_DEGREES * RADIANS);
    let frame = 0;
    let last = performance.now();

    function draw(now: number) {
      if (!canvas || !context) return;
      const size = canvas.clientWidth;
      const ratio = window.devicePixelRatio || 1;
      if (canvas.width !== Math.round(size * ratio)) {
        canvas.width = Math.round(size * ratio);
        canvas.height = Math.round(size * ratio);
      }
      const seconds = Math.min((now - last) / 1000, 0.1);
      last = now;
      if (!paused && !reduceMotion) rotationRef.current = (rotationRef.current + SPIN_SPEED * seconds) % 360;

      const radius = (canvas.width / 2) * 0.96;
      const centre = canvas.width / 2;
      // Large enough for neighbouring dots to almost touch, so continents read clearly.
      const dotRadius = Math.max(canvas.width / 150, 1.2);
      context.clearRect(0, 0, canvas.width, canvas.height);

      const project = (lon: number, lat: number) => {
        const lambda = (lon - rotationRef.current) * RADIANS;
        const phi = lat * RADIANS;
        const x = Math.cos(phi) * Math.sin(lambda);
        const y = Math.sin(phi);
        const z = Math.cos(phi) * Math.cos(lambda);
        // Tilt the axis towards the viewer so the northern hemisphere shows more.
        const yTilted = y * tiltCos - z * tiltSin;
        const zTilted = y * tiltSin + z * tiltCos;
        return { x: centre + x * radius, y: centre - yTilted * radius, depth: zTilted };
      };

      for (const [lon, lat] of WORLD_DOTS) {
        const point = project(lon, lat);
        if (point.depth <= 0) continue;
        context.globalAlpha = 0.45 + point.depth * 0.55;
        context.fillStyle = "#ffffff";
        context.beginPath();
        context.arc(point.x, point.y, dotRadius, 0, Math.PI * 2);
        context.fill();
      }

      const home = project(HIGHLIGHT.lon, HIGHLIGHT.lat);
      if (home.depth > 0) {
        const pulse = (now / 1600) % 1;
        context.globalAlpha = (1 - pulse) * 0.7;
        context.strokeStyle = "#f2b34b";
        context.lineWidth = dotRadius * 0.8;
        context.beginPath();
        context.arc(home.x, home.y, dotRadius * (2 + pulse * 6), 0, Math.PI * 2);
        context.stroke();
        context.globalAlpha = 1;
        context.fillStyle = "#f2b34b";
        context.beginPath();
        context.arc(home.x, home.y, dotRadius * 2, 0, Math.PI * 2);
        context.fill();
      }
      context.globalAlpha = 1;

      if (!reduceMotion && !paused) frame = requestAnimationFrame(draw);
    }

    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [paused, reduceMotion]);

  return <canvas ref={canvasRef} aria-hidden className={className} />;
}
