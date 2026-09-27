/**
 * Aira, the website assistant — from the client's "Chat bot work flow" document.
 * Guided paths (Products, Buying Enquiry, Company Information) are scripted here;
 * free-text questions are answered from faq.ts, so editing the FAQs teaches her.
 * No AI service is involved: every answer is written in advance.
 */
import { contactHref } from "./routes";

/** One question in the buying-enquiry wizard. Answers are stored under `id`. */
export interface BuyingStep {
  id: BuyingStepId;
  /** Shown in the summary and the team's email. */
  label: string;
  question: string;
  /** How the answer is typed; "choice" offers buttons (typing is still allowed). */
  input: "product" | "choice" | "text" | "email" | "tel" | "url";
  placeholder?: string;
  options?: string[];
  /** Buttons that fill in a typical answer, e.g. "25 MT". */
  examples?: string[];
  /** Offers a "Skip" button and allows moving on without an answer. */
  optional?: boolean;
  /** Said after particular answers, e.g. reassurance after "Not sure". */
  followUps?: Record<string, string>;
  /** Asked only when another answer has this value. */
  askWhen?: { step: BuyingStepId; equals: string };
}

export type BuyingStepId =
  | "product"
  | "productOther"
  | "quantity"
  | "grade"
  | "packaging"
  | "destinationCountry"
  | "destinationPort"
  | "incoterm"
  | "frequency"
  | "importing"
  | "indianSupplier"
  | "company"
  | "website"
  | "country"
  | "designation"
  | "name"
  | "email"
  | "phone"
  | "documentation"
  | "ownSpecification"
  | "quotation";

/** The value the product step stores when the visitor picks "Other product". */
export const OTHER_PRODUCT_ANSWER = "other";

const NEED_ASSISTANCE = "I need assistance";
const NOT_SURE_INCOTERM = "Not sure";

export const buyingSteps: BuyingStep[] = [
  { id: "product", label: "Product", question: "Which product would you like to purchase?", input: "product" },
  {
    id: "productOther",
    label: "Product requested",
    question: "Which product are you looking for?",
    input: "text",
    placeholder: "Product name",
    askWhen: { step: "product", equals: OTHER_PRODUCT_ANSWER },
  },
  {
    id: "quantity",
    label: "Quantity",
    question: "What quantity do you require?",
    input: "text",
    placeholder: "e.g. 25 MT",
    examples: ["5 MT", "10 MT", "25 MT", "1 × 20' container", "1 × 40' container"],
  },
  {
    id: "grade",
    label: "Grade / specification",
    question:
      "What specification or grade do you require? If you don't have one, choose “I need assistance” and our export team can discuss suitable options with you.",
    input: "text",
    placeholder: "Grade or specification",
    examples: [NEED_ASSISTANCE],
  },
  {
    id: "packaging",
    label: "Packaging",
    question: "What packaging do you require? Please specify your preferred packaging, if known.",
    input: "text",
    placeholder: "e.g. 25 kg PP bags",
    optional: true,
  },
  {
    id: "destinationCountry",
    label: "Destination country",
    question: "What is your destination country — where do you intend to import the goods?",
    input: "text",
    placeholder: "Country",
  },
  {
    id: "destinationPort",
    label: "Destination port",
    question: "What is your destination port? For example: Jebel Ali, UAE · Hamburg, Germany · Port Klang, Malaysia.",
    input: "text",
    placeholder: "Port",
    optional: true,
  },
  {
    id: "incoterm",
    label: "Incoterm",
    question: "Which Incoterm are you looking for?",
    input: "choice",
    options: ["FOB", "CFR", "CIF", NOT_SURE_INCOTERM, "Other"],
    followUps: {
      [NOT_SURE_INCOTERM]: "No problem. Our export team can discuss the appropriate Incoterm based on your shipment requirements.",
    },
  },
  {
    id: "frequency",
    label: "Purchase frequency",
    question: "How frequently do you expect to purchase this product?",
    input: "choice",
    options: ["One-time purchase", "Monthly", "Quarterly", "Half-yearly", "As required"],
  },
  {
    id: "importing",
    label: "Currently importing",
    question: "Are you currently importing this product?",
    input: "choice",
    options: ["Yes, regularly", "Yes, occasionally", "No, this is our first import", "We are currently evaluating suppliers"],
  },
  {
    id: "indianSupplier",
    label: "Existing Indian supplier",
    question: "Do you currently have an Indian supplier?",
    input: "choice",
    options: ["Yes", "No", "Looking for an additional supplier", "Looking for a new supplier"],
  },
  {
    id: "company",
    label: "Company",
    question: "Thanks! A few details about your company. What is your company name?",
    input: "text",
    placeholder: "Company name",
  },
  {
    id: "website",
    label: "Website",
    question: "What is your company website, if available?",
    input: "url",
    placeholder: "www.company.com",
    optional: true,
  },
  {
    id: "country",
    label: "Company country",
    question: "What country is your company based in?",
    input: "text",
    placeholder: "Country",
  },
  {
    id: "designation",
    label: "Designation",
    question: "What is your position / designation?",
    input: "choice",
    options: [
      "Owner",
      "Director",
      "CEO",
      "Procurement Manager",
      "Purchasing Manager",
      "Import Manager",
      "Sourcing Manager",
      "Other",
    ],
  },
  { id: "name", label: "Name", question: "What is your full name?", input: "text", placeholder: "Full name" },
  {
    id: "email",
    label: "Email",
    question: "What is your business email address?",
    input: "email",
    placeholder: "you@company.com",
  },
  {
    id: "phone",
    label: "WhatsApp / phone",
    question: "What is your WhatsApp / telephone number? Please include the country code.",
    input: "tel",
    placeholder: "+971 …",
  },
  {
    id: "documentation",
    label: "Documentation requirements",
    question: "Do you have any specific documentation requirements?",
    input: "choice",
    options: [
      "No specific requirement",
      "Certificate of Origin",
      "Inspection Certificate",
      "Product-specific certificate",
      "Phytosanitary Certificate",
      "Other",
      "Not sure",
    ],
    followUps: {
      "*": "Documentation depends on the product, destination country and agreed transaction requirements. Our export team can confirm the applicable documents for your shipment.",
    },
  },
  {
    id: "ownSpecification",
    label: "Own specification",
    question: "Do you have your own product specification?",
    input: "choice",
    options: ["Yes, I can share it", "No", "I need help preparing the specification"],
    followUps: {
      "Yes, I can share it":
        "Great — please share your specification with our export team when they contact you, or attach it through the buyer enquiry form.",
    },
  },
  {
    id: "quotation",
    label: "Quotation requested",
    question: "Would you like to receive a quotation?",
    input: "choice",
    options: ["Yes — Request Quotation", "No — Continue Browsing"],
  },
];

