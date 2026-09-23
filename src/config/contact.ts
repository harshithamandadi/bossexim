/** Contact page content, the enquiry form's fields and wording, and the enquiry emails. */
import type { EnquiryFieldConfig, EnquiryTypeId, EnquiryType, SectionContent } from "@/types/content";

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

/** Choices for "Partnership area" on partnership enquiries. */
export const partnershipAreas = [
  "Logistics & shipping",
  "Warehousing",
  "Inspection & certification",
  "Trade finance",
  "Overseas representation",
  "Other",
];

/**
 * The fields each enquiry type asks for, in order. Fields fill a two-column
 * grid; a field left alone on its row spans both columns, and the message
 * always comes last. DRAFT — confirm the fields with the client.
 */
export const enquiryFormFields: Record<EnquiryTypeId, EnquiryFieldConfig[]> = {
  general: [
    { name: "name", required: true },
    { name: "email", required: true },
    { name: "company" },
    { name: "phone" },
    { name: "country" },
    { name: "message", required: true, placeholder: "How can we help?" },
  ],
  buyer: [
    { name: "name", required: true },
    { name: "company", required: true },
    { name: "email", required: true },
    { name: "phone" },
    { name: "product", required: true },
    { name: "quantity", label: "Quantity required", placeholder: "e.g. 25 MT per month" },
    { name: "country", label: "Destination country or port", placeholder: "e.g. Jebel Ali, UAE" },
    {
      name: "message",
      required: true,
      placeholder: "Grade or specification, packing, delivery terms and timeline…",
    },
  ],
  supplier: [
    { name: "name", required: true },
    { name: "company", required: true },
    { name: "email", required: true },
    { name: "phone" },
    { name: "product", required: true, label: "Product you supply" },
    { name: "quantity", label: "Supply capacity", placeholder: "e.g. 100 MT per month" },
    { name: "country", label: "Country of origin", placeholder: "Where the goods are produced" },
    {
      name: "message",
      required: true,
      placeholder: "Grades, certifications, packing and lead times…",
    },
  ],
  partnership: [
    { name: "name", required: true },
    { name: "company", required: true },
    { name: "email", required: true },
    { name: "phone" },
    { name: "partnershipArea", required: true },
    { name: "country", placeholder: "Where you operate" },
    {
      name: "message",
      required: true,
      placeholder: "Tell us about your company and how you'd like to work together…",
    },
  ],
};

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
    /** Default label and placeholder for each field; enquiry types may override them. */
    fields: {
      name: { label: "Full name", placeholder: "Your name" },
      company: { label: "Company", placeholder: "Company name" },
      email: { label: "Email", placeholder: "you@company.com" },
      phone: { label: "Phone", placeholder: "Include country code" },
      country: { label: "Country", placeholder: "Where you're based" },
      product: { label: "Product of interest", placeholder: "Select a product", other: "Other / not listed" },
      quantity: { label: "Quantity", placeholder: "e.g. 25 MT" },
      partnershipArea: { label: "Partnership area", placeholder: "Select an area" },
      message: { label: "Message", placeholder: "Tell us more…" },
    },
    submit: "Send enquiry",
    submitting: "Sending…",
    privacyNote: "We use your details only to reply to your enquiry.",
    success: {
      title: "Thank you — enquiry received.",
      description: "Our trade desk will review your message and get back to you.",
      again: "Send another enquiry",
    },
    errors: {
      invalid: "Please check the highlighted fields.",
      delivery: "We couldn't send your enquiry just now. Please try again shortly.",
      tooFast: "That was quick! Please check your details, then send your enquiry again.",
      expired: "This form has expired. Please reload the page and send your enquiry again.",
      rateLimited: "You've sent several enquiries in a short time. Please wait a few minutes and try again.",
      emailFallback: "You can also email us at",
      required: "This field is required.",
      email: "Enter a valid email address.",
      message: "Please add a few more details.",
      product: "Choose a product from the list.",
      partnershipArea: "Choose an area from the list.",
    },
  },
};

/** Wording for the emails sent when an enquiry arrives. */
export const enquiryEmails = {
  notification: {
    subjectPrefix: "New",
    intro: "A new enquiry was sent from the website.",
    replyHint: "Reply to this email to answer the enquirer directly.",
    viewInAdmin: "View in the admin",
    submitted: "Submitted",
    sentFrom: "Sent from",
  },
  acknowledgement: {
    subject: "We've received your enquiry",
    greeting: "Hello",
    body: "Thank you for contacting us. Our trade desk has received your",
    about: "about",
    closing: "We'll review it and get back to you soon. If you'd like to add anything, simply reply to this email.",
    signOff: "Kind regards,",
  },
};
