import Image from "next/image";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { IconTile } from "@/components/ui/icon";
import { leadership } from "@/config";
import { cn } from "@/lib/cn";
import { getTeamMembers } from "@/lib/content/queries";
import { getInitials } from "@/lib/format";
import type { TeamMember } from "@/types/content";

const AVATAR_SIZE = 80;

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
    <RevealGroup as="ul" className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {members.map((member) => (
        <RevealItem as="li" key={member.name}>
          <article className="h-full rounded-card bg-surface p-7 sm:p-8">
            <Avatar member={member} />
            <h3 className="type-h4 mt-6">{member.name}</h3>
            <p className="text-sm font-medium text-brand">{member.role}</p>
            {member.bio && <p className="mt-4 text-[15px] leading-relaxed text-fg-mute">{member.bio}</p>}
          </article>
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
        className="size-20 rounded-full object-cover"
      />
    );
  }
  return (
    <span aria-hidden className="type-h4 grid size-20 place-items-center rounded-full bg-fg text-canvas">
      {getInitials(member.name)}
    </span>
  );
}
