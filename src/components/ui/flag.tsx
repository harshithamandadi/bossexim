import { cn } from "@/lib/cn";
import { toAlpha2 } from "@/lib/country-codes";

/**
 * A country's flag from /public/flags (flag-icons, MIT — see LICENSE.txt there).
 * `code` is the market's code (UAE, SGP…) or a two-letter ISO code.
 */
export function Flag({ code, className }: { code: string; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- tiny local SVGs; no optimisation needed
    <img
      src={`/flags/${toAlpha2(code).toLowerCase()}.svg`}
      alt=""
      aria-hidden
      loading="lazy"
      decoding="async"
      className={cn("aspect-[4/3] object-cover", className)}
    />
  );
}
