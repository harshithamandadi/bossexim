/**
 * Limits how many enquiries (or brochures) one visitor, by IP address, can
 * request in a short time. Kept in memory: it resets when the server restarts
 * and is per-instance on serverless hosts — a speed bump for abuse, alongside
 * the honeypot and the form token, not a guarantee.
 */
import "server-only";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const PRUNE_ABOVE_KEYS = 5000;

const sentAt = new Map<string, number[]>();

/** Best-effort visitor address; set by the hosting platform's proxy. */
export function clientAddress(headers: Headers): string {
  return headers.get("x-forwarded-for")?.split(",")[0]?.trim() || headers.get("x-real-ip") || "unknown";
}

/** Records an attempt for `key` and reports whether it is over the limit (`max` per 10 minutes). */
export function isRateLimited(key: string, max = MAX_PER_WINDOW, now = Date.now()): boolean {
  const recent = (sentAt.get(key) ?? []).filter((time) => now - time < WINDOW_MS);
  const limited = recent.length >= max;
  if (!limited) recent.push(now);
  sentAt.set(key, recent);

  if (sentAt.size > PRUNE_ABOVE_KEYS) {
    for (const [otherKey, times] of sentAt) {
      if (times.every((time) => now - time >= WINDOW_MS)) sentAt.delete(otherKey);
    }
  }
  return limited;
}
