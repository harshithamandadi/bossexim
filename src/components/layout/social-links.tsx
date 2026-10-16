import { Chip } from "@/components/ui/chip";
import { cn } from "@/lib/cn";
import type { SocialLink } from "@/types/content";

/** Social profiles (set in the admin, Settings → Company details). Profiles without a link are hidden. */
export function SocialLinks({ links, className }: { links: SocialLink[]; className?: string }) {
  // Only profiles with a link (client request: no "coming soon" placeholders).
  const live = links.filter((link) => link.href);
  if (live.length === 0) return null;
  return (
    <ul className={cn("flex flex-wrap gap-2", className)}>
      {live.map(({ platform, href }) => (
        <li key={platform}>
          <a href={href} target="_blank" rel="noopener noreferrer" className="group">
            <Chip variant="outline" className="px-3 py-1.5 text-[13px] whitespace-nowrap transition-colors group-hover:text-fg group-hover:ring-fg/30">
              {platform}
            </Chip>
          </a>
        </li>
      ))}
    </ul>
  );
}