export const chatbotContent = {
  name: "Aira",
  dialogLabel: "Aira, the BOSS Global EXIM assistant",
  launcher: {
    label: "Chat with Aira",
    open: "Open the website assistant",
    close: "Close the website assistant",
  },
  title: "Aira",
  subtitle: "BOSS Global EXIM trade assistant",
  greeting:
    "👋 Welcome to BOSS Global EXIM. We help international buyers source quality products from India.\n\nHow can we assist you today?",
  menu: {
    products: "🌾 Products",
    buying: "📦 Buying Enquiry",
    company: "🏢 Company Information",
  },
  backToMenu: "Main menu",
  smallTalk: {
    greeting: "Hello! How can we assist you today?",
    thanks: "You're welcome. Is there anything else I can help with?",
  },
  suggestionsLabel: "Popular questions",
  relatedLabel: "Related questions",
  didYouMean: "I'm not certain I have that exactly. Did you mean one of these?",
  fallback: "I couldn't find that in our FAQs. Our trade desk can help you directly.",
  fallbackAction: { label: "Send an enquiry", href: contactHref() },

  products: {
    question: "What product are you interested in?",
    other: "📦 Other product",
    otherQuestion: "Which product are you looking for?",
    otherReply:
      "Thank you. Beyond our current focus, we evaluate other products on a case-by-case basis. Start a buying enquiry and our export team will review your requirement.",
    topicQuestion: "Would you like to know more about the product?",
    about:
      "We can provide information regarding available grades, specifications, packaging options, MOQ, origin, quality requirements, documentation and other export-related requirements, subject to the specific product and destination market.",
    topics: {
      specifications: "Product Specifications",
      grades: "Grades / Varieties",
      packaging: "Packaging",
      moq: "MOQ",
      documentation: "Export Documentation",
      customisation: "Can it be customised?",
      quote: "Request a Quote",
    },
    answers: {
      specificationsIntro: "Here is our general specification. Final specifications are confirmed for each order.",
      noSpecifications:
        "Specifications depend on the grade, origin and destination-market requirements. Share your required specification and our export team will confirm what can be supplied.",
      gradesIntro: "Available grades / varieties include:",
      noGrades: "Grades and varieties are confirmed based on availability and your requirement.",
      noPackaging: "Packaging is arranged according to the product and buyer requirement.",
      moq: "MOQ depends on the product, grade, packaging and destination. Typical enquiries range from a few metric tonnes to full containers — share your required quantity and our team will confirm what is feasible.",
      documentationIntro: "Export documentation may include:",
      documentationNote: "Applicable documents depend on the product, destination country and transaction requirements.",
      noDocumentation:
        "Documentation depends on the product, destination country and agreed transaction requirements. Our export team can confirm the applicable documents for your shipment.",
      customisation:
        "Where commercially and operationally feasible, product grade, specifications, size, packaging and other requirements can be discussed according to buyer requirements and applicable regulations.",
      quote:
        "Yes. Please provide your product, quantity, specifications and destination details. Our export team will review your requirement and prepare the appropriate commercial quotation.",
    },
    viewProduct: "View product page",
    anotherTopic: "Anything else about this product?",
  },

  company: {
    intro: "Here's a quick introduction. What would you like to know?",
    questions: [
      {
        question: "What is BOSS Global EXIM?",
        answer:
          "BOSS Global EXIM Pvt. Ltd. is an international trading company engaged in Merchant Exports, Merchant Imports, Global Sourcing, International Trading and Supply Chain Solutions.",
      },
      {
        question: "What does BOSS Global EXIM do?",
        answer:
          "We connect international buyers with Indian products through sourcing, merchant exports, international trading and supply-chain coordination.",
      },
      {
        question: "Where do you source your products?",
        answer:
          "We source products from suitable Indian producers, processors, manufacturers and suppliers based on product requirements, quality specifications, availability and commercial feasibility.",
      },
      {
        question: "Do you work with international buyers?",
        answer:
          "Yes. We work with international buyers seeking Indian products for import, distribution, trading, manufacturing and other commercial requirements.",
      },
      {
        question: "How can I contact your sales team?",
        answer:
          "You can submit your product requirement through this chat. Our export sales team can then review your enquiry and contact you using the details provided.",
      },
    ],
    startBuying: "➡️ Start Buying Enquiry",
  },

  buying: {
    intro: "Let's put your enquiry together — it takes about two minutes. You can type your answers or tap an option.",
    skip: "Skip",
    invalid: {
      required: "Please enter an answer so we can continue.",
      email: "That doesn't look like an email address. Please enter your business email.",
      tel: "Please enter your number with the country code, e.g. +971 50 123 4567.",
      url: "Please enter a website address such as www.company.com, or tap Skip.",
    },
    quoteYes:
      "Thank you. We have collected the basic information required for your enquiry. Our export team will review your requirement and provide the applicable commercial quotation based on product specifications, quantity, packaging, destination and agreed Incoterm.",
    quoteNo: "No problem. If you'd still like our export team to follow up, you can submit your details below.",
    summaryTitle: "Please confirm your enquiry:",
    confirmQuestion: "Is this information correct?",
    submit: "✅ Yes, Submit Enquiry",
    edit: "✏️ Edit Information",
    editQuestion: "Which detail would you like to change?",
    backToSummary: "Back to summary",
    submitting: "Submitting your enquiry…",
    success: "✅ Thank you! Your enquiry has been successfully submitted to BOSS Global EXIM.",
    successFollowUp: "Our export sales team will review your requirement and contact you regarding:",
    successTopics: [
      "Product availability",
      "Specifications",
      "Pricing",
      "Packaging",
      "Incoterm",
      "Payment terms",
      "Shipment arrangements",
      "Required documentation",
    ],
    reference: "Enquiry Reference",
    failure: "Sorry — we couldn't submit your enquiry just now. Please try again, or email us at",
    retry: "Try again",
  },

  composer: {
    label: "Your message",
    placeholder: "Type your question…",
    send: "Send",
  },
  restart: "Start over",
  close: "Close",
  typing: "Aira is typing",
  disclaimer: "Automated answers — no AI service involved.",
  humanLink: { label: "Talk to our team", href: contactHref() },
  dragHandle: "Drag down to close",
  /** How many FAQ questions follow an answer. */
  relatedCount: 3,
};
