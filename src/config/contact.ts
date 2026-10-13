/**
 * Contact page content, the enquiry forms and the enquiry emails — from the
 * client's Contact Us and Partner With Us documents.
 */
import type {
  EnquiryField,
  EnquiryFieldDefinition,
  EnquiryFormSection,
  EnquiryType,
  EnquiryTypeId,
  SectionContent,
} from "@/types/content";

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
    description: "Looking to source a product — pricing, availability and specifications.",
  },
  {
    id: "supplier",
    label: "Supplier Enquiry",
    shortLabel: "Supplier",
    description: "Introduce your company, products and supply capability.",
  },
  {
    id: "partnership",
    label: "Business Partnership",
    shortLabel: "Partnership",
    description: "Logistics, warehousing, inspection, finance or representation.",
  },
];

/**
 * Attachment rules: specifications, licences, certificates, CoA or photos.
 * The total stays under 4 MB because hosts such as Vercel refuse requests over 4.5 MB.
 */
export const ATTACHMENT_LIMITS = {
  maxFiles: 3,
  maxTotalMegabytes: 4,
  accept: ".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx,.xls,.xlsx",
  mimeTypes: [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ],
};

/** Every field's default label, placeholder and kind; forms below may override the wording. */
export const enquiryFieldDefinitions: Record<EnquiryField, EnquiryFieldDefinition> = {
  name: { kind: "text", label: "Full name", placeholder: "Your name", autoComplete: "name" },
  company: { kind: "text", label: "Company (legal name)", placeholder: "Registered company name", autoComplete: "organization" },
  email: { kind: "email", label: "Business email", placeholder: "you@company.com", autoComplete: "email" },
  phone: { kind: "tel", label: "Phone / WhatsApp", placeholder: "Include country code", autoComplete: "tel" },
  country: { kind: "text", label: "Country", placeholder: "Where your company is based", autoComplete: "country-name" },
  website: { kind: "url", label: "Company website", placeholder: "www.company.com", autoComplete: "url" },
  registration: {
    kind: "text",
    label: "Registration details",
    placeholder: "e.g. trade licence, VAT or import licence number",
  },
  designation: {
    kind: "select",
    label: "Designation",
    placeholder: "Select your role",
    options: [
      "Owner",
      "Director",
      "CEO",
      "Procurement Manager",
      "Purchasing Manager",
      "Import Manager",
      "Sourcing Manager",
      "Sales / Export Manager",
      "Other",
    ],
  },
  product: { kind: "product", label: "Product", placeholder: "Select a product" },
  grade: { kind: "text", label: "Grade / specification", placeholder: "e.g. 1121 Basmati, Sortexed" },
  quantity: { kind: "text", label: "Quantity", placeholder: "e.g. 25 MT or 1 × 20' container" },
  frequency: {
    kind: "select",
    label: "Purchase frequency",
    placeholder: "Select frequency",
    options: ["One-time purchase", "Monthly", "Quarterly", "Half-yearly", "As required"],
  },
  destinationCountry: { kind: "text", label: "Destination country", placeholder: "Where the goods are going" },
  destinationPort: { kind: "text", label: "Destination port", placeholder: "e.g. Jebel Ali, UAE" },
  deliveryDate: { kind: "date", label: "Required delivery date" },
  incoterm: {
    kind: "select",
    label: "Preferred Incoterm",
    placeholder: "Select an Incoterm",
    options: ["FOB", "CFR", "CIF", "Not sure"],
  },
  paymentMethod: {
    kind: "select",
    label: "Preferred payment method",
    placeholder: "Select a method",
    options: ["Letter of Credit (LC)", "Advance payment (TT)", "Cash against documents (CAD)", "To be discussed"],
  },
  originCountry: { kind: "text", label: "Country of origin", placeholder: "Where the goods are produced" },
  capacity: { kind: "text", label: "Monthly capacity", placeholder: "e.g. 100 MT per month" },
  moq: { kind: "text", label: "Minimum order quantity (MOQ)", placeholder: "e.g. 1 × 20' container" },
  packaging: { kind: "text", label: "Packaging", placeholder: "e.g. 25 kg PP bags" },
  loadingPort: { kind: "text", label: "Loading port", placeholder: "e.g. Mundra, India" },
  indicativePrice: { kind: "text", label: "Indicative price", placeholder: "e.g. USD 950 / MT FOB" },
  paymentTerms: { kind: "text", label: "Payment terms", placeholder: "e.g. 30% advance, balance against documents" },
  partnershipArea: {
    kind: "select",
    label: "Partnership area",
    placeholder: "Select an area",
    options: [
      "Logistics / freight forwarding",
      "Shipping company",
      "Warehouse",
      "Inspection agency",
      "Testing laboratory",
      "Financial institution / trade finance",
      "Customs support",
      "Overseas representative",
      "Other",
    ],
  },
  marketsCovered: { kind: "text", label: "Markets covered", placeholder: "Countries or regions you serve" },
  services: { kind: "textarea", label: "Services offered", placeholder: "What your company provides…" },
  licences: { kind: "text", label: "Licences & certifications", placeholder: "e.g. ISO 9001, FMC licence" },
  experience: { kind: "text", label: "Years of experience", placeholder: "e.g. 12 years" },
  message: { kind: "textarea", label: "Message", placeholder: "Tell us more…" },
  attachments: {
    kind: "files",
    label: "Supporting documents",
    placeholder: `Up to ${ATTACHMENT_LIMITS.maxFiles} files, ${ATTACHMENT_LIMITS.maxTotalMegabytes} MB in total — PDF, image, Word or Excel`,
  },
};

