import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { contactHref, enquiryTypes } from "@/config";

/** Each enquiry type pre-selects itself in the form below. */
export function EnquiryTypeList() {
  return (
    <RevealGroup as="ul" interval={0.05} className="divide-y divide-border border-y border-border">
      {enquiryTypes.map((type) => (
        <RevealItem as="li" key={type.id}>
          <Link href={contactHref({ type: type.id })} className="group flex items-center justify-between gap-6 py-5">
            <span>
              <span className="block font-medium">{type.label}</span>
              <span className="mt-1 block text-sm text-fg-mute">{type.description}</span>
            </span>
            <ArrowRight
              aria-hidden
              className="size-4 shrink-0 text-fg-mute transition-[color,transform] duration-300 group-hover:translate-x-1 group-hover:text-fg"
            />
          </Link>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
