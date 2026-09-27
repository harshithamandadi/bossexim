import Image from "next/image";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { toParagraphs } from "@/components/sections/shared/prose";
import { IconTile } from "@/components/ui/icon";
import { leadership } from "@/config";
import { cn } from "@/lib/cn";
import { getTeamMembers } from "@/lib/content/queries";
import { getInitials } from "@/lib/format";
import type { TeamMember } from "@/types/content";

const AVATAR_SIZE = 96;

/** Leadership profiles: name and role beside the full profile. */
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
    <RevealGroup as="ul" className={cn("divide-y divide-border border-y border-border", className)}>
      {members.map((member) => (
        <RevealItem
          as="li"
          key={member.name}
          className="grid gap-6 py-10 md:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] md:gap-12 lg:py-12"
        >
          <div className="flex items-center gap-5 md:flex-col md:items-start">
            <Avatar member={member} />
            <div>
              <h3 className="type-h3">{member.name}</h3>
              <p className="mt-1 text-[15px] font-semibold text-brand">{member.role}</p>
            </div>
          </div>
          {member.bio && (
            <div className="max-w-2xl space-y-4">
              {toParagraphs(member.bio).map((paragraph) => (
                <p key={paragraph} className="type-body text-pretty text-fg-mute">
                  {paragraph}
                </p>
              ))}
            </div>
          )}
        </RevealItem>
      ))}
    </RevealGroup>
  );
}

function Avatar({ member }: { member: TeamMember }) {
  if (member.photo) {
    return (
      <Image
        src={member.photo.src}
        alt={member.photo.alt}
        width={AVATAR_SIZE}
        height={AVATAR_SIZE}
        className="size-20 shrink-0 rounded-full object-cover md:size-24"
      />
    );
  }
  return (
    <span aria-hidden className="type-h3 grid size-20 shrink-0 place-items-center rounded-full bg-navy text-white md:size-24">
      {getInitials(member.name)}
    </span>
  );
}