const companySection = (extra: EnquiryFormSection["fields"] = []): EnquiryFormSection => ({
  title: "Company",
  fields: [
    { name: "company", required: true },
    { name: "country", required: true },
    { name: "website" },
    ...extra,
  ],
});

const contactSection = (phoneRequired: boolean): EnquiryFormSection => ({
  title: "Contact Person",
  fields: [
    { name: "name", required: true },
    { name: "designation" },
    { name: "email", required: true },
    { name: "phone", required: phoneRequired },
  ],
});

/**
 * The sections and fields each enquiry type asks for. Fields sit in a
 * two-column grid; a field left alone on its row, and text areas and uploads,
 * span both columns. DRAFT — confirm the fields with the client.
 */
export const enquiryForms: Record<EnquiryTypeId, EnquiryFormSection[]> = {
  general: [
    {
      title: "Your Details",
      fields: [
        { name: "name", required: true },
        { name: "email", required: true, label: "Email" },
        { name: "phone" },
        { name: "company", label: "Company" },
        { name: "country" },
      ],
    },
    {
      title: "Your Message",
      fields: [{ name: "message", required: true, label: "How can we help?", placeholder: "Your question or message…" }],
    },
  ],
  buyer: [
    companySection([{ name: "registration" }]),
    contactSection(true),
    {
      title: "Your Requirement",
      fields: [
        { name: "product", required: true, label: "Product required" },
        { name: "grade" },
        { name: "quantity", required: true, label: "Quantity required" },
        { name: "frequency" },
        { name: "destinationCountry", required: true },
        { name: "destinationPort" },
        { name: "deliveryDate" },
        { name: "incoterm" },
        { name: "paymentMethod" },
        {
          name: "message",
          label: "Anything else we should know?",
          placeholder: "Packaging, documentation, quality expectations…",
        },
      ],
    },
    {
      title: "Documents (Optional)",
      fields: [
        {
          name: "attachments",
          label: "Product specification, import licence or other business documents",
        },
      ],
    },
  ],
  supplier: [
    companySection([{ name: "registration" }]),
    contactSection(true),
    {
      title: "What You Supply",
      fields: [
        { name: "product", required: true, label: "Product you supply" },
        { name: "grade" },
        { name: "originCountry", required: true },
        { name: "capacity" },
        { name: "moq" },
        { name: "packaging" },
        { name: "loadingPort" },
        { name: "indicativePrice" },
        { name: "paymentTerms" },
        { name: "message", label: "Anything else we should know?", placeholder: "Certifications, lead times, experience…" },
      ],
    },
    {
      title: "Documents (Optional)",
      fields: [{ name: "attachments", label: "Company profile, specifications, certificates, CoA or product photos" }],
    },
  ],
  partnership: [
    companySection([{ name: "experience" }, { name: "licences" }]),
    contactSection(false),
    {
      title: "Partnership",
      fields: [
        { name: "partnershipArea", required: true },
        { name: "marketsCovered" },
        { name: "services" },
        {
          name: "message",
          required: true,
          label: "How would you like to work together?",
          placeholder: "Tell us about your company and the partnership you have in mind…",
        },
      ],
    },
    {
      title: "Documents (Optional)",
      fields: [{ name: "attachments", label: "Company profile, licences or certifications" }],
    },
  ],
};

export const contactContent = {
  heading: {
    eyebrow: "Enquiry routes",
    title: "Four Ways to Reach Us",
    description:
      "Contact us through four dedicated enquiry routes: General Enquiry, Buyer Enquiry, Supplier Enquiry and Business Partnership. Each form is designed to collect important company and transaction information so that our team can conduct basic background work before responding.",
  } satisfies SectionContent,
  details: {
    title: "Reach Us Directly",
    labels: { website: "Web", email: "Email", phone: "Phone", address: "Office" },
    pendingNote: "Phone, WhatsApp, office hours and map details will be added once finalised.",
  },
  social: { title: "Follow Us" },
  form: {
    title: "Send an Enquiry",
    typeLabel: "Enquiry type",
    optional: "Optional",
    otherProduct: "Other / not listed",
    otherGroup: "Something else",
    searchProduct: "Search products…",
    noProductMatch: "No match — choose “Other / not listed”.",
    submit: "Send enquiry",
    submitting: "Sending…",
    privacyNote:
      "We use your details only for internal business evaluation and to reply to your enquiry. Submitting a form does not create a commercial commitment.",
    files: { choose: "Choose files", remove: "Remove", selected: "selected" },
    success: {
      title: "Thank You — Enquiry Received",
      description: "Our trade desk will review your requirement and contact you if a suitable opportunity is identified.",
      reference: "Your reference",
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
      phone: "Enter a phone number with its country code.",
      url: "Enter a website address, e.g. www.company.com.",
      date: "Choose a valid date.",
      option: "Choose an option from the list.",
      message: "Please add a few more details.",
      product: "Choose a product from the list.",
      files: `Attach up to ${ATTACHMENT_LIMITS.maxFiles} files, ${ATTACHMENT_LIMITS.maxTotalMegabytes} MB in total — PDF, image, Word or Excel. Larger files can be shared by email once our team replies.`,
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
    attachments: "Attachments",
    attachmentsHint: "Open the enquiry in the admin to download them.",
    submitted: "Submitted",
    sentFrom: "Sent from",
    reference: "Reference",
  },
  acknowledgement: {
    subject: "We've received your enquiry",
    greeting: "Hello",
    body: "Thank you for contacting BOSS EXIM Global. Our team has received your",
    about: "about",
    reference: "Your reference is",
    closing:
      "Every enquiry is reviewed by our team before further discussion, and we will contact you regarding availability, specifications, pricing and next steps. If you'd like to add anything, simply reply to this email.",
    signOff: "Kind regards,",
  },
};
