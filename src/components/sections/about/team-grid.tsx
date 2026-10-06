import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { toParagraphs } from "@/components/sections/shared/prose";
import { IconTile } from "@/components/ui/icon";
import { LogoMark } from "@/components/ui/logo";
import { leadership } from "@/config";
import { cn } from "@/lib/cn";
import { getTeamMembers } from "@/lib/content/queries";
import { getInitials } from "@/lib/format";
import type { TeamMember } from "@/types/content";

/**
 * Leadership profile cards: a portrait (the admin photo, or a branded monogram
 * until one is uploaded), name and role, the opening paragraph, and the rest of
 * the profile behind "Read full profile".
 */
export async function TeamGrid({ className }: { className?: string }) {
  const { emptyState } = leadership;
  const members = await getTeamMembers();

  if (members.length === 0) {
    return (
      <Reveal className={className}>
        <div className="flex flex-col items-center justify-center gap-5 rounded-card border border-dashed border-fg/15 px-6 py-16 text-center">
          <IconTile icon="users" variant="soft" size="lg" />
          <p className="type-body text-fg-mute">{emptyState}</p>
        </div>
      </Reveal>
    );
  }

  return (
    <RevealGroup as="ul" className={cn("grid items-start gap-5 md:grid-cols-2 lg:grid-cols-3", className)}>
      {members.map((member) => (
        <RevealItem as="li" key={member.name} className="card-gradient overflow-hidden rounded-card bg-surface ring-1 ring-inset ring-border">
          <Portrait member={member} />
          <div className="p-6 sm:p-7">
            <h3 className="type-h3">{member.name}</h3>
            <p className="mt-1 text-[15px] font-semibold text-brand">{member.role}</p>
            {member.bio && <Bio text={member.bio} />}
          </div>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}

function Bio({ text }: { text: string }) {
  const [lead, ...rest] = toParagraphs(text);
  return (
    <div className="mt-4 text-[15px] leading-relaxed text-pretty text-fg-mute">
      <p>{lead}</p>
      {rest.length > 0 && (
        <details className="group mt-3">
          <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 text-sm font-semibold text-brand [&::-webkit-details-marker]:hidden">
            {leadership.readProfile}
            <ChevronDown aria-hidden className="size-4 transition-transform duration-300 group-open:rotate-180" />
          </summary>
          <div className="mt-3 space-y-3">
            {rest.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}

function Portrait({ member }: { member: TeamMember }) {
  if (member.photo) {
    return (
      <div className="relative aspect-[4/3] overflow-hidden bg-mist">
        <Image
          src={member.photo.src}
          alt={member.photo.alt}
          fill
          sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 90vw"
          className="object-cover object-top"
        />
      </div>
    );
  }
  return (
    <div data-tone="dark" aria-hidden className="deep-gradient relative isolate grid aspect-[4/3] place-items-center overflow-hidden">
      <div className="dot-grid absolute inset-0 -z-10 opacity-30 [mask-image:radial-gradient(ellipse_at_center,#000,transparent_75%)]" />
      <LogoMark className="absolute -right-6 -bottom-6 -z-10 h-32 w-auto text-white/[0.07]" />
      <span className="grid size-28 place-items-center rounded-full bg-white/10 font-display text-4xl font-bold tracking-wide text-white ring-1 ring-inset ring-white/20 backdrop-blur">
        {getInitials(member.name)}
      </span>
    </div>
  );
}
