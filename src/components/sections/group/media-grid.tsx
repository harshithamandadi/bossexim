import { PhotoSlider } from "@/components/ui/photo-slider";
import { mediaEvents, toAnchorId } from "@/config";
import { getGalleries } from "@/lib/content/queries";

/**
 * Media & Events: one gliding, zoomable row of photos per gallery (galleries are managed in
 * the admin, Website content → Galleries). The cover-tile grid was removed (client request).
 */
export async function MediaGrid({ className }: { className?: string }) {
  const galleries = (await getGalleries()).filter((gallery) => gallery.images.length > 0);

  return (
    <div className={className}>
      <div className="space-y-10">
        {galleries.map((gallery, index) => (
          <section key={gallery.title} id={toAnchorId(gallery.title)} className="scroll-mt-32">
            <h3 className="type-h4">{gallery.title}</h3>
            <PhotoSlider photos={gallery.images} label={gallery.title} reverse={index % 2 === 1} speed={0.9} className="mt-2" />
          </section>
        ))}
      </div>
      {galleries.length === 0 && <p className="type-body text-fg-mute">{mediaEvents.emptyLabel}</p>}
    </div>
  );
}
