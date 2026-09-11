/** Contact page content and the enquiry form's wording. */
import type { EnquiryType, SectionContent } from "@/types/content";

export const enquiryTypes: EnquiryType[] = [
  {
    id: "general",
    label: "General Enquiry",
    shortLabel: "General",
    description: "Questions about the company, media or anything else.",
  },
  {
    id: "buyer",
    label: "Buyer Enquiry",
    shortLabel: "Buyer",
    description: "Pricing, availability and specifications for our product lines.",
  },
  {
    id: "supplier",
    label: "Supplier Enquiry",
    shortLabel: "Supplier",
    description: "Offer your products for our export or import lines.",
  },
  {
    id: "partnership",
    label: "Business Partnership",
    shortLabel: "Partnership",
    description: "Logistics, warehousing, inspection, finance or representation.",
  },
];

export const contactContent = {
  heading: {
    eyebrow: "Enquiry types",
    title: "Four ways to reach us.",
    description: "One trade desk — we route your message to the team best placed to help.",
  } satisfies SectionContent,
  details: {
    title: "Reach us directly",
    labels: { website: "Web", email: "Email", phone: "Phone", address: "Office" },
  },
  social: { title: "Follow us" },
  form: {
    title: "Send an enquiry",
    typeLabel: "Enquiry type",
    optional: "Optional",
    fields: {
      name: { label: "Full name", placeholder: "Your name" },
      company: { label: "Company", placeholder: "Company name" },
      email: { label: "Email", placeholder: "you@company.com" },
      phone: { label: "Phone", placeholder: "Include country code" },
      country: { label: "Country", placeholder: "Where you're based" },
      product: { label: "Product of interest", placeholder: "Select a product", other: "Other / not listed" },
      message: {
        label: "Message",
        placeholder: "Product, specification, quantity, packing and destination…",
      },
    },
    submit: "Send enquiry",
    submitting: "Sending…",
    success: {
      title: "Thank you — enquiry received.",
      description: "Our trade desk will review your message and get back to you.",
      again: "Send another enquiry",
    },
    errors: {
      invalid: "Please check the highlighted fields.",
      delivery: "We couldn't send your enquiry just now. Please try again shortly.",
      required: "This field is required.",
      email: "Enter a valid email address.",
      message: "Please add a few more details.",
      product: "Choose a product from the list.",
    },
  },
};
