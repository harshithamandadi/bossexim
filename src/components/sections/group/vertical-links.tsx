import { Carousel } from "@/components/ui/carousel";
import { PhotoTitleCard } from "@/components/ui/photo-title-card";
import { containerLine, groupVerticalHref, groupVerticals, uiLabels, type GroupVertical, type GroupVerticalSlug } from "@/config";
import type { IconName } from "@/lib/icons";

/** Icons for verticals that have no photographs yet. */
const VERTICAL_ICONS: Record<GroupVerticalSlug, IconName> = {
  "container-line": "ship",
  retail: "store",
  constructions: "building",
  hospitality: "hotel",
  laundromats: "washing-machine",
  it: "cpu",
  bpo: "headset",
};

const verticalPhoto = (vertical: GroupVertical) =>
  vertical.slug === "container-line" ? containerLine.image : vertical.photos?.[0];

/** Links to the other BOSS Group verticals — standard-size cards with a photo and the vertical's name. */
export function VerticalLinks({ current, title, className }: { current?: GroupVerticalSlug; title: string; className?: string }) {
  const others = groupVerticals.filter((vertical) => vertical.slug !== current);

  return (
    <div className={className}>
      <h2 className="type-h3">{title}</h2>
      <Carousel
        className="mt-4"
        label={title}
        previousLabel={uiLabels.previous}
        nextLabel={uiLabels.next}
        slideWidth="16rem"
        items={others.map((vertical) => (
          <PhotoTitleCard
            key={vertical.slug}
            href={groupVerticalHref(vertical.slug)}
            title={vertical.name}
            photo={verticalPhoto(vertical)}
            icon={VERTICAL_ICONS[vertical.slug]}
          />
        ))}
      />
    </div>
  );
}
