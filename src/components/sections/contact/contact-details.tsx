import { PendingValue } from "@/components/ui/pending-value";
import { contactContent, siteConfig, uiLabels } from "@/config";
import type { ContactInfo } from "@/types/content";

/** Web, email, phone and office — each shows "To be added" until set in the admin. */
export function ContactDetails({ contact }: { contact: ContactInfo }) {
  const { url } = siteConfig;
  const { title, labels } = contactContent.details;

  const rows = [
    { label: labels.website, value: contact.website, href: url },
    { label: labels.email, value: contact.email, href: contact.email ? `mailto:${contact.email}` : undefined },
    { label: labels.phone, value: contact.phone, href: contact.phone ? `tel:${contact.phone.replace(/[^\d+]/g, "")}` : undefined },
    { label: labels.address, value: contact.address },
  ];

  return (
    <div>
      <h3 className="type-h4">{title}</h3>
      <dl className="mt-5 space-y-3">
        {rows.map((row) => (
          <div key={row.label} className="grid grid-cols-[5rem_minmax(0,1fr)] gap-4 text-[15px]">
            <dt className="text-fg-mute">{row.label}</dt>
            <dd>
              <PendingValue value={row.value} href={row.href} fallback={uiLabels.pending} />
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
