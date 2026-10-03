import { cn } from "@/lib/cn";

/**
 * A country's flag from /public/flags (flag-icons, MIT — see LICENSE.txt there).
 * `code` is the two-letter ISO country code, as entered for each market in the admin.
 */
export function Flag({ code, className }: { code: string; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- tiny local SVGs; no optimisation needed
    <img
      src={`/flags/${code.toLowerCase()}.svg`}
      alt=""
      aria-hidden
      loading="lazy"
      decoding="async"
      className={cn("aspect-[4/3] object-cover", className)}
    />
  );
}
