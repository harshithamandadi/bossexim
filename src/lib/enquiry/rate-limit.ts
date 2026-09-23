/**
 * Limits how many enquiries one visitor (by IP address) can send in a short
 * time. Kept in memory: it resets when the server restarts and is per-instance
 * on serverless hosts — a speed bump for abuse, alongside the honeypot and the
 * form token, not a guarantee.
 */
import "server-only";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const PRUNE_ABOVE_KEYS = 5000;

const sentAt = new Map<string, number[]>();

/** Records an attempt for `key` and reports whether it is over the limit. */
export function isRateLimited(key: string, now = Date.now()): boolean {
  const recent = (sentAt.get(key) ?? []).filter((time) => now - time < WINDOW_MS);
  const limited = recent.length >= MAX_PER_WINDOW;
  if (!limited) recent.push(now);
  sentAt.set(key, recent);

  if (sentAt.size > PRUNE_ABOVE_KEYS) {
    for (const [otherKey, times] of sentAt) {
      if (times.every((time) => now - time >= WINDOW_MS)) sentAt.delete(otherKey);
    }
  }
  return limited;
}
